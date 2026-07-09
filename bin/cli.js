#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const { execSync } = require('child_process');
const prompts = require('prompts');

const localSkillDir = path.join(__dirname, '../roblox-best-practices');
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

// Fetch available tags from GitHub API
function fetchGithubTags() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.github.com',
      path: '/repos/andrian-syh/roblox-best-practices-skill/tags',
      headers: {
        'User-Agent': 'roblox-best-practices-skill-installer'
      },
      timeout: 3000
    };

    https.get(options, (res) => {
      if (res.statusCode !== 200) {
        resolve([]);
        return;
      }

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const tags = JSON.parse(data).map(t => t.name);
          resolve(tags);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => {
      resolve([]);
    });
  });
}

// Download a specific tag from GitHub to a temporary directory
function downloadVersion(tag) {
  const tempDir = path.join(os.tmpdir(), `roblox_skill_${Math.random().toString(36).substr(2, 9)}`);
  console.log(`Downloading version ${tag} to temporary directory...`);
  
  try {
    let hasGit = false;
    try {
      execSync('git --version', { stdio: 'ignore' });
      hasGit = true;
    } catch (e) {}

    if (hasGit) {
      execSync(`git clone --depth 1 --branch ${tag} https://github.com/andrian-syh/roblox-best-practices-skill.git "${tempDir}"`, { stdio: 'ignore' });
    } else {
      fs.mkdirSync(tempDir, { recursive: true });
      const zipUrl = `https://github.com/andrian-syh/roblox-best-practices-skill/archive/refs/tags/${tag}.zip`;
      const zipPath = path.join(tempDir, 'archive.zip');
      
      if (process.platform === 'win32') {
        execSync(`powershell.exe -Command "Invoke-WebRequest -Uri '${zipUrl}' -OutFile '${zipPath}' -UseBasicParsing"`, { stdio: 'ignore' });
        execSync(`powershell.exe -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${tempDir}' -Force"`, { stdio: 'ignore' });
      } else {
        execSync(`curl -fsSL "${zipUrl}" -o "${zipPath}"`, { stdio: 'ignore' });
        execSync(`unzip -q "${zipPath}" -d "${tempDir}"`, { stdio: 'ignore' });
      }
      
      // Move extracted files up
      const tagFolderSuffix = tag.replace(/^v/, '');
      const extractedDir = path.join(tempDir, `roblox-best-practices-skill-${tagFolderSuffix}`);
      if (fs.existsSync(extractedDir)) {
        fs.readdirSync(extractedDir).forEach(file => {
          fs.renameSync(path.join(extractedDir, file), path.join(tempDir, file));
        });
        fs.rmdirSync(extractedDir);
      }
    }
    
    const downloadedSkillDir = path.join(tempDir, 'roblox-best-practices');
    if (!fs.existsSync(downloadedSkillDir)) {
      throw new Error('Downloaded folder structure invalid.');
    }
    
    return { tempDir, skillDir: downloadedSkillDir };
  } catch (err) {
    console.error(`\x1b[31m[ERROR] Failed to download version ${tag}: ${err.message}\x1b[0m`);
    process.exit(1);
  }
}

function cleanupTempDir(tempDir) {
  if (tempDir && fs.existsSync(tempDir)) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

const additionalAgents = [
  { name: 'AiderDesk', path: '.aider-desk/skills' },
  { name: 'AstrBot', path: 'data/skills' },
  { name: 'Autohand Code CLI', path: '.autohand/skills' },
  { name: 'Augment', path: '.augment/skills' },
  { name: 'IBM Bob', path: '.bob/skills' },
  { name: 'Claude Code', path: '.claude/skills' },
  { name: 'OpenClaw', path: 'skills' },
  { name: 'CodeArts Agent', path: '.codeartsdoer/skills' },
  { name: 'CodeBuddy', path: '.codebuddy/skills' },
  { name: 'Codemaker', path: '.codemaker/skills' },
  { name: 'Code Studio', path: '.codestudio/skills' },
  { name: 'Command Code', path: '.commandcode/skills' },
  { name: 'Continue', path: '.continue/skills' },
  { name: 'Cortex Code', path: '.cortex/skills' },
  { name: 'Crush', path: '.crush/skills' },
  { name: 'Cursor', path: '.cursor/skills' },
  { name: 'DeepAgents', path: '.deepagents/skills' },
  { name: 'Devin for Terminal', path: '.devin/skills' },
  { name: 'Dexto', path: '.dexto/skills' },
  { name: 'Droid', path: '.factory/skills' },
  { name: 'Eve', path: '.eve/skills' },
  { name: 'Firebender', path: '.firebender/skills' },
  { name: 'ForgeCode', path: '.forge/skills' },
  { name: 'Gemini CLI', path: '.gemini/skills' },
  { name: 'GitHub Copilot', path: '.github/skills' },
  { name: 'Goose', path: '.goose/skills' },
  { name: 'Hermes Agent', path: '.hermes/skills' },
  { name: 'inference.sh', path: '.inferencesh/skills' },
  { name: 'Jazz', path: '.jazz/skills' },
  { name: 'Junie', path: '.junie/skills' },
  { name: 'iFlow CLI', path: '.iflow/skills' },
  { name: 'Kilo Code', path: '.kilocode/skills' },
  { name: 'Kiro CLI', path: '.kiro/skills' },
  { name: 'Kode', path: '.kode/skills' },
  { name: 'Lingma', path: '.lingma/skills' },
  { name: 'Loaf', path: '.loaf/skills' },
  { name: 'MCPJam', path: '.mcpjam/skills' },
  { name: 'Mistral Vibe', path: '.vibe/skills' },
  { name: 'Moxby', path: '.moxby/skills' },
  { name: 'Mux', path: '.mux/skills' },
  { name: 'OpenHands', path: '.openhands/skills' },
  { name: 'Ona', path: '.ona/skills' },
  { name: 'Pi', path: '.pi/skills' },
  { name: 'Qoder', path: '.qoder/skills' },
  { name: 'Qoder CN', path: '.qoder-cn/skills' },
  { name: 'Qwen Code', path: '.qwen/skills' },
  { name: 'Replit Agent', path: '.replit/skills' },
  { name: 'Reasonix', path: '.reasonix/skills' },
  { name: 'Rovodev', path: '.rovodev/skills' },
  { name: 'Roo Code', path: '.roo/skills' },
  { name: 'Tabnine CLI', path: '.tabnine/skills' },
  { name: 'Terramind', path: '.terramind/skills' },
  { name: 'TinyCloud', path: '.tinycloud/skills' },
  { name: 'Trae AI', path: '.trae/skills' },
  { name: 'Trae CN', path: '.trae-cn/skills' },
  { name: 'Windsurf', path: '.windsurf/skills' },
  { name: 'Zencoder', path: '.zencoder/skills' },
  { name: 'Zenflow', path: '.zenflow/skills' },
  { name: 'Neovate', path: '.neovate/skills' },
  { name: 'Pochi', path: '.pochi/skills' },
  { name: 'Promptscript', path: '.promptscript/skills' },
  { name: 'Adal', path: '.adal/skills' }
];

// Execute installation for a given target object
function executeInstall(agent, skillDir) {
  const dest = path.join(cwd, agent.path, 'roblox-best-practices');
  const parentDir = path.dirname(dest);
  
  if (fs.existsSync(parentDir)) {
    console.log(`\n--- Installing \x1b[36m${agent.name}\x1b[0m ---`);
    copyFolderRecursiveSync(skillDir, dest);
  } else {
    console.log(`\x1b[33m[SKIPPED]\x1b[0m ${agent.name} (parent directory ${path.relative(cwd, parentDir) || parentDir} not found)`);
  }
}

// Argument parsing for automation/non-interactive
const args = process.argv.slice(2);

let chosenTag = 'latest';
const tagArgIndex = args.findIndex(arg => arg === '--tag' || arg === '-t');
if (tagArgIndex !== -1 && args[tagArgIndex + 1]) {
  chosenTag = args[tagArgIndex + 1];
}

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Roblox Best Practices Skill Installer CLI

Usage:
  npx github:andrian-syh/roblox-best-practices-skill [options]

Options:
  -a, --all                   Install for all supported additional agents
  -t, --tag <tag_name>        Target a specific version tag from GitHub (e.g. v1.0.0, v1.1.7)
  -h, --help                  Show this help message
  `);
  process.exit(0);
}

if (args.includes('--all') || args.includes('-a')) {
  console.log(`Installing version '${chosenTag}' to Universal and all selected additional agents...`);
  
  let activeSkillDir = localSkillDir;
  let tempCleanDir = null;

  if (chosenTag !== 'latest') {
    const downloadResult = downloadVersion(chosenTag);
    activeSkillDir = downloadResult.skillDir;
    tempCleanDir = downloadResult.tempDir;
  }

  // Universal
  console.log(`\n--- Installing \x1b[36mUniversal (.agents/skills)\x1b[0m ---`);
  copyFolderRecursiveSync(activeSkillDir, path.join(cwd, '.agents/skills/roblox-best-practices'));
  
  // All additional
  additionalAgents.forEach(agent => {
    executeInstall(agent, activeSkillDir);
  });

  cleanupTempDir(tempCleanDir);
  console.log('\n\x1b[32m[SUCCESS] Installation complete!\x1b[0m');
  process.exit(0);
}

// Interactive prompt
(async () => {
  console.log('\x1b[36m========================================================\x1b[0m');
  console.log('\x1b[36m       Roblox Best Practices Skill Installer CLI        \x1b[0m');
  console.log('\x1b[36m========================================================\x1b[0m\n');

  // Step 1: Select Version
  console.log('Fetching available tags from GitHub...');
  const tags = await fetchGithubTags();
  
  const versionChoices = [
    { title: 'Latest (Local bundled v1.1.7)', value: 'latest', description: 'Installs the latest version instantly' }
  ];

  if (tags.length > 0) {
    tags.forEach(tag => {
      versionChoices.push({
        title: `${tag} (Download from GitHub)`,
        value: tag,
        description: `Downloads and installs version ${tag}`
      });
    });
  } else {
    // Fallback static choices if offline/rate-limited
    versionChoices.push(
      { title: 'v1.1.7 (Download from GitHub)', value: 'v1.1.7', description: 'Downloads and installs v1.1.7' },
      { title: 'v1.0.0 (Download from GitHub)', value: 'v1.0.0', description: 'Downloads and installs v1.0.0' }
    );
  }

  const versionResponse = await prompts({
    type: 'select',
    name: 'version',
    message: 'Select the skill version to install:',
    choices: versionChoices
  });

  if (!versionResponse.version) {
    console.log('\n\x1b[31m[CANCELLED] Installation cancelled.\x1b[0m');
    process.exit(0);
  }

  const selectedTag = versionResponse.version;

  // Step 2: Select Targets
  console.log(`\n\x1b[32m•\x1b[0m ${additionalAgents.length + 9} agents`);
  console.log('\x1b[32m•\x1b[0m Which agents do you want to install to?\n');
  console.log('  \x1b[90m— Universal (.agents/skills) — always included —————\x1b[0m');
  console.log('    \x1b[32m•\x1b[0m Amp');
  console.log('    \x1b[32m•\x1b[0m Antigravity');
  console.log('    \x1b[32m•\x1b[0m Antigravity CLI');
  console.log('    \x1b[32m•\x1b[0m Cline');
  console.log('    \x1b[32m•\x1b[0m Codex');
  console.log('    \x1b[32m•\x1b[0m Kimi Code CLI');
  console.log('    \x1b[32m•\x1b[0m OpenCode');
  console.log('    \x1b[32m•\x1b[0m Warp');
  console.log('    \x1b[32m•\x1b[0m Zed');
  console.log('    \x1b[90m...and 4 more\x1b[0m\n');

  const targetChoices = additionalAgents.map(agent => {
    const parentPath = path.dirname(path.join(cwd, agent.path));
    const exists = fs.existsSync(parentPath);
    return {
      title: `${agent.name} (${agent.path})`,
      value: agent,
      selected: exists
    };
  });

  const response = await prompts({
    type: 'autocompleteMultiselect',
    name: 'selected',
    message: '— Additional agents —',
    choices: targetChoices,
    hint: '- Type to search, Space to select, Enter to confirm',
    instructions: false
  });

  if (response.selected === undefined) {
    console.log('\n\x1b[31m[CANCELLED] Installation cancelled.\x1b[0m');
    process.exit(0);
  }

  const selectedAgents = response.selected || [];

  // Download older version if required
  let activeSkillDir = localSkillDir;
  let tempCleanDir = null;

  if (selectedTag !== 'latest') {
    const downloadResult = downloadVersion(selectedTag);
    activeSkillDir = downloadResult.skillDir;
    tempCleanDir = downloadResult.tempDir;
  }

  console.log(`\n\x1b[32mInstalling skill...\x1b[0m`);
  
  // 1. Always install to Universal
  console.log(`\n--- Installing \x1b[36mUniversal (.agents/skills)\x1b[0m ---`);
  copyFolderRecursiveSync(activeSkillDir, path.join(cwd, '.agents/skills/roblox-best-practices'));

  // 2. Install to selected additional agents (only if parent dir exists)
  selectedAgents.forEach(agent => {
    executeInstall(agent, activeSkillDir);
  });

  cleanupTempDir(tempCleanDir);
  console.log('\n\x1b[32m[SUCCESS] Installation complete!\x1b[0m');
})();
