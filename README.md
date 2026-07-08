# Roblox Best Practices Skill

A framework-agnostic coding standards and best practices skill for Roblox and Luau development. It provides structured guidance to write secure, performant, clean, and resource-frugal scripts (Scripts, LocalScripts, ModuleScripts) regardless of your architecture.

---

## Supported AI Tools & Agents (by Popularity)

This repository includes a multi-agent installer that automatically configures this skill for your preferred AI editor, CLI, or extension:

- **Claude Code**: Global (`~/.claude/skills/`) and local (`.claude/skills/`) skill configuration.
- **Codex CLI**: Global (`~/.codex/skills/`) and local (`.codex/skills/`) skill configuration.
- **Gemini CLI**: Global (`~/.gemini/skills/`) and local (`.gemini/skills/`) skill configuration.
- **Antigravity / Gemini Agent IDE**: Global (`~/.gemini/config/skills/`) and local (`.agents/skills/`) skill configuration.
- **Cursor**: Global (`~/.cursor/skills/`) and local (`.cursor/skills/`) skill configuration.
- **Windsurf / Devin Desktop**: Global (`~/.codeium/windsurf/skills/`) and local (`.windsurf/skills/`) skill configuration.
- **Cline**: Global (`~/.cline/skills/`) and local (`.cline/skills/`) skill configuration.
- **Roo Code**: Global (`~/.roo/skills/`) and local (`.roo/skills/`) skill configuration.
- **Kilo Code**: Global (`~/.kilo/skills/`) and local (`.kilo/skills/`) skill configuration.
- **Trae AI**: Global (`~/.trae/skills/`) and local (`.trae/skills/`) skill configuration.
- **Augment Code**: Local skill via `.augment/skills/` (also reads `.agents/skills/`).
- **Zed Editor**: Local skill via `.zed/skills/`, or via Zed's built-in Skills Manager.
- **Amazon Q Developer**: Local skill via `.amazonq/skills/`.
- **OpenCode**: Global (`~/.config/opencode/skills/`) and local (`.opencode/skills/`) skill configuration.
- **OpenClaude**: Global (`~/.openclaude/skills/`) and local (`.openclaude/skills/`) skill configuration.

---

## Installation

You can install this skill globally or locally for your project using one of the following methods.

### Method 1: Using `npx` (Node.js Required - Recommended)

Run the interactive installer directly in your terminal:

```bash
npx github:andrian-syh/roblox-best-practice-skill
```

#### CLI Flags (Non-Interactive)

You can pass flags to automate the installation:

- **All Local Tools**: `npx github:andrian-syh/roblox-best-practice-skill --all-local` (or `-al`)
- **All Global Configs**: `npx github:andrian-syh/roblox-best-practice-skill --all-global` (or `-ag`)
- **All Supported Tools**: `npx github:andrian-syh/roblox-best-practice-skill --all` (or `-a`)
- **Specific Tools**:
  - `npx github:andrian-syh/roblox-best-practice-skill --claude-local` (Claude Code local)
  - `npx github:andrian-syh/roblox-best-practice-skill --cursor` (Cursor)
  - `npx github:andrian-syh/roblox-best-practice-skill --codex-local` (Codex CLI local)
  - *(Run `npx github:andrian-syh/roblox-best-practice-skill --help` to see all specific flags)*

---

### Method 2: Shell/Terminal One-Liner (macOS & Linux)

Runs the installer directly from GitHub (runs via `npx` if Node is installed, otherwise falls back to a POSIX shell menu):

```bash
curl -fsSL https://raw.githubusercontent.com/andrian-syh/roblox-best-practice-skill/main/install.sh | bash
```

---

### Method 3: PowerShell One-Liner (Windows)

Runs the installer directly from GitHub (runs via `npx` if Node is installed, otherwise falls back to a PowerShell menu):

```powershell
irm https://raw.githubusercontent.com/andrian-syh/roblox-best-practice-skill/main/install.ps1 | iex
```

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