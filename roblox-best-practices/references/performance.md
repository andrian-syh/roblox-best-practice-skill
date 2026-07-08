# Performance, Memory & Network Optimization

Rules for writing lightweight, fast, resource-frugal Luau. Ordered by impact.

## CPU

- **Hoist out of hot loops.** Anything inside `RunService` callbacks, `while` loops, or per-entity iteration must not: create tables/closures, concatenate strings, call `Instance:FindFirstChild`/`WaitForChild`/`GetChildren`, or index deep Instance paths. Resolve references once in VARIABLES or at connection time.
- **Cache repeated lookups.** `local floor = math.floor` matters only in extreme hot paths; caching *Instance* lookups and *attribute reads* matters everywhere.
- **Prefer `Heartbeat` over `RenderStepped`.** `PreRender`/`RenderStepped` blocks the frame — client-only, camera/visual work only. Gameplay logic belongs on `Heartbeat`. For fixed-rate simulation logic use `RunService:BindToSimulation(callback, frequency)` where available.
- **Throttle naturally-slow work.** AI targeting, proximity scans, leaderboard sorts don't need 60 Hz. Accumulate `deltaTime` and run at 5–10 Hz, or stagger entities across frames (process `i % N == frame % N`).
- **Use the right primitives:** `vector`/`Vector3` math over per-component arithmetic; `buffer` for binary data and large numeric arrays; `table.create(n)` when the final size is known; `table.clear()` to reuse tables instead of reallocating.
- **String building:** collect into a table and `table.concat`, or use interpolation backticks; never `..` in a loop.
- **Native codegen:** for genuinely compute-heavy ModuleScripts (procedural generation, pathfinding math), add `--!native`. Don't scatter it everywhere — it costs memory.
- **Parallel Luau:** only for embarrassingly-parallel heavy work (raycast batches, terrain edits) via Actors. Don't parallelize chatty logic; cross-VM communication overhead outweighs gains.

## Memory

- **Instances:** `Destroy()` everything you spawn when done. Destroying an Instance disconnects its connections and unparents descendants — it is the cheapest cleanup primitive. Never just `.Parent = nil` something you mean to discard.
- **Connections:** every `:Connect()` whose owner outlives the connected object leaks. Patterns:
  - Per-player tables of connections, disconnected in `PlayerRemoving`.
  - Connections on an Instance you own → let `Destroy()` handle them.
  - One-shot listeners → `:Once()` instead of `:Connect()` + manual disconnect.
- **Module-level tables keyed by Player/Instance** are the #1 leak source. Every insertion needs a matching removal path (`PlayerRemoving`, `Destroying`). Do not rely on weak tables (`__mode`) as a cleanup strategy.
- **Object pooling:** for frequently created/destroyed things (projectiles, VFX parts, damage numbers), keep a pool: take → reset properties → use → return. `Destroy`/`Instance.new` churn causes GC pressure and physics re-registration.
- **Textures/assets:** reuse asset IDs; identical IDs share memory. Avoid loading giant one-off textures for tiny UI.

## Network

- **Server-authoritative always.** Client sends *intents*, server validates and executes. Validate every remote argument: `typeof` check, range clamp, ownership check, rate limit. Treat all client input as hostile.
- **RemoteEvent hygiene:**
  - Batch: one `UpdateState` remote with a payload table beats ten tiny remotes per frame.
  - Delta, don't dump: send changed fields, not the whole state table.
  - `UnreliableRemoteEvent` for high-frequency loss-tolerant data (cosmetic positions, VFX triggers, voice-adjacent pings). Reliable remotes for anything gameplay-critical.
  - `FireClient` targeted lists instead of `FireAllClients` when only some players care.
- **Prefer replication you get for free:** Attributes, tags, and property replication reach clients without custom remotes and are automatically streamed. Use remotes for *actions*, attributes for *state*.
- **StreamingEnabled awareness:** never assume workspace descendants exist on the client. Use `WaitForChild` with timeouts, `CollectionService` tag signals (`GetInstanceAddedSignal`), or design around persistent models. Mesh streaming is default on modern engine versions — plan LoD accordingly.
- **Payload size:** numbers are cheap, strings and nested tables are not. For bulk data use `buffer` serialization.

## Instances & Rendering

- Anchor everything static. Unanchored parts cost physics even when idle.
- Minimize part count: union/mesh static decoration, but beware overly complex collision — set `CollisionFidelity` to `Box`/`Hull` for decoration.
- `CanCollide = false`, `CanQuery = false`, `CanTouch = false` on parts that don't need them — each flag off removes work from physics/raycast broadphase.
- Use `Model.StreamingMode`/persistence deliberately; keep gameplay-critical anchors persistent.
- UI: avoid `UIGradient`/heavy effects on elements updated every frame; prefer native styling (UICorner, UIShadow, Styling/StyleQueries) over image assets.

## Measurement (never optimize blind)

- **MicroProfiler** (`Ctrl+F6`) for frame-time hotspots; wrap suspect code in `debug.profilebegin/profileend`.
- **ScriptProfiler** and **Developer Console → Memory** for scripts and leaks (watch `Instances` and `LuaHeap` trend over a long session).
- **Studio's Advanced Network Simulation** to test under packet loss/latency before shipping netcode.
- Structured logging (`LogService` `Info`/`Warn`/`Error` methods where available) with contextual data instead of bare `print` spam.
