#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const prompts = require('prompts');

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
    appRoot: path.join(homeDir, '.claude'),
    dest: path.join(homeDir, '.claude/skills/roblox-best-practices')
  },
  claudeLocal: {
    name: 'Claude Code (Local)',
    desc: 'Project-specific skill for Claude Code (.claude/skills/)',
    appRoot: path.join(cwd, '.claude'),
    dest: path.join(cwd, '.claude/skills/roblox-best-practices')
  },
  codexGlobal: {
    name: 'Codex CLI (Global)',
    desc: 'Global skill for Codex CLI (~/.codex/skills/)',
    appRoot: path.join(homeDir, '.codex'),
    dest: path.join(homeDir, '.codex/skills/roblox-best-practices')
  },
  codexLocal: {
    name: 'Codex CLI (Local)',
    desc: 'Project-specific skill for Codex CLI (.codex/skills/)',
    appRoot: path.join(cwd, '.codex'),
    dest: path.join(cwd, '.codex/skills/roblox-best-practices')
  },
  geminiCliGlobal: {
    name: 'Gemini CLI (Global)',
    desc: 'Global skill for Gemini CLI (~/.gemini/skills/)',
    appRoot: path.join(homeDir, '.gemini'),
    dest: path.join(homeDir, '.gemini/skills/roblox-best-practices')
  },
  geminiCliLocal: {
    name: 'Gemini CLI (Local)',
    desc: 'Project-specific skill for Gemini CLI (.gemini/skills/)',
    appRoot: path.join(cwd, '.gemini'),
    dest: path.join(cwd, '.gemini/skills/roblox-best-practices')
  },
  antigravityGlobal: {
    name: 'Antigravity / Gemini Agent IDE (Global)',
    desc: 'Global skill for Antigravity (~/.gemini/config/skills/)',
    appRoot: path.join(homeDir, '.gemini'),
    dest: path.join(homeDir, '.gemini/config/skills/roblox-best-practices')
  },
  antigravityLocal: {
    name: 'Antigravity / Gemini Agent IDE (Local)',
    desc: 'Project-specific skill for Antigravity (.agents/skills/)',
    appRoot: path.join(cwd, '.agents'),
    dest: path.join(cwd, '.agents/skills/roblox-best-practices')
  },
  cursorGlobal: {
    name: 'Cursor (Global)',
    desc: 'Global skill for Cursor (~/.cursor/skills/)',
    appRoot: path.join(homeDir, '.cursor'),
    dest: path.join(homeDir, '.cursor/skills/roblox-best-practices')
  },
  cursorLocal: {
    name: 'Cursor (Local)',
    desc: 'Project-specific skill for Cursor (.cursor/skills/)',
    appRoot: path.join(cwd, '.cursor'),
    dest: path.join(cwd, '.cursor/skills/roblox-best-practices')
  },
  windsurfGlobal: {
    name: 'Windsurf / Devin Desktop (Global)',
    desc: 'Global skill for Windsurf / Devin Desktop (~/.codeium/windsurf/skills/)',
    appRoot: path.join(homeDir, '.codeium'),
    dest: path.join(homeDir, '.codeium/windsurf/skills/roblox-best-practices')
  },
  windsurfLocal: {
    name: 'Windsurf / Devin Desktop (Local)',
    desc: 'Project-specific skill for Windsurf / Devin Desktop (.windsurf/skills/)',
    appRoot: path.join(cwd, '.windsurf'),
    dest: path.join(cwd, '.windsurf/skills/roblox-best-practices')
  },
  clineGlobal: {
    name: 'Cline (Global)',
    desc: 'Global skill for Cline (~/.cline/skills/)',
    appRoot: path.join(homeDir, '.cline'),
    dest: path.join(homeDir, '.cline/skills/roblox-best-practices')
  },
  clineLocal: {
    name: 'Cline (Local)',
    desc: 'Project-specific skill for Cline (.cline/skills/)',
    appRoot: path.join(cwd, '.cline'),
    dest: path.join(cwd, '.cline/skills/roblox-best-practices')
  },
  rooGlobal: {
    name: 'Roo Code (Global)',
    desc: 'Global skill for Roo Code (~/.roo/skills/)',
    appRoot: path.join(homeDir, '.roo'),
    dest: path.join(homeDir, '.roo/skills/roblox-best-practices')
  },
  rooLocal: {
    name: 'Roo Code (Local)',
    desc: 'Project-specific skill for Roo Code (.roo/skills/)',
    appRoot: path.join(cwd, '.roo'),
    dest: path.join(cwd, '.roo/skills/roblox-best-practices')
  },
  kiloGlobal: {
    name: 'Kilo Code (Global)',
    desc: 'Global skill for Kilo Code (~/.kilo/skills/)',
    appRoot: path.join(homeDir, '.kilo'),
    dest: path.join(homeDir, '.kilo/skills/roblox-best-practices')
  },
  kiloLocal: {
    name: 'Kilo Code (Local)',
    desc: 'Project-specific skill for Kilo Code (.kilo/skills/)',
    appRoot: path.join(cwd, '.kilo'),
    dest: path.join(cwd, '.kilo/skills/roblox-best-practices')
  },
  traeGlobal: {
    name: 'Trae AI (Global)',
    desc: 'Global skill for Trae AI (~/.trae/skills/)',
    appRoot: path.join(homeDir, '.trae'),
    dest: path.join(homeDir, '.trae/skills/roblox-best-practices')
  },
  traeLocal: {
    name: 'Trae AI (Local)',
    desc: 'Project-specific skill for Trae AI (.trae/skills/)',
    appRoot: path.join(cwd, '.trae'),
    dest: path.join(cwd, '.trae/skills/roblox-best-practices')
  },
  augment: {
    name: 'Augment Code (Local)',
    desc: 'Project-specific skill for Augment Code (.augment/skills/)',
    appRoot: path.join(cwd, '.augment'),
    dest: path.join(cwd, '.augment/skills/roblox-best-practices')
  },
  zed: {
    name: 'Zed Editor (Local)',
    desc: 'Project-specific skill for Zed Editor (.zed/skills/)',
    appRoot: path.join(cwd, '.zed'),
    dest: path.join(cwd, '.zed/skills/roblox-best-practices')
  },
  amazonq: {
    name: 'Amazon Q Developer (Local)',
    desc: 'Project-specific skill for Amazon Q Developer (.amazonq/skills/)',
    appRoot: path.join(cwd, '.amazonq'),
    dest: path.join(cwd, '.amazonq/skills/roblox-best-practices')
  },
  opencodeGlobal: {
    name: 'OpenCode (Global)',
    desc: 'Global skill for OpenCode (~/.config/opencode/skills/)',
    appRoot: path.join(homeDir, '.config/opencode'),
    dest: path.join(homeDir, '.config/opencode/skills/roblox-best-practices')
  },
  opencodeLocal: {
    name: 'OpenCode (Local)',
    desc: 'Project-specific skill for OpenCode (.opencode/skills/)',
    appRoot: path.join(cwd, '.opencode'),
    dest: path.join(cwd, '.opencode/skills/roblox-best-practices')
  },
  openclaudeGlobal: {
    name: 'OpenClaude (Global)',
    desc: 'Global skill for OpenClaude (~/.openclaude/skills/)',
    appRoot: path.join(homeDir, '.openclaude'),
    dest: path.join(homeDir, '.openclaude/skills/roblox-best-practices')
  },
  openclaudeLocal: {
    name: 'OpenClaude (Local)',
    desc: 'Project-specific skill for OpenClaude (.openclaude/skills/)',
    appRoot: path.join(cwd, '.openclaude'),
    dest: path.join(cwd, '.openclaude/skills/roblox-best-practices')
  }
};

const keys = Object.keys(targets);

// Execute installation for a given target key
function executeInstall(key) {
  const target = targets[key];
  console.log(`\n--- Installing \x1b[36m${target.name}\x1b[0m ---`);
  
  if (target.appRoot && !fs.existsSync(target.appRoot)) {
    console.log(`\x1b[33m[SKIPPED]\x1b[0m App root directory not found: ${target.appRoot}`);
  } else {
    copyFolderRecursiveSync(srcSkillDir, target.dest);
  }
}

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
    executeInstall(key);
  });
  console.log('\n\x1b[32m[SUCCESS] Installation complete!\x1b[0m');
  process.exit(0);
}

// Interactive prompt using prompts library
(async () => {
  console.log('\x1b[36m========================================================\x1b[0m');
  console.log('\x1b[36m       Roblox Best Practices Skill Installer CLI        \x1b[0m');
  console.log('\x1b[36m========================================================\x1b[0m\n');

  const modeResponse = await prompts({
    type: 'select',
    name: 'mode',
    message: 'Welcome! How would you like to install the Roblox Best Practices skill?',
    choices: [
      { title: '>> Smart Install (Auto-detect tools & install)', value: 'smart', description: 'Automatically detects which AI tools you have and configures them' },
      { title: '-> Local Project (Specific tools for this folder)', value: 'local', description: 'Manually select local project tools to configure' },
      { title: '=> Global User (Specific tools globally)', value: 'global', description: 'Manually select global tools to configure' },
      { title: '== Manual Selection (Show ALL tools)', value: 'all', description: 'Manually select from the full list of both local and global tools' },
      { title: ' x Cancel', value: 'cancel' }
    ]
  });

  if (!modeResponse.mode || modeResponse.mode === 'cancel') {
    console.log('\n\x1b[31m[CANCELLED] Installation cancelled.\x1b[0m');
    process.exit(0);
  }

  let keysToInstall = [];

  if (modeResponse.mode === 'smart') {
    // Auto-detect available tools
    const availableKeys = keys.filter(k => {
      const target = targets[k];
      return target.appRoot && fs.existsSync(target.appRoot);
    });
    
    if (availableKeys.length === 0) {
       console.log('\n\x1b[33m[INFO] No supported AI tools detected on your system. Try manual Local/Global install.\x1b[0m');
       process.exit(0);
    }
    
    console.log(`\n\x1b[32m>> Smart Install: Detected ${availableKeys.length} tool(s).\x1b[0m`);
    keysToInstall = availableKeys;

  } else {
    // Manual Selection (Local, Global, or All)
    const isGlobal = modeResponse.mode === 'global';
    const isLocal = modeResponse.mode === 'local';
    
    let filteredKeys = keys;
    if (isGlobal) filteredKeys = keys.filter(k => k.endsWith('Global'));
    if (isLocal) filteredKeys = keys.filter(k => !k.endsWith('Global'));
    
    const choices = filteredKeys.map(key => ({
      title: targets[key].name,
      description: targets[key].desc,
      value: key
    }));
    
    let allMacroTitle = 'ALL';
    if (isGlobal) allMacroTitle = 'GLOBAL';
    if (isLocal) allMacroTitle = 'LOCAL';

    choices.unshift({ 
      title: `\x1b[33m--- Select All ${allMacroTitle} Tools ---\x1b[0m`, 
      value: 'ALL', 
      description: `Selects all options below` 
    });

    const response = await prompts({
      type: 'multiselect',
      name: 'selected',
      message: `Select the ${isGlobal ? 'Global' : 'Local'} tools to configure:`,
      choices: choices,
      instructions: false,
      hint: '- Space to select. Return to submit',
      min: 1
    });

    if (!response.selected || response.selected.length === 0) {
      console.log('\n\x1b[31m[CANCELLED] No targets selected.\x1b[0m');
      process.exit(0);
    }
    
    keysToInstall = response.selected;
    if (keysToInstall.includes('ALL')) {
      keysToInstall = filteredKeys;
    }
    
    // Remove the 'ALL' macro if it's there but they also selected specific ones
    keysToInstall = keysToInstall.filter(k => k !== 'ALL');
  }

  console.log(`\n\x1b[32mInstalling for ${keysToInstall.length} target(s)...\x1b[0m`);
  keysToInstall.forEach(key => {
    executeInstall(key);
  });

  console.log('\n\x1b[32m[SUCCESS] Installation complete!\x1b[0m');
})();
