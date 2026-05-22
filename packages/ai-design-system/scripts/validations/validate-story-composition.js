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

const COMPONENTS_DIR = path.join(__dirname, '../components');

// Layers to validate (only blocks and features need this check)
// Primitives and composites are allowed to use other components in their stories
const LAYERS = ['blocks', 'features'];

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
 * Check if a story file manually composes child components
 */
function checkStoryComposition(storyFilePath) {
  const content = fs.readFileSync(storyFilePath, 'utf-8');
  const componentName = getComponentName(storyFilePath);
  const violations = [];

  // Check for imports from any component layer
  const componentImportRegex = /@\/components\/(primitives|composites|blocks|features|ai-elements)\/(\w+)/g;
  const matches = [...content.matchAll(componentImportRegex)];

  for (const match of matches) {
    const layer = match[1];
    const importedComponent = match[2];

    // Skip if it's importing the component itself (same name)
    if (importedComponent === componentName) {
      continue;
    }

    // Check if this component is actually used in JSX (not just imported for types)
    const jsxUsageRegex = new RegExp(`<${importedComponent}[\\s/>]`, 'g');
    if (jsxUsageRegex.test(content)) {
      violations.push({
        type: 'manual-composition',
        component: importedComponent,
        layer: layer,
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
        if (v.type === 'manual-composition') {
          console.log(`      ${colors.red}✗${colors.reset} Manually renders <${v.component}> from ${v.layer}/`);
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
    console.log(`  ${colors.green}✓ DO:${colors.reset}`);
    console.log(`    - Only render the component being documented`);
    console.log(`    - Pass all configuration via props`);
    console.log(`    - Use mock data from .mocks.ts files\n`);

    console.log(`  ${colors.red}✗ DON'T:${colors.reset}`);
    console.log(`    - Import and render child components directly`);
    console.log(`    - Wrap render stories in raw <div> layout containers`);
    console.log(`    - Put inline if-condition logic in story render functions`);
    console.log(`    - Manually build up the component from its parts`);
    console.log(`    - Bypass the component's composition logic\n`);

    console.log(`${colors.yellow}Example - WRONG:${colors.reset}`);
    console.log(`  ${colors.red}// ❌ Don't manually compose child components${colors.reset}`);
    console.log(`  import { AppSidebar } from '@/components/blocks/AppSidebar'`);
    console.log(`  import { AppHeader } from '@/components/composites/AppHeader'`);
    console.log(`  `);
    console.log(`  export const Default: Story = {`);
    console.log(`    render: () => (`);
    console.log(`      <div>`);
    console.log(`        <AppSidebar {...sidebarProps} />`);
    console.log(`        <AppHeader {...headerProps} />`);
    console.log(`      </div>`);
    console.log(`    )`);
    console.log(`  }\n`);

    console.log(`${colors.yellow}Example - CORRECT:${colors.reset}`);
    console.log(`  ${colors.green}// ✓ Only render the component itself${colors.reset}`);
    console.log(`  import { PageLayout } from './PageLayout'`);
    console.log(`  import { mockSidebarConfig, mockHeaderConfig } from './PageLayout.mocks'`);
    console.log(`  `);
    console.log(`  export const Default: Story = {`);
    console.log(`    args: {`);
    console.log(`      sidebar: mockSidebarConfig,`);
    console.log(`      header: mockHeaderConfig,`);
    console.log(`      children: <div>Page content</div>,`);
    console.log(`    }`);
    console.log(`  }\n`);

    console.log(`${colors.yellow}See: .claude/skills/design-system/scripts/VALIDATION.md${colors.reset}\n`);

    return false;
  }
}

// Run validation
const success = validate();
process.exit(success ? 0 : 1);
