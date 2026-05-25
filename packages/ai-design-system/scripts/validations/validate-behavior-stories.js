#!/usr/bin/env node

/**
 * Behavior Stories Validation Script
 *
 * Enforces that all feature components have behavior testing stories.
 * Behavior stories test user interactions and state changes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

const FEATURES_DIR = path.join(__dirname, '../../components/features');

/**
 * Get all feature component directories
 */
function getFeatureDirectories() {
  if (!fs.existsSync(FEATURES_DIR)) {
    return [];
  }

  return fs.readdirSync(FEATURES_DIR)
    .map(item => path.join(FEATURES_DIR, item))
    .filter(itemPath => {
      const stat = fs.statSync(itemPath);
      return stat.isDirectory();
    });
}

/**
 * Check if a feature has a component file
 */
function hasComponentFile(featureDir) {
  const files = fs.readdirSync(featureDir);
  return files.some(file => {
    return file.endsWith('.tsx') && 
           !file.endsWith('.stories.tsx') && 
           !file.endsWith('.test.tsx');
  });
}

/**
 * Check if a feature has behavior stories file
 */
function hasBehaviorStories(featureDir) {
  const files = fs.readdirSync(featureDir);
  return files.some(file => file.endsWith('.behaviors.stories.tsx'));
}

/**
 * Get feature name from directory
 */
function getFeatureName(featureDir) {
  return path.basename(featureDir);
}

/**
 * Validate all features
 */
function validate() {
  console.log(`${colors.blue}${colors.bold}Validating behavior stories...${colors.reset}\n`);

  const featureDirs = getFeatureDirectories();

  if (featureDirs.length === 0) {
    console.log(`${colors.yellow}No features found to validate${colors.reset}\n`);
    return true;
  }

  const violations = [];

  for (const featureDir of featureDirs) {
    const featureName = getFeatureName(featureDir);

    // Skip if no component file exists
    if (!hasComponentFile(featureDir)) {
      continue;
    }

    // Check for behavior stories file
    if (!hasBehaviorStories(featureDir)) {
      violations.push({
        feature: featureName,
        path: path.relative(process.cwd(), featureDir),
        expectedFile: `${featureName}.behaviors.stories.tsx`,
      });
    }
  }

  // Report results
  if (violations.length === 0) {
    console.log(`${colors.green}✅ All features have behavior stories${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}${colors.bold}❌ Behavior stories validation failed${colors.reset}\n`);
    console.log(`${colors.red}Missing behavior stories for features:${colors.reset}\n`);

    for (const violation of violations) {
      console.log(`  ${colors.bold}${violation.feature}${colors.reset}`);
      console.log(`    Path:     ${violation.path}`);
      console.log(`    Expected: ${violation.expectedFile}`);
      console.log(`    ${colors.red}✗${colors.reset} File not found`);
      console.log();
    }

    console.log(`${colors.yellow}Required for all features:${colors.reset}`);
    console.log(`  Create ${colors.bold}{FeatureName}.behaviors.stories.tsx${colors.reset} in the feature directory`);
    console.log(`  File should contain interaction tests with play functions\n`);

    console.log(`${colors.yellow}Example: packages/ai-design-system/components/features/AIDocEditor/AIDocEditor.behaviors.stories.tsx${colors.reset}\n`);

    return false;
  }
}

// Run validation
const success = validate();
process.exit(success ? 0 : 1);
