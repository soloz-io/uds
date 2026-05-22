import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['components/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next', 'ui-schema-contracts'],
  treeshake: true,
  minify: false,
});
