#!/usr/bin/env node
/**
 * Design System Architectural Pattern Validation Script
 *
 * This script detects anti-patterns and architectural violations that bypass
 * the design system's governance rules.
 *
 * Detected Patterns:
 * 1. Re-export Workarounds - Files that only re-export from forbidden layers
 *    to allow higher layers to bypass import restrictions
 *
 * Future patterns can be added here as needed.
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

class ArchitecturalPatternValidator {
  constructor(repoRoot) {
    this.repoRoot = repoRoot;
    this.componentsPath = path.join(repoRoot, 'components');
    this.violations = [];

    // Define the layer hierarchy and their allowed import sources
    this.LAYER_RULES = {
      'primitives': {
        allowed_paths: ['components/ui'],
        forbidden_paths: ['components/ai-elements', 'components/composites',
                         'components/blocks', 'components/features'],
      },
      'ai-elements': {
        allowed_paths: ['components/ui'],
        forbidden_paths: ['components/primitives', 'components/composites',
                         'components/blocks', 'components/features'],
      },
      'composites': {
        allowed_paths: ['components/primitives', 'components/ai-elements'],
        forbidden_paths: ['components/ui', 'components/blocks', 'components/features'],
      },
      'blocks': {
        allowed_paths: ['components/composites', 'components/primitives'],
        forbidden_paths: ['components/ui', 'components/ai-elements', 'components/features'],
      },
      'features': {
        allowed_paths: ['components/blocks', 'components/composites'],
        forbidden_paths: ['components/ui', 'components/ai-elements', 'components/primitives'],
      }
    };
  }

  getLayerFromPath(filePath) {
    try {
      const relPath = path.relative(this.componentsPath, filePath);
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

  hasActualCode(content) {
    // Patterns that indicate actual code (not just re-exports)
    const codePatterns = [
      /function\s+\w+/,                    // function declarations
      /const\s+\w+\s*=\s*\(/,              // arrow functions
      /const\s+\w+\s*=\s*\{/,              // object literals
      /const\s+\w+\s*=\s*\[/,              // array literals
      /interface\s+\w+/,                   // interfaces
      /type\s+\w+\s*=/,                    // type aliases
      /class\s+\w+/,                       // classes
      /<\w+/,                              // JSX tags
      /return\s+/,                         // return statements
      /export\s+function/,                 // exported functions
      /export\s+const\s+\w+\s*=\s*\(/,    // exported arrow functions
      /export\s+class/,                    // exported classes
      /export\s+interface/,                // exported interfaces
      /export\s+type\s+\w+\s*=/,          // exported types
    ];

    // Remove export-from statements and comments
    const lines = content.split('\n');
    const nonExportLines = lines
      .filter(line => {
        const trimmed = line.trim();
        // Skip empty lines
        if (!trimmed) return false;
        // Skip comments
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return false;
        // Skip pure re-exports (export { X } from "y")
        if (/^export\s+(?:type\s+)?\{[^}]*\}\s+from\s+["']/.test(trimmed)) return false;
        // Skip export * from
        if (/^export\s+\*\s+from\s+["']/.test(trimmed)) return false;
        return true;
      })
      .join('\n');

    // Check if any code pattern exists
    return codePatterns.some(pattern => pattern.test(nonExportLines));
  }

  extractExports(content) {
    const exports = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      // Match: export { X } from "path" or export * from "path"
      const match = trimmed.match(/^export\s+(?:type\s+)?(?:\{[^}]*\}|\*)\s+from\s+["']([^"']+)["']/);
      if (match) {
        exports.push({
          line: trimmed,
          importPath: match[1],
          lineNumber: index + 1
        });
      }
    });

    return exports;
  }

  normalizeImportPath(importPath, currentFile) {
    if (importPath.startsWith('.')) {
      // Resolve relative path
      const currentDir = path.dirname(currentFile);
      const resolved = path.resolve(currentDir, importPath);

      try {
        const relPath = path.relative(this.componentsPath, resolved);
        return relPath.replace(/\\/g, '/');
      } catch (e) {
        return '';
      }
    } else if (importPath.startsWith('@/components/')) {
      // Extract the components part
      return importPath.replace('@/components/', 'components/');
    }

    return importPath;
  }

  detectReExportWorkaround(filePath, content) {
    const currentLayer = this.getLayerFromPath(filePath);
    if (!currentLayer || !this.LAYER_RULES[currentLayer]) {
      return null;
    }

    // Check if file has actual code
    if (this.hasActualCode(content)) {
      return null; // File has actual functionality, not a workaround
    }

    // Extract all export-from statements
    const exports = this.extractExports(content);
    
    if (exports.length === 0) {
      return null; // No exports, not a workaround
    }

    // Determine which layers can import from this layer
    const consumingLayers = [];
    for (const [layer, rules] of Object.entries(this.LAYER_RULES)) {
      if (rules.allowed_paths.includes(`components/${currentLayer}`)) {
        consumingLayers.push(layer);
      }
    }

    // Check if exports are from layers that consumers cannot import from
    const problematicExports = [];

    for (const exp of exports) {
      const normalized = this.normalizeImportPath(exp.importPath, filePath);
      
      // Determine which layer this export is from
      let exportFromLayer = null;
      for (const layer of Object.keys(this.LAYER_RULES)) {
        if (normalized.includes(`components/${layer}`) || normalized.includes(`${layer}/`)) {
          exportFromLayer = layer;
          break;
        }
      }

      if (exportFromLayer) {
        // Check if ANY consuming layer is forbidden from importing this layer
        for (const consumingLayer of consumingLayers) {
          const consumerRules = this.LAYER_RULES[consumingLayer];
          const isForbidden = consumerRules.forbidden_paths.includes(`components/${exportFromLayer}`);

          if (isForbidden) {
            problematicExports.push({
              ...exp,
              exportFromLayer: exportFromLayer,
              consumingLayer: consumingLayer,
              reason: `${consumingLayer}/ cannot import from ${exportFromLayer}/, but can import from ${currentLayer}/`
            });
            break; // Found at least one problematic consumer
          }
        }
      }
    }

    // If ALL exports are problematic, this is a workaround
    if (problematicExports.length === exports.length && problematicExports.length > 0) {
      return {
        filePath: path.relative(this.repoRoot, filePath),
        layer: currentLayer,
        exports: problematicExports,
        consumingLayers: consumingLayers,
        pattern: 'RE_EXPORT_WORKAROUND'
      };
    }

    return null;
  }

  validateFile(filePath) {
    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      return;
    }

    // Check for re-export workarounds
    const workaround = this.detectReExportWorkaround(filePath, content);
    if (workaround) {
      this.violations.push(workaround);
    }
  }

  validateAll() {
    if (!fs.existsSync(this.componentsPath)) {
      console.log(`${RED}Error: components path not found: ${this.componentsPath}${RESET}`);
      return false;
    }

    // Find all .tsx and .ts files (excluding .stories.tsx, .test.tsx, and index files)
    const findFiles = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          findFiles(filePath);
        } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) &&
                   !file.includes('.stories.') && 
                   !file.includes('.test.') &&
                   file !== 'index.ts' && 
                   file !== 'index.tsx') {
          this.validateFile(filePath);
        }
      }
    };

    findFiles(this.componentsPath);

    return this.violations.length === 0;
  }

  printViolations() {
    if (this.violations.length === 0) {
      console.log(`${GREEN}${BOLD}✓ No architectural pattern violations detected!${RESET}`);
      return;
    }

    console.log(`${RED}${BOLD}✗ Found ${this.violations.length} architectural pattern violation(s):${RESET}\n`);

    // Group by pattern type
    const byPattern = {};
    for (const violation of this.violations) {
      if (!byPattern[violation.pattern]) {
        byPattern[violation.pattern] = [];
      }
      byPattern[violation.pattern].push(violation);
    }

    // Print re-export workarounds
    if (byPattern.RE_EXPORT_WORKAROUND) {
      console.log(`${RED}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
      console.log(`${RED}${BOLD}⚠️  PATTERN: RE-EXPORT WORKAROUNDS${RESET}`);
      console.log(`${RED}${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

      for (const violation of byPattern.RE_EXPORT_WORKAROUND) {
        console.log(`${RED}${BOLD}✗ ${violation.filePath}${RESET}`);
        console.log(`  ${YELLOW}Layer: ${violation.layer}/${RESET}`);
        console.log(`  ${YELLOW}Consuming layers: ${violation.consumingLayers.join(', ')}${RESET}`);
        console.log();
        console.log(`  ${RED}Issue: This file only re-exports from forbidden layers${RESET}`);
        console.log(`  ${YELLOW}Problematic exports (${violation.exports.length}):${RESET}`);

        for (const exp of violation.exports) {
          console.log(`    ${BLUE}Line ${exp.lineNumber}:${RESET} ${exp.line}`);
          console.log(`      ${RED}↳ ${exp.reason}${RESET}`);
        }

        console.log();
        console.log(`  ${BOLD}Why this is wrong:${RESET}`);
        console.log(`    This file exists ONLY to re-export from layers that its consumers`);
        console.log(`    cannot directly import from, bypassing architectural rules.`);
        console.log();
        console.log(`  ${BOLD}How to fix:${RESET}`);
        console.log(`    1. Move the consuming component to the correct layer (e.g., blocks → composites)`);
        console.log(`    2. Add actual functionality to this file (components, types, utilities)`);
        console.log(`    3. Remove this file and use allowed layers directly`);
        console.log();
      }
    }

    console.log(`${BOLD}Design System Principle:${RESET}`);
    console.log(`  Components should be in the correct layer based on what they combine.`);
    console.log(`  Re-export wrappers that bypass layer rules violate architectural integrity.`);
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
  const validator = new ArchitecturalPatternValidator(repoRoot);
  const isValid = validator.validateAll();
  validator.printViolations();
  process.exit(isValid ? 0 : 1);
}

main();
