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

1. **Version Selection**: The installer dynamically fetches available tags from GitHub (e.g., `v1.1.7`, `v1.0.0`). You can choose to install the latest bundled version instantly or download an older version from GitHub.
2. **Universal Destination**: The skill is always installed to `./.agents/skills/roblox-best-practices/` (Universal workspace customizations). This automatically makes it available to compatible agents such as **Antigravity**, **Cline**, **Codex**, **Warp**, **Zed**, **Amp**, **Kimi Code CLI**, **OpenCode**, and others.
3. **Additional Agent Folders**:
   - The installer displays a list of 72 additional supported agents.
   - It scans your workspace root directory for existing configuration folders of these agents (like `.cursor/`, `.claude/`, `.windsurf/`, `.roo/`, etc.).
   - If found, it **pre-selects** them in the menu.
   - You can type to **search and filter** the list in real-time.
   - The skill will be copied to the selected folders only if their parent folder exists, keeping your workspace neat.

---

## Supported AI Tools & Agents

| Path Category | Target Directory | Compatible Tools / Agents |
|---|---|---|
| **Universal** (Always Included) | `./.agents/skills/` | Antigravity, Amp, Cline, Codex, Kimi Code CLI, OpenCode, Warp, Zed, and others |
| **Additional (Local)** | `./.claude/skills/` | Claude Code |
| **Additional (Local)** | `./.cursor/skills/` | Cursor |
| **Additional (Local)** | `./.windsurf/skills/` | Windsurf / Cascade |
| **Additional (Local)** | `./.roo/skills/` | Roo Code |
| **Additional (Local)** | `./.cline/skills/` | Cline |
| **Additional (Local)** | `./.trae/skills/` | Trae AI |
| **Additional (Local)** | `./.aider-desk/skills/` | AiderDesk |
| **Additional (Local)** | `./data/skills/` | AstrBot |
| **Additional (Local)** | *(and 60+ others)* | Complete set of 72 agents supported |

---

## Skill Conventions & Standards

Once installed, your AI agent will enforce the following standards for all Luau files:

1. **Mandatory Script Section Layout**:
   All scripts must follow this exact order:
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

2. **Language Rules**:
   - Start with `--!strict` typing.
   - Use `game:GetService()` (never direct service indexing).
   - Use modern/non-deprecated APIs (`task.wait()`, constraints instead of body movers, etc.).
   - Wrap yielding API calls (`DataStore`, `MarketplaceService`) in `pcall`.

3. **Non-Negotiable Runtime Rules**:
   - **Server Authority**: Never trust the client; validate all remote arguments.
   - **No Memory Leaks**: Clean up all connections and instances (`Destroy()`).
   - **Performance**: No table/string allocations inside `RunService` per-frame loops.
   - **Event-driven**: React to changes; never poll with `while task.wait() do`.

---

## License

This repository is licensed under the [MIT License](LICENSE).