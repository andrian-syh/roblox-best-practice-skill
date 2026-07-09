# Framework-Agnostic Patterns

Reusable patterns that work in any project structure. Each fits the VARIABLES/FUNCTIONS/INITIALIZATION layout.

> If the project uses a community library owning one of these concerns (ProfileStore for data, Packet/ByteNet for networking, Trove/Maid for cleanup, ...), the library's idioms replace the corresponding pattern here — see [community-libraries.md](community-libraries.md).

## Data Persistence

- **`UpdateAsync` over `SetAsync`** — atomic read-modify-write prevents lost updates from multiple servers.
- **Retry with exponential backoff** around every DataStore call (`pcall` + `2^attempt` delay, 3–5 attempts).
- **Save triggers:** `PlayerRemoving` (always), periodic autosave (2–5 min), `game:BindToClose` (iterate remaining players synchronously — you get 30 s), and `game.ServerRestartScheduled` where available (fires before scheduled restarts; flush early).
- **Versioned store names** (`PlayerData_v2`) + a migration function on load, so schema changes never corrupt old data.
- **Session cache:** load once on join into a server-side table; all gameplay reads/writes hit the cache; DataStore only on save triggers. Never read DataStores during gameplay.
- **Session locking** (write a lock key with server id + timestamp, or use MemoryStore) if item duplication via server-hopping matters for your economy.

## Remote Communication

Server-side handler skeleton — every remote handler follows this shape:

```lua
-- Validates and executes a client request to equip an item
local function onEquipRequest(player: Player, itemId: unknown)
	-- 1. Type validation
	if typeof(itemId) ~= "string" then return end
	-- 2. Rate limit
	if not RateLimiter.Allow(player, "Equip", 5) then return end
	-- 3. Authorization / ownership
	if not Inventory.Owns(player, itemId) then return end
	-- 4. Execute server-side
	Inventory.Equip(player, itemId)
end
```

- Prefer `RemoteEvent` + a response event over `RemoteFunction` server→client (a client that never returns hangs your thread). Client→server `RemoteFunction` is acceptable with a server-side timeout mindset.
- Namespace remotes in one folder (`ReplicatedStorage/Remotes`); create them in one server script or build step so clients can `WaitForChild` deterministically.
- State that clients merely *display* → replicate via Attributes on the player/character instead of remotes.

## Behavior Binding (works with any framework)

`CollectionService` tags decouple behavior from hierarchy — the same script works no matter where instances live:

```lua
-- Binds lava behavior to every instance tagged "Lava", including streamed-in ones
local function bindLava(part: BasePart)
	part.Touched:Connect(onLavaTouched)
end

for _, part in CollectionService:GetTagged("Lava") do
	bindLava(part)
end
CollectionService:GetInstanceAddedSignal("Lava"):Connect(bindLava)
```

- Pair with `GetInstanceRemovedSignal` to clean up per-instance state (mandatory with StreamingEnabled — instances come and go).
- Per-instance tuning via **Attributes** (`part:GetAttribute("Damage")`), not name-parsing or config child-values.

## Lifecycle & Cleanup

Minimal connection-bag pattern (use a maid/janitor/trove module if the project has one; otherwise this suffices):

```lua
-- | State Management | --
local cleanupByPlayer: {[Player]: {() -> ()}} = {}

-- Registers a cleanup task owned by the player
local function addCleanup(player: Player, cleanupTask: () -> ())
	local bag = cleanupByPlayer[player]
	if not bag then bag = {}; cleanupByPlayer[player] = bag end
	table.insert(bag, cleanupTask)
end

-- Runs and clears all cleanup tasks for a leaving player
local function onPlayerRemoving(player: Player)
	for _, cleanupTask in cleanupByPlayer[player] or {} do
		cleanupTask()
	end
	cleanupByPlayer[player] = nil
end
```

Rules:
- Whatever creates a resource registers its destruction in the same place.
- Handle players already present before your `PlayerAdded` connection (`for _, p in Players:GetPlayers()`), and characters already spawned before `CharacterAdded`.
- Module init/start: expose an idempotent `Module.Init()` if setup order matters; call it from INITIALIZATION of a single bootstrap script rather than relying on require-order side effects.

## Object Pooling

```lua
-- | State Management | --
local projectilePool: {BasePart} = {}

-- Takes a projectile from the pool or creates one if empty
local function takeProjectile(): BasePart
	local part = table.remove(projectilePool)
	if not part then
		part = projectileTemplate:Clone()
	end
	part.Parent = workspace.Projectiles
	return part
end

-- Resets and returns a projectile to the pool
local function returnProjectile(part: BasePart)
	part.Parent = nil
	part.AssemblyLinearVelocity = Vector3.zero
	table.insert(projectilePool, part)
end
```

Pool anything spawned more than ~once per second. Always reset *all* mutated properties on return.

## Input (client)

- New projects: use the **Input Action System** (`InputAction`/`InputBinding`) rather than raw `UserInputService` — it handles rebinding and cross-device out of the box. Verify availability in the target environment first (SKILL.md → Environment & Scale); fall back to `ContextActionService` if absent.
- Legacy projects: `ContextActionService` over raw `UserInputService.InputBegan` for gameplay actions — it stacks/unbinds cleanly with UI and tools.
- Never read input on the server; the client sends validated *intents*.

## Anti-Patterns (reject on sight)

| Anti-pattern | Replace with |
|---|---|
| `while task.wait() do` polling a condition that has a signal | Event / `GetPropertyChangedSignal` / attribute signal. (Timed loops for genuinely periodic work — round timers, autosave, throttled scans — are fine) |
| `wait()`, `spawn()`, `delay()` | `task.wait()`, `task.spawn()`, `task.delay()` |
| Logic in `Touched` without debounce | Debounce table keyed by character + cooldown |
| `FindFirstChild` chains every frame | Resolve once in VARIABLES / on bind |
| Client-computed damage/currency sent to server | Server computes; client sends intent only |
| `RemoteFunction` server→client | RemoteEvent pair |
| Giant God-script | One module per responsibility; bootstrap script calls Init |
| `Instance.new("Part", parent)` (parent arg) | Create, set properties, parent last |
| Storing player data only in leaderstats | Session cache table; leaderstats is display-only |
| `getfenv`/`setfenv`/`loadstring` | Never — kills Luau optimization and is a security hole |
