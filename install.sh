#!/bin/sh

# Stop on errors
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0;0m' # No Color

echo "${BLUE}========================================================${NC}"
echo "${BLUE}       Roblox Best Practices Skill Installer            ${NC}"
echo "${BLUE}========================================================${NC}"

# Check if Node.js/npm is available
if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  echo "Node.js detected. Launching NPM-based CLI installer..."
  npx roblox-best-practices-skill "$@"
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
  git clone --depth 1 https://github.com/andrian-syh/roblox-best-practice-skill.git "$TEMP_DIR" > /dev/null 2>&1
else
  # Fallback to downloading ZIP
  ZIP_URL="https://github.com/andrian-syh/roblox-best-practice-skill/archive/refs/heads/main.zip"
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
    # Move extracted files to temp root
    mv "$TEMP_DIR"/roblox-best-practice-skill-main/* "$TEMP_DIR"/ || true
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

copy_file() {
  local src="$1"
  local dest="$2"
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
  echo "${GREEN}[CREATED] $dest${NC}"
}

install_targets() {
  echo ""
  echo "Where would you like to install the skill?"
  echo "1) Antigravity / Gemini Agent IDE (Global) -> ~/.gemini/config/skills/"
  echo "2) Antigravity / Gemini Agent IDE (Local)  -> ./.agents/skills/"
  echo "3) Claude Code CLI (Global)                -> ~/.claude/skills/"
  echo "4) Claude Code CLI (Local)                 -> ./.claude/skills/"
  echo "5) Cursor (Local)                          -> ./.cursor/rules/"
  echo "6) Windsurf (Local)                        -> ./.windsurf/rules/"
  echo "7) Cline / Roo Code (Local)                -> .clinerules & .roorules"
  echo "8) GitHub Copilot (Local)                  -> .github/copilot-instructions.md"
  echo "A) All Local targets"
  echo "B) All Global targets"
  echo "C) Cancel"
  
  printf "Select option(s) (space-separated, e.g. 1 3 5 or A/B/C): "
  read -r CHOICE
  
  # Normalize to uppercase
  CHOICE=$(echo "$CHOICE" | tr '[:lower:]' '[:upper:]')
  
  case "$CHOICE" in
    C)
      echo "Installation cancelled."
      exit 0
      ;;
    A)
      CHOICE="2 4 5 6 7 8"
      ;;
    B)
      CHOICE="1 3"
      ;;
  esac
  
  for opt in $CHOICE; do
    case "$opt" in
      1)
        copy_folder "$SRC_SKILL_DIR" "$HOME/.gemini/config/skills/roblox-best-practices"
        ;;
      2)
        copy_folder "$SRC_SKILL_DIR" "./.agents/skills/roblox-best-practices"
        ;;
      3)
        copy_folder "$SRC_SKILL_DIR" "$HOME/.claude/skills/roblox-best-practices"
        ;;
      4)
        copy_folder "$SRC_SKILL_DIR" "./.claude/skills/roblox-best-practices"
        ;;
      5)
        # Cursor needs custom mdc file formatting
        MDC_FILE="./.cursor/rules/roblox-best-practices.mdc"
        mkdir -p ./.cursor/rules
        printf -- "---\ndescription: Framework-agnostic Roblox/Luau coding standards and best practices\nglobs: [\"**/*.lua\", \"**/*.luau\"]\nalwaysApply: true\n---\n\n" > "$MDC_FILE"
        cat "$SRC_SKILL_DIR/SKILL.md" >> "$MDC_FILE"
        echo "${GREEN}[CREATED] $MDC_FILE${NC}"
        copy_folder "$SRC_SKILL_DIR/references" "./.cursor/rules/references"
        ;;
      6)
        copy_file "$SRC_SKILL_DIR/SKILL.md" "./.windsurf/rules/roblox-best-practices.md"
        copy_folder "$SRC_SKILL_DIR/references" "./.windsurf/rules/references"
        copy_file "$SRC_SKILL_DIR/SKILL.md" "./.windsurfrules"
        copy_folder "$SRC_SKILL_DIR/references" "./references"
        ;;
      7)
        copy_file "$SRC_SKILL_DIR/SKILL.md" "./.clinerules"
        copy_file "$SRC_SKILL_DIR/SKILL.md" "./.roorules"
        copy_folder "$SRC_SKILL_DIR/references" "./references"
        ;;
      8)
        copy_file "$SRC_SKILL_DIR/SKILL.md" "./.github/copilot-instructions.md"
        copy_folder "$SRC_SKILL_DIR/references" "./.github/references"
        ;;
      *)
        echo "${RED}Invalid option: $opt${NC}"
        ;;
    esac
  done
  
  echo "\n${GREEN}[SUCCESS] Installation complete!${NC}"
}

install_targets
