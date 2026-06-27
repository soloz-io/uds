#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

const COMPONENTS_DIR = path.join(__dirname, '../../components');

const KNOWN_LAYERS = ['primitives', 'ai-elements', 'composites', 'blocks', 'features'];

function getStoryFiles(dir) {
  const storyFiles = [];

  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) {
      return;
    }

    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        traverse(itemPath);
      } else if (item.endsWith('.stories.tsx')) {
        storyFiles.push(itemPath);
      }
    }
  }

  traverse(dir);
  return storyFiles;
}

function getStoryBlocks(content) {
  return [...content.matchAll(/export\s+const\s+(\w+)[\s\S]*?(?=\nexport\s+const|\s*$)/g)].map(match => ({
    storyName: match[1],
    block: match[0],
  }));
}

function validate() {
  console.log(`${colors.blue}${colors.bold}📖 Validating story composition...${colors.reset}\n`);

  const allViolations = [];

  for (const layer of KNOWN_LAYERS) {
    const layerDir = path.join(COMPONENTS_DIR, layer);
    const storyFiles = getStoryFiles(layerDir);

    for (const storyFile of storyFiles) {
      const content = fs.readFileSync(storyFile, 'utf-8');
      const relativePath = path.relative(process.cwd(), storyFile);
      const isBehaviorStory = storyFile.endsWith('.behaviors.stories.tsx');

      if (!isBehaviorStory && layer === 'features') {
        const storyBlocks = getStoryBlocks(content);

        for (const { storyName, block } of storyBlocks) {
          if (!block.includes('render:')) {
            continue;
          }

          if (/<div[\s>]/.test(block)) {
            allViolations.push({
              type: 'raw-div-wrapper',
              storyName,
              file: relativePath,
            });
          }

          if (/\bif\s*\(/.test(block)) {
            allViolations.push({
              type: 'inline-if',
              storyName,
              file: relativePath,
            });
          }
        }
      }
    }
  }

  if (allViolations.length === 0) {
    console.log(`${colors.green}✅ All stories follow proper composition patterns${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}${colors.bold}❌ Story composition validation failed${colors.reset}\n`);
    console.log(`${colors.red}Found ${allViolations.length} violation(s):${colors.reset}\n`);

    for (const violation of allViolations) {
      if (violation.type === 'raw-div-wrapper') {
        console.log(`  ${colors.red}✗${colors.reset} ${violation.file} — ${violation.storyName}: Uses raw <div> in render story`);
      }
      if (violation.type === 'inline-if') {
        console.log(`  ${colors.red}✗${colors.reset} ${violation.file} — ${violation.storyName}: Uses inline if-condition in render story`);
      }
      console.log();
    }

    return false;
  }
}

const success = validate();
process.exit(success ? 0 : 1);
