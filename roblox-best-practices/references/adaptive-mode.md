# Adaptive Mode — Learn the Project's Conventions First

Procedure for applying this skill while conforming to a studio's existing coding structure/hierarchy. The goal: maximum best practice, minimum friction with the team's established style.

## What adapts vs. what never adapts

| Adaptable (follow the project) | Non-negotiable (always enforce) |
|---|---|
| Section header syntax/wording (`-- // ... // --` vs `--== ... ==--` vs none) | Server-authoritative design; remote argument validation |
| Section ordering and which subsections exist | Connection/instance cleanup; no leaks |
| Naming conventions (casing of functions, constants, privates) | No deprecated APIs (`wait`, `spawn`, `Instance.new` parent arg, ...) |
| Module require ordering | No per-frame garbage; no polling; event-driven design |
| Doc comment style/format/language | `pcall` + retry on external/yielding calls |
| Framework idioms (Knit services, ECS systems, single-script, custom loaders) | Data-safety rules (UpdateAsync, BindToClose, save on leave) |
| File/module organization and bootstrap pattern | Type safety where the project already uses `--!strict` |

If an existing project convention *directly conflicts* with a non-negotiable rule (e.g., their template uses `wait()`), flag it in the confirmation step — don't silently copy the bad practice, and don't silently break their convention either. Let the user decide, recommending the safe option.

## Step 1 — Analyze the codebase

Sample representative scripts — not everything. Aim for 5–15 files covering: a server Script, a LocalScript, several ModuleScripts, and whatever framework entry points exist. For Roblox Studio MCP setups, use script search/read tools; for Rojo-style filesystem projects, use file search.

Record for each dimension:

1. **Section/organization style** — Do scripts have section headers? What syntax? What top-level divisions (variables/functions/init or something else)? How deep is the nesting?
2. **Naming** — casing for: services, module tables, local variables, functions (public vs private), constants, Instance references, remotes. Prefix/suffix habits (`_private`, `on`-handlers, `Async` suffix).
3. **Module conventions** — require ordering, single-table return vs class-style (`__index`, `.new()`), init/start lifecycle (`Init()`/`Start()`? framework-managed?), how public vs private is expressed.
4. **Framework** — Knit/Flamework/custom loader/none? How do scripts discover each other (require chains, service locator, tags, `_G` [flag it])? Where do remotes live and who creates them?
   - **Community libraries** — scan `require()`s for known libraries (ProfileStore/ProfileService, Packet/ByteNet/Zap, Trove/Maid/Janitor, Signal, Promise, Fusion/React-lua, ...). Each detected library shifts the applicable patterns per [community-libraries.md](community-libraries.md). Unknown recurring modules → read 2–3 usages to classify them.
5. **Typing** — `--!strict` usage, annotation density, shared type modules.
6. **Comment/doc style** — language, placement, format (`--`, `--[[]]`, moonwave `---`), density.
7. **Existing quality level** — deprecated API usage, cleanup discipline, validation habits. This feeds the conflict list.

## Step 2 — Present findings and confirm

Before writing any code, show the user a compact summary and get explicit approval:

```
## Project Convention Analysis
- Sections: uses `--== SECTION ==--` headers with SERVICES/VARIABLES/MAIN divisions
- Naming: camelCase functions everywhere (no PascalCase publics), SCREAMING constants
- Modules: class-style with .new() + :Destroy(), required via a central Loader
- Framework: custom Loader in ReplicatedStorage.Core; remotes auto-created by NetModule
- Libraries detected: ProfileStore (data), Packet (networking), Trove (cleanup)
  -> defer data/network/cleanup patterns to them per community-libraries.md — confirm?
- Typing: --!strict in ~80% of files
- Docs: moonwave-style --- comments, English

## Proposed convention for new code
[skill defaults merged with the above — list each point]

## Conflicts with best practice (need your decision)
1. Existing template uses wait() — recommend task.wait() even though it deviates
2. _G used for service discovery — recommend keeping for consistency now, flag for refactor

Proceed with this convention? Anything to adjust?
```

Wait for confirmation. Apply any corrections the user gives. If the user answers with adjustments, restate the final convention in one short block so there is a single source of truth in the conversation.

**Supervision level modifies this step** (see SKILL.md → Supervision Level): under **Supervised** and **Balanced**, wait for explicit approval before coding. Under **Autonomous** (`!go`), present the same summary as a *report* — state the convention you will follow and the safe choice for each conflict — and proceed without waiting.

## Step 3 — Apply

- Write all subsequent code in the confirmed convention.
- Where the project had no convention for something (e.g., no doc comment habit), fill the gap with this skill's default.
- When editing an existing file, match that file even if it predates the confirmed convention — consistency within a file beats global consistency. Note mismatches; offer (don't perform) refactors.
- The confirmed convention holds for the rest of the session/project unless the user changes it. Re-run analysis only if you enter a clearly different sub-project.

## Persisting the result

If the environment supports project memory or a conventions file (e.g., `CLAUDE.md`, `CONVENTIONS.md`), offer to save the confirmed convention there so future sessions skip re-analysis. Keep it as a diff against this skill's defaults ("same as roblox-best-practices except: ...") rather than a full copy.
