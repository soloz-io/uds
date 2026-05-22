#!/usr/bin/env node
/**
 * Build dist/index.css
 * Produces a self-contained consumer stylesheet by running Tailwind v4
 * against design-system source paths and generated token globals.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const globalsCss = readFileSync(join(root, 'app/globals.css'), 'utf8');
const componentCss = readFileSync(
  join(root, 'components/composites/DocumentEditor/DocumentEditor.css'),
  'utf8'
);

mkdirSync(join(root, 'dist'), { recursive: true });

const entryCss = [
  '@source "../components";',
  '@source "../lib";',
  '@source "../hooks";',
  globalsCss,
  componentCss,
].join('\n\n');

const result = await postcss([tailwindcss()]).process(entryCss, {
  from: join(root, 'app/_build-index.css'),
});

writeFileSync(join(root, 'dist/index.css'), result.css, 'utf8');

console.log('✅ dist/index.css built successfully');
