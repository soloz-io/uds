#!/usr/bin/env node
/**
 * Master validation script for the design system
 * Runs all validation checks and reports results clearly
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Running all design system validations...\n');

const validations = [
  {
    name: 'Layer Import Validation',
    emoji: '📋',
    description: 'Checking that components follow proper layer import rules...',
    script: 'validations/validate-layer-imports.js',
  },
  {
    name: 'Architectural Patterns Validation',
    emoji: '🏗️',
    description: 'Checking for anti-patterns and architectural workarounds...',
    script: 'validations/validate-architectural-patterns.js',
  },
  {
    name: 'Storybook Coverage Validation',
    emoji: '📚',
    description: 'Checking that all primitives and blocks have stories...',
    script: 'validations/validate-storybook-coverage.js',
  },
  {
    name: 'Design Token Validation',
    emoji: '🎨',
    description: 'Checking that components use tokens instead of direct CSS...',
    script: 'validations/validate-design-tokens.js',
  },
  {
    name: 'Story Composition Validation',
    emoji: '📖',
    description: 'Checking that stories only render their own component...',
    script: 'validations/validate-story-composition.js',
  },
  {
    name: 'Feature Story Validation',
    emoji: '🔌',
    description: 'Checking that all features have WithStateManagement stories and hooks...',
    script: 'validations/validate-feature-stories.js',
  },
  {
    name: 'Feature Hook Pattern Validation',
    emoji: '🪝',
    description: 'Checking that features follow the hook contract, mock hook, and mocks file pattern...',
    script: 'validations/validate-feature-hook-pattern.js',
  },
  {
    name: 'Behavior Stories Validation',
    emoji: '🧪',
    description: 'Checking that all features have behavior testing stories...',
    script: 'validations/validate-behavior-stories.js',
  },
  {
    name: 'Import Alias Validation',
    emoji: '📦',
    description: 'Checking that all imports use @/ alias...',
    script: 'validations/validate-import-aliases.js',
  },
  {
    name: 'Icon Usage Validation',
    emoji: '🖼️',
    description: 'Checking that components use the Icon primitive instead of direct lucide-react imports or inline SVGs...',
    script: 'validations/validate-icon-usage.js',
  },
  {
    name: 'ESLint Disable Validation',
    emoji: '🚫',
    description: 'Checking for eslint-disable comments that suppress no-explicit-any...',
    script: 'validations/validate-no-eslint-disable.js',
  },
];

const results = [];

for (const validation of validations) {
  console.log(`${validation.emoji} ${validation.name}...`);
  console.log(`   ${validation.description}`);
  
  try {
    execSync(`node ${path.join(__dirname, validation.script)}`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    results.push({ ...validation, passed: true });
  } catch (error) {
    results.push({ ...validation, passed: false });
  }
  
  console.log('');
}

// Results Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const failed = results.filter(r => !r.passed);

if (failed.length > 0) {
  console.log('❌ Validation failed!\n');
  failed.forEach(f => {
    console.log(`   ✗ ${f.name} failed`);
  });
  console.log('\nPlease fix the issues above before building.');
  process.exit(1);
}

console.log('✅ All validations passed!\n');
results.forEach(r => {
  console.log(`   ✓ ${r.name.replace(' Validation', '')} is correct`);
});
console.log('');

process.exit(0);
