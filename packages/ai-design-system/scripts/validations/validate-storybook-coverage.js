#!/usr/bin/env node

/**
 * Storybook Pattern Validation Script
 *
 * Enforces the Storybook-First Governance rule:
 * Every component in primitives/ and blocks/ MUST have corresponding .stories.tsx files
 *
 * This script runs as a prebuild hook to ensure design system integrity.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

// Configuration
const COMPONENTS_DIR = path.join(__dirname, '../../components');
const LAYERS_TO_VALIDATE = ['primitives', 'composites'];

/**
 * Check if validation should be skipped
 */
function shouldSkipValidation() {
  return process.env.SKIP_STORYBOOK_VALIDATION === '1';
}

/**
 * Get all component directories in a layer
 */
function getComponentDirectories(layerPath) {
  if (!fs.existsSync(layerPath)) {
    return [];
  }

  return fs.readdirSync(layerPath)
    .map(item => path.join(layerPath, item))
    .filter(itemPath => {
      const stat = fs.statSync(itemPath);
      return stat.isDirectory();
    });
}

/**
 * Check if a component directory has a .tsx file (not .stories.tsx)
 */
function hasComponentFile(componentDir) {
  const files = fs.readdirSync(componentDir);
  return files.some(file => {
    return file.endsWith('.tsx') && !file.endsWith('.stories.tsx') && !file.endsWith('.test.tsx');
  });
}

/**
 * Check if a component directory has a .stories.tsx file
 */
function hasStoriesFile(componentDir) {
  const files = fs.readdirSync(componentDir);
  return files.some(file => file.endsWith('.stories.tsx'));
}

/**
 * Get the component name from directory path
 */
function getComponentName(componentDir) {
  return path.basename(componentDir);
}

/**
 * Validate a single layer
 */
function validateLayer(layerName) {
  const layerPath = path.join(COMPONENTS_DIR, layerName);
  const componentDirs = getComponentDirectories(layerPath);

  const missing = [];

  for (const componentDir of componentDirs) {
    const componentName = getComponentName(componentDir);

    // Skip if no component file exists (might be just utilities)
    if (!hasComponentFile(componentDir)) {
      continue;
    }

    // Check for stories file
    if (!hasStoriesFile(componentDir)) {
      const relativePath = path.relative(process.cwd(), componentDir);
      missing.push({
        component: componentName,
        layer: layerName,
        path: relativePath,
        expectedStory: `${componentName}.stories.tsx`,
      });
    }
  }

  return missing;
}

/**
 * Main validation function
 */
function validate() {
  console.log(`${colors.blue}${colors.bold}Validating Storybook coverage...${colors.reset}\n`);

  // Check if validation should be skipped
  if (shouldSkipValidation()) {
    console.log(`${colors.yellow}⚠️  Validation skipped (SKIP_STORYBOOK_VALIDATION=1)${colors.reset}`);
    console.log(`${colors.yellow}   This should only be used in emergencies!${colors.reset}\n`);
    return true;
  }

  let allMissing = [];

  // Validate each layer
  for (const layer of LAYERS_TO_VALIDATE) {
    const missing = validateLayer(layer);
    allMissing = allMissing.concat(missing);
  }

  // Report results
  if (allMissing.length === 0) {
    console.log(`${colors.green}✅ All components have Storybook coverage${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}${colors.bold}❌ Build failed: Missing Storybook coverage${colors.reset}\n`);
    console.log(`${colors.red}Missing stories for components:${colors.reset}\n`);

    for (const item of allMissing) {
      console.log(`  ${colors.bold}${item.layer}/${item.component}${colors.reset}`);
      console.log(`    Component: ${item.path}/${item.component}.tsx`);
      console.log(`    Expected:  ${item.path}/${item.expectedStory}`);
      console.log(`    Status:    ${colors.red}NOT FOUND${colors.reset}\n`);
    }

    console.log(`${colors.yellow}Build blocked. Create the required stories to continue.${colors.reset}`);
    console.log(`${colors.yellow}See: .claude/skills/design-system/SKILL.md (Step 4.5)${colors.reset}\n`);

    console.log(`${colors.blue}Bypass (emergency only): SKIP_STORYBOOK_VALIDATION=1 pnpm build${colors.reset}\n`);

    return false;
  }
}

// Run validation
const success = validate();
process.exit(success ? 0 : 1);
