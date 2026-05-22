#!/usr/bin/env node
/**
 * Design Token Validation Script
 * 
 * Enforces that all components use design tokens instead of direct CSS values.
 * 
 * FORBIDDEN:
 * - Direct color values: #hex, rgb(), rgba(), hsl(), hsla()
 * - Direct spacing values: px, rem, em (except in specific contexts)
 * - Direct font sizes, line heights without tokens
 * 
 * REQUIRED:
 * - Use CSS variables: var(--token-*)
 * - Use Tailwind utility classes
 * - Use design tokens from tokens/ directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsPath = path.join(__dirname, '..', 'components');

// Regex patterns for forbidden CSS values
const PATTERNS = {
  hex_color: /["']#[0-9a-fA-F]{3,8}["']/g,
  rgb_color: /rgb\s*\([^)]+\)/g,
  rgba_color: /rgba\s*\([^)]+\)/g,
  hsl_color: /hsl\s*\([^)]+\)/g,
  hsla_color: /hsla\s*\([^)]+\)/g,
  px_value: /["'][0-9]+px["']/g,
  rem_value: /["'][0-9.]+rem["']/g,
  em_value: /["'][0-9.]+em["']/g,
};

// Files to skip
const SKIP_PATTERNS = [
  '.stories.tsx',
  '.test.tsx',
  '.spec.tsx',
  'globals.css',
  '_generated-tokens.css',
  'tailwind.config',
];

const violations = [];

function shouldSkipFile(filePath) {
  const fileName = path.basename(filePath);
  return SKIP_PATTERNS.some(pattern => fileName.includes(pattern));
}

function isInAllowedContext(line, matchStart) {
  // Check if match is in a comment
  const commentBefore = line.substring(0, matchStart);
  if (commentBefore.includes('//')) {
    return true;
  }
  if (commentBefore.includes('/*') && !commentBefore.includes('*/')) {
    return true;
  }

  // Check if line is an import
  if (line.trim().startsWith('import') || line.trim().startsWith('@import')) {
    return true;
  }

  // Check if in URL or data URI
  if (line.includes('url(') || line.includes('data:')) {
    return true;
  }

  return false;
}

function validateFile(filePath) {
  if (shouldSkipFile(filePath)) {
    return;
  }

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`Warning: Could not read ${filePath}: ${error.message}`);
    return;
  }

  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    for (const [patternName, pattern] of Object.entries(PATTERNS)) {
      const matches = [...line.matchAll(pattern)];

      for (const match of matches) {
        // Check if in allowed context
        if (isInAllowedContext(line, match.index)) {
          continue;
        }

        // Special case: allow z-index, opacity, and transform values
        if (['px_value', 'rem_value', 'em_value'].includes(patternName)) {
          const beforeMatch = line.substring(0, match.index).toLowerCase();
          if (['z-index', 'opacity', 'transform', 'transition-duration', 'animation-duration'].some(prop => beforeMatch.includes(prop))) {
            continue;
          }
        }

        const relFile = path.relative(path.join(__dirname, '..'), filePath);
        violations.push({
          file: relFile,
          patternName,
          value: match[0],
          lineNum,
        });
      }
    }
  });
}

async function validateAll() {
  const extensions = ['**/*.tsx', '**/*.ts', '**/*.css'];
  
  for (const ext of extensions) {
    const files = await glob(ext, { cwd: componentsPath, absolute: true });
    files.forEach(validateFile);
  }

  return violations.length === 0;
}

function printViolations() {
  if (violations.length === 0) {
    console.log('✓ All components use design tokens correctly!');
    return;
  }

  console.error(`✗ Found ${violations.length} design token violation(s):\n`);

  // Group violations by file
  const violationsByFile = {};
  violations.forEach(({ file, patternName, value, lineNum }) => {
    if (!violationsByFile[file]) {
      violationsByFile[file] = [];
    }
    violationsByFile[file].push({ patternName, value, lineNum });
  });

  for (const [file, fileViolations] of Object.entries(violationsByFile)) {
    console.error(`${file}`);
    fileViolations.forEach(({ patternName, value, lineNum }) => {
      const violationType = patternName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      console.error(`  ✗ Line ${lineNum}: ${violationType}`);
      console.error(`    Found: ${value}`);
    });
    console.error('');
  }

  // Print guidance
  console.error('Design Token Usage Rules:\n');
  console.error('  ✗ FORBIDDEN:');
  console.error('    - Direct colors: #hex, rgb(), rgba(), hsl(), hsla()');
  console.error('    - Direct spacing: \'16px\', \'1rem\', \'2em\'\n');
  console.error('  ✓ REQUIRED:');
  console.error('    - CSS variables: var(--token-color-primary)');
  console.error('    - Tailwind classes: bg-primary, text-lg, p-4');
  console.error('    - Design tokens from tokens/ directory\n');
}

async function main() {
  const isValid = await validateAll();
  printViolations();
  process.exit(isValid ? 0 : 1);
}

main();
