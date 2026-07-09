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
  echo "  ${GREEN}•${NC} 72 agents"
  echo "  ${GREEN}•${NC} Which agents do you want to install to?"
  echo ""
  echo "  ${YELLOW}— Universal (.agents/skills) — always included —————${NC}"
  echo "    ${GREEN}•${NC} Amp, Antigravity, Antigravity CLI, Cline, Codex, Kimi Code CLI, OpenCode, Warp, Zed"
  echo ""

  echo "Installing to Universal (.agents/skills)..."
  copy_folder "$SRC_SKILL_DIR" "./.agents/skills/roblox-best-practices"

  local detected_names=""
  local detected_paths=""
  local count=0
  
  check_agent() {
    local name="$1"
    local path="$2"
    local parent="$3"
    if [ -d "$parent" ]; then
      count=$((count+1))
      detected_names="$detected_names\n  $count) [x] $name ($path)"
      detected_paths="$detected_paths $path"
    fi
  }

  check_agent "AiderDesk" ".aider-desk/skills" ".aider-desk"
  check_agent "AstrBot" "data/skills" "data"
  check_agent "Augment" ".augment/skills" ".augment"
  check_agent "IBM Bob" ".bob/skills" ".bob"
  check_agent "Claude Code" ".claude/skills" ".claude"
  check_agent "Cursor" ".cursor/skills" ".cursor"
  check_agent "Windsurf" ".windsurf/skills" ".windsurf"
  check_agent "Cline" ".cline/skills" ".cline"
  check_agent "Roo Code" ".roo/skills" ".roo"
  check_agent "Kilo Code" ".kilocode/skills" ".kilocode"
  check_agent "Trae AI" ".trae/skills" ".trae"
  check_agent "Zed Editor" ".zed/skills" ".zed"
  check_agent "Amazon Q" ".amazonq/skills" ".amazonq"
  check_agent "OpenCode" ".opencode/skills" ".opencode"
  check_agent "OpenClaude" ".openclaude/skills" ".openclaude"

  if [ $count -gt 0 ]; then
    echo ""
    echo "Detected existing agent directories in your project:"
    printf "$detected_names\n"
    echo ""
    printf "Do you want to install the skill to these detected agents? (Y/n): "
    read -r CONFIRM
    CONFIRM=$(echo "$CONFIRM" | tr '[:lower:]' '[:upper:]')
    if [ "$CONFIRM" = "" ] || [ "$CONFIRM" = "Y" ]; then
      for path in $detected_paths; do
        echo ""
        echo "Installing to $path/roblox-best-practices..."
        copy_folder "$SRC_SKILL_DIR" "./$path/roblox-best-practices"
      done
    fi
  else
    echo ""
    echo "No other agent directories detected in this folder. Skip additional agents."
  fi

  echo ""
  echo "${GREEN}[SUCCESS] Installation complete!${NC}"
}

install_targets
