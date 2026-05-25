#!/usr/bin/env node

/**
 * Feature Hook Pattern Validation Script
 *
 * Validates that all features correctly follow the mock and hook pattern.
 * All checks are generic — derived from featureName, no hardcoded names.
 *
 * Checks:
 * 1. No hooks/ subfolder — files must be flat in feature directory
 * 2. Hook contract (useFeatureName.d.ts):
 *    - Exports UseFeatureNameReturn interface
 *    - Exports stub function useFeatureName
 * 3. Mock hook (useFeatureName.mock.ts):
 *    - References UseFeatureNameReturn (implements the contract)
 *    - Uses React hooks (useState/useCallback/useRef)
 *    - Does NOT import from @storybook/*
 * 4. Static mocks (FeatureName.mocks.ts):
 *    - No React hooks (pure data file)
 *    - No @storybook/* imports
 *    - Uses named exports only (no default export)
 * 5. Stories (FeatureName.stories.tsx):
 *    - WithStateManagement uses render: (not args:)
 *    - WithStateManagement imports from the .mock.ts file
 *    - Imports static data from .mocks.ts
 * 6. Behavior stories (FeatureName.behaviors.stories.tsx):
 *    - Has play: functions
 *    - Uses fn() for callbacks
 *    - Does NOT import from the .mock.ts file
 * 7. Feature component implementation:
 *    - The main FeatureName.tsx file must NOT import from other features
 */

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

const FEATURES_DIR = path.join(__dirname, '../../components/features');

function getFeatureDirectories() {
  if (!fs.existsSync(FEATURES_DIR)) return [];
  return fs.readdirSync(FEATURES_DIR)
    .map(item => path.join(FEATURES_DIR, item))
    .filter(p => fs.statSync(p).isDirectory());
}

function getFeatureName(featureDir) {
  return path.basename(featureDir);
}

function readFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

function hasComponentFile(featureDir) {
  return fs.readdirSync(featureDir).some(
    f => f.endsWith('.tsx') && !f.endsWith('.stories.tsx') && !f.endsWith('.test.tsx')
  );
}

function getFeatureComponentFile(featureDir, featureName) {
  const componentFilePath = path.join(featureDir, `${featureName}.tsx`);
  return fs.existsSync(componentFilePath) ? componentFilePath : null;
}

/** Derive the mock hook filename from featureName */
function mockHookFile(featureName) {
  return `use${featureName}.mock.ts`;
}

/** Derive the hook contract filename from featureName */
function hookContractFile(featureName) {
  return `use${featureName}.d.ts`;
}

/** Derive the mocks data filename from featureName */
function mocksDataFile(featureName) {
  return `${featureName}.mocks.ts`;
}

/** Check if a file's import statements reference a given filename (without extension) */
function importsFile(content, filename) {
  // Match: from './filename' or from "./filename" (with or without extension)
  const base = filename.replace(/\.(ts|tsx|js)$/, '');
  return new RegExp(`from\\s+['"]\\./(?:[^'"]*/)?(${base.replace('.', '\\.')})['"']`).test(content)
    || content.includes(`'./${base}'`)
    || content.includes(`"./${base}"`)
    || content.includes(`'./${filename}'`)
    || content.includes(`"./${filename}"`);
}

function extractImports(content) {
  const imports = [];
  const patterns = [
    /import\s+(?:type\s+)?[\s\S]*?from\s+["']([^"']+)["']/g,
    /import\s+["']([^"']+)["']/g,
    /export\s+(?:type\s+)?(?:\*|\{[\s\S]*?\})\s+from\s+["']([^"']+)["']/g,
  ];

  patterns.forEach(pattern => {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(content)) !== null) {
      const lineNumber = content.slice(0, match.index).split('\n').length;
      imports.push({ importPath: match[1], lineNumber });
    }
  });

  return imports;
}

function normalizeFeatureImport(importPath, currentFile) {
  if (importPath.startsWith('.')) {
    const resolved = path.resolve(path.dirname(currentFile), importPath);
    const relativeToFeatures = path.relative(FEATURES_DIR, resolved);
    if (!relativeToFeatures.startsWith('..') && !path.isAbsolute(relativeToFeatures)) {
      return relativeToFeatures.replace(/\\/g, '/');
    }
    return null;
  }

  if (importPath.startsWith('@/components/features/')) {
    return importPath.replace('@/components/features/', '');
  }

  if (importPath === '@/components/features' || importPath.endsWith('/components/features')) {
    return '__FEATURES_BARREL__';
  }

  return null;
}

/**
 * Check 1: No hooks/ subfolder
 */
function checkNoHooksSubfolder(featureDir) {
  const hooksDir = path.join(featureDir, 'hooks');
  if (fs.existsSync(hooksDir) && fs.statSync(hooksDir).isDirectory()) {
    return `Has a hooks/ subfolder — all hook files must be flat in the feature directory`;
  }
  return null;
}

/**
 * Check 2: Hook contract
 */
function checkHookContract(featureDir, featureName) {
  const content = readFile(path.join(featureDir, hookContractFile(featureName)));
  if (!content) return null; // file existence checked by validate-feature-stories.js

  const issues = [];
  const expectedInterface = `Use${featureName}Return`;

  if (!content.includes(`interface ${expectedInterface}`)) {
    issues.push(`${hookContractFile(featureName)}: Missing "interface ${expectedInterface}"`);
  }

  if (!content.includes(`export function use${featureName}`)) {
    issues.push(`${hookContractFile(featureName)}: Missing stub "export function use${featureName}(...)"`);
  }

  return issues;
}

/**
 * Check 3: Mock hook
 */
function checkMockHook(featureDir, featureName) {
  const content = readFile(path.join(featureDir, mockHookFile(featureName)));
  if (!content) return null;

  const issues = [];

  if (!content.includes(`Use${featureName}Return`)) {
    issues.push(`${mockHookFile(featureName)}: Does not reference "Use${featureName}Return" — must implement the hook contract`);
  }

  // Enforce function name convention: use${featureName}Mock
  const expectedFnName = `use${featureName}Mock`;
  if (!content.includes(`export function ${expectedFnName}`) && !content.includes(`export const ${expectedFnName}`)) {
    issues.push(`${mockHookFile(featureName)}: Missing "export function ${expectedFnName}" — mock hook must be named ${expectedFnName}`);
  }

  if (!content.includes('useState') && !content.includes('useCallback') && !content.includes('useRef')) {
    issues.push(`${mockHookFile(featureName)}: No React hooks (useState/useCallback/useRef) — mock must simulate real state`);
  }

  if (content.includes('@storybook/')) {
    issues.push(`${mockHookFile(featureName)}: Imports from @storybook/* — mock hook must be a pure React hook`);
  }

  return issues;
}

/**
 * Check 4: Static mocks data file
 */
function checkMocksFile(featureDir, featureName) {
  const content = readFile(path.join(featureDir, mocksDataFile(featureName)));
  if (!content) return null;

  const issues = [];

  if (content.includes('useState') || content.includes('useCallback') || content.includes('useEffect')) {
    issues.push(`${mocksDataFile(featureName)}: Contains React hooks — must be pure static data`);
  }

  if (content.includes('@storybook/')) {
    issues.push(`${mocksDataFile(featureName)}: Imports from @storybook/* — must be pure TypeScript data`);
  }

  if (!content.includes('export const') && !content.includes('export type') && !content.includes('export interface')) {
    issues.push(`${mocksDataFile(featureName)}: No named exports — use "export const mockX = [...]"`);
  }

  if (/^export default/m.test(content)) {
    issues.push(`${mocksDataFile(featureName)}: Uses default export — use named exports only`);
  }

  return issues;
}

/**
 * Check 5: Stories file
 */
function checkStoriesFile(featureDir, featureName) {
  const storiesFile = fs.readdirSync(featureDir).find(
    f => f.endsWith('.stories.tsx') && !f.endsWith('.behaviors.stories.tsx')
  );
  if (!storiesFile) return null;

  const content = readFile(path.join(featureDir, storiesFile));
  if (!content) return null;

  const issues = [];

  // Extract WithStateManagement story block
  const withStateMatch = content.match(/export\s+const\s+WithStateManagement[\s\S]*?(?=\nexport\s+const|\s*$)/);
  if (withStateMatch) {
    const storyBlock = withStateMatch[0];

    if (!storyBlock.includes('render:')) {
      issues.push(`${storiesFile}: WithStateManagement must use render: () => {...}, not args:`);
    }

    // Check it imports from the .mock.ts file (generic — by filename, not function name)
    if (!importsFile(content, mockHookFile(featureName))) {
      issues.push(`${storiesFile}: WithStateManagement must import from ${mockHookFile(featureName)}`);
    }

    // Check the mock hook function name follows the convention: use${featureName}Mock
    const expectedMockFn = `use${featureName}Mock`;
    if (!content.includes(expectedMockFn)) {
      issues.push(`${storiesFile}: WithStateManagement must call "${expectedMockFn}()" — mock hook function must be named use${featureName}Mock`);
    }
  }

  // Must import from .mocks.ts (generic — by filename)
  if (!importsFile(content, mocksDataFile(featureName))) {
    issues.push(`${storiesFile}: Must import static data from ${mocksDataFile(featureName)}`);
  }

  return issues;
}

/**
 * Check 6: Behavior stories
 */
function checkBehaviorStories(featureDir, featureName) {
  const behaviorsFile = `${featureName}.behaviors.stories.tsx`;
  const content = readFile(path.join(featureDir, behaviorsFile));
  if (!content) return null;

  const issues = [];

  if (!content.includes('play:')) {
    issues.push(`${behaviorsFile}: No play: functions — behavior stories must test interactions`);
  }

  if (!content.includes('fn()')) {
    issues.push(`${behaviorsFile}: No fn() — use fn() from @storybook/test for callback props`);
  }

  // Must NOT import from the mock hook file (generic — by filename)
  if (importsFile(content, mockHookFile(featureName))) {
    issues.push(`${behaviorsFile}: Imports ${mockHookFile(featureName)} — behaviors must use args: + fn(), not render: with mock hook`);
  }

  return issues;
}

function checkFeatureImports(featureDir, featureName) {
  const issues = [];
  const filePath = getFeatureComponentFile(featureDir, featureName);

  if (!filePath) {
    return issues;
  }

  const content = readFile(filePath);
  if (!content) {
    return issues;
  }

  for (const { importPath, lineNumber } of extractImports(content)) {
    const normalizedImport = normalizeFeatureImport(importPath, filePath);
    if (!normalizedImport) {
      continue;
    }

    if (normalizedImport === '__FEATURES_BARREL__') {
      issues.push(`${path.basename(filePath)}:${lineNumber}: Imports from @/components/features — feature components must not import from the features barrel`);
      continue;
    }

    const targetFeature = normalizedImport.split('/')[0];
    if (targetFeature && targetFeature !== featureName) {
      issues.push(`${path.basename(filePath)}:${lineNumber}: Imports from feature "${targetFeature}" via "${importPath}" — feature components must only compose blocks and composites`);
    }
  }

  return issues;
}

function validate() {
  console.log(`${colors.blue}${colors.bold}Validating feature hook and mock patterns...${colors.reset}\n`);

  const featureDirs = getFeatureDirectories();

  if (featureDirs.length === 0) {
    console.log(`${colors.yellow}No features found to validate${colors.reset}\n`);
    return true;
  }

  const violations = [];

  for (const featureDir of featureDirs) {
    const featureName = getFeatureName(featureDir);
    if (!hasComponentFile(featureDir)) continue;

    const allIssues = [];

    const noHooksIssue = checkNoHooksSubfolder(featureDir);
    if (noHooksIssue) allIssues.push(noHooksIssue);

    for (const issues of [
      checkHookContract(featureDir, featureName),
      checkMockHook(featureDir, featureName),
      checkMocksFile(featureDir, featureName),
      checkStoriesFile(featureDir, featureName),
      checkBehaviorStories(featureDir, featureName),
      checkFeatureImports(featureDir, featureName),
    ]) {
      if (issues) allIssues.push(...issues);
    }

    if (allIssues.length > 0) {
      violations.push({
        feature: featureName,
        path: path.relative(process.cwd(), featureDir),
        issues: allIssues,
      });
    }
  }

  if (violations.length === 0) {
    console.log(`${colors.green}✅ All features follow the hook and mock pattern${colors.reset}\n`);
    return true;
  }

  console.log(`${colors.red}${colors.bold}❌ Feature hook pattern validation failed${colors.reset}\n`);

  for (const v of violations) {
    console.log(`  ${colors.bold}${v.feature}${colors.reset} (${v.path})`);
    for (const issue of v.issues) {
      console.log(`    ${colors.red}✗${colors.reset} ${issue}`);
    }
    console.log();
  }

  console.log(`${colors.yellow}Reference: .kiro/skills/storybook-guidelines/references/feature-mock-and-hook-pattern.md${colors.reset}\n`);

  return false;
}

const success = validate();
process.exit(success ? 0 : 1);
