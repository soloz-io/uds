#!/usr/bin/env node
/**
 * ESLint Disable Validation
 *
 * Validates that design system code does not use eslint-disable comments
 * to suppress @typescript-eslint/no-explicit-any. Disabling type safety
 * defeats the purpose of the lint rule — types should be properly defined.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getRepoRoot() {
  const packageRoot = path.join(__dirname, '..', '..');
  if (fs.existsSync(path.join(packageRoot, 'components'))) {
    return packageRoot;
  }
  try {
    const result = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' });
    return result.trim();
  } catch (e) {
    return process.cwd();
  }
}

const repoRoot = getRepoRoot();
const componentsDir = path.join(repoRoot, 'components');

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) &&
               !file.includes('.stories.') && !file.includes('.test.') && !file.endsWith('.d.ts')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(componentsDir);
let hasErrors = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    if (/\/\/\s*eslint-disable-next-line\s*@typescript-eslint\/no-explicit-any/.test(line.trim())) {
      console.error(`❌ eslint-disable for no-explicit-any found: ${path.relative(repoRoot, file)}:${index + 1}`);
      console.error(`   Line: ${line.trim()}`);
      console.error(`   Fix: Define a proper TypeScript type instead of using 'any'. Remove the eslint-disable comment and replace with an explicit type.\n`);
      hasErrors = true;
    }
  });
});

if (hasErrors) {
  process.exit(1);
}
