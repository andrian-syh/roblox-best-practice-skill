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
  claudeGlobal: {
    name: 'Claude Code (Global)',
    desc: 'Global skill for Claude Code (~/.claude/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.claude/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  claudeLocal: {
    name: 'Claude Code (Local)',
    desc: 'Project-specific skill for Claude Code (.claude/skills/)',
    install: () => {
      const dest = path.join(cwd, '.claude/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  codexGlobal: {
    name: 'Codex CLI (Global)',
    desc: 'Global skill for Codex CLI (~/.codex/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.codex/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  codexLocal: {
    name: 'Codex CLI (Local)',
    desc: 'Project-specific skill for Codex CLI (.codex/skills/)',
    install: () => {
      const dest = path.join(cwd, '.codex/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  geminiCliGlobal: {
    name: 'Gemini CLI (Global)',
    desc: 'Global skill for Gemini CLI (~/.gemini/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.gemini/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  geminiCliLocal: {
    name: 'Gemini CLI (Local)',
    desc: 'Project-specific skill for Gemini CLI (.gemini/skills/)',
    install: () => {
      const dest = path.join(cwd, '.gemini/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  antigravityGlobal: {
    name: 'Antigravity / Gemini Agent IDE (Global)',
    desc: 'Global skill for Antigravity (~/.gemini/config/skills/)',
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
  cursorGlobal: {
    name: 'Cursor (Global)',
    desc: 'Global skill for Cursor (~/.cursor/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.cursor/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  cursorLocal: {
    name: 'Cursor (Local)',
    desc: 'Project-specific skill for Cursor (.cursor/skills/)',
    install: () => {
      const dest = path.join(cwd, '.cursor/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  windsurfGlobal: {
    name: 'Windsurf / Devin Desktop (Global)',
    desc: 'Global skill for Windsurf / Devin Desktop (~/.codeium/windsurf/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.codeium/windsurf/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  windsurfLocal: {
    name: 'Windsurf / Devin Desktop (Local)',
    desc: 'Project-specific skill for Windsurf / Devin Desktop (.windsurf/skills/)',
    install: () => {
      const dest = path.join(cwd, '.windsurf/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  clineGlobal: {
    name: 'Cline (Global)',
    desc: 'Global skill for Cline (~/.cline/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.cline/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  clineLocal: {
    name: 'Cline (Local)',
    desc: 'Project-specific skill for Cline (.cline/skills/)',
    install: () => {
      const dest = path.join(cwd, '.cline/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  rooGlobal: {
    name: 'Roo Code (Global)',
    desc: 'Global skill for Roo Code (~/.roo/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.roo/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  rooLocal: {
    name: 'Roo Code (Local)',
    desc: 'Project-specific skill for Roo Code (.roo/skills/)',
    install: () => {
      const dest = path.join(cwd, '.roo/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  kiloGlobal: {
    name: 'Kilo Code (Global)',
    desc: 'Global skill for Kilo Code (~/.kilo/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.kilo/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  kiloLocal: {
    name: 'Kilo Code (Local)',
    desc: 'Project-specific skill for Kilo Code (.kilo/skills/)',
    install: () => {
      const dest = path.join(cwd, '.kilo/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  traeGlobal: {
    name: 'Trae AI (Global)',
    desc: 'Global skill for Trae AI (~/.trae/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.trae/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  traeLocal: {
    name: 'Trae AI (Local)',
    desc: 'Project-specific skill for Trae AI (.trae/skills/)',
    install: () => {
      const dest = path.join(cwd, '.trae/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  augment: {
    name: 'Augment Code (Local)',
    desc: 'Project-specific skill for Augment Code (.augment/skills/)',
    install: () => {
      const dest = path.join(cwd, '.augment/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  zed: {
    name: 'Zed Editor (Local)',
    desc: 'Project-specific skill for Zed Editor (.zed/skills/)',
    install: () => {
      const dest = path.join(cwd, '.zed/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  amazonq: {
    name: 'Amazon Q Developer (Local)',
    desc: 'Project-specific skill for Amazon Q Developer (.amazonq/skills/)',
    install: () => {
      const dest = path.join(cwd, '.amazonq/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  opencodeGlobal: {
    name: 'OpenCode (Global)',
    desc: 'Global skill for OpenCode (~/.config/opencode/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.config/opencode/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  opencodeLocal: {
    name: 'OpenCode (Local)',
    desc: 'Project-specific skill for OpenCode (.opencode/skills/)',
    install: () => {
      const dest = path.join(cwd, '.opencode/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  openclaudeGlobal: {
    name: 'OpenClaude (Global)',
    desc: 'Global skill for OpenClaude (~/.openclaude/skills/)',
    install: () => {
      const dest = path.join(homeDir, '.openclaude/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
    }
  },
  openclaudeLocal: {
    name: 'OpenClaude (Local)',
    desc: 'Project-specific skill for OpenClaude (.openclaude/skills/)',
    install: () => {
      const dest = path.join(cwd, '.openclaude/skills/roblox-best-practices');
      copyFolderRecursiveSync(srcSkillDir, dest);
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
  -a, --all                   Install for all supported local and global tools
  -al, --all-local            Install for all local tools in the current project directory
  -ag, --all-global           Install for all global user configurations
  
Specific Agent Options:
  --claude-global, -clg       Claude Code (Global)
  --claude-local, -cll        Claude Code (Local)
  --codex-global, -cxg        Codex CLI (Global)
  --codex-local, -cxl         Codex CLI (Local)
  --gemini-global, -gmg       Gemini CLI (Global)
  --gemini-local, -gml        Gemini CLI (Local)
  --antigravity-global, -agg  Antigravity / Gemini Agent IDE (Global)
  --antigravity-local, -agl   Antigravity / Gemini Agent IDE (Local)
  --cursor-global, -crg       Cursor (Global)
  --cursor-local, -crl        Cursor (Local)
  --windsurf-global, -wsg     Windsurf / Devin Desktop (Global)
  --windsurf-local, -wsl      Windsurf / Devin Desktop (Local)
  --cline-global, -cng        Cline (Global)
  --cline-local, -cnl         Cline (Local)
  --roo-global, -rog          Roo Code (Global)
  --roo-local, -rol           Roo Code (Local)
  --kilo-global, -kg          Kilo Code (Global)
  --kilo-local, -kl           Kilo Code (Local)
  --trae-global, -trg         Trae AI (Global)
  --trae-local, -trl          Trae AI (Local)
  --augment, -aug             Augment Code (Local)
  --zed, -zd                  Zed Editor (Local)
  --amazonq, -aq              Amazon Q Developer (Local)
  --opencode-global, -opg     OpenCode (Global)
  --opencode-local, -opl      OpenCode (Local)
  --openclaude-global, -ocg   OpenClaude (Global)
  --openclaude-local, -ocl    OpenClaude (Local)
  `);
  process.exit(0);
}

// Map flags to targets
const argMap = {
  '--claude-global': ['claudeGlobal'], '-clg': ['claudeGlobal'],
  '--claude-local': ['claudeLocal'], '-cll': ['claudeLocal'],
  '--codex-global': ['codexGlobal'], '-cxg': ['codexGlobal'],
  '--codex-local': ['codexLocal'], '-cxl': ['codexLocal'],
  '--gemini-global': ['geminiCliGlobal'], '-gmg': ['geminiCliGlobal'],
  '--gemini-local': ['geminiCliLocal'], '-gml': ['geminiCliLocal'],
  '--antigravity-global': ['antigravityGlobal'], '-agg': ['antigravityGlobal'],
  '--antigravity-local': ['antigravityLocal'], '-agl': ['antigravityLocal'],
  '--cursor-global': ['cursorGlobal'], '-crg': ['cursorGlobal'],
  '--cursor-local': ['cursorLocal'], '-crl': ['cursorLocal'],
  '--windsurf-global': ['windsurfGlobal'], '-wsg': ['windsurfGlobal'],
  '--windsurf-local': ['windsurfLocal'], '-wsl': ['windsurfLocal'],
  '--cline-global': ['clineGlobal'], '-cng': ['clineGlobal'],
  '--cline-local': ['clineLocal'], '-cnl': ['clineLocal'],
  '--roo-global': ['rooGlobal'], '-rog': ['rooGlobal'],
  '--roo-local': ['rooLocal'], '-rol': ['rooLocal'],
  '--kilo-global': ['kiloGlobal'], '-kg': ['kiloGlobal'],
  '--kilo-local': ['kiloLocal'], '-kl': ['kiloLocal'],
  '--trae-global': ['traeGlobal'], '-trg': ['traeGlobal'],
  '--trae-local': ['traeLocal'], '-trl': ['traeLocal'],
  '--augment': ['augment'], '-aug': ['augment'],
  '--zed': ['zed'], '-zd': ['zed'],
  '--amazonq': ['amazonq'], '-aq': ['amazonq'],
  '--opencode-global': ['opencodeGlobal'], '-opg': ['opencodeGlobal'],
  '--opencode-local': ['opencodeLocal'], '-opl': ['opencodeLocal'],
  '--openclaude-global': ['openclaudeGlobal'], '-ocg': ['openclaudeGlobal'],
  '--openclaude-local': ['openclaudeLocal'], '-ocl': ['openclaudeLocal'],
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
  console.log(`${(idx + 1).toString().padStart(2)}) [ ] ${targets[key].name.padEnd(48)} - ${targets[key].desc}`);
});
console.log(' L) [ ] Select All LOCAL tools');
console.log(' G) [ ] Select All GLOBAL tools');
console.log(' A) [ ] Select ALL tools');
console.log('========================================================');

rl.question('Enter numbers separated by spaces (e.g. 1 2 5) or L / G / A: ', (answer) => {
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
