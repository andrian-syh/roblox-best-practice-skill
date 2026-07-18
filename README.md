# Roblox Best Practices Skill

A framework-agnostic coding standards and best practices skill for Roblox and Luau development. It provides structured guidance to write secure, performant, clean, and resource-frugal scripts (Scripts, LocalScripts, ModuleScripts) regardless of your architecture.

---

## Installation

This repository includes a smart installer script that automatically configures this skill for your preferred AI editors and agents, bypassing potential npm version security issues.

### Method 1: PowerShell One-Liner (Windows - Recommended)

Runs the installer directly from GitHub (auto-launches via `npx` with security bypasses if Node is installed, otherwise falls back to a PowerShell menu):

```powershell
irm https://raw.githubusercontent.com/andrian-syh/roblox-best-practices-skill/main/install.ps1 | iex
```

---

### Method 2: Shell/Terminal One-Liner (macOS & Linux - Recommended)

Runs the installer directly from GitHub (auto-launches via `npx` with security bypasses if Node is installed, otherwise falls back to a POSIX shell menu):

```bash
curl -fsSL https://raw.githubusercontent.com/andrian-syh/roblox-best-practices-skill/main/install.sh | bash
```

---

### Method 3: Using `npx` directly (Deprecated)

> [!WARNING]
> **DEPRECATED**: Direct `npx` execution is deprecated due to security defaults in newer versions of npm (such as npm v12+) which block Git-based fetches by default (throwing an `EALLOWGIT` error). It is strongly recommended to use **Method 1** or **Method 2** above, which automatically handle these checks and apply necessary security bypass flags.

If you must run it directly, you can bypass npm restrictions by passing the `--allow-git=all` flag (npm v12+):

```bash
npx --allow-git=all github:andrian-syh/roblox-best-practices-skill
```

#### CLI Options & Flags (Automated Installs)

You can pass flags to the installer to automate configuration:

- **All Agents**: `--all` (or `-a`) - Installs the skill for the Universal path and all supported additional agents.
- **Specific Version Tag**: `--tag <tag_name>` (or `-t <tag_name>`) - Target a specific version tag from GitHub (e.g., `v1.0.0`, `v1.1.7`).
- **Help**: `--help` (or `-h`) - Show CLI help message.

---

## How It Works

1. **Version Selection**: The installer dynamically fetches available tags from GitHub. The menu shows the latest bundled version (installed instantly) plus the **5 most recent published versions** to keep the list short. Older versions are not listed but remain fully installable — pick **"Other version (type manually)…"** and enter the tag (e.g. `v1.0.0`), or pass `--tag <tag_name>` for a non-interactive install.
2. **Universal Destination**: The skill is always installed to `./.agents/skills/roblox-best-practices/` (Universal workspace customizations). This automatically makes it available to compatible agents such as **Antigravity**, **Cline**, **Codex**, **Warp**, **Zed**, **Amp**, **Kimi Code CLI**, **OpenCode**, and others.
3. **Additional Agent Folders**:
   - The installer displays a list of 72 additional supported agents.
   - It scans your user home directory for existing configuration folders of these agents (like `~/.cursor/`, `~/.claude/`, `~/.windsurf/`, `~/.roo/`, etc.).
   - If found, it **pre-selects** them in the menu.
   - You can type to **search and filter** the list in real-time.
   - The skill will be copied to the selected folders only if their parent folder exists in the user's home directory. If the folder does not exist, the installer considers it as already installed (assumed installed).

---

## Supported AI Tools & Agents

| Path Category | Target Directory | Compatible Tools / Agents |
|---|---|---|
| **Universal** (Always Included) | `./.agents/skills/` | Antigravity, Amp, Cline, Codex, Kimi Code CLI, OpenCode, Warp, Zed, and others |
| **Additional (Global)** | `~/.claude/skills/` | Claude Code |
| **Additional (Global)** | `~/.gemini/config/skills/` | Gemini |
| **Additional (Global)** | `~/.codex/skills/` | Codex |
| **Additional (Global)** | `~/.cursor/skills/` | Cursor |
| **Additional (Global)** | `~/.windsurf/skills/` | Windsurf / Cascade |
| **Additional (Global)** | `~/.roo/skills/` | Roo Code |
| **Additional (Global)** | `~/.cline/skills/` | Cline |
| **Additional (Global)** | `~/.trae/skills/` | Trae AI |
| **Additional (Global)** | `~/.aider-desk/skills/` | AiderDesk |
| **Additional (Global)** | `~/data/skills/` | AstrBot |
| **Additional (Global)** | *(and 60+ others)* | Complete set of 72 agents supported |

---

## Skill Conventions & Standards

Once installed, your AI agent will be armed with standard guidelines, templates, and best practices tailored to your project setup:

### 1. Dual Operational Modes
- **Default Mode**: Appointed for new projects or when starting fresh. The agent strictly enforces standard layout, naming, and Luau typing conventions.
- **Adaptive Mode**: Designed for existing codebases. The agent studies the project's existing coding structures and conventions, proposes adapted styles for user approval, and then implements code matching the project's native style.

### 2. Supervision Control
The installer supports inline control tokens to control the agent's autonomy level:
- **`!ask` (Supervised)**: Confirm before every decision (conventions, file writes, modifications).
- **`!bal` (Balanced - Default)**: Proceed automatically for standard actions, stopping only for destructive changes or real ambiguity.
- **`!go` (Autonomous)**: Move forward without prompts; record assumptions in the final summary.

### 3. Structured Reference Routing
The skill routes coding logic through modular reference sheets depending on the task:
- **Templates**: [references/templates.md](references/templates.md) - Standard section layouts for Scripts, LocalScripts, and ModuleScripts.
- **Adaptive Mode**: [references/adaptive-mode.md](references/adaptive-mode.md) - Workflow checklist for analyzing project structures.
- **Community Libraries**: [references/community-libraries.md](references/community-libraries.md) - Best practices for Knit, ProfileStore, ByteNet, Fusion, Trove, etc.
- **Performance**: [references/performance.md](references/performance.md) - Loop optimizations, garbage collection, and resource-frugal memory practices.
- **Security & Monetization**: [references/security-monetization.md](references/security-monetization.md) - Server authority, remote validation depth, and handling purchases.
- **Genres**: [references/genres.md](references/genres.md) - Specific advice based on the game type (Simulator, Obby, FPS, horror, RPG, etc.).

### 4. Basic Script Layout
For standard new files, scripts are divided into distinct sections:
```lua
-- // VARIABLES // --
-- | Services | --
-- | Modules | --
-- | Objects | --
-- | Configuration | --
-- | State Management | --

-- // FUNCTIONS // --
-- | Private | --
-- | Public | --

-- // INITIALIZATION // --
```

### 5. Critical Runtime Rules
- **Server Authority**: Never trust the client; validate all RemoteEvent/RemoteFunction arguments.
- **No Memory Leaks**: Clean up event connections and call `:Destroy()` on unused instances.
- **RunService Safety**: No table or string allocations in high-frequency per-frame loops.
- **Event-Driven**: Listen for state changes; never poll using busy loops (`while task.wait() do`).

---

## License

This repository is licensed under the [MIT License](LICENSE).