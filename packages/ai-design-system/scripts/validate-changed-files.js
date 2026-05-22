#!/usr/bin/env node
/**
 * Validate only changed component files
 * This runs faster than full validation by checking only staged files
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Get list of staged files
const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

// Include story files so story-only changes still trigger validation
const validationFiles = stagedFiles.filter(file =>
  file.startsWith('components/') && 
  (file.endsWith('.tsx') || file.endsWith('.ts'))
);

// Filter for implementation component files only
const componentFiles = validationFiles.filter(file =>
  !file.includes('.stories.') &&
  !file.includes('.test.') &&
  !file.includes('.mock.')
);

if (validationFiles.length === 0) {
  console.log('✅ No component or story files changed, skipping validation');
  process.exit(0);
}

console.log(`🔍 Validating ${validationFiles.length} changed component/story file(s)...`);
console.log('');

// Determine which validations to run based on changed files
const needsValidation = {
  layerImports: componentFiles.some(f => f.startsWith('components/')),
  tokens: componentFiles.some(f => f.endsWith('.tsx')),
  stories: validationFiles.some(f => 
    f.startsWith('components/primitives/') || 
    f.startsWith('components/blocks/')
  ),
  storyComposition: validationFiles.some(f =>
    f.startsWith('components/blocks/') ||
    f.startsWith('components/features/')
  ),
  features: validationFiles.some(f => f.startsWith('components/features/')),
};

let hasErrors = false;

// Run only necessary validations
if (needsValidation.layerImports) {
  console.log('📋 Checking layer imports...');
  try {
    execSync('node scripts/validations/validate-layer-imports.js', { stdio: 'inherit' });
  } catch {
    hasErrors = true;
  }
}

if (needsValidation.tokens) {
  console.log('🎨 Checking design tokens...');
  try {
    execSync('node scripts/validations/validate-design-tokens.js', { stdio: 'inherit' });
  } catch {
    hasErrors = true;
  }
}

if (needsValidation.stories) {
  console.log('📚 Checking storybook coverage...');
  try {
    execSync('node scripts/validations/validate-storybook-coverage.js', { stdio: 'inherit' });
  } catch {
    hasErrors = true;
  }
}

if (needsValidation.storyComposition) {
  console.log('🧱 Checking story composition...');
  try {
    execSync('node scripts/validations/validate-story-composition.js', { stdio: 'inherit' });
  } catch {
    hasErrors = true;
  }
}

if (needsValidation.features) {
  console.log('🔌 Checking feature patterns...');
  try {
    execSync('node scripts/validations/validate-feature-stories.js', { stdio: 'inherit' });
    execSync('node scripts/validations/validate-feature-hook-pattern.js', { stdio: 'inherit' });
    execSync('node scripts/validations/validate-behavior-stories.js', { stdio: 'inherit' });
  } catch {
    hasErrors = true;
  }
}

if (hasErrors) {
  console.log('');
  console.log('❌ Validation failed for changed files');
  process.exit(1);
}

console.log('');
console.log('✅ All validations passed for changed files');
process.exit(0);
