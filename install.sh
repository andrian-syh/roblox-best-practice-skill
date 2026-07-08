#!/bin/sh

# Stop on errors
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0;0m' # No Color

echo "${BLUE}========================================================${NC}"
echo "${BLUE}       Roblox Best Practices Skill Installer            ${NC}"
echo "${BLUE}========================================================${NC}"

# Check if Node.js/npm is available
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  echo "Node.js detected. Launching NPM-based CLI installer..."
  npx github:andrian-syh/roblox-best-practices-skill "$@"
  exit 0
fi

echo "Node.js/NPM not found. Running shell fallback installer..."

# Setup temporary directory
TEMP_DIR=$(mktemp -d 2>/dev/null || mktemp -d -t 'roblox_best_practices_skill')
cleanup() {
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

# Download the skill files
echo "Downloading skill files..."
if command -v git >/dev/null 2>&1; then
  git clone --depth 1 https://github.com/andrian-syh/roblox-best-practices-skill.git "$TEMP_DIR" > /dev/null 2>&1
else
  # Fallback to downloading ZIP
  ZIP_URL="https://github.com/andrian-syh/roblox-best-practices-skill/archive/refs/heads/main.zip"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$ZIP_URL" -o "$TEMP_DIR/archive.zip"
  elif command -v wget >/dev/null 2>&1; then
    wget -q "$ZIP_URL" -O "$TEMP_DIR/archive.zip"
  else
    echo "${RED}[ERROR] Neither git, curl, nor wget is installed. Please install one of them to download the skill.${NC}"
    exit 1
  fi
  
  if command -v unzip >/dev/null 2>&1; then
    unzip -q "$TEMP_DIR/archive.zip" -d "$TEMP_DIR"
    mv "$TEMP_DIR"/roblox-best-practices-skill-main/* "$TEMP_DIR"/ || true
  else
    echo "${RED}[ERROR] 'unzip' utility not found. Please install unzip or Node.js to continue.${NC}"
    exit 1
  fi
fi

# The source skill folder
SRC_SKILL_DIR="$TEMP_DIR/roblox-best-practices"

if [ ! -d "$SRC_SKILL_DIR" ]; then
  echo "${RED}[ERROR] Failed to locate roblox-best-practices directory in download.${NC}"
  exit 1
fi

copy_folder() {
  local src="$1"
  local dest="$2"
  mkdir -p "$(dirname "$dest")"
  rm -rf "$dest"
  cp -R "$src" "$dest"
  echo "${GREEN}[CREATED] $dest${NC}"
}

install_targets() {
  echo ""
  echo "Where would you like to install the skill?"
  echo " 1) Claude Code (Global)                      -> ~/.claude/skills/"
  echo " 2) Claude Code (Local)                       -> ./.claude/skills/"
  echo " 3) Codex CLI (Global)                        -> ~/.codex/skills/"
  echo " 4) Codex CLI (Local)                         -> ./.codex/skills/"
  echo " 5) Gemini CLI (Global)                       -> ~/.gemini/skills/"
  echo " 6) Gemini CLI (Local)                        -> ./.gemini/skills/"
  echo " 7) Antigravity / Gemini Agent IDE (Global)   -> ~/.gemini/config/skills/"
  echo " 8) Antigravity / Gemini Agent IDE (Local)    -> ./.agents/skills/"
  echo " 9) Cursor (Global)                           -> ~/.cursor/skills/"
  echo "10) Cursor (Local)                            -> ./.cursor/skills/"
  echo "11) Windsurf / Devin Desktop (Global)         -> ~/.codeium/windsurf/skills/"
  echo "12) Windsurf / Devin Desktop (Local)          -> ./.windsurf/skills/"
  echo "13) Cline (Global)                            -> ~/.cline/skills/"
  echo "14) Cline (Local)                             -> ./.cline/skills/"
  echo "15) Roo Code (Global)                         -> ~/.roo/skills/"
  echo "16) Roo Code (Local)                          -> ./.roo/skills/"
  echo "17) Kilo Code (Global)                        -> ~/.kilo/skills/"
  echo "18) Kilo Code (Local)                         -> ./.kilo/skills/"
  echo "19) Trae AI (Global)                          -> ~/.trae/skills/"
  echo "20) Trae AI (Local)                           -> ./.trae/skills/"
  echo "21) Augment Code (Local)                      -> ./.augment/skills/"
  echo "22) Zed Editor (Local)                        -> ./.zed/skills/"
  echo "23) Amazon Q Developer (Local)                -> ./.amazonq/skills/"
  echo "24) OpenCode (Global)                         -> ~/.config/opencode/skills/"
  echo "25) OpenCode (Local)                          -> ./.opencode/skills/"
  echo "26) OpenClaude (Global)                       -> ~/.openclaude/skills/"
  echo "27) OpenClaude (Local)                        -> ./.openclaude/skills/"
  echo " L) All LOCAL targets"
  echo " G) All GLOBAL targets"
  echo " A) ALL targets"
  echo " C) Cancel"
  
  printf "Select option(s) (space-separated, e.g. 1 3 5 or A/G/L/C): "
  read -r CHOICE
  
  # Normalize to uppercase
  CHOICE=$(echo "$CHOICE" | tr '[:lower:]' '[:upper:]')
  
  case "$CHOICE" in
    C)
      echo "Installation cancelled."
      exit 0
      ;;
    A)
      CHOICE="1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27"
      ;;
    L)
      CHOICE="2 4 6 8 10 12 14 16 18 20 21 22 23 25 27"
      ;;
    G)
      CHOICE="1 3 5 7 9 11 13 15 17 19 24 26"
      ;;
  esac
  
  for opt in $CHOICE; do
    case "$opt" in
      1)  copy_folder "$SRC_SKILL_DIR" "$HOME/.claude/skills/roblox-best-practices" ;;
      2)  copy_folder "$SRC_SKILL_DIR" "./.claude/skills/roblox-best-practices" ;;
      3)  copy_folder "$SRC_SKILL_DIR" "$HOME/.codex/skills/roblox-best-practices" ;;
      4)  copy_folder "$SRC_SKILL_DIR" "./.codex/skills/roblox-best-practices" ;;
      5)  copy_folder "$SRC_SKILL_DIR" "$HOME/.gemini/skills/roblox-best-practices" ;;
      6)  copy_folder "$SRC_SKILL_DIR" "./.gemini/skills/roblox-best-practices" ;;
      7)  copy_folder "$SRC_SKILL_DIR" "$HOME/.gemini/config/skills/roblox-best-practices" ;;
      8)  copy_folder "$SRC_SKILL_DIR" "./.agents/skills/roblox-best-practices" ;;
      9)  copy_folder "$SRC_SKILL_DIR" "$HOME/.cursor/skills/roblox-best-practices" ;;
      10) copy_folder "$SRC_SKILL_DIR" "./.cursor/skills/roblox-best-practices" ;;
      11) copy_folder "$SRC_SKILL_DIR" "$HOME/.codeium/windsurf/skills/roblox-best-practices" ;;
      12) copy_folder "$SRC_SKILL_DIR" "./.windsurf/skills/roblox-best-practices" ;;
      13) copy_folder "$SRC_SKILL_DIR" "$HOME/.cline/skills/roblox-best-practices" ;;
      14) copy_folder "$SRC_SKILL_DIR" "./.cline/skills/roblox-best-practices" ;;
      15) copy_folder "$SRC_SKILL_DIR" "$HOME/.roo/skills/roblox-best-practices" ;;
      16) copy_folder "$SRC_SKILL_DIR" "./.roo/skills/roblox-best-practices" ;;
      17) copy_folder "$SRC_SKILL_DIR" "$HOME/.kilo/skills/roblox-best-practices" ;;
      18) copy_folder "$SRC_SKILL_DIR" "./.kilo/skills/roblox-best-practices" ;;
      19) copy_folder "$SRC_SKILL_DIR" "$HOME/.trae/skills/roblox-best-practices" ;;
      20) copy_folder "$SRC_SKILL_DIR" "./.trae/skills/roblox-best-practices" ;;
      21) copy_folder "$SRC_SKILL_DIR" "./.augment/skills/roblox-best-practices" ;;
      22) copy_folder "$SRC_SKILL_DIR" "./.zed/skills/roblox-best-practices" ;;
      23) copy_folder "$SRC_SKILL_DIR" "./.amazonq/skills/roblox-best-practices" ;;
      24) copy_folder "$SRC_SKILL_DIR" "$HOME/.config/opencode/skills/roblox-best-practices" ;;
      25) copy_folder "$SRC_SKILL_DIR" "./.opencode/skills/roblox-best-practices" ;;
      26) copy_folder "$SRC_SKILL_DIR" "$HOME/.openclaude/skills/roblox-best-practices" ;;
      27) copy_folder "$SRC_SKILL_DIR" "./.openclaude/skills/roblox-best-practices" ;;
      *)  echo "${RED}Invalid option: $opt${NC}" ;;
    esac
  done
  
  echo "\n${GREEN}[SUCCESS] Installation complete!${NC}"
}

install_targets
