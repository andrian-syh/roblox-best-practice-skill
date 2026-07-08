# Roblox Best Practices Skill

A framework-agnostic coding standards and best practices skill for Roblox and Luau development. It provides structured guidance to write secure, performant, clean, and resource-frugal scripts (Scripts, LocalScripts, ModuleScripts) regardless of your architecture.

---

## Supported AI Tools & Agents (Alphabetical)

This repository includes a multi-agent installer that automatically configures this skill for your preferred AI editor, CLI, or extension:

- **Aider**: Project-level instructions via `.aider.instructions.md`.
- **Antigravity / Gemini Agent IDE**: Global (`~/.gemini/config/skills/`) and local (`./.agents/skills/`) configuration.
- **Claude Code CLI**: Global (`~/.claude/skills/`) and local (`./.claude/skills/`) skill placement.
- **Cline / Roo Code**: Local rules using `.clinerules` and `.roorules` in the project root.
- **Cursor**: Local Markdown Cursor rules (`.cursor/rules/*.mdc`) with YAML frontmatter and globs setup.
- **GitHub Copilot**: Project-level instructions via `.github/copilot-instructions.md`.
- **Kilo Code**: Global rules via `~/.config/kilo/AGENTS.md` and local rules via `./.kilocode/rules/`.
- **OpenClaude**: Global (`~/.openclaude/skills/`) and local (`./.openclaude/skills/`) skills.
- **OpenCode**: Global (`~/.config/opencode/skills/`) and local (`./.opencode/skills/`) skills.
- **Windsurf**: Local Cascade rules via `./.windsurf/rules/` and `./.windsurfrules`.

---

## Installation

You can install this skill globally or locally for your project using one of the following methods.

### Method 1: Using `npx` (Node.js Required - Recommended)

Run the interactive installer directly in your terminal:

```bash
npx roblox-best-practices-skill
```

#### CLI Flags (Non-Interactive)

You can pass flags to automate the installation:

- **All Local Tools**: `npx roblox-best-practices-skill --all-local` (or `-al`)
- **All Global Configs**: `npx roblox-best-practices-skill --all-global` (or `-ag`)
- **All Supported Tools**: `npx roblox-best-practices-skill --all` (or `-a`)
- **Specific Tools**:
  - `npx roblox-best-practices-skill --cursor` (Cursor)
  - `npx roblox-best-practices-skill --claude-local` (Claude Code local)
  - `npx roblox-best-practices-skill --copilot` (GitHub Copilot)
  - *(Run `npx roblox-best-practices-skill --help` to see all specific flags)*

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