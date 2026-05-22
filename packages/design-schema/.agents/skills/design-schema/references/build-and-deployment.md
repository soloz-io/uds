# Build & Deployment

## Repository

- **Repo**: `soloz-io/design-schema` (GitHub)
- **npm package**: `design-schema`
- **Registry**: `https://registry.npmjs.org`
- **Secret required**: `NPM_TOKEN` (stored in GitHub repository secrets)

## Local Build

```bash
cd design-schema

# Install dependencies (use --legacy-peer-deps due to peer dep constraints)
npm install --legacy-peer-deps

# Type check
npm run typecheck

# Lint
npm run lint

# Build (outputs to dist/)
npm run build

# Watch mode for development
npm run dev
```

## Build Output

Vite builds multiple CJS + ESM entry points to `dist/`:

| Entry | ESM | CJS | Description |
|-------|-----|-----|-------------|
| `index` | `dist/index.js` | `dist/index.cjs` | Root barrel |
| `renderer` | `dist/renderer.js` | `dist/renderer.cjs` | Renderer re-export |
| `presets/dashboard` | `dist/presets/dashboard.js` | `dist/presets/dashboard.cjs` | Dashboard preset |
| `presets/form` | `dist/presets/form.js` | `dist/presets/form.cjs` | Form preset |
| `presets/workflow` | `dist/presets/workflow.js` | `dist/presets/workflow.cjs` | Workflow preset |
| `presets/full` | `dist/presets/full.js` | `dist/presets/full.cjs` | Full preset |
| `schemas/*` | `dist/schemas/*.js` | `dist/schemas/*.cjs` | Zod schemas |
| `prompts` | `dist/prompts.js` | `dist/prompts.cjs` | Prompt helpers |
| `adapters/jotai` | `dist/adapters/jotai.js` | `dist/adapters/jotai.cjs` | Jotai adapter |
| `adapters/drizzle` | `dist/adapters/drizzle.js` | `dist/adapters/drizzle.cjs` | Drizzle adapter |

All entries are covered by the wildcard export `"./*"` in `package.json`.

## CI/CD Pipeline

The GitHub Actions workflow in `.github/workflows/ci.yml` runs on every push to `main` and on PRs:

### `validate-and-test` job (runs on all pushes + PRs)
1. Checkout code
2. Setup Node.js 22
3. `npm install --legacy-peer-deps`
4. `npm run typecheck`
5. `npm run lint`
6. `npm run build`

### `publish` job (runs only on push to `main`, after `validate-and-test` passes)
1. Checkout code
2. Setup Node.js 22 with `registry-url: https://registry.npmjs.org`
3. `npm install --legacy-peer-deps`
4. `npm run build`
5. **Version check**: compares `package.json` version vs latest on npm — only publishes if different
6. `npm publish --access public` (uses `NPM_TOKEN` secret)

## Publishing a New Version

### Step 1 — Bump the version locally

```bash
cd design-schema

# Patch bump (bug fix): 0.1.0 → 0.1.1
npm version patch --no-git-tag-version

# Minor bump (new feature): 0.1.0 → 0.2.0
npm version minor --no-git-tag-version

# Major bump (breaking change): 0.1.0 → 1.0.0
npm version major --no-git-tag-version
```

The `--no-git-tag-version` flag updates `package.json` without creating a git tag.

### Step 2 — Commit and push to main

```bash
git add package.json package-lock.json
git commit -m "chore: bump version to X.Y.Z"
git push origin main
```

### Step 3 — CI publishes automatically

The CI pipeline detects the version difference and publishes to npm. Monitor at:
`https://github.com/soloz-io/design-schema/actions`

## Consuming the Package (ai-design-system)

```bash
cd ai-design-system

# Update to latest
pnpm update design-schema

# Install specific version
pnpm add -D design-schema@^0.1.1
```

> ⚠️ Always use `pnpm` in `ai-design-system` — the project uses pnpm workspaces.
> `npm install` will fail due to pnpm symlink structure.

## Peer Dependencies

`design-schema` declares these as **peerDependencies** (not regular deps):
- `@json-render/core >= 0.19`
- `@json-render/react >= 0.19`
- `@json-render/shadcn >= 0.19`
- `ai-design-system: *`
- `react: ^18 || ^19`
- `zod: ^3`

Consumers do **not** need to install `@json-render/*` separately — `Renderer` is re-exported from `design-schema/renderer`.

## Pre-commit Hooks

The repo uses Husky + lint-staged. On commit:
- `eslint --fix` runs on all `src/**/*.{ts,tsx}` staged files
- This catches unused variables and import issues before CI

If pre-commit lint fails locally:
```bash
npm run lint        # see all errors
npm run lint -- --fix  # auto-fix what's possible
```
