#!/usr/bin/env node
/**
 * Import Alias Validation Script
 *
 * Enforces that all component imports use the @/ alias instead of relative paths.
 *
 * FORBIDDEN:
 * - Relative imports: ../../components/
 * - Relative imports: ../components/
 *
 * REQUIRED:
 * - Alias imports: @/components/
 * - Alias imports: @/lib/
 * - Alias imports: @/types/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color codes for terminal output
const RED = '\x1b[91m';
const GREEN = '\x1b[92m';
const YELLOW = '\x1b[93m';
const BLUE = '\x1b[94m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

class ImportAliasValidator {
  constructor(repoRoot) {
    this.repoRoot = repoRoot;
    this.uiLibPath = path.join(repoRoot, 'components');
    this.componentsPath = path.join(this.uiLibPath);
    this.violations = [];

    // Patterns for forbidden relative imports
    this.FORBIDDEN_PATTERNS = [
      /from\s+["']\.\.\/\.\.\//,  // Any ../../ import
      /from\s+["']\.\.\/(?!\.\/)/,  // Any ../ import (but not .././)
    ];

    // Allowed relative imports (same directory or subdirectory)
    this.ALLOWED_RELATIVE = [
      /from\s+["']\.\/[^.\/]/,  // ./Component (same directory)
      /from\s+["']\.\/[a-zA-Z]/,  // ./subdir/Component (subdirectory)
      /from\s+["']\.\.\/\.\.\/ui\//,  // ../../ui/ (primitives importing shadcn)
    ];
  }

  isAllowedRelative(line) {
    for (const pattern of this.ALLOWED_RELATIVE) {
      if (pattern.test(line)) {
        return true;
      }
    }
    return false;
  }

  validateFile(filePath) {
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      console.log(`${YELLOW}Warning: Could not read ${filePath}: ${e}${RESET}`);
      return;
    }

    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Skip if it's an allowed relative import
      if (this.isAllowedRelative(line)) {
        return;
      }

      // Check for forbidden relative imports
      for (const pattern of this.FORBIDDEN_PATTERNS) {
        if (pattern.test(line)) {
          const relFile = path.relative(this.repoRoot, filePath);
          // Extract the import statement
          const importMatch = line.match(/from\s+["']([^"']+)["']/);
          if (importMatch) {
            const importPath = importMatch[1];
            this.violations.push([
              relFile,
              importPath,
              lineNum
            ]);
          }
          break;
        }
      }
    });
  }

  validateAll() {
    if (!fs.existsSync(this.componentsPath)) {
      console.log(`${RED}Error: Components path not found: ${this.componentsPath}${RESET}`);
      return false;
    }

    // Validate all .tsx and .ts files in components
    const findFiles = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          findFiles(filePath);
        } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) &&
                   !file.includes('.stories.') && !file.includes('.test.')) {
          this.validateFile(filePath);
        }
      }
    };

    findFiles(this.componentsPath);

    return this.violations.length === 0;
  }

  printViolations() {
    if (this.violations.length === 0) {
      console.log(`${GREEN}${BOLD}✓ All imports use @/ alias correctly!${RESET}`);
      return;
    }

    console.log(`${RED}${BOLD}✗ Found ${this.violations.length} import alias violation(s):${RESET}\n`);

    // Group violations by file
    const violationsByFile = {};
    for (const [filePath, importPath, lineNum] of this.violations) {
      if (!violationsByFile[filePath]) {
        violationsByFile[filePath] = [];
      }
      violationsByFile[filePath].push([importPath, lineNum]);
    }

    for (const [filePath, violations] of Object.entries(violationsByFile)) {
      console.log(`${BOLD}${BLUE}${filePath}${RESET}`);
      for (const [importPath, lineNum] of violations) {
        console.log(`  ${RED}✗${RESET} Line ${lineNum}: Relative import`);
        console.log(`    Found: ${BOLD}${importPath}${RESET}`);

        // Suggest the correct import
        if (importPath.includes('components/')) {
          const suggested = importPath.split('components/').pop();
          console.log(`    Use:   ${GREEN}@/components/${suggested}${RESET}`);
        } else if (importPath.includes('lib/')) {
          const suggested = importPath.split('lib/').pop();
          console.log(`    Use:   ${GREEN}@/lib/${suggested}${RESET}`);
        } else if (importPath.includes('types/')) {
          const suggested = importPath.split('types/').pop();
          console.log(`    Use:   ${GREEN}@/types/${suggested}${RESET}`);
        }
      }
      console.log();
    }

    // Print guidance
    console.log(`${BOLD}Import Alias Rules:${RESET}`);
    console.log();
    console.log(`  ${RED}✗ FORBIDDEN:${RESET}`);
    console.log(`    - Relative imports: ../../components/`);
    console.log(`    - Relative imports: ../components/`);
    console.log();
    console.log(`  ${GREEN}✓ REQUIRED:${RESET}`);
    console.log(`    - Alias imports: @/components/`);
    console.log(`    - Alias imports: @/lib/`);
    console.log(`    - Alias imports: @/types/`);
    console.log();
    console.log(`  ${GREEN}✓ ALLOWED:${RESET}`);
    console.log(`    - Same directory: ./Component`);
    console.log(`    - Subdirectory: ./subdir/Component`);
    console.log();
  }
}

function getRepoRoot() {
  try {
    const result = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' });
    return result.trim();
  } catch (e) {
    return process.cwd();
  }
}

function main() {
  const repoRoot = getRepoRoot();
  const validator = new ImportAliasValidator(repoRoot);
  const isValid = validator.validateAll();
  validator.printViolations();
  process.exit(isValid ? 0 : 1);
}

main();
