# ========================================================
#  Roblox Best Practices Skill Installer (PowerShell)
# ========================================================

Write-Host "========================================================" -ForegroundColor Blue
Write-Host "       Roblox Best Practices Skill Installer            " -ForegroundColor Blue
Write-Host "========================================================" -ForegroundColor Blue

# Check if Node.js/npm is available, prefer npx-based CLI
if ((Get-Command node -ErrorAction SilentlyContinue) -and (Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js detected. Launching NPM-based CLI installer..." -ForegroundColor Green
  $npmVer = (npm --version) -split '\.'
  if ([int]$npmVer[0] -ge 12) {
    & npx --allow-git=all github:andrian-syh/roblox-best-practices-skill $args
  } else {
    & npx github:andrian-syh/roblox-best-practices-skill $args
  }
  return
}

Write-Host "Node.js/NPM not found. Running PowerShell fallback installer..." -ForegroundColor Yellow

# Download skill files to temp directory
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("roblox_skill_" + [System.Guid]::NewGuid().ToString().Substring(0,8))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
  if (Get-Command git -ErrorAction SilentlyContinue) {
    git clone --depth 1 https://github.com/andrian-syh/roblox-best-practices-skill.git $tempDir 2>$null | Out-Null
  } else {
    $zipUrl = "https://github.com/andrian-syh/roblox-best-practices-skill/archive/refs/heads/main.zip"
    $zipPath = Join-Path $tempDir "archive.zip"
    Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing
    Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force
    # Move extracted files up
    $extracted = Join-Path $tempDir "roblox-best-practices-skill-main"
    Get-ChildItem $extracted | Move-Item -Destination $tempDir -Force
    Remove-Item $extracted -Recurse -Force -ErrorAction SilentlyContinue
  }

  $srcSkillDir = Join-Path $tempDir "roblox-best-practices"
  if (-not (Test-Path $srcSkillDir)) {
    Write-Host "[ERROR] Failed to locate roblox-best-practices directory in download." -ForegroundColor Red
    return
  }

  function Copy-SkillFolder($src, $dest) {
    if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
    $parent = Split-Path $dest -Parent
    if (-not (Test-Path $parent)) {
      New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
    Copy-Item -Path $src -Destination $dest -Recurse -Force
    Write-Host "[CREATED] $dest" -ForegroundColor Green
  }

  # List of additional agents with paths
  $additionalAgents = @(
      @{ Name = "AiderDesk"; Path = ".aider-desk/skills"; Parent = ".aider-desk" }
      @{ Name = "AstrBot"; Path = "data/skills"; Parent = "data" }
      @{ Name = "Autohand Code CLI"; Path = ".autohand/skills"; Parent = ".autohand" }
      @{ Name = "Augment"; Path = ".augment/skills"; Parent = ".augment" }
      @{ Name = "IBM Bob"; Path = ".bob/skills"; Parent = ".bob" }
      @{ Name = "Claude Code"; Path = ".claude/skills"; Parent = ".claude" }
      @{ Name = "Codex"; Path = ".codex/skills"; Parent = ".codex" }
      @{ Name = "Gemini CLI"; Path = ".gemini/config/skills"; Parent = ".gemini" }
      @{ Name = "Cursor"; Path = ".cursor/skills"; Parent = ".cursor" }
      @{ Name = "Windsurf"; Path = ".windsurf/skills"; Parent = ".windsurf" }
      @{ Name = "Cline"; Path = ".cline/skills"; Parent = ".cline" }
      @{ Name = "Roo Code"; Path = ".roo/skills"; Parent = ".roo" }
      @{ Name = "Kilo Code"; Path = ".kilocode/skills"; Parent = ".kilocode" }
      @{ Name = "Trae AI"; Path = ".trae/skills"; Parent = ".trae" }
      @{ Name = "Zed Editor"; Path = ".zed/skills"; Parent = ".zed" }
      @{ Name = "Amazon Q"; Path = ".amazonq/skills"; Parent = ".amazonq" }
      @{ Name = "OpenCode"; Path = ".opencode/skills"; Parent = ".opencode" }
      @{ Name = "OpenClaude"; Path = ".openclaude/skills"; Parent = ".openclaude" }
  )

  # Check which parent folders exist in user's home directory
  $detectedAgents = @()
  foreach ($agent in $additionalAgents) {
      $parentHomePath = Join-Path $HOME $agent.Parent
      if (Test-Path $parentHomePath) {
          $detectedAgents += $agent
      }
  }

  Write-Host ""
  Write-Host "  Which agents do you want to install to?" -ForegroundColor Green
  Write-Host "  --- Universal (.agents/skills) -- always included -------" -ForegroundColor DarkGray
  Write-Host "    * Amp, Antigravity, Antigravity CLI, Cline, Codex, Kimi Code CLI, OpenCode, Warp, Zed" -ForegroundColor Green
  Write-Host ""

  # Always copy to Universal
  Write-Host "Installing to Universal (.agents/skills)..." -ForegroundColor Cyan
  Copy-SkillFolder $srcSkillDir (Join-Path "." ".agents\skills\roblox-best-practices")

  if ($detectedAgents.Count -gt 0) {
      Write-Host ""
      Write-Host "Detected existing agent directories in your home directory:" -ForegroundColor Yellow
      for ($i = 0; $i -lt $detectedAgents.Count; $i++) {
          $idx = $i + 1
          $agentName = $detectedAgents[$i].Name
          $agentPath = $detectedAgents[$i].Path
          Write-Host ("  {0}) [x] {1} (~/{2})" -f $idx, $agentName, $agentPath) -ForegroundColor Cyan
      }
      Write-Host ""
      $confirm = Read-Host "Do you want to install the skill to these detected agents? (Y/n)"
      if ($confirm -eq "" -or $confirm.ToUpper() -eq "Y") {
          foreach ($agent in $detectedAgents) {
              $agentName = $agent.Name
              $agentPath = $agent.Path
              Write-Host ""
              Write-Host ("Installing to {0}..." -f $agentName) -ForegroundColor Cyan
              Copy-SkillFolder $srcSkillDir (Join-Path $HOME ($agentPath + "/roblox-best-practices"))
          }
          # Show assumed installed for non-detected agents
          foreach ($agent in $additionalAgents) {
              if ($detectedAgents.Name -notcontains $agent.Name) {
                  Write-Host ("[INSTALLED] (Assumed) " + $agent.Name) -ForegroundColor Green
              }
          }
      }
  } else {
      Write-Host ""
      Write-Host "No other agent directories detected in your home directory. Skip additional agents." -ForegroundColor Gray
      # Show assumed installed for all
      foreach ($agent in $additionalAgents) {
          Write-Host ("[INSTALLED] (Assumed) " + $agent.Name) -ForegroundColor Green
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
