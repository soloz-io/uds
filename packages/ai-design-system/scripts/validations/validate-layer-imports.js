#!/usr/bin/env node
/**
 * Design System Layer Import Validation Script
 *
 * This script enforces strict architectural layer rules across the design system:
 *
 * Layer Hierarchy (bottom to top):
 * 1. components/ui/         - shadcn/ui base components (no imports from project)
 * 2. components/primitives/ - ONLY import from components/ui/
 * 3. components/ai-elements/ - ONLY import from components/ui/ (specialized AI components)
 * 4. components/composites/     - ONLY import from primitives/ or ai-elements/
 * 5. components/composites/   - ONLY import from composites/ or primitives/
 * 6. components/features/   - ONLY import from blocks/, composites/, or primitives/
 *
 * FORBIDDEN IMPORTS:
 * - Any layer (except primitives) importing directly from components/ui/
 * - Any layer (except blocks) importing directly from components/ai-elements/
 * - Circular dependencies between layers
 * - Upward imports (lower layers importing from higher layers)
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

class LayerValidator {
  constructor(repoRoot) {
    this.repoRoot = repoRoot;
    this.uiLibPath = path.join(repoRoot, 'components');
    this.violations = [];

    // Define the layer hierarchy and their allowed import sources
    this.LAYER_RULES = {
      'primitives': {
        allowed_paths: ['components/ui'],
        forbidden_paths: ['components/ai-elements', 'components/composites',
                         'components/blocks', 'components/features'],
        description: 'Primitives ONLY import from components/ui/'
      },
      'ai-elements': {
        allowed_paths: ['components/ui'],
        forbidden_paths: ['components/primitives', 'components/composites',
                         'components/blocks', 'components/features'],
        description: 'AI Elements ONLY import from components/ui/'
      },
      'composites': {
        allowed_paths: ['components/primitives', 'components/ai-elements'],
        forbidden_paths: ['components/ui', 'components/blocks', 'components/features'],
        description: 'Composites ONLY import from primitives/ or ai-elements/'
      },
      'blocks': {
        allowed_paths: ['components/composites', 'components/primitives', 'components/ai-elements'],
        forbidden_paths: ['components/ui', 'components/blocks', 'components/features'],
        description: 'Blocks ONLY import from composites/, primitives/, or ai-elements/'
      },
      'features': {
        allowed_paths: ['components/blocks', 'components/composites'],
        forbidden_paths: ['components/ui', 'components/ai-elements', 'components/primitives'],
        description: 'Features ONLY import from blocks/ or composites/'
      }
    };
  }

  extractImports(fileContent) {
    const imports = [];
    const patterns = [
      // import { X } from "path" or import X from "path"
      /import\s+(?:{[^}]*}|\w+)\s+from\s+["']([^"']+)["']/g,
      // import "path"
      /import\s+["']([^"']+)["']/g,
      // export { X } from "path" or export * from "path"
      /export\s+(?:\*|{[^}]*})\s+from\s+["']([^"']+)["']/g,
    ];

    const lines = fileContent.split('\n');
    lines.forEach((line, index) => {
      patterns.forEach(pattern => {
        let match;
        const regex = new RegExp(pattern.source, pattern.flags);
        while ((match = regex.exec(line)) !== null) {
          imports.push([match[1], index + 1]);
        }
      });
    });

    return imports;
  }

  normalizeImportPath(importPath, currentFile) {
    if (importPath.startsWith('.')) {
      // Resolve relative path
      const currentDir = path.dirname(currentFile);
      const resolved = path.resolve(currentDir, importPath);

      // Get relative path from uiLibPath
      try {
        const relPath = path.relative(this.uiLibPath, resolved);
        const normalized = relPath.replace(/\\/g, '/');

        // Check if it's a same-layer import
        const currentLayer = this.getLayerFromPath(currentFile);
        const targetLayer = this.getLayerFromPath(resolved);
        const isSameLayer = currentLayer && targetLayer && currentLayer === targetLayer;

        return [normalized, isSameLayer];
      } catch (e) {
        // Path is outside ui-lib, ignore
        return ['', false];
      }
    } else {
      // Already relative to some base, check if it's within components
      if (importPath.includes('components/')) {
        // Extract the components part
        const parts = importPath.split('components/');
        if (parts.length > 1) {
          return ['components/' + parts[1], false];
        }
      }
    }

    return [importPath, false];
  }

  getLayerFromPath(filePath) {
    try {
      const relPath = path.relative(this.uiLibPath, filePath);
      const parts = relPath.split(path.sep);

      if (parts.length > 0) {
        const layer = parts[0];
        if (this.LAYER_RULES[layer]) {
          return layer;
        }
      }
    } catch (e) {
      // Ignore
    }

    return '';
  }

  validateImport(currentLayer, importPath) {
    if (!this.LAYER_RULES[currentLayer]) {
      return true;
    }

    const rules = this.LAYER_RULES[currentLayer];

    // Check if import is from a forbidden path
    for (const forbidden of rules.forbidden_paths) {
      if (importPath.includes(forbidden)) {
        return false;
      }
    }

    // For layers other than primitives and ai-elements,
    // ensure they don't import from components/ui
    if (!['primitives', 'ai-elements'].includes(currentLayer)) {
      if (importPath.includes('components/ui') || importPath.startsWith('ui/')) {
        return false;
      }
    }

    return true;
  }

  validateFile(filePath) {
    const currentLayer = this.getLayerFromPath(filePath);

    if (!currentLayer) {
      // File is not in a layer we care about
      return;
    }

    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      console.log(`${YELLOW}Warning: Could not read ${filePath}: ${e}${RESET}`);
      return;
    }

    const imports = this.extractImports(content);

    for (const [importPath, lineNum] of imports) {
      const [normalized, isSameLayer] = this.normalizeImportPath(importPath, filePath);

      if (!normalized) {
        continue;
      }

      // Allow same-layer imports (imports within the same layer folder)
      if (isSameLayer) {
        continue;
      }

      if (!this.validateImport(currentLayer, normalized)) {
        const relFile = path.relative(this.repoRoot, filePath);
        this.violations.push([
          relFile,
          currentLayer,
          importPath,
          lineNum
        ]);
      }
    }
  }

  validateAll() {
    if (!fs.existsSync(this.uiLibPath)) {
      console.log(`${RED}Error: ui-lib path not found: ${this.uiLibPath}${RESET}`);
      return false;
    }

    // Find all .tsx and .ts files (excluding .stories.tsx and .test.tsx)
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

    findFiles(this.uiLibPath);

    return this.violations.length === 0;
  }

  printViolations() {
    if (this.violations.length === 0) {
      console.log(`${GREEN}${BOLD}✓ All layer import rules are satisfied!${RESET}`);
      return;
    }

    console.log(`${RED}${BOLD}✗ Found ${this.violations.length} layer import violation(s):${RESET}\n`);

    // Group violations by layer
    const violationsByLayer = {};
    for (const [filePath, layer, importPath, lineNum] of this.violations) {
      if (!violationsByLayer[layer]) {
        violationsByLayer[layer] = [];
      }
      violationsByLayer[layer].push([filePath, importPath, lineNum]);
    }

    for (const [layer, violations] of Object.entries(violationsByLayer)) {
      const rules = this.LAYER_RULES[layer];
      console.log(`${BOLD}${BLUE}Layer: ${layer}/${RESET}`);
      console.log(`${YELLOW}Rule: ${rules.description}${RESET}`);
      console.log();

      for (const [filePath, importPath, lineNum] of violations) {
        console.log(`  ${RED}✗${RESET} ${filePath}:${lineNum}`);
        console.log(`    Invalid import: ${BOLD}${importPath}${RESET}`);
      }

      console.log();
    }

    // Print layer rules summary
    console.log(`${BOLD}Layer Architecture Rules:${RESET}`);
    console.log();
    for (const [layer, rules] of Object.entries(this.LAYER_RULES)) {
      const allowed = rules.allowed_paths.join(', ');
      console.log(`  ${GREEN}✓${RESET} ${BOLD}${layer}/${RESET}`);
      console.log(`    Allowed: ${allowed}`);
    }
    console.log();
  }
}

function getRepoRoot() {
  // Use __dirname-based resolution so this works in both standalone repos and
  // monorepos (where git rev-parse --show-toplevel returns the monorepo root,
  // not this package's root).
  // __dirname = scripts/validations/, so two levels up is the package root.
  const packageRoot = path.join(__dirname, '..', '..');
  if (fs.existsSync(path.join(packageRoot, 'components'))) {
    return packageRoot;
  }
  // Fallback: try git toplevel, then cwd
  try {
    const result = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' });
    return result.trim();
  } catch (e) {
    return process.cwd();
  }
}

function main() {
  const repoRoot = getRepoRoot();
  const validator = new LayerValidator(repoRoot);
  const isValid = validator.validateAll();
  validator.printViolations();
  process.exit(isValid ? 0 : 1);
}

main();
