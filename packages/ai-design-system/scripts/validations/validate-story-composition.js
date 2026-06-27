#!/usr/bin/env node

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

const COMPONENTS_DIR = path.join(__dirname, '../../components');

const KNOWN_LAYERS = ['primitives', 'ai-elements', 'composites', 'blocks', 'features'];

const LAYERS = KNOWN_LAYERS;

const LAYER_IMPORT_RULES = {
  'primitives': {
    allowedSources: [],
  },
  'ai-elements': {
    allowedSources: [],
  },
  'composites': {
    allowedSources: [],
  },
  'blocks': {
    allowedSources: [],
  },
  'features': {
    allowedSources: ['features'],
  },
};

function getStoryFiles(dir) {
  const storyFiles = [];

  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) {
      return;
    }

    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        traverse(itemPath);
      } else if (item.endsWith('.stories.tsx')) {
        storyFiles.push(itemPath);
      }
    }
  }

  traverse(dir);
  return storyFiles;
}

function getComponentName(storyFilePath) {
  const dir = path.dirname(storyFilePath);
  const dirName = path.basename(dir);
  if (KNOWN_LAYERS.includes(dirName)) {
    const storyFileName = path.basename(storyFilePath);
    return storyFileName.replace(/\.stories\.tsx$/, '');
  }
  return dirName;
}

function getStoryBlocks(content) {
  return [...content.matchAll(/export\s+const\s+(\w+)[\s\S]*?(?=\nexport\s+const|\s*$)/g)].map(match => ({
    storyName: match[1],
    block: match[0],
  }));
}

function resolveRelativeImport(importPath, storyFilePath) {
  if (!importPath.startsWith('.')) return null;
  const storyDir = path.dirname(storyFilePath);
  return path.resolve(storyDir, importPath);
}

function identifyComponentImport(resolvedPath, storyFilePath) {
  const componentsDir = COMPONENTS_DIR;
  const relative = path.relative(componentsDir, resolvedPath);
  if (!relative || relative.startsWith('..')) return null;

  const parts = relative.split(path.sep);
  if (parts.length < 2) return null;

  const layer = parts[0];
  const componentName = parts[1];

  if (!KNOWN_LAYERS.includes(layer)) return null;

  return { layer, componentName };
}

function extractImports(content, storyFilePath) {
  const imports = [];

  const importRegex = /import\s+(?:\{[^}]*\}|\w+(?:\s*,\s*\{[^}]*\})?)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const sourcePath = match[1];
    const resolvedPath = sourcePath.startsWith('@/components/')
      ? path.join(COMPONENTS_DIR, sourcePath.replace('@/components/', ''))
      : resolveRelativeImport(sourcePath, storyFilePath);

    const importClause = match[0];
    const namedMatch = importClause.match(/import\s+\{([^}]*)\}\s+from/);
    const defaultMatch = importClause.match(/import\s+(\w+)\s+from/);

    if (namedMatch) {
      const names = namedMatch[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
      for (const name of names) {
        imports.push({ importedName: name, sourcePath, resolvedPath });
      }
    } else if (defaultMatch) {
      imports.push({ importedName: defaultMatch[1].trim(), sourcePath, resolvedPath });
    }
  }

  return imports;
}

function checkStoryComposition(storyFilePath, storyLayer) {
  const content = fs.readFileSync(storyFilePath, 'utf-8');
  const componentName = getComponentName(storyFilePath);
  const violations = [];

  const imports = extractImports(content, storyFilePath);

  const rules = LAYER_IMPORT_RULES[storyLayer];
  const allowedSources = rules?.allowedSources ?? [];

  for (const imp of imports) {
    if (!imp.resolvedPath) continue;

    const identified = identifyComponentImport(imp.resolvedPath, storyFilePath);
    if (!identified) continue;

    if (identified.componentName === componentName) {
      continue;
    }

    if (imp.resolvedPath === storyFilePath) {
      continue;
    }

    const isTypeOnly = !new RegExp(`<${imp.importedName}[\\s/>]`, 'g').test(content);
    if (isTypeOnly) {
      continue;
    }

    const isAllowed = allowedSources.includes(identified.layer);
    if (!isAllowed) {
      violations.push({
        type: 'forbidden-layer-import',
        component: imp.importedName,
        fromLayer: identified.layer,
        fromComponent: identified.componentName,
        storyLayer,
        source: imp.sourcePath,
        suggestion: `Stories must only import the component being documented — no other design system components`,
      });
    }
  }

  const relativePath = path.relative(process.cwd(), storyFilePath);
  const isBehaviorStory = storyFilePath.endsWith('.behaviors.stories.tsx');

  if (!isBehaviorStory && storyLayer === 'features') {
    const storyBlocks = getStoryBlocks(content);

    for (const { storyName, block } of storyBlocks) {
      if (!block.includes('render:')) {
        continue;
      }

      if (/<div[\s>]/.test(block)) {
        violations.push({
          type: 'raw-div-wrapper',
          storyName,
          file: relativePath,
        });
      }

      if (/\bif\s*\(/.test(block)) {
        violations.push({
          type: 'inline-if',
          storyName,
          file: relativePath,
        });
      }
    }
  }

  return violations;
}

function validate() {
  console.log(`${colors.blue}${colors.bold}📖 Validating story composition...${colors.reset}\n`);

  const allViolations = [];

  for (const layer of LAYERS) {
    const layerDir = path.join(COMPONENTS_DIR, layer);
    const storyFiles = getStoryFiles(layerDir);

    for (const storyFile of storyFiles) {
      const violations = checkStoryComposition(storyFile, layer);

      if (violations.length > 0) {
        const relativePath = path.relative(process.cwd(), storyFile);
        const componentName = getComponentName(storyFile);

        allViolations.push({
          file: relativePath,
          component: componentName,
          layer: layer,
          violations: violations,
        });
      }
    }
  }

  if (allViolations.length === 0) {
    console.log(`${colors.green}✅ All stories follow proper composition patterns${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}${colors.bold}❌ Story composition validation failed${colors.reset}\n`);
    console.log(`${colors.red}Found ${allViolations.length} story file(s) with composition violations:${colors.reset}\n`);

    for (const violation of allViolations) {
      console.log(`  ${colors.bold}${violation.file}${colors.reset}`);
      console.log(`    Component: ${violation.component}`);
      console.log(`    Layer: ${violation.layer}/`);
      console.log(`    ${colors.red}Violations:${colors.reset}`);

      for (const v of violation.violations) {
        if (v.type === 'forbidden-layer-import') {
          console.log(`      ${colors.red}✗${colors.reset} Renders <${v.component}> (from ${v.fromLayer}/${v.fromComponent}) — stories must only import the component being documented (import: ${v.source})`);
        }

        if (v.type === 'raw-div-wrapper') {
          console.log(`      ${colors.red}✗${colors.reset} ${v.storyName}: Uses raw <div> in render story — stories must render the documented component directly`);
        }

        if (v.type === 'inline-if') {
          console.log(`      ${colors.red}✗${colors.reset} ${v.storyName}: Uses inline if-condition in render story — move conditional logic into the component or hook`);
        }
      }
      console.log();
    }

    console.log(`${colors.yellow}${colors.bold}Layer Import Rules for Stories:${colors.reset}\n`);

    console.log(`  ${colors.green}✓ ALLOWED imports per layer:${colors.reset}`);
    for (const [layer, rules] of Object.entries(LAYER_IMPORT_RULES)) {
      if (rules.allowedSources.length > 0) {
        console.log(`    ${layer}/: may render components from ${rules.allowedSources.join(', ')}`);
      } else {
        console.log(`    ${layer}/: may NOT render components from any design system layer`);
      }
    }
    console.log();

    console.log(`  ${colors.green}✓ Always allowed:${colors.reset}`);
    console.log(`    - The component being documented (same name as story file)`);
    console.log(`    - Type-only imports (not used in JSX)`);
    console.log(`    - React, Storybook types, external libraries\n`);

    console.log(`${colors.red}${colors.bold}Why:${colors.reset}`);
    console.log(`    Stories should only render the component they're documenting and pass`);
    console.log(`    data via props. Lower-layer components should be composed inside the`);
    console.log(`    component itself, not in the story.\n`);

    console.log(`${colors.yellow}See: .claude/skills/design-system/scripts/VALIDATION.md${colors.reset}\n`);

    return false;
  }
}

const success = validate();
process.exit(success ? 0 : 1);
