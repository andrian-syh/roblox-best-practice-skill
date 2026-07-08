# ========================================================
#  Roblox Best Practices Skill Installer (PowerShell)
# ========================================================

Write-Host "========================================================" -ForegroundColor Blue
Write-Host "       Roblox Best Practices Skill Installer            " -ForegroundColor Blue
Write-Host "========================================================" -ForegroundColor Blue

# Check if Node.js/npm is available, prefer npx-based CLI
if ((Get-Command node -ErrorAction SilentlyContinue) -and (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js detected. Launching NPM-based CLI installer..."
  npx github:andrian-syh/roblox-best-practice-skill @args
  exit
}

Write-Host "Node.js/NPM not found. Running PowerShell fallback installer..." -ForegroundColor Yellow

# Download skill files to temp directory
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("roblox_skill_" + [System.Guid]::NewGuid().ToString().Substring(0,8))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
  if (Get-Command git -ErrorAction SilentlyContinue) {
    git clone --depth 1 https://github.com/andrian-syh/roblox-best-practice-skill.git $tempDir 2>$null | Out-Null
  } else {
    $zipUrl = "https://github.com/andrian-syh/roblox-best-practice-skill/archive/refs/heads/main.zip"
    $zipPath = Join-Path $tempDir "archive.zip"
    Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing
    Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force
    # Move extracted files up
    $extracted = Join-Path $tempDir "roblox-best-practice-skill-main"
    Get-ChildItem $extracted | Move-Item -Destination $tempDir -Force
    Remove-Item $extracted -Recurse -Force -ErrorAction SilentlyContinue
  }

  $srcSkillDir = Join-Path $tempDir "roblox-best-practices"
  if (-not (Test-Path $srcSkillDir)) {
    Write-Host "[ERROR] Failed to locate roblox-best-practices directory in download." -ForegroundColor Red
    exit 1
  }

  function Copy-SkillFolder($src, $dest) {
    if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
    New-Item -ItemType Directory -Path (Split-Path $dest -Parent) -Force | Out-Null
    Copy-Item -Path $src -Destination $dest -Recurse -Force
    Write-Host "[CREATED] $dest" -ForegroundColor Green
  }

  # Interactive menu
  Write-Host ""
  Write-Host "Where would you like to install the skill?"
  Write-Host " 1) Claude Code (Global)                      -> ~/.claude/skills/"
  Write-Host " 2) Claude Code (Local)                       -> ./.claude/skills/"
  Write-Host " 3) Codex CLI (Global)                        -> ~/.codex/skills/"
  Write-Host " 4) Codex CLI (Local)                         -> ./.codex/skills/"
  Write-Host " 5) Gemini CLI (Global)                       -> ~/.gemini/skills/"
  Write-Host " 6) Gemini CLI (Local)                        -> ./.gemini/skills/"
  Write-Host " 7) Antigravity / Gemini Agent IDE (Global)   -> ~/.gemini/config/skills/"
  Write-Host " 8) Antigravity / Gemini Agent IDE (Local)    -> ./.agents/skills/"
  Write-Host " 9) Cursor (Global)                           -> ~/.cursor/skills/"
  Write-Host "10) Cursor (Local)                            -> ./.cursor/skills/"
  Write-Host "11) Windsurf / Devin Desktop (Global)         -> ~/.codeium/windsurf/skills/"
  Write-Host "12) Windsurf / Devin Desktop (Local)          -> ./.windsurf/skills/"
  Write-Host "13) Cline (Global)                            -> ~/.cline/skills/"
  Write-Host "14) Cline (Local)                             -> ./.cline/skills/"
  Write-Host "15) Roo Code (Global)                         -> ~/.roo/skills/"
  Write-Host "16) Roo Code (Local)                          -> ./.roo/skills/"
  Write-Host "17) Kilo Code (Global)                        -> ~/.kilo/skills/"
  Write-Host "18) Kilo Code (Local)                         -> ./.kilo/skills/"
  Write-Host "19) Trae AI (Global)                          -> ~/.trae/skills/"
  Write-Host "20) Trae AI (Local)                           -> ./.trae/skills/"
  Write-Host "21) Augment Code (Local)                      -> ./.augment/skills/"
  Write-Host "22) Zed Editor (Local)                        -> ./.zed/skills/"
  Write-Host "23) Amazon Q Developer (Local)                -> ./.amazonq/skills/"
  Write-Host "24) OpenCode (Global)                         -> ~/.config/opencode/skills/"
  Write-Host "25) OpenCode (Local)                          -> ./.opencode/skills/"
  Write-Host "26) OpenClaude (Global)                       -> ~/.openclaude/skills/"
  Write-Host "27) OpenClaude (Local)                        -> ./.openclaude/skills/"
  Write-Host " L) All LOCAL targets"
  Write-Host " G) All GLOBAL targets"
  Write-Host " A) ALL targets"
  Write-Host " C) Cancel"
  Write-Host ""

  $choice = Read-Host "Select option(s) (space-separated, e.g. 1 3 5 or L/G/A/C)"
  $choice = $choice.Trim().ToUpper()

  if ($choice -eq 'C') {
    Write-Host "Installation cancelled."
    exit 0
  }

  # Local indices: even-numbered + local-only tools (21,22,23)
  $localIndices = @(2,4,6,8,10,12,14,16,18,20,21,22,23,25,27)
  # Global indices: odd-numbered for paired, 24 for opencode, 26 for openclaude
  $globalIndices = @(1,3,5,7,9,11,13,15,17,19,24,26)
  $allIndices = 1..27

  if ($choice -eq 'A') { $indices = $allIndices }
  elseif ($choice -eq 'L') { $indices = $localIndices }
  elseif ($choice -eq 'G') { $indices = $globalIndices }
  else { $indices = $choice -split '\s+' | ForEach-Object { [int]$_ } }

  $homeDir = $env:USERPROFILE

  foreach ($opt in $indices) {
    switch ($opt) {
       1 { Copy-SkillFolder $srcSkillDir (Join-Path $homeDir ".claude\skills\roblox-best-practices") }
       2 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".claude\skills\roblox-best-practices") }
       3 { Copy-SkillFolder $srcSkillDir (Join-Path $homeDir ".codex\skills\roblox-best-practices") }
       4 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".codex\skills\roblox-best-practices") }
       5 { Copy-SkillFolder $srcSkillDir (Join-Path $homeDir ".gemini\skills\roblox-best-practices") }
       6 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".gemini\skills\roblox-best-practices") }
       7 { Copy-SkillFolder $srcSkillDir (Join-Path $homeDir ".gemini\config\skills\roblox-best-practices") }
       8 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".agents\skills\roblox-best-practices") }
       9 { Copy-SkillFolder $srcSkillDir (Join-Path $homeDir ".cursor\skills\roblox-best-practices") }
      10 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".cursor\skills\roblox-best-practices") }
      11 { Copy-SkillFolder $srcSkillDir (Join-Path $homeDir ".codeium\windsurf\skills\roblox-best-practices") }
      12 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".windsurf\skills\roblox-best-practices") }
      13 { Copy-SkillFolder $srcSkillDir (Join-Path $homeDir ".cline\skills\roblox-best-practices") }
      14 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".cline\skills\roblox-best-practices") }
      15 { Copy-SkillFolder $srcSkillDir (Join-Path $homeDir ".roo\skills\roblox-best-practices") }
      16 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".roo\skills\roblox-best-practices") }
      17 { Copy-SkillFolder $srcSkillDir (Join-Path $homeDir ".kilo\skills\roblox-best-practices") }
      18 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".kilo\skills\roblox-best-practices") }
      19 { Copy-SkillFolder $srcSkillDir (Join-Path $homeDir ".trae\skills\roblox-best-practices") }
      20 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".trae\skills\roblox-best-practices") }
      21 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".augment\skills\roblox-best-practices") }
      22 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".zed\skills\roblox-best-practices") }
      23 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".amazonq\skills\roblox-best-practices") }
      24 { Copy-SkillFolder $srcSkillDir (Join-Path $homeDir ".config\opencode\skills\roblox-best-practices") }
      25 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".opencode\skills\roblox-best-practices") }
      26 { Copy-SkillFolder $srcSkillDir (Join-Path $homeDir ".openclaude\skills\roblox-best-practices") }
      27 { Copy-SkillFolder $srcSkillDir (Join-Path "." ".openclaude\skills\roblox-best-practices") }
      default { Write-Host "[WARNING] Invalid option: $opt" -ForegroundColor Yellow }
    }
  }

  Write-Host ""
  Write-Host "[SUCCESS] Installation complete!" -ForegroundColor Green

} finally {
  # Cleanup temp directory
  if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
  }
}
