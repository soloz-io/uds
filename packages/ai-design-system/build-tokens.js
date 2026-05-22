#!/usr/bin/env node
import StyleDictionary from 'style-dictionary';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Custom formatter that directly outputs values
StyleDictionary.registerFormat({
  name: 'css/custom-variables',
  format: ({ dictionary, options }) => {
    const selector = options.selector || ':root';
    const tokens = dictionary.allTokens;

    let output = `/**\n * Do not edit directly, this file was auto-generated.\n */\n\n${selector} {\n`;

    tokens.forEach(token => {
      const name = `--${token.path.join('-')}`;
      let value = token.$value || token.value;

      // Resolve references manually
      if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        const refPath = value.slice(1, -1).split('.');
        const refToken = tokens.find(t => t.path.join('.') === refPath.join('.'));
        if (refToken) {
          value = refToken.$value || refToken.value;
        }
      }

      // Apply calc() wrapper for spacing calculations
      if (token.$type === 'dimension' && typeof value === 'string') {
        // Check if this is a radius calculation
        if (token.path.includes('radius') && (value.includes(' + ') || value.includes(' - '))) {
          // For referenced values like "{spacing.radius.base} - 4px"
          // First resolve the reference
          if (value.includes('{')) {
            const match = value.match(/\{([^}]+)\}/);
            if (match) {
              const refPath = match[1].split('.');
              const refToken = tokens.find(t => t.path.join('.') === refPath.join('.'));
              if (refToken) {
                const refValue = refToken.$value || refToken.value;
                value = value.replace(match[0], refValue);
              }
            }
          }
          value = `calc(${value})`;
        }
      }

      output += `  ${name}: ${value};\n`;
    });

    output += '}\n';
    return output;
  }
});

// Build light theme tokens
const lightSD = new StyleDictionary({
  source: [
    'tokens/color/base.json',
    'tokens/color/light.json',
    'tokens/spacing.json'
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'app/',
      files: [{
        destination: '_generated-tokens.css',
        format: 'css/custom-variables'
      }]
    }
  }
});

// Build dark-neutral theme tokens (dark base + neutral accents)
const darkNeutralSD = new StyleDictionary({
  source: [
    'tokens/color/base.json',
    'tokens/color/dark.json',
    'tokens/color/neutral.json',
    'tokens/spacing.json'
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'app/',
      files: [{
        destination: '_generated-tokens.dark-neutral.css',
        format: 'css/custom-variables',
        options: {
          selector: '.dark-neutral'
        }
      }]
    }
  }
});

// Build dark-green theme tokens (dark base + green accents)
const darkGreenSD = new StyleDictionary({
  source: [
    'tokens/color/base.json',
    'tokens/color/dark.json',
    'tokens/color/green.json',
    'tokens/spacing.json'
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'app/',
      files: [{
        destination: '_generated-tokens.dark-green.css',
        format: 'css/custom-variables',
        options: {
          selector: '.dark-green'
        }
      }]
    }
  }
});

// Build dark-violet theme tokens (dark base + violet accents)
const darkVioletSD = new StyleDictionary({
  source: [
    'tokens/color/base.json',
    'tokens/color/dark.json',
    'tokens/color/violet.json',
    'tokens/spacing.json'
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'app/',
      files: [{
        destination: '_generated-tokens.dark-violet.css',
        format: 'css/custom-variables',
        options: {
          selector: '.dark-violet'
        }
      }]
    }
  }
});

console.log('Building light theme tokens...');
await lightSD.buildAllPlatforms();

console.log('Building dark-neutral theme tokens...');
await darkNeutralSD.buildAllPlatforms();

console.log('Building dark-green theme tokens...');
await darkGreenSD.buildAllPlatforms();

console.log('Building dark-violet theme tokens...');
await darkVioletSD.buildAllPlatforms();

// Generate semantic alias mapping once from token build layer.
const semanticAliasesTemplatePath = join(__dirname, 'scripts/templates/semantic-aliases.css.template');
const semanticAliases = readFileSync(semanticAliasesTemplatePath, 'utf8');

writeFileSync(join(__dirname, 'app/_generated-semantic-aliases.css'), semanticAliases, 'utf8');
console.log('Generated semantic alias CSS...');

// Generate the global Tailwind entrypoint so there is no manual inline theme bridge.
const globalsTemplatePath = join(__dirname, 'scripts/templates/globals.css.template');
const globalsCss = readFileSync(globalsTemplatePath, 'utf8');

writeFileSync(join(__dirname, 'app/globals.css'), globalsCss, 'utf8');
console.log('Generated globals CSS entrypoint...');

console.log('✅ Token build complete!');
