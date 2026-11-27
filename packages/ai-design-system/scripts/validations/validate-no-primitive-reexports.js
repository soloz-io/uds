#!/usr/bin/env node
/**
 * Design System Primitive Re-export Validation Script
 *
 * This script enforces that primitives are NEVER re-exported from @/components/composites.
 *
 * Rule:
 * Composites may import primitives to build composite components, but composites
 * must NEVER re-export primitives. Re-exporting primitives from composites is an
 * architectural anti-pattern that creates a loophole for features to bypass
 * layer restrictions.
 *
 * Correct approach:
 * Decompose the UI into Composites or Blocks instead of re-exporting primitives.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Terminal colors
const RED = '\x1b[91m';
const GREEN = '\x1b[92m';
const YELLOW = '\x1b[93m';
const BLUE = '\x1b[94m';
const CYAN = '\x1b[96m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

class PrimitiveReexportValidator {
  constructor(repoRoot) {
    this.repoRoot = repoRoot;
    this.componentsPath = path.join(repoRoot, 'components');
    this.compositesPath = path.join(this.componentsPath, 'composites');
    this.primitivesPath = path.join(this.componentsPath, 'primitives');
    this.featuresPath = path.join(this.componentsPath, 'features');
    this.violations = [];

    this.compositeNames = this.getKnownCompositeNames();
    this.primitiveNames = this.getKnownPrimitiveNames();
  }

  getKnownCompositeNames() {
    const names = new Set();
    if (!fs.existsSync(this.compositesPath)) {
      return names;
    }
    const entries = fs.readdirSync(this.compositesPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        names.add(entry.name);
      }
    }
    return names;
  }

  getKnownPrimitiveNames() {
    const names = new Set();
    if (!fs.existsSync(this.primitivesPath)) {
      return names;
    }

    // Read primitive directory names (e.g. Button, Card, Badge)
    const entries = fs.readdirSync(this.primitivesPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        names.add(entry.name);
      }
    }

    // Also inspect primitives/index.ts for all exported identifiers
    const indexPath = path.join(this.primitivesPath, 'index.ts');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      const exportMatches = content.matchAll(/export\s+\{([^}]+)\}/g);
      for (const match of exportMatches) {
        const identifiers = match[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim());
        identifiers.forEach(id => {
          if (id && !id.startsWith('type ')) {
            names.add(id);
          }
        });
      }
    }

    return names;
  }

  isPrimitiveTarget(importPath, currentFilePath) {
    if (importPath.startsWith('@/components/primitives') || importPath.startsWith('@/primitives')) {
      return true;
    }
    if (importPath.includes('components/primitives') || importPath.includes('/primitives')) {
      return true;
    }
    if (importPath.startsWith('.')) {
      const currentDir = path.dirname(currentFilePath);
      const resolved = path.resolve(currentDir, importPath);
      try {
        const rel = path.relative(this.primitivesPath, resolved);
        if (!rel.startsWith('..') && !path.isAbsolute(rel)) {
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  }

  checkCompositeFileForPrimitiveReexports(filePath) {
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      return;
    }

    const relPath = path.relative(this.repoRoot, filePath);

    // 1. Direct re-exports:
    // export { ... } from '...primitives...'
    // export type { ... } from '...primitives...'
    // export * from '...primitives...'
    const reexportRegex = /export\s+(?:type\s+)?(?:\{([^}]*)\}|\*)\s+from\s+["']([^"']+)["']/gs;
    let match;
    while ((match = reexportRegex.exec(content)) !== null) {
      const targetPath = match[2];

      if (this.isPrimitiveTarget(targetPath, filePath)) {
        const beforeMatch = content.slice(0, match.index);
        const lineNum = beforeMatch.split('\n').length;
        const exportedItems = match[1] ? match[1].trim().replace(/\s+/g, ' ') : '*';

        this.violations.push({
          type: 'COMPOSITE_REEXPORT_FROM_PRIMITIVES',
          filePath: relPath,
          lineNum,
          statement: match[0].trim().replace(/\s+/g, ' '),
          exportedItems,
          targetPath,
          message: `Composites may NOT re-export from primitives/.`,
        });
      }
    }

    // 2. Direct naked re-export of primitives without modification or renaming:
    // E.g.: import { Button } from '@/components/primitives/Button'; export { Button };
    const primitiveImports = new Map();
    const importRegex = /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+["']([^"']+)["']/g;
    let importMatch;
    while ((importMatch = importRegex.exec(content)) !== null) {
      const targetPath = importMatch[2];
      if (this.isPrimitiveTarget(targetPath, filePath)) {
        const before = content.slice(0, importMatch.index);
        const lineNum = before.split('\n').length;
        const ids = importMatch[1].split(',').map(s => {
          const parts = s.trim().split(/\s+as\s+/);
          return parts.length > 1 ? parts[1].trim() : parts[0].trim();
        });
        ids.forEach(id => {
          if (id) primitiveImports.set(id, { targetPath, lineNum });
        });
      }
    }

    if (primitiveImports.size > 0) {
      // Find export { ... } statements without a "from" clause
      const nakedExportRegex = /export\s+\{([^}]+)\}(?!\s*from)/g;
      let exportMatch;
      while ((exportMatch = nakedExportRegex.exec(content)) !== null) {
        const before = content.slice(0, exportMatch.index);
        const lineNum = before.split('\n').length;
        const exportClauses = exportMatch[1].split(',').map(s => s.trim()).filter(Boolean);

        for (const clause of exportClauses) {
          const parts = clause.split(/\s+as\s+/);
          const localName = parts[0].trim();
          const exportedName = parts.length > 1 ? parts[1].trim() : localName;

          // If the exported item preserves the primitive name (not a composite-specific abstraction), flag it
          if (primitiveImports.has(localName) && (this.primitiveNames.has(exportedName) || exportedName === localName)) {
            const importedFrom = primitiveImports.get(localName);
            this.violations.push({
              type: 'INDIRECT_PRIMITIVE_REEXPORT',
              filePath: relPath,
              lineNum,
              statement: `export { ${clause} }`,
              exportedItems: exportedName,
              targetPath: importedFrom.targetPath,
              message: `Primitive '${localName}' is imported from primitives and re-exported under '${exportedName}'.`,
            });
          }
        }
      }
    }
  }

  checkFeatureFileForCompositePrimitiveImports(filePath) {
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      return;
    }

    const relPath = path.relative(this.repoRoot, filePath);

    // Match imports from composites
    const compositeImportRegex = /import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g;
    let match;
    while ((match = compositeImportRegex.exec(content)) !== null) {
      const rawTarget = match[2];
      const isComposites =
        rawTarget === '@/components/composites' ||
        rawTarget.startsWith('@/components/composites/') ||
        rawTarget === './composites' ||
        rawTarget.endsWith('/composites');

      if (isComposites) {
        const before = content.slice(0, match.index);
        const lineNum = before.split('\n').length;
        const importedItems = match[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim());

        const primitiveImportsFound = importedItems.filter(item => {
          // If it's a known standalone composite, it's not a primitive!
          if (this.compositeNames.has(item)) {
            return false;
          }
          // Check if item matches a known primitive name
          if (this.primitiveNames.has(item)) {
            return true;
          }
          // Check if it starts with a primitive name and is a primitive subcomponent (e.g. CardHeader, SelectTrigger)
          for (const prim of this.primitiveNames) {
            if (item.startsWith(prim) && item.length > prim.length && /^[A-Z]/.test(item.slice(prim.length))) {
              return true;
            }
          }
          return false;
        });

        if (primitiveImportsFound.length > 0) {
          this.violations.push({
            type: 'FEATURE_IMPORTING_PRIMITIVE_VIA_COMPOSITES',
            filePath: relPath,
            lineNum,
            statement: match[0].trim(),
            exportedItems: primitiveImportsFound.join(', '),
            targetPath: rawTarget,
            message: `Feature imports primitive(s) [${primitiveImportsFound.join(', ')}] from ${rawTarget}.`,
          });
        }
      }
    }
  }

  scanDirectory(dir, filterFn, callback) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        this.scanDirectory(fullPath, filterFn, callback);
      } else if (filterFn(entry.name)) {
        callback(fullPath);
      }
    }
  }

  validateAll() {
    // 1. Scan all composites (including index.ts) for primitive re-exports
    this.scanDirectory(
      this.compositesPath,
      name => (name.endsWith('.ts') || name.endsWith('.tsx')) && !name.includes('.stories.') && !name.includes('.test.'),
      filePath => this.checkCompositeFileForPrimitiveReexports(filePath)
    );

    // 2. Scan all features for primitive imports via composites
    this.scanDirectory(
      this.featuresPath,
      name => (name.endsWith('.ts') || name.endsWith('.tsx')) && !name.includes('.stories.') && !name.includes('.test.'),
      filePath => this.checkFeatureFileForCompositePrimitiveImports(filePath)
    );

    return this.violations.length === 0;
  }

  printViolations() {
    if (this.violations.length === 0) {
      console.log(`${GREEN}${BOLD}✓ No primitive re-exports found in @/components/composites!${RESET}`);
      return;
    }

    console.log(`${RED}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
    console.log(`${RED}${BOLD}✗ Found ${this.violations.length} primitive re-export violation(s):${RESET}`);
    console.log(`${RED}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

    for (const violation of this.violations) {
      console.log(`${RED}${BOLD}🔴 ${violation.type}${RESET}`);
      console.log(`   ${CYAN}${violation.filePath}:${violation.lineNum}${RESET}`);
      console.log(`   Statement: ${YELLOW}${violation.statement}${RESET}`);
      console.log(`   Items:     ${RED}${violation.exportedItems}${RESET}`);
      console.log(`   Issue:     ${violation.message}`);
      console.log();
    }

    console.log(`${BOLD}Design System Architecture Rule:${RESET}`);
    console.log(`  ${RED}✗ Re-exporting primitives from @/components/composites is strictly forbidden.${RESET}`);
    console.log(`  ${RED}✗ Features cannot import primitives directly OR through composite re-exports.${RESET}`);
    console.log();
    console.log(`${BOLD}${GREEN}How to fix (Correct Architecture):${RESET}`);
    console.log(`  1. ${BOLD}Decompose into Composites / Blocks:${RESET}`);
    console.log(`     Extract the sub-components into dedicated Composites or Blocks.`);
    console.log(`  2. Composites and Blocks ${BOLD}are allowed${RESET} to import and use primitives directly.`);
    console.log(`  3. Features must compose those Composites and Blocks.`);
    console.log(`  4. Remove all primitive re-exports from components/composites/index.ts.`);
    console.log();
  }
}

function getRepoRoot() {
  const packageRoot = path.join(__dirname, '..', '..');
  if (fs.existsSync(path.join(packageRoot, 'components'))) {
    return packageRoot;
  }
  try {
    const result = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' });
    return result.trim();
  } catch {
    return process.cwd();
  }
}

function main() {
  const repoRoot = getRepoRoot();
  const validator = new PrimitiveReexportValidator(repoRoot);
  const isValid = validator.validateAll();
  validator.printViolations();
  process.exit(isValid ? 0 : 1);
}

main();
