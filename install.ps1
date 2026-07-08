# Roblox Best Practices Skill Installer for Windows PowerShell

$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       Roblox Best Practices Skill Installer            " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# Check if Node.js and npm are available
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "Node.js detected. Launching NPM-based CLI installer..." -ForegroundColor Green
    & npx github:andrian-syh/roblox-best-practice-skill $args
    return
}

Write-Host "Node.js/NPM not found. Running PowerShell fallback installer..." -ForegroundColor Yellow

# Setup temporary directory
$tempDirName = "roblox_best_practices_skill_temp"
$tempPath = Join-Path $env:TEMP $tempDirName
if (Test-Path $tempPath) {
    Remove-Item -Recurse -Force $tempPath -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $tempPath | Out-Null

try {
    Write-Host "Downloading skill files..." -ForegroundColor Cyan
    if (Get-Command git -ErrorAction SilentlyContinue) {
        & git clone --depth 1 https://github.com/andrian-syh/roblox-best-practice-skill.git $tempPath
    } else {
        $zipUrl = "https://github.com/andrian-syh/roblox-best-practice-skill/archive/refs/heads/main.zip"
        $zipPath = Join-Path $tempPath "archive.zip"
        
        Write-Host "Git not found. Downloading repository ZIP archive..." -ForegroundColor Gray
        Invoke-RestMethod -Uri $zipUrl -OutFile $zipPath
        
        Write-Host "Extracting ZIP archive..." -ForegroundColor Gray
        Expand-Archive -Path $zipPath -DestinationPath $tempPath
        
        # Extracted files go to a subfolder
        $extractedDir = Join-Path $tempPath "roblox-best-practice-skill-main"
        # Copy contents to root temp folder
        Copy-Item -Path "$extractedDir\*" -Destination $tempPath -Recurse -Force
        Remove-Item -Path $extractedDir -Recurse -Force
    }

    $srcSkillDir = Join-Path $tempPath "roblox-best-practices"
    if (-not (Test-Path $srcSkillDir)) {
        throw "Failed to locate roblox-best-practices folder in downloaded repository."
    }

    function Copy-Folder {
        param($src, $dest)
        if (Test-Path $dest) {
            Remove-Item -Recurse -Force $dest -ErrorAction SilentlyContinue
        }
        $parent = Split-Path -Parent $dest
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Path $parent | Out-Null
        }
        Copy-Item -Path $src -Destination $dest -Recurse -Force
        Write-Host "[CREATED] $dest" -ForegroundColor Green
    }

    function Copy-File {
        param($src, $dest)
        $parent = Split-Path -Parent $dest
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Path $parent | Out-Null
        }
        Copy-Item -Path $src -Destination $dest -Force
        Write-Host "[CREATED] $dest" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "Where would you like to install the skill?" -ForegroundColor Cyan
    Write-Host "1) Antigravity / Gemini Agent IDE (Global) -> ~/.gemini/config/skills/"
    Write-Host "2) Antigravity / Gemini Agent IDE (Local)  -> ./.agents/skills/"
    Write-Host "3) Claude Code CLI (Global)                -> ~/.claude/skills/"
    Write-Host "4) Claude Code CLI (Local)                 -> ./.claude/skills/"
    Write-Host "5) Cursor (Local)                          -> ./.cursor/rules/"
    Write-Host "6) Windsurf (Local)                        -> ./.windsurf/rules/"
    Write-Host "7) Cline / Roo Code (Local)                -> .clinerules & .roorules"
    Write-Host "8) GitHub Copilot (Local)                  -> .github/copilot-instructions.md"
    Write-Host "A) All Local targets"
    Write-Host "B) All Global targets"
    Write-Host "C) Cancel"
    
    $choice = Read-Host "Select option(s) (space-separated, e.g. 1 3 5 or A/B/C)"
    $choice = $choice.Trim().ToUpper()

    if ($choice -eq "C" -or $choice -eq "") {
        Write-Host "Installation cancelled." -ForegroundColor Yellow
        return
    }
    
    $opts = @()
    if ($choice -eq "A") {
        $opts = @("2", "4", "5", "6", "7", "8")
    } elseif ($choice -eq "B") {
        $opts = @("1", "3")
    } else {
        $opts = $choice -split "\s+"
    }

    $homePath = $HOME
    $currentPath = Get-Location

    foreach ($opt in $opts) {
        switch ($opt) {
            "1" {
                $dest = Join-Path $homePath ".gemini\config\skills\roblox-best-practices"
                Copy-Folder $srcSkillDir $dest
            }
            "2" {
                $dest = Join-Path $currentPath ".agents\skills\roblox-best-practices"
                Copy-Folder $srcSkillDir $dest
            }
            "3" {
                $dest = Join-Path $homePath ".claude\skills\roblox-best-practices"
                Copy-Folder $srcSkillDir $dest
            }
            "4" {
                $dest = Join-Path $currentPath ".claude\skills\roblox-best-practices"
                Copy-Folder $srcSkillDir $dest
            }
            "5" {
                $mdcFile = Join-Path $currentPath ".cursor\rules\roblox-best-practices.mdc"
                $parent = Split-Path -Parent $mdcFile
                if (-not (Test-Path $parent)) {
                    New-Item -ItemType Directory -Path $parent | Out-Null
                }
                
                $frontmatter = @"
---
description: Framework-agnostic Roblox/Luau coding standards and best practices
globs: ["**/*.lua", "**/*.luau"]
alwaysApply: true
---


"@
                $skillContent = Get-Content -Raw -Path (Join-Path $srcSkillDir "SKILL.md")
                Set-Content -Path $mdcFile -Value ($frontmatter + $skillContent) -Encoding utf8
                Write-Host "[CREATED] $mdcFile" -ForegroundColor Green
                
                Copy-Folder (Join-Path $srcSkillDir "references") (Join-Path $parent "references")
            }
            "6" {
                Copy-File (Join-Path $srcSkillDir "SKILL.md") (Join-Path $currentPath ".windsurf\rules\roblox-best-practices.md")
                Copy-Folder (Join-Path $srcSkillDir "references") (Join-Path $currentPath ".windsurf\rules\references")
                Copy-File (Join-Path $srcSkillDir "SKILL.md") (Join-Path $currentPath ".windsurfrules")
                Copy-Folder (Join-Path $srcSkillDir "references") (Join-Path $currentPath "references")
            }
            "7" {
                Copy-File (Join-Path $srcSkillDir "SKILL.md") (Join-Path $currentPath ".clinerules")
                Copy-File (Join-Path $srcSkillDir "SKILL.md") (Join-Path $currentPath ".roorules")
                Copy-Folder (Join-Path $srcSkillDir "references") (Join-Path $currentPath "references")
            }
            "8" {
                Copy-File (Join-Path $srcSkillDir "SKILL.md") (Join-Path $currentPath ".github\copilot-instructions.md")
                Copy-Folder (Join-Path $srcSkillDir "references") (Join-Path $currentPath ".github\references")
            }
            Default {
                Write-Host "Invalid option ignored: $opt" -ForegroundColor Red
            }
        }
    }
    
    Write-Host "`n[SUCCESS] Installation complete!" -ForegroundColor Green

} catch {
    Write-Host "`n[ERROR] Installation failed: $_" -ForegroundColor Red
} finally {
    # Cleanup
    if (Test-Path $tempPath) {
        Remove-Item -Recurse -Force $tempPath -ErrorAction SilentlyContinue
    }
}
