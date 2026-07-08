# Roblox Best Practices Skill

A framework-agnostic coding standards and best practices skill for Roblox and Luau development. It provides structured guidance to write secure, performant, clean, and resource-frugal scripts (Scripts, LocalScripts, ModuleScripts) regardless of your architecture.

---

## Installation

This repository includes a multi-agent installer that automatically configures this skill for your preferred AI editor, CLI, or extension. You can install this skill globally or locally for your project using one of the following methods.

### Method 1: Using `npx` (Node.js Required - Recommended)

Run the interactive installer directly in your terminal:

```bash
npx github:andrian-syh/roblox-best-practices-skill
```

#### CLI Flags (Non-Interactive)

You can pass flags to automate the installation:

- **All Local Tools**: `--all-local` (or `-al`)
- **All Global Configs**: `--all-global` (or `-ag`)
- **All Supported Tools**: `--all` (or `-a`)
- **Specific Tools**:
  - `--claude-local` (Claude Code local)
  - `--cursor-local` (Cursor local)
  - `--codex-local` (Codex CLI local)
  - *(Run `npx github:andrian-syh/roblox-best-practices-skill --help` to see all specific flags)*

---

### Method 2: Shell/Terminal One-Liner (macOS & Linux)

Runs the installer directly from GitHub (runs via `npx` if Node is installed, otherwise falls back to a POSIX shell menu):

```bash
curl -fsSL https://raw.githubusercontent.com/andrian-syh/roblox-best-practices-skill/main/install.sh | bash
```

---

### Method 3: PowerShell One-Liner (Windows)

Runs the installer directly from GitHub (runs via `npx` if Node is installed, otherwise falls back to a PowerShell menu):

```powershell
irm https://raw.githubusercontent.com/andrian-syh/roblox-best-practices-skill/main/install.ps1 | iex
```

---

## Supported AI Tools & Agents

| Tool / Agent | Global Configuration Path | Local Configuration Path |
|--------------|---------------------------|--------------------------|
| **Claude Code** | `~/.claude/skills/` | `.claude/skills/` |
| **Codex CLI** | `~/.codex/skills/` | `.codex/skills/` |
| **Gemini CLI** | `~/.gemini/skills/` | `.gemini/skills/` |
| **Antigravity / Gemini Agent IDE** | `~/.gemini/config/skills/` | `.agents/skills/` |
| **Cursor** | `~/.cursor/skills/` | `.cursor/skills/` |
| **Windsurf / Devin Desktop** | `~/.codeium/windsurf/skills/` | `.windsurf/skills/` |
| **Cline** | `~/.cline/skills/` | `.cline/skills/` |
| **Roo Code** | `~/.roo/skills/` | `.roo/skills/` |
| **Kilo Code** | `~/.kilo/skills/` | `.kilo/skills/` |
| **Trae AI** | `~/.trae/skills/` | `.trae/skills/` |
| **Augment Code** | *(N/A)* | `.augment/skills/` |
| **Zed Editor** | `~/.config/zed/` | `.zed/skills/` |
| **Amazon Q Developer** | *(N/A)* | `.amazonq/skills/` |
| **OpenCode** | `~/.config/opencode/skills/` | `.opencode/skills/` |
| **OpenClaude** | `~/.openclaude/skills/` | `.openclaude/skills/` |

> **Note**: Any other AI coding agent or tool that supports the open Agent Skills standard (`SKILL.md`) should also be able to use this skill seamlessly by placing the skill folder in its designated skills directory.

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