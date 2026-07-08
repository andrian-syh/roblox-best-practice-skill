# Security & Monetization

Deep-dive on the "server is authoritative" rule and on purchase handling. The remote-handler skeleton (type → rate → ownership → game-state) lives in [patterns.md](patterns.md#remote-communication) — this file adds the layers around it.

## Threat model (assume all of these exist)

Exploiters can: fire any RemoteEvent/RemoteFunction with any arguments at any rate; read *all* client-replicated code and data (LocalScripts, ModuleScripts in ReplicatedStorage, attribute values); move their character anywhere at any speed; delete/modify anything client-side. They can **not**: run code on the server, see ServerStorage/ServerScriptService, or modify other clients.

Consequences:
- Never put secrets (API keys, admin lists used for enforcement, loot tables you don't want mined) in ReplicatedStorage or any client-visible location. Enforcement data lives server-side; ReplicatedStorage holds only what clients legitimately need.
- Client-side anti-cheat is a speed bump, not a wall — it may exist for honest-player UX, but every *decision* is server-side.
- Never execute strings or dynamic requires from client input; `loadstring`/`getfenv`/`setfenv` stay banned.

## Server-side validation layers

Every remote handler, in order (cheapest check first):

1. **Type/shape** — `typeof()` every argument; reject `nil`/wrong types silently (no error replies that help fuzzing).
2. **Rate** — per-player, per-action token bucket or fixed window. Reference implementation:

```lua
-- | State Management | --
local buckets: {[Player]: {[string]: {count: number, windowStart: number}}} = {}

-- Returns true if the player is within maxPerWindow calls for the action; false to reject
local function allowRate(player: Player, action: string, maxPerWindow: number, window: number?): boolean
	local now = os.clock()
	local windowSize = window or 1
	local playerBuckets = buckets[player]
	if not playerBuckets then playerBuckets = {}; buckets[player] = playerBuckets end
	local bucket = playerBuckets[action]
	if not bucket or now - bucket.windowStart > windowSize then
		playerBuckets[action] = {count = 1, windowStart = now}
		return true
	end
	bucket.count += 1
	return bucket.count <= maxPerWindow
end
```

Clear `buckets[player]` in `PlayerRemoving`. Escalate repeat offenders (log → soft-fail → kick) instead of kicking on the first violation — mobile lag spikes cause honest bursts.

3. **Ownership/authorization** — does this player own the item / have the role / stand in the right place?
4. **Game-state plausibility** — is the action possible *right now*? (Alive? In range? Cooldown elapsed? Enough currency — checked server-side?)

## Movement & physics sanity checks

Character physics is client-owned; validate *outcomes*, not inputs:

- **Teleport/speed:** on a slow loop (1–2 Hz, staggered), compare position delta vs `WalkSpeed * elapsed * tolerance` (tolerance ≥ 1.5 — physics, lag, and legitimate mechanics overshoot). On violation: rubber-band back, log; kick only on sustained patterns.
- Account for legitimate causes before punishing: server teleports, vehicle exits, knockback, streaming pauses. Maintain an "expected displacement" allowlist window after such events.
- Hit/interaction range: re-verify distance server-side at execution time, with a lag allowance (~10–15 studs beyond nominal range, tuned per game).
- Don't build honeypots that punish automatically (invisible parts that kick on touch) without long observation first — false positives destroy trust.

## Purchases

### ProcessReceipt (Developer Products) — correctness rules

`MarketplaceService.ProcessReceipt` is the single most bug-prone monetization API. Rules:

- **Exactly one** callback game-wide; set it in one server script.
- **Idempotent:** Roblox retries receipts (server crash, prior `NotProcessedYet`, rejoin). Record processed `PurchaseId`s durably (in the player's data profile, as a capped history list) and return `PurchaseGranted` immediately for already-processed IDs — never grant twice.
- **Grant, persist, then acknowledge:** apply the product effect, *save it* (or mark it inside the already-managed data profile), and only then return `Enum.ProductPurchaseDecision.PurchaseGranted`. Returning `PurchaseGranted` before the grant is durable = paid item lost on crash.
- Return `NotProcessedYet` when: the player left, their data isn't loaded, or the grant failed. Roblox will retry — that's the mechanism, not an error.
- Wrap the whole handler logic in `pcall`; an error inside ProcessReceipt otherwise silently drops the receipt until retry.
- Player may be offline on retry: either handle `player == nil` by returning `NotProcessedYet`, or design grants to work through the data store directly.

### Choosing the product type

| Type | Use for | Notes |
|---|---|---|
| Game Pass | Permanent one-time perks (VIP, x2 coins) | Check `UserOwnsGamePassAsync` (cache per session; also listen to `PromptGamePassPurchaseFinished`) |
| Developer Product | Consumables, repeatable (currency, revives) | ProcessReceipt rules above |
| Subscription | Recurring benefits | Check status on join + `UserSubscriptionStatusChanged`; always handle lapse |
| Paid access / Managed Pricing | Whole-experience monetization | Managed Pricing (regional + optimization) is platform-side; don't hardcode price displays — read from `GetProductInfo` |

- Never trust a client claim of ownership — verify server-side, cache the result, invalidate on purchase-finished events.
- Prompt purchases from the client (`PromptProductPurchase` etc. work there), but *effects* only ever originate from server-side verification.

## Logging & response

- Log validation failures with context (player, action, args, rate) via structured logging ([performance.md](performance.md#measurement-never-optimize-blind)) or AnalyticsService custom events — you tune thresholds from data, not guesses.
- `Players:BanAsync` with `ApplyDeviceBlock` for confirmed cheaters (alt-evasion resistance); reserve automated bans for high-confidence signals only.
