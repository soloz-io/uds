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

const LAYERS_REQUIRED = ['primitives', 'composites'];

const LAYERS_FORBIDDEN = ['ai-elements'];

function shouldSkipValidation() {
  return process.env.SKIP_STORYBOOK_VALIDATION === '1';
}

function getComponentDirectories(layerPath) {
  if (!fs.existsSync(layerPath)) {
    return [];
  }

  return fs.readdirSync(layerPath)
    .map(item => path.join(layerPath, item))
    .filter(itemPath => {
      const stat = fs.statSync(itemPath);
      return stat.isDirectory();
    });
}

function hasComponentFile(componentDir) {
  const files = fs.readdirSync(componentDir);
  return files.some(file => {
    return file.endsWith('.tsx') && !file.endsWith('.stories.tsx') && !file.endsWith('.test.tsx');
  });
}

function hasStoriesFile(componentDir) {
  const files = fs.readdirSync(componentDir);
  return files.some(file => file.endsWith('.stories.tsx'));
}

function getComponentName(componentDir) {
  return path.basename(componentDir);
}

function validateLayerRequired(layerName) {
  const layerPath = path.join(COMPONENTS_DIR, layerName);
  const componentDirs = getComponentDirectories(layerPath);

  const missing = [];

  for (const componentDir of componentDirs) {
    const componentName = getComponentName(componentDir);

    if (!hasComponentFile(componentDir)) {
      continue;
    }

    if (!hasStoriesFile(componentDir)) {
      const relativePath = path.relative(process.cwd(), componentDir);
      missing.push({
        component: componentName,
        layer: layerName,
        path: relativePath,
        expectedStory: `${componentName}.stories.tsx`,
      });
    }
  }

  return missing;
}

function getFlatTsxFiles(layerPath) {
  if (!fs.existsSync(layerPath)) {
    return [];
  }

  return fs.readdirSync(layerPath)
    .filter(item => item.endsWith('.tsx') && !item.endsWith('.stories.tsx') && !item.endsWith('.test.tsx'))
    .map(item => path.join(layerPath, item));
}

function validateLayerForbidden(layerName) {
  const layerPath = path.join(COMPONENTS_DIR, layerName);

  const forbidden = [];

  const componentDirs = getComponentDirectories(layerPath);

  for (const componentDir of componentDirs) {
    const componentName = getComponentName(componentDir);

    if (!hasComponentFile(componentDir)) {
      continue;
    }

    if (hasStoriesFile(componentDir)) {
      const relativePath = path.relative(process.cwd(), componentDir);
      forbidden.push({
        component: componentName,
        layer: layerName,
        path: relativePath,
        storiesFile: `${componentName}.stories.tsx`,
      });
    }
  }

  const flatComponentFiles = getFlatTsxFiles(layerPath);

  for (const filePath of flatComponentFiles) {
    const baseName = path.basename(filePath, '.tsx');
    const storiesFilePath = path.join(layerPath, `${baseName}.stories.tsx`);

    if (fs.existsSync(storiesFilePath)) {
      const relativePath = path.relative(process.cwd(), storiesFilePath);
      forbidden.push({
        component: baseName,
        layer: layerName,
        path: path.relative(process.cwd(), layerPath),
        storiesFile: `${baseName}.stories.tsx`,
      });
    }
  }

  return forbidden;
}

function validate() {
  console.log(`${colors.blue}${colors.bold}Validating Storybook coverage...${colors.reset}\n`);

  if (shouldSkipValidation()) {
    console.log(`${colors.yellow}⚠️  Validation skipped (SKIP_STORYBOOK_VALIDATION=1)${colors.reset}`);
    console.log(`${colors.yellow}   This should only be used in emergencies!${colors.reset}\n`);
    return true;
  }

  let allMissing = [];
  let allForbidden = [];

  for (const layer of LAYERS_REQUIRED) {
    const missing = validateLayerRequired(layer);
    allMissing = allMissing.concat(missing);
  }

  for (const layer of LAYERS_FORBIDDEN) {
    const forbidden = validateLayerForbidden(layer);
    allForbidden = allForbidden.concat(forbidden);
  }

  const hasErrors = allMissing.length > 0 || allForbidden.length > 0;

  if (!hasErrors) {
    console.log(`${colors.green}✅ Storybook coverage check passed${colors.reset}\n`);
    return true;
  }

  console.log(`${colors.red}${colors.bold}❌ Storybook coverage validation failed${colors.reset}\n`);

  if (allMissing.length > 0) {
    console.log(`${colors.red}Missing stories (required layers):${colors.reset}\n`);

    for (const item of allMissing) {
      console.log(`  ${colors.bold}${item.layer}/${item.component}${colors.reset}`);
      console.log(`    Component: ${item.path}/${item.component}.tsx`);
      console.log(`    Expected:  ${item.path}/${item.expectedStory}`);
      console.log(`    Status:    ${colors.red}MISSING${colors.reset}\n`);
    }

    console.log(`${colors.yellow}All components in ${LAYERS_REQUIRED.join(', ')} must have stories.${colors.reset}`);
    console.log(`${colors.yellow}Create the required stories to continue.${colors.reset}\n`);
  }

  if (allForbidden.length > 0) {
    console.log(`${colors.red}Forbidden stories (prohibited layers):${colors.reset}\n`);

    for (const item of allForbidden) {
      console.log(`  ${colors.bold}${item.layer}/${item.component}${colors.reset}`);
      console.log(`    Found:    ${item.path}/${item.storiesFile}`);
      console.log(`    Status:   ${colors.red}FORBIDDEN${colors.reset}\n`);
    }

    console.log(`${colors.yellow}Components in ${LAYERS_FORBIDDEN.join(', ')} must NOT have stories.${colors.reset}`);
    console.log(`${colors.yellow}Remove the forbidden story files to continue.${colors.reset}\n`);
  }

  return false;
}

const success = validate();
process.exit(success ? 0 : 1);
