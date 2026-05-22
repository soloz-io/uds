# Design System Validation Scripts

This directory contains all validation scripts that enforce design system governance rules.

## Quick Reference

| Script | Purpose | Technology | When It Runs |
|--------|---------|------------|--------------|
| `validate-layer-imports.py` | Enforces layer architecture | Python 3 | Commit + Build |
| `validate-storybook-coverage.js` | Ensures primitives/blocks have stories | Node.js | Commit + Build |
| `validate-design-tokens.py` | Prevents direct CSS values | Python 3 | Commit + Build |
| `validate-feature-stories.js` | Ensures features have hooks | Node.js | Commit + Build |
| `run-all-validations.sh` | Runs all validations | Bash | Build (prebuild) |
| `setup-hooks.sh` | Installs git hooks | Bash | Install (prepare) |

## Validation Rules

### 1. Layer Architecture

**Strict import hierarchy:**
- `primitives/` → ONLY `ui/`
- `ai-elements/` → ONLY `ui/`
- `composites/` → ONLY `primitives/` or `ai-elements/`
- `blocks/` → ONLY `composites/` or `primitives/`
- `features/` → ONLY `blocks/` or `composites/`

**Key changes:**
- ✅ Sections CAN import primitives or blocks
- ❌ Features can NO LONGER import primitives or ai-elements directly

### 2. Storybook Coverage

**All primitives and blocks MUST have:**
- A `.stories.tsx` file
- Stories for all variants
- Light/dark theme examples

### 3. Design Tokens

**FORBIDDEN:**
- Direct colors: `#hex`, `rgb()`, `rgba()`, `hsl()`
- Direct spacing: `'16px'`, `'1rem'`, `'2em'`

**REQUIRED:**
- CSS variables: `var(--token-color-primary)`
- Tailwind classes: `bg-primary`, `p-4`

### 4. Feature Stories

**All features MUST have:**
- A `.stories.tsx` file
- A `WithStateManagement` story export
- A mock hook (`.mock.ts`)
- A hook contract (`hooks/useFeatureName.d.ts`)

## Running Validations

### Run All Validations
```bash
bash scripts/run-all-validations.sh
```

### Run Individual Validations
```bash
# Layer imports
python3 scripts/validate-layer-imports.py

# Storybook coverage
node scripts/validate-storybook-coverage.js

# Design tokens
python3 scripts/validate-design-tokens.py

# Feature stories
node scripts/validate-feature-stories.js
```

### Setup Git Hooks
```bash
bash scripts/setup-hooks.sh
```

## Automatic Execution

Validations run automatically at:

1. **Commit time** - via pre-commit hook (fast feedback)
2. **Build time** - via prebuild script (catches issues before deployment)

```json
{
  "scripts": {
    "build": "pnpm tokens:build && pnpm prebuild && next build",
    "prebuild": "bash scripts/run-all-validations.sh",
    "prepare": "bash scripts/setup-hooks.sh"
  }
}
```

## Bypassing Validations

**NOT RECOMMENDED** - Only use in emergencies:

```bash
# Skip commit hook
git commit --no-verify

# Skip build validation
SKIP_STORYBOOK_VALIDATION=1 pnpm build
```

## Exit Codes

All scripts follow standard exit codes:
- `0` - All validations passed
- `1` - One or more violations found

## Troubleshooting

### Python not found
```bash
# macOS
brew install python3

# Verify
python3 --version
```

### Node not found
```bash
# macOS
brew install node

# Verify
node --version
```

### Hook not running
```bash
# Make hook executable
chmod +x .git/hooks/pre-commit

# Verify hook exists
ls -la .git/hooks/pre-commit
```

## Documentation

Full documentation: `.claude/skills/design-system/scripts/VALIDATION.md`

## Adding New Validations

To add a new validation:

1. Create script in `scripts/` directory
2. Add to `run-all-validations.sh`
3. Add to `hooks/pre-commit`
4. Update this README
5. Update VALIDATION.md

Example template in `run-all-validations.sh`:
```bash
# ============================================================================
# Your New Validation
# ============================================================================
echo ""
echo "🎯 Validating your new rule..."
echo "   Checking that components follow your rule..."
python3 scripts/validate-your-rule.py || YOUR_EXIT=$?
```
