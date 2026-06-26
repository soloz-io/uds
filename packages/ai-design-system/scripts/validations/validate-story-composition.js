#!/usr/bin/env node

/**
 * Story Composition Validation Script
 *
 * Enforces that all story files only render their own component,
 * not manually compose child components from other layers.
 *
 * Rules:
 * - Stories should only render the component they're documenting
 * - Stories should NOT import and render components from other layers
 * - Stories should pass props to the component, not build it from parts
 *
 * This ensures:
 * - Components remain encapsulated
 * - Stories reflect actual usage patterns
 * - Internal composition changes don't break stories
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

const COMPONENTS_DIR = path.join(__dirname, '../../components');

// Layers to validate — only features need this check.
// Primitives, composites, blocks, and ai-elements are allowed to use other components in their stories.
const LAYERS = ['features'];

/**
 * Get all story files in a directory recursively
 */
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

/**
 * Get the component name from a story file path
 * e.g., /path/to/Button/Button.stories.tsx -> Button
 */
function getComponentName(storyFilePath) {
  const dir = path.dirname(storyFilePath);
  return path.basename(dir);
}

function getStoryBlocks(content) {
  return [...content.matchAll(/export\s+const\s+(\w+)[\s\S]*?(?=\nexport\s+const|\s*$)/g)].map(match => ({
    storyName: match[1],
    block: match[0],
  }));
}

/**
 * Resolve a relative import path to an absolute filesystem path.
 * Returns null for non-relative imports (bare specifiers, @/ aliases).
 */
function resolveRelativeImport(importPath, storyFilePath) {
  if (!importPath.startsWith('.')) return null;
  const storyDir = path.dirname(storyFilePath);
  return path.resolve(storyDir, importPath);
}

/**
 * Given a resolved absolute path, check if it falls under the components/
 * directory and extract the layer name and component name.
 * Returns { layer, componentName } or null.
 */
function identifyComponentImport(resolvedPath, storyFilePath) {
  const componentsDir = COMPONENTS_DIR;
  const relative = path.relative(componentsDir, resolvedPath);
  if (!relative || relative.startsWith('..')) return null;

  const parts = relative.split(path.sep);
  // Must be at least 2 levels deep: layer/ComponentName
  if (parts.length < 2) return null;

  const layer = parts[0];
  const componentName = parts[1];

  const knownLayers = ['primitives', 'ai-elements', 'composites', 'blocks', 'features'];
  if (!knownLayers.includes(layer)) return null;

  return { layer, componentName };
}

/**
 * Extract all import declarations from file content.
 * Returns array of { importedName, sourcePath, resolvedPath } objects.
 */
function extractImports(content, storyFilePath) {
  const imports = [];

  // Named/default imports: import X from "path" or import { X } from "path"
  const importRegex = /import\s+(?:\{[^}]*\}|\w+(?:\s*,\s*\{[^}]*\})?)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const sourcePath = match[1];
    const resolvedPath = sourcePath.startsWith('@/components/')
      ? path.join(COMPONENTS_DIR, sourcePath.replace('@/components/', ''))
      : resolveRelativeImport(sourcePath, storyFilePath);

    // Extract imported names for named imports
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

/**
 * Check if a story file manually composes child components
 */
function checkStoryComposition(storyFilePath) {
  const content = fs.readFileSync(storyFilePath, 'utf-8');
  const componentName = getComponentName(storyFilePath);
  const violations = [];

  // Extract and resolve all imports
  const imports = extractImports(content, storyFilePath);


  for (const imp of imports) {
    if (!imp.resolvedPath) continue;

    const identified = identifyComponentImport(imp.resolvedPath, storyFilePath);
    if (!identified) continue;

    // Skip if it's importing the component itself (same name)
    if (identified.componentName === componentName) {
      continue;
    }

    // Skip if the resolved path IS the story file itself (circular self-ref)
    if (imp.resolvedPath === storyFilePath) {
      continue;
    }

    // Allow cross-feature imports — only block composites, primitives, blocks, ai-elements
    if (identified.layer === 'features') continue;

    // Check if this component is actually used in JSX (not just imported for types)
    const jsxUsageRegex = new RegExp(`<${imp.importedName}[\\s/>]`, 'g');
    if (jsxUsageRegex.test(content)) {
      violations.push({
        type: 'forbidden-layer-import',
        component: imp.importedName,
        layer: identified.layer,
        source: imp.sourcePath,
      });
    }
  }

  const relativePath = path.relative(process.cwd(), storyFilePath);
  const isBehaviorStory = storyFilePath.endsWith('.behaviors.stories.tsx');

  if (!isBehaviorStory) {
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

/**
 * Validate all story files
 */
function validate() {
  console.log(`${colors.blue}${colors.bold}📖 Validating story composition...${colors.reset}\n`);

  const allViolations = [];

  for (const layer of LAYERS) {
    const layerDir = path.join(COMPONENTS_DIR, layer);
    const storyFiles = getStoryFiles(layerDir);

    for (const storyFile of storyFiles) {
      const violations = checkStoryComposition(storyFile);

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

  // Report results
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
          console.log(`      ${colors.red}✗${colors.reset} Imports <${v.component}> from ${v.layer}/ — not allowed in feature stories (import: ${v.source})`);
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

    console.log(`${colors.yellow}${colors.bold}Story Composition Rules:${colors.reset}\n`);

    console.log(`  ${colors.green}✓ ALLOWED imports in features stories:${colors.reset}`);
    console.log(`    - Other features components (e.g. import { WorkflowBuilder } from '../WorkflowBuilder/WorkflowBuilder')`);
    console.log(`    - The component's own mocks, hooks, and supporting files`);
    console.log(`    - React, Storybook types, and external libraries\n`);

    console.log(`  ${colors.red}✗ FORBIDDEN imports in features stories:${colors.reset}`);
    console.log(`    - composites/  (e.g. ProjectSwitcher)`);
    console.log(`    - primitives/  (e.g. Button, Icon)`);
    console.log(`    - blocks/`);
    console.log(`    - ai-elements/\n`);

    console.log(`  ${colors.red}${colors.bold}Why:${colors.reset}`);
    console.log(`    Feature stories should only render the feature's own component and pass`);
    console.log(`    data via props. Lower-layer components (composites, primitives, etc.)`);
    console.log(`    should be composed inside the feature component, not in the story.\n`);

    console.log(`${colors.yellow}Example - WRONG:${colors.reset}`);
    console.log(`  ${colors.red}// ❌ Importing composites/primitives directly in story${colors.reset}`);
    console.log(`  import { ProjectSwitcher } from '@/components/composites/ProjectSwitcher'`);
    console.log(`  import { Button } from '@/components/primitives/Button'`);
    console.log(`  import { AppSidebar } from '@/components/blocks/AppSidebar'`);
    console.log(`  `);
    console.log(`  export const Default: Story = {`);
    console.log(`    render: () => (`);
    console.log(`      <PageLayout>`);
    console.log(`        <ProjectSwitcher {...switcherProps} />`);
    console.log(`        <Button>Click</Button>`);
    console.log(`      </PageLayout>`);
    console.log(`    )`);
    console.log(`  }\n`);

    console.log(`${colors.yellow}Example - ALLOWED (cross-feature import):${colors.reset}`);
    console.log(`  ${colors.green}// ✓ Cross-feature imports are fine${colors.reset}`);
    console.log(`  import { WorkflowBuilder } from '../WorkflowBuilder/WorkflowBuilder'`);
    console.log(`  import { PageLayout } from './PageLayout'`);
    console.log(`  import { mockSidebarConfig } from './PageLayout.mocks'`);
    console.log(`  `);
    console.log(`  export const Default: Story = {`);
    console.log(`    args: {`);
    console.log(`      sidebar: mockSidebarConfig,`);
    console.log(`    }`);
    console.log(`  }\n`);

    console.log(`${colors.yellow}See: .claude/skills/design-system/scripts/VALIDATION.md${colors.reset}\n`);

    return false;
  }
}

// Run validation
const success = validate();
process.exit(success ? 0 : 1);
