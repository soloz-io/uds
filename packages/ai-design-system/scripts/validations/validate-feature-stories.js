#!/usr/bin/env node

/**
 * Feature Story Validation Script
 *
 * Enforces that all feature components have:
 * 1. A .stories.tsx file
 * 2. A "WithStateManagement" story
 * 3. A corresponding hook contract (.d.ts file)
 * 4. A mock hook implementation (.mock.ts file)
 *
 * This ensures features follow the extensible component pattern.
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
    return file.endsWith('.tsx') && !file.endsWith('.stories.tsx') && !file.endsWith('.test.tsx');
  });
}

/**
 * Check if a feature has a stories file
 */
function hasStoriesFile(featureDir) {
  const files = fs.readdirSync(featureDir);
  return files.some(file => file.endsWith('.stories.tsx') && !file.endsWith('.behaviors.stories.tsx'));
}

/**
 * Check if stories file has WithStateManagement story
 */
function hasWithStateManagementStory(featureDir) {
  const files = fs.readdirSync(featureDir);
  // Exclude behavior stories files
  const storiesFile = files.find(file => file.endsWith('.stories.tsx') && !file.endsWith('.behaviors.stories.tsx'));

  if (!storiesFile) {
    return false;
  }

  const storiesPath = path.join(featureDir, storiesFile);
  const content = fs.readFileSync(storiesPath, 'utf-8');

  // Check for WithStateManagement export
  return /export\s+const\s+WithStateManagement/m.test(content);
}

/**
 * Check if feature has hook contract file
 * Hook contracts should be in the feature directory itself
 */
function hasHookContract(featureDir, featureName) {
  const hookContractPath = path.join(featureDir, `use${featureName}.d.ts`);
  return fs.existsSync(hookContractPath);
}

/**
 * Check if feature has mock hook implementation
 */
function hasMockHook(featureDir, featureName) {
  const hookMockPath = path.join(featureDir, `use${featureName}.mock.ts`);
  return fs.existsSync(hookMockPath);
}

/**
 * Check if feature has behavior stories file
 */
function hasBehaviorStories(featureDir, featureName) {
  const behaviorStoriesPath = path.join(featureDir, `${featureName}.behaviors.stories.tsx`);
  return fs.existsSync(behaviorStoriesPath);
}

/**
 * Check if feature has mocks file
 */
function hasMocksFile(featureDir, featureName) {
  const mocksPath = path.join(featureDir, `${featureName}.mocks.ts`);
  return fs.existsSync(mocksPath);
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
  console.log(`${colors.blue}${colors.bold}Validating feature stories...${colors.reset}\n`);

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

    const issues = [];

    // Check for stories file
    if (!hasStoriesFile(featureDir)) {
      issues.push('Missing .stories.tsx file');
    } else {
      // Check for WithStateManagement story
      if (!hasWithStateManagementStory(featureDir)) {
        issues.push('Missing "WithStateManagement" story');
      }
    }

    // Check for behavior stories
    if (!hasBehaviorStories(featureDir, featureName)) {
      issues.push(`Missing behavior stories (${featureName}.behaviors.stories.tsx)`);
    }

    // Check for mocks file
    if (!hasMocksFile(featureDir, featureName)) {
      issues.push(`Missing mocks file (${featureName}.mocks.ts)`);
    }

    // Check for mock hook
    if (!hasMockHook(featureDir, featureName)) {
      issues.push(`Missing mock hook (use${featureName}.mock.ts)`);
    }

    // Check for hook contract
    if (!hasHookContract(featureDir, featureName)) {
      issues.push(`Missing hook contract (use${featureName}.d.ts)`);
    }

    // Check for index.ts
    if (!fs.existsSync(path.join(featureDir, 'index.ts'))) {
      issues.push(`Missing index.ts`);
    }

    // Check for README.md
    if (!fs.existsSync(path.join(featureDir, 'README.md'))) {
      issues.push(`Missing README.md`);
    }

    if (issues.length > 0) {
      violations.push({
        feature: featureName,
        path: path.relative(process.cwd(), featureDir),
        issues,
      });
    }
  }

  // Report results
  if (violations.length === 0) {
    console.log(`${colors.green}✅ All features have required stories and hooks${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}${colors.bold}❌ Feature story validation failed${colors.reset}\n`);
    console.log(`${colors.red}Missing required files for features:${colors.reset}\n`);

    for (const violation of violations) {
      console.log(`  ${colors.bold}${violation.feature}${colors.reset}`);
      console.log(`    Path: ${violation.path}`);
      for (const issue of violation.issues) {
        console.log(`    ${colors.red}✗${colors.reset} ${issue}`);
      }
      console.log();
    }

    console.log(`${colors.yellow}Required for all features (in feature directory):${colors.reset}`);
    console.log(`  1. Component file: ${colors.bold}FeatureName.tsx${colors.reset}`);
    console.log(`  2. Stories file: ${colors.bold}FeatureName.stories.tsx${colors.reset} (with WithStateManagement story)`);
    console.log(`  3. Behavior stories: ${colors.bold}FeatureName.behaviors.stories.tsx${colors.reset}`);
    console.log(`  4. Mock data: ${colors.bold}FeatureName.mocks.ts${colors.reset}`);
    console.log(`  5. Mock hook: ${colors.bold}useFeatureName.mock.ts${colors.reset}`);
    console.log(`  6. Hook contract: ${colors.bold}useFeatureName.d.ts${colors.reset}`);
    console.log(`  7. Index: ${colors.bold}index.ts${colors.reset}`);
    console.log(`  8. Readme: ${colors.bold}README.md${colors.reset}\n`);

    console.log(`${colors.yellow}See: .kiro/skills/storybook-guidelines/references/feature-mock-and-hook-pattern.md${colors.reset}\n`);

    return false;
  }
}

// Run validation
const success = validate();
process.exit(success ? 0 : 1);
