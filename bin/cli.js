#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const srcSkillDir = path.join(__dirname, '../roblox-best-practices');
const homeDir = os.homedir();
const cwd = process.cwd();

// Helper to copy file
function copyFileSync(src, dest) {
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`[CREATED] ${path.relative(cwd, dest) || dest}`);
  } catch (err) {
    console.error(`[ERROR] Failed to write ${dest}: ${err.message}`);
  }
}

// Helper to copy folder recursively
function copyFolderRecursiveSync(src, dest) {
  try {
    if (!fs.existsSync(src)) return;
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(childItemName => {
        copyFolderRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      });
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      console.log(`[CREATED] ${path.relative(cwd, dest) || dest}`);
    }
  } catch (err) {
    console.error(`[ERROR] Failed to copy from ${src} to ${dest}: ${err.message}`);
  }
}

const targets = {
  aider: {
    name: 'Aider (Local)',
    desc: 'Project-specific instructions for Aider (.aider.instructions.md)',
    install: () => {
      copyFileSync(path.join(srcSkillDir, 'SKILL.md'), path.join(cwd, '.aider.instructions.md'));
      copyFolderRecursiveSync(path.join(srcSkillDir, 'references'), path.join(cwd, 'references'));
    }
  },
  antigravityGlobal: {
    name: 'Antigravity / Gemini Agent IDE (Global)',
    desc: 'Global custom skill for Antigravity (~/.gemini/config/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.gemini/config/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  antigravityLocal: {
    name: 'Antigravity / Gemini Agent IDE (Local)',
    desc: 'Project-specific skill for Antigravity (.agents/skills/)',
    install: () => {
      const dest = path.join(cwd, '.agents/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  claudeGlobal: {
    name: 'Claude Code CLI (Global)',
    desc: 'Global custom skill for Claude Code (~/.claude/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.claude/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  claudeLocal: {
    name: 'Claude Code CLI (Local)',
    desc: 'Project-specific skill for Claude Code (.claude/skills/)',
    install: () => {
      const dest = path.join(cwd, '.claude/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  cline: {
    name: 'Cline / Roo Code (Local)',
    desc: 'Project rules for Cline and Roo Code (.clinerules & .roorules)',
    install: () => {
      copyFileSync(path.join(srcSkillDir, 'SKILL.md'), path.join(cwd, '.clinerules'));
      copyFileSync(path.join(srcSkillDir, 'SKILL.md'), path.join(cwd, '.roorules'));
      copyFolderRecursiveSync(path.join(srcSkillDir, 'references'), path.join(cwd, 'references'));
    }
  },
  cursor: {
    name: 'Cursor (Local)',
    desc: 'Project rules for Cursor (.cursor/rules/) with MDC frontmatter',
    install: () => {
      const ruleDest = path.join(cwd, '.cursor/rules/roblox-best-practices.mdc');
      const skillContent = fs.readFileSync(path.join(srcSkillDir, 'SKILL.md'), 'utf8');
      
      const frontmatter = `---
description: Framework-agnostic Roblox/Luau coding standards and best practices
globs: ["**/*.lua", "**/*.luau"]
alwaysApply: true
---

`;
      
      fs.mkdirSync(path.dirname(ruleDest), { recursive: true });
      fs.writeFileSync(ruleDest, frontmatter + skillContent, 'utf8');
      console.log(`[CREATED] ${path.relative(cwd, ruleDest)}`);
      
      copyFolderRecursiveSync(path.join(srcSkillDir, 'references'), path.join(cwd, '.cursor/rules/references'));
    }
  },
  copilot: {
    name: 'GitHub Copilot (Local)',
    desc: 'Workspace instructions for GitHub Copilot (.github/copilot-instructions.md)',
    install: () => {
      copyFileSync(path.join(srcSkillDir, 'SKILL.md'), path.join(cwd, '.github/copilot-instructions.md'));
      copyFolderRecursiveSync(path.join(srcSkillDir, 'references'), path.join(cwd, '.github/references'));
    }
  },
  kiloGlobal: {
    name: 'Kilo Code (Global)',
    desc: 'Global agent rules for Kilo Code (~/.config/kilo/AGENTS.md)',
    install: () => {
      const destFile = path.join(homeDir, '.config/kilo/AGENTS.md');
      const skillContent = fs.readFileSync(path.join(srcSkillDir, 'SKILL.md'), 'utf8');
      
      fs.mkdirSync(path.dirname(destFile), { recursive: true });
      if (fs.existsSync(destFile)) {
        const existing = fs.readFileSync(destFile, 'utf8');
        if (existing.includes('roblox-best-practices')) {
          console.log(`[INFO] roblox-best-practices rules already present in ${destFile}`);
          return;
        }
        fs.writeFileSync(destFile, existing + '\n\n' + skillContent, 'utf8');
        console.log(`[APPENDED] roblox-best-practices rules to ${destFile}`);
      } else {
        fs.writeFileSync(destFile, skillContent, 'utf8');
        console.log(`[CREATED] ${destFile}`);
      }
    }
  },
  kiloLocal: {
    name: 'Kilo Code (Local)',
    desc: 'Workspace rules for Kilo Code (.kilocode/rules/)',
    install: () => {
      copyFileSync(path.join(srcSkillDir, 'SKILL.md'), path.join(cwd, '.kilocode/rules/roblox-best-practices.md'));
      copyFolderRecursiveSync(path.join(srcSkillDir, 'references'), path.join(cwd, '.kilocode/rules/references'));
    }
  },
  openclaudeGlobal: {
    name: 'OpenClaude (Global)',
    desc: 'Global skills for OpenClaude (~/.openclaude/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.openclaude/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  openclaudeLocal: {
    name: 'OpenClaude (Local)',
    desc: 'Project-specific skills for OpenClaude (.openclaude/skills/)',
    install: () => {
      const dest = path.join(cwd, '.openclaude/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  opencodeGlobal: {
    name: 'OpenCode (Global)',
    desc: 'Global agent skills for OpenCode (~/.config/opencode/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.config/opencode/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  opencodeLocal: {
    name: 'OpenCode (Local)',
    desc: 'Project-specific skills for OpenCode (.opencode/skills/)',
    install: () => {
      const dest = path.join(cwd, '.opencode/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  windsurf: {
    name: 'Windsurf (Local)',
    desc: 'Workspace rules for Windsurf (.windsurf/rules/ & .windsurfrules)',
    install: () => {
      copyFileSync(path.join(srcSkillDir, 'SKILL.md'), path.join(cwd, '.windsurf/rules/roblox-best-practices.md'));
      copyFolderRecursiveSync(path.join(srcSkillDir, 'references'), path.join(cwd, '.windsurf/rules/references'));
      copyFileSync(path.join(srcSkillDir, 'SKILL.md'), path.join(cwd, '.windsurfrules'));
      copyFolderRecursiveSync(path.join(srcSkillDir, 'references'), path.join(cwd, 'references'));
    }
  }
};

const keys = Object.keys(targets);

// Argument parsing
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Roblox Best Practices Skill Installer CLI

Usage:
  npx roblox-best-practices-skill [options]

Options:
  -a, --all                 Install for all supported local and global tools
  -al, --all-local          Install for all local tools in the current project directory
  -ag, --all-global         Install for all global user configurations
  
Specific Agent Options:
  --aider, -ad              Aider (Local)
  --antigravity-global, -agg Antigravity / Gemini Agent IDE (Global)
  --antigravity-local, -agl  Antigravity / Gemini Agent IDE (Local)
  --claude-global, -clg     Claude Code CLI (Global)
  --claude-local, -cll      Claude Code CLI (Local)
  --cline, -cn              Cline / Roo Code (Local)
  --cursor, -cr             Cursor (Local)
  --copilot, -cp            GitHub Copilot (Local)
  --kilo-global, -kg        Kilo Code (Global)
  --kilo-local, -kl         Kilo Code (Local)
  --openclaude-global, -ocg OpenClaude (Global)
  --openclaude-local, -ocl  OpenClaude (Local)
  --opencode-global, -opg   OpenCode (Global)
  --opencode-local, -opl    OpenCode (Local)
  --windsurf, -ws           Windsurf (Local)
  `);
  process.exit(0);
}

// Map flags to targets
const argMap = {
  '--aider': ['aider'], '-ad': ['aider'],
  '--antigravity-global': ['antigravityGlobal'], '-agg': ['antigravityGlobal'],
  '--antigravity-local': ['antigravityLocal'], '-agl': ['antigravityLocal'],
  '--claude-global': ['claudeGlobal'], '-clg': ['claudeGlobal'],
  '--claude-local': ['claudeLocal'], '-cll': ['claudeLocal'],
  '--cline': ['cline'], '-cn': ['cline'],
  '--cursor': ['cursor'], '-cr': ['cursor'],
  '--copilot': ['copilot'], '-cp': ['copilot'],
  '--kilo-global': ['kiloGlobal'], '-kg': ['kiloGlobal'],
  '--kilo-local': ['kiloLocal'], '-kl': ['kiloLocal'],
  '--openclaude-global': ['openclaudeGlobal'], '-ocg': ['openclaudeGlobal'],
  '--openclaude-local': ['openclaudeLocal'], '-ocl': ['openclaudeLocal'],
  '--opencode-global': ['opencodeGlobal'], '-opg': ['opencodeGlobal'],
  '--opencode-local': ['opencodeLocal'], '-opl': ['opencodeLocal'],
  '--windsurf': ['windsurf'], '-ws': ['windsurf'],
  '--all': keys, '-a': keys,
  '--all-local': keys.filter(k => !k.endsWith('Global')), '-al': keys.filter(k => !k.endsWith('Global')),
  '--all-global': keys.filter(k => k.endsWith('Global')), '-ag': keys.filter(k => k.endsWith('Global'))
};

let selectedTargets = [];
for (const arg of args) {
  if (argMap[arg]) {
    selectedTargets.push(...argMap[arg]);
  }
}
// Remove duplicates
selectedTargets = [...new Set(selectedTargets)];

if (selectedTargets.length > 0) {
  console.log(`Installing for ${selectedTargets.length} target(s)...`);
  selectedTargets.forEach(key => {
    console.log(`\n--- Installing ${targets[key].name} ---`);
    targets[key].install();
  });
  console.log('\n[SUCCESS] Installation complete!');
  process.exit(0);
}

// Interactive prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('========================================================');
console.log('       Roblox Best Practices Skill Installer CLI        ');
console.log('========================================================');
console.log('Select the tools/assistants you want to install this skill for:');
keys.forEach((key, idx) => {
  console.log(`${(idx + 1).toString().padStart(2)}) [ ] ${targets[key].name.padEnd(45)} - ${targets[key].desc}`);
});
console.log(' L) [ ] Select All LOCAL tools');
console.log(' G) [ ] Select All GLOBAL tools');
console.log(' A) [ ] Select ALL tools');
console.log('========================================================');

rl.question('Enter numbers separated by spaces (e.g. 2 3 5) or L / G / A: ', (answer) => {
  const ans = answer.trim().toUpperCase();
  let keysToInstall = [];

  if (ans === 'A') {
    keysToInstall = keys;
  } else if (ans === 'L') {
    keysToInstall = keys.filter(k => !k.endsWith('Global'));
  } else if (ans === 'G') {
    keysToInstall = keys.filter(k => k.endsWith('Global'));
  } else {
    const indices = ans.split(/\s+/).map(x => parseInt(x, 10)).filter(n => !isNaN(n) && n >= 1 && n <= keys.length);
    keysToInstall = indices.map(idx => keys[idx - 1]);
  }

  if (keysToInstall.length === 0) {
    console.log('\n[CANCELLED] No targets selected.');
    rl.close();
    process.exit(0);
  }

  console.log(`\nInstalling for ${keysToInstall.length} target(s)...`);
  keysToInstall.forEach(key => {
    console.log(`\n--- Installing ${targets[key].name} ---`);
    targets[key].install();
  });

  console.log('\n[SUCCESS] Installation complete!');
  rl.close();
});
