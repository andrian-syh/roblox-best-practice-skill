# API Currency — Confirmed Baseline for "Verify First"

The verify-first rule ([SKILL.md](../SKILL.md#environment--scale)) says: confirm a newer API exists in the target environment before relying on it, and never flag an API as nonexistent from memory. This file is the **baseline that rule reads against** — a dated list of what is already confirmed, so the agent stops re-litigating mapped APIs while still verifying the genuinely bleeding-edge.

**Snapshot basis:** Luau Recap 2025 (December 2025) and engine Release Notes through **v728**, cross-checked via context7 against `luau-lang` docs and `create.roblox.com`. Treat everything here as *available unless the target environment proves otherwise*; treat anything post-dating this snapshot as *verify before use*.

**Authority order when a claim is in doubt:** create.roblox.com Engine API Reference (primary) → the API dump / `ReflectionService` → a quick in-Studio test. Absence from this file is **not** evidence an API is missing — Roblox ships continuously; this list only removes friction, it never overrides the docs.

## Confirmed available — Luau language & libraries

| Area | Confirmed | Notes |
|---|---|---|
| `vector` library | `vector.create`, `.x/.y/.z`, `vector.zero/one`, `magnitude`, `normalize`, `dot`, `cross`, `angle` | Native, SIMD-backed; complements engine `Vector3` |
| `buffer` library | `create`/`fromstring`/`tostring`/`len`, typed read/write, `copy`, `fill`, and **`readbits`/`writebits`** | Binary data and network serialization |
| `math` additions | `math.map`, `math.lerp`, `math.isnan`, `math.isinf`, `math.isfinite` | |
| Native codegen | `--!native` (module) and the `@native` function attribute | Costs memory; use on genuinely compute-heavy code |
| Modern syntax | String interpolation, generalized `for k,v in t`, `continue`, compound assignment, `//`, if-expressions, `table.freeze` | All stable |
| Scheduling | `task.spawn`/`defer`/`delay`/`wait`/`cancel` | The `wait`/`spawn`/`delay` globals remain deprecated |

## Confirmed available — engine

| Area | Confirmed | Notes |
|---|---|---|
| Server Authority | Engine-level server-authoritative movement/physics + Input Action System resimulation | See [security-monetization.md](security-monetization.md#server-authority-engine-level); attribute replication is limited (first 64 attributes, ≤50-char names, ≤50-char string values) |
| Camera sync | `Player:GetCameraState()` | Client↔server camera state in server-authoritative games |
| Groups | `GroupService:GetRolesInGroupAsync(userId, groupId)` | Multi-role; **deprecates** `Player:GetRankInGroupAsync`/`GetRoleInGroupAsync` |
| Audio | Acoustic simulation with independent **Occlusion** and **Reverb** subcategories | |
| Logging | Structured `LogService` `Info`/`Warn`/`Error` with context; instances render via `GetFullName()`; caught errors suppressed under `pcall` | Prefer over `print` spam |
| Data | DataStore versioning (`GetVersionAsync`, `ListVersionsAsync`), `ListKeysAsync`, `DataStoreGetOptions`; `game.ServerRestartScheduled` | See [patterns.md](patterns.md#data-persistence) |
| Streaming | `Model.ModelStreamingMode`, `Player:RequestStreamAroundAsync`, tag added/removed signals | See [patterns.md](patterns.md#streaming-streamingenabled) |
| Bans | `Players:BanAsync`/`UnbanAsync` with `ExcludeAltAccounts`, `ApplyDeviceBlock`, `ApplyToUniverse` | |

## Gated — verify the specific gate before use

- **New type solver features** (`keyof`, user-defined `type function`, `issubtypeof`, other type-function built-ins): available **only when the new type solver is enabled** in the target place. Do not flag their absence in old-solver projects, and do not rely on them without confirming the solver.
- **Require-by-string / `Luau.Require`**: a standalone-runtime feature (Lune and other embeddings), **not** how Roblox Studio resolves modules — Studio uses instance-based `require`. Do not port require-by-string idioms into a Studio project.
- **Anything newer than v728 / the Dec 2025 recap**: verify against the live docs; this snapshot does not cover it.

## Newly deprecated since this skill last set its baseline

- `Player:GetRankInGroupAsync()` and `Player:GetRoleInGroupAsync()` → `GroupService:GetRolesInGroupAsync()`.

Add to the deprecated-API list in [SKILL.md](../SKILL.md#language--style-rules); see the deprecated-vs-discouraged split in [false-positives.md](false-positives.md#deprecated-vs-discouraged--do-not-conflate-them).

## Maintaining this file

When a new engine/Luau release confirms an API this skill previously told the agent to verify, move it into a Confirmed table and bump the snapshot basis line. Keep it a *baseline*, not a changelog: one row per capability, newest snapshot wins.
