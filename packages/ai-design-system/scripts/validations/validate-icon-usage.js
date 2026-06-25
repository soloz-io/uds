#!/usr/bin/env node
/**
 * Icon Usage Validation Script
 *
 * Enforces consistent icon usage across the design system.
 * All icons should go through the Icon primitive and registry.
 *
 * Rules:
 * 1. DIRECT_LUCIDE_IMPORT - Components must NOT import directly from lucide-react.
 *    Exception: components/ui/ (shadcn wrappers)
 *
 * 2. LUCILE_ICON_TYPE - Components must NOT use LucideIcon type in props.
 *    This couples the component API to lucide-react.
 *
 * 3. INLINE_SVG - Components must NOT define inline <svg> elements.
 *    Exception: components/ui/ and components/primitives/Icon/
 *
 * 4. TABLER_ICONS_IMPORT - Components must NOT import from @tabler/icons-react.
 *    It is not part of the design system.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RED = '\x1b[91m';
const GREEN = '\x1b[92m';
const YELLOW = '\x1b[93m';
const BLUE = '\x1b[94m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

const TYPE_CONFIG = {
  DIRECT_LUCIDE_IMPORT: {
    label: 'Direct lucide-react Import',
    icon: '\uD83D\uDD34',
    description: 'Components must use the Icon primitive instead of importing directly from lucide-react.',
    fix: 'Replace with <Icon name="..." /> from @/components/primitives/Icon. If the icon is not in the registry, add it to @/registry/icons.ts.',
    allowed: 'components/ui/ and components/ai-elements/ are exempt.',
  },
  LUCILE_ICON_TYPE: {
    label: 'LucideIcon Type in Props',
    icon: '\uD83D\uDFE0',
    description: 'Using LucideIcon type in component props couples the API to lucide-react.',
    fix: 'Replace the prop type with ReactNode (for rendered icons) or a string icon name.',
  },
  INLINE_SVG: {
    label: 'Inline SVG Element',
    icon: '\uD83D\uDFE1',
    description: 'Inline <svg> elements bypass the design system\'s icon registry.',
    fix: 'Register the icon in @/registry/icons.ts and use <Icon name="..." />.',
    allowed: 'components/ui/, components/ai-elements/, and components/primitives/Icon/ are exempt.',
  },
  TABLER_ICONS_IMPORT: {
    label: '@tabler/icons-react Import',
    icon: '\uD83D\uDFE4',
    description: '@tabler/icons-react is not part of the design system.',
    fix: 'Use lucide-react icons via the Icon primitive.',
  },
};

class IconUsageValidator {
  constructor(repoRoot) {
    this.repoRoot = repoRoot;
    this.componentsPath = path.join(repoRoot, 'components');
    this.violations = [];

    this.SKIP_DIRS = new Set(['ui', 'ai-elements']);

    this.SKIP_FILES_REGEX = [
      /\.stories\.tsx$/,
      /\.behaviors\.stories\.tsx$/,
      /\.test\.tsx$/,
      /\.spec\.tsx$/,
      /^index\.tsx?$/,
    ];
  }

  shouldSkipFile(filePath) {
    const relativeToComponents = path.relative(this.componentsPath, filePath);
    const parts = relativeToComponents.split(path.sep);

    if (parts.length > 0 && this.SKIP_DIRS.has(parts[0])) {
      return true;
    }

    if (parts.length >= 2 && parts[0] === 'primitives' && parts[1] === 'Icon') {
      return true;
    }

    const fileName = path.basename(filePath);
    for (const pattern of this.SKIP_FILES_REGEX) {
      if (pattern.test(fileName)) {
        return true;
      }
    }

    return false;
  }

  isInComment(line, matchIndex) {
    const before = line.substring(0, matchIndex);
    if (before.includes('//')) return true;
    if (before.includes('/*') && !before.includes('*/')) return true;
    return false;
  }

  isImportLine(line) {
    return line.trim().startsWith('import ') || line.trim().startsWith('from ');
  }

  validateFile(filePath) {
    if (this.shouldSkipFile(filePath)) return;

    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      console.log(`${YELLOW}Warning: Could not read ${filePath}: ${e}${RESET}`);
      return;
    }

    const lines = content.split('\n');
    const relFile = path.relative(this.repoRoot, filePath);

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      if (this.isInComment(line, 0)) return;

      const trimmed = line.trim();
      if (trimmed.startsWith('*') || trimmed.startsWith('//')) return;

      const lucideMatch = trimmed.match(/from\s+["']lucide-react["']/);
      if (lucideMatch) {
        this.violations.push({
          file: relFile,
          line: lineNum,
          type: 'DIRECT_LUCIDE_IMPORT',
          value: trimmed,
        });
      }

      const lucideIconMatch = trimmed.match(/\bLucideIcon\b/);
      if (lucideIconMatch) {
        this.violations.push({
          file: relFile,
          line: lineNum,
          type: 'LUCILE_ICON_TYPE',
          value: trimmed,
        });
      }

      const svgMatch = trimmed.match(/<\s*svg\s/i);
      if (svgMatch) {
        this.violations.push({
          file: relFile,
          line: lineNum,
          type: 'INLINE_SVG',
          value: trimmed,
        });
      }

      const tablerMatch = trimmed.match(/from\s+["']@tabler\/icons-react["']/);
      if (tablerMatch) {
        this.violations.push({
          file: relFile,
          line: lineNum,
          type: 'TABLER_ICONS_IMPORT',
          value: trimmed,
        });
      }
    });
  }

  validateAll() {
    if (!fs.existsSync(this.componentsPath)) {
      console.log(`${RED}Error: Components path not found: ${this.componentsPath}${RESET}`);
      return false;
    }

    const walkDir = (dir) => {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const entryPath = path.join(dir, entry);
        const stat = fs.statSync(entryPath);

        if (stat.isDirectory()) {
          walkDir(entryPath);
        } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
          this.validateFile(entryPath);
        }
      }
    };

    walkDir(this.componentsPath);

    return this.violations.length === 0;
  }

  printViolations() {
    if (this.violations.length === 0) {
      console.log(`${GREEN}${BOLD}\u2713 All components follow proper icon usage patterns!${RESET}`);
      return;
    }

    console.log(`${RED}${BOLD}\u2717 Found ${this.violations.length} icon usage violation(s):${RESET}\n`);

    const byType = {};
    for (const v of this.violations) {
      if (!byType[v.type]) byType[v.type] = [];
      byType[v.type].push(v);
    }

    for (const [type, violations] of Object.entries(byType)) {
      const config = TYPE_CONFIG[type] || { label: type, icon: '\u26AA', description: '', fix: '' };

      console.log(`${config.icon} ${BOLD}${config.label}${RESET}`);
      console.log(`   ${config.description}\n`);

      const byFile = {};
      for (const v of violations) {
        if (!byFile[v.file]) byFile[v.file] = [];
        byFile[v.file].push(v);
      }

      for (const [file, fileViolations] of Object.entries(byFile)) {
        console.log(`   ${BLUE}${file}${RESET}`);
        for (const v of fileViolations) {
          console.log(`     ${RED}\u2717${RESET} Line ${v.line}: ${v.value}`);
        }
        console.log();
      }

      console.log(`   ${BOLD}How to fix:${RESET} ${config.fix}`);
      if (config.allowed) {
        console.log(`   ${GREEN}Allowed:${RESET} ${config.allowed}`);
      }
      console.log();
    }

    console.log(`${BOLD}Icon Usage Rules:${RESET}\n`);
    console.log(`  ${GREEN}\u2713 DO:${RESET}`);
    console.log(`    - Use <Icon name="..." /> from @/components/primitives/Icon`);
    console.log(`    - Register new icons in @/registry/icons.ts`);
    console.log(`    - Use ReactNode for icon props in composite interfaces`);
    console.log(`    - Use aria-label on icon-only buttons for accessibility\n`);
    console.log(`  ${RED}\u2717 DON'T:${RESET}`);
    console.log(`    - Import directly from lucide-react in components`);
    console.log(`    - Use LucideIcon type in component prop interfaces`);
    console.log(`    - Define inline <svg> elements in components`);
    console.log(`    - Import from @tabler/icons-react\n`);

    console.log(`${YELLOW}${BOLD}Need to add a new icon?${RESET}`);
    console.log(`   Add it to ${BLUE}@/registry/icons.ts${RESET} using iconRegistry.register()`);
    console.log(`   Then use it with ${GREEN}<Icon name="your-icon" />${RESET}\n`);
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
  } catch (e) {
    return process.cwd();
  }
}

function main() {
  const repoRoot = getRepoRoot();
  const validator = new IconUsageValidator(repoRoot);
  const isValid = validator.validateAll();
  validator.printViolations();
  process.exit(isValid ? 0 : 1);
}

main();
