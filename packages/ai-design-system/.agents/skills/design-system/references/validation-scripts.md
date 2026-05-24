# Validation Scripts

Complete guide to all validation scripts in the AI Design System.

## Overview

The design system has **9 validation scripts** that enforce governance rules automatically. They run:
- On every commit (via pre-commit hook)
- Before every build (via prebuild script)
- Manually when needed

## Master Validation Script

### run-all-validations.js

**Location**: `scripts/run-all-validations.js`

**Purpose**: Runs all 9 validations in sequence and reports results

**Usage**:
```bash
node scripts/run-all-validations.js
# or
pnpm run prebuild
```

**Output**:
```
🔍 Running all design system validations...

📋 Layer Import Validation...
   Checking that components follow proper layer import rules...
✓ All layer import rules are satisfied!

📚 Storybook Coverage Validation...
   Checking that all primitives and blocks have stories...
✓ All primitives and blocks have stories!

... (continues for all 9 validations)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All validations passed!

   ✓ Layer Import is correct
   ✓ Storybook Coverage is correct
   ✓ Design Token is correct
   ✓ Story Composition is correct
   ✓ Feature Story is correct
   ✓ Behavior Stories is correct
   ✓ Import Alias is correct
```

**Exit Codes**:
- `0` - All validations passed
- `1` - One or more validations failed

---

## Individual Validation Scripts

### 1. validate-layer-imports.js

**Purpose**: Enforces strict layer architecture rules

**What it checks**:
- Primitives only import from ui/
- AI-elements only import from ui/
- Composites only import from primitives/ or ai-elements/
- Blocks import from composites/ or primitives/ or ai-elements/
- Features only import from blocks/ or composites/
- No upward imports (lower layers importing higher layers)
- No circular dependencies

**Usage**:
```bash
node scripts/validations/validate-layer-imports.js
```

**Success Output**:
```
✓ All layer import rules are satisfied!
```

**Failure Output**:
```
✗ Found 2 layer import violation(s):

Layer: composites/
Rule: Composites ONLY import from primitives/ or ai-elements/

  ✗ components/composites/DataTable/DataTable.tsx:5
    Invalid import: @/components/ui/button

  ✗ components/composites/PromptInput/PromptInput.tsx:12
    Invalid import: ../../ui/input

Layer Architecture Rules:

  ✓ primitives/
    Allowed: components/ui
  ✓ ai-elements/
    Allowed: components/ui
  ✓ composites/
    Allowed: components/primitives, components/ai-elements
  ✓ blocks/
    Allowed: components/composites, components/primitives, components/ai-elements
  ✓ features/
    Allowed: components/blocks, components/composites
```

**How it works**:
1. Scans all `.tsx` and `.ts` files (excluding `.stories.` and `.test.`)
2. Extracts import statements using regex patterns
3. Determines which layer each file belongs to
4. Validates imports against layer rules
5. Reports violations with file path, line number, and import

**Common violations**:
- Composites importing from `components/ui/`
- Blocks importing from `features/`
- Features importing from `primitives/`
- Using relative paths instead of `@/` alias

---

### 2. validate-storybook-coverage.js

**Purpose**: Ensures all primitives and blocks have Storybook stories

**What it checks**:
- Every component in `primitives/` has a `.stories.tsx` file
- Every component in `blocks/` has a `.stories.tsx` file
- Story files follow naming convention: `{ComponentName}.stories.tsx`

**Usage**:
```bash
node scripts/validations/validate-storybook-coverage.js
```

**Success Output**:
```
✓ All primitives and blocks have stories!
```

**Failure Output**:
```
✗ Found 3 components without stories:

Primitives:
  ✗ components/primitives/IconButton/
    Missing: IconButton.stories.tsx

Blocks:
  ✗ components/blocks/ChatPanel/
    Missing: ChatPanel.stories.tsx
  ✗ components/blocks/EditorToolbar/
    Missing: EditorToolbar.stories.tsx

Storybook Coverage Rules:

  ✓ All primitives/ components must have .stories.tsx
  ✓ All blocks/ components must have .stories.tsx
  ✓ Story files must be named {ComponentName}.stories.tsx
```

**How it works**:
1. Scans `components/primitives/` and `components/blocks/` directories
2. For each component directory, checks for `.stories.tsx` file
3. Reports missing story files

**Why primitives and blocks?**
- Primitives are base components - need documentation
- Blocks are complex sections - need visual testing
- Composites and features are tested through integration
- AI-elements are specialized - stories optional

---

### 3. validate-design-tokens.js

**Purpose**: Prevents hardcoded CSS values, enforces design token usage

**What it checks**:
- No hardcoded colors: `#hex`, `rgb()`, `rgba()`, `hsl()`, `hsla()`
- No hardcoded spacing: `'16px'`, `'1rem'`, `'2em'`, `'10%'`
- No hardcoded values in `style` prop or `className`

**Allowed**:
- Tailwind classes: `bg-primary`, `p-4`, `text-lg`
- CSS variables: `var(--color-primary)`, `var(--spacing-4)`
- Relative units in specific contexts: `width: '100%'`, `height: 'auto'`

**Usage**:
```bash
node scripts/validations/validate-design-tokens.js
```

**Success Output**:
```
✓ All components use design tokens correctly!
```

**Failure Output**:
```
✗ Found 4 design token violation(s):

components/composites/DataTable/DataTable.tsx
  ✗ Line 45: Hardcoded color
    Found: style={{ color: "#3b82f6" }}
    Use:   className="text-primary" or var(--color-primary)

  ✗ Line 67: Hardcoded spacing
    Found: style={{ padding: "16px" }}
    Use:   className="p-4" or var(--spacing-4)

components/blocks/Toolbar/Toolbar.tsx
  ✗ Line 23: Hardcoded color in className
    Found: className="text-[#ef4444]"
    Use:   className="text-destructive"

Design Token Rules:

  ✗ FORBIDDEN:
    - Direct colors: #hex, rgb(), rgba(), hsl()
    - Direct spacing: '16px', '1rem', '2em'

  ✓ REQUIRED:
    - Tailwind classes: bg-primary, p-4
    - CSS variables: var(--color-primary)
```

**How it works**:
1. Scans all `.tsx` and `.ts` files
2. Searches for patterns matching hardcoded values
3. Checks `style` props and `className` attributes
4. Reports violations with suggestions

**Common violations**:
- `style={{ color: "#3b82f6" }}` → Use `className="text-primary"`
- `style={{ padding: "16px" }}` → Use `className="p-4"`
- `className="text-[#ef4444]"` → Use `className="text-destructive"`
- `backgroundColor: "rgb(59, 130, 246)"` → Use `var(--color-primary)`

---

### 4. validate-story-composition.js

**Purpose**: Ensures stories only render their own component

**What it checks**:
- Story files don't import other components from the design system
- Stories focus on demonstrating the component they're documenting
- No nested component composition in stories

**Usage**:
```bash
node scripts/validations/validate-story-composition.js
```

**Success Output**:
```
✓ All stories only render their own component!
```

**Failure Output**:
```
✗ Found 2 story composition violation(s):

components/primitives/Button/Button.stories.tsx
  ✗ Line 8: Importing other design system component
    Found: import { Icon } from "@/components/primitives/Icon"
    Stories should only demonstrate the Button component

Story Composition Rules:

  ✓ Stories should only render their own component
  ✓ Don't import other design system components in stories
  ✓ Use mock data and props instead of real components
```

**How it works**:
1. Scans all `.stories.tsx` files
2. Checks for imports from `@/components/`
3. Reports violations

**Why this rule?**
- Stories should be focused and simple
- Composition is tested in integration tests
- Stories are for documentation, not integration testing

---

### 5. validate-feature-stories.js

**Purpose**: Ensures features have proper state management stories and hooks

**What it checks**:
- Every feature has a `.stories.tsx` file
- Story file exports a `WithStateManagement` story
- Feature has a mock hook file: `useFeatureName.mock.ts`
- Feature has a hook contract: `useFeatureName.d.ts`

**Usage**:
```bash
node scripts/validations/validate-feature-stories.js
```

**Success Output**:
```
✓ All features have proper state management stories!
```

**Failure Output**:
```
✗ Found 2 feature story violation(s):

components/features/AIDocEditor/
  ✗ Missing WithStateManagement story export
    File: AIDocEditor.stories.tsx
    Add: export const WithStateManagement: Story = { ... }

components/features/RefinementPanel/
  ✗ Missing mock hook
    Expected: useRefinementPanel.mock.ts
  ✗ Missing hook contract
    Expected: useRefinementPanel.d.ts

Feature Story Rules:

  ✓ All features must have .stories.tsx
  ✓ Stories must export WithStateManagement
  ✓ Features must have useFeatureName.mock.ts
  ✓ Features must have useFeatureName.d.ts
```

**How it works**:
1. Scans `components/features/` directory
2. For each feature, checks for story file
3. Parses story file for `WithStateManagement` export
4. Checks for mock hook and contract files

**Why this rule?**
- Features are stateful and need state management examples
- Mock hooks enable Storybook testing without real backends
- Hook contracts define the feature's API

---

### 6. validate-behavior-stories.js

**Purpose**: Ensures features have behavior testing stories

**What it checks**:
- Features have stories that test behavior
- Behavior stories cover key user interactions
- Stories are set up for automated testing

**Usage**:
```bash
node scripts/validations/validate-behavior-stories.js
```

**Success Output**:
```
✓ All features have behavior testing stories!
```

**Failure Output**:
```
✗ Found 1 behavior story violation(s):

components/features/AIDocEditor/
  ✗ Missing behavior testing stories
    Add stories that test user interactions

Behavior Story Rules:

  ✓ Features should have behavior testing stories
  ✓ Stories should cover key user interactions
  ✓ Use @storybook/test for interaction testing
```

---

### 7. validate-feature-hook-pattern.js

**Purpose**: Enforces the feature hook/mock contract pattern

**What it checks**:
- No `hooks/` subfolder in feature directories
- `useFeatureName.d.ts`, `useFeatureName.mock.ts`, and `FeatureName.mocks.ts` naming
- `WithStateManagement` uses `render` and imports the mock hook
- Behavior stories use `args` + `fn()` and do not import the mock hook

**Usage**:
```bash
node scripts/validations/validate-feature-hook-pattern.js
```

---

### 8. validate-architectural-patterns.js

**Purpose**: Enforces architectural anti-pattern guardrails

**What it checks**:
- Forbidden workarounds and unsafe composition shortcuts
- Pattern violations that break layer governance

**Usage**:
```bash
node scripts/validations/validate-architectural-patterns.js
```

---

### 9. validate-import-aliases.js

**Purpose**: Enforces `@/` import alias usage, prevents relative paths

**What it checks**:
- No relative imports: `../../components/`, `../lib/`
- All project imports use `@/` alias
- Same-directory imports (`./Component`) are allowed
- Subdirectory imports (`./subdir/Component`) are allowed

**Usage**:
```bash
node scripts/validations/validate-import-aliases.js
```

**Success Output**:
```
✓ All imports use @/ alias correctly!
```

**Failure Output**:
```
✗ Found 3 import alias violation(s):

components/composites/DataTable/DataTable.tsx
  ✗ Line 5: Relative import
    Found: ../../primitives/Button
    Use:   @/components/primitives/Button

  ✗ Line 12: Relative import
    Found: ../../../lib/utils
    Use:   @/lib/utils

components/blocks/Toolbar/Toolbar.tsx
  ✗ Line 8: Relative import
    Found: ../../composites/ActionButton
    Use:   @/components/composites/ActionButton

Import Alias Rules:

  ✗ FORBIDDEN:
    - Relative imports: ../../components/
    - Relative imports: ../components/

  ✓ REQUIRED:
    - Alias imports: @/components/
    - Alias imports: @/lib/
    - Alias imports: @/types/

  ✓ ALLOWED:
    - Same directory: ./Component
    - Subdirectory: ./subdir/Component
```

**How it works**:
1. Scans all `.tsx` and `.ts` files
2. Extracts import statements
3. Checks for relative path patterns (`../../`, `../`)
4. Allows same-directory imports (`./`)
5. Reports violations with suggestions

**Why this rule?**
- `@/` imports are absolute and refactor-safe
- Relative imports break when files move
- Consistent import style improves readability
- TypeScript path mapping enables better IDE support

---

## Running Validations

### During Development

```bash
# Run all validations
node scripts/run-all-validations.js

# Run specific validation
node scripts/validations/validate-layer-imports.js
node scripts/validations/validate-storybook-coverage.js
node scripts/validations/validate-design-tokens.js
```

### Automatic Execution

**Pre-commit hook** (runs on `git commit`):
```bash
# Installed via
bash scripts/setup-hooks.sh

# Located at
.git/hooks/pre-commit
```

**Pre-build script** (runs on `pnpm build`):
```json
{
  "scripts": {
    "prebuild": "node scripts/run-all-validations.js",
    "build": "pnpm tokens:build && pnpm prebuild && next build"
  }
}
```

### Bypassing Validations

**NOT RECOMMENDED** - Only use in emergencies:

```bash
# Skip pre-commit hook
git commit --no-verify

# Skip build validation
SKIP_VALIDATION=1 pnpm build
```

Always fix violations immediately after bypassing.

## Exit Codes

All validation scripts follow standard exit codes:
- `0` - All checks passed
- `1` - One or more violations found

This enables CI/CD integration:
```bash
# CI script
node scripts/run-all-validations.js || exit 1
```

## Adding New Validations

To add a new validation script:

1. **Create script** in `scripts/` directory
2. **Follow naming convention**: `validate-{feature}.js`
3. **Implement validation logic**
4. **Use consistent output format**:
   - Success: `✓ {Feature} validation passed!`
   - Failure: `✗ Found {count} {feature} violation(s):`
5. **Return proper exit codes**: 0 for success, 1 for failure
6. **Add to master script**: Edit `run-all-validations.js`
7. **Add to pre-commit hook**: Edit `scripts/hooks/pre-commit`
8. **Update documentation**: Update this file and README.md

## Troubleshooting

### "Python not found"
```bash
# Install Python 3
brew install python3  # macOS
# or
apt-get install python3  # Linux

# Verify
python3 --version
```

### "Node not found"
```bash
# Install Node.js
brew install node  # macOS
# or
apt-get install nodejs  # Linux

# Verify
node --version
```

### "Hook not running"
```bash
# Make hook executable
chmod +x .git/hooks/pre-commit

# Verify hook exists
ls -la .git/hooks/pre-commit

# Reinstall hooks
bash scripts/setup-hooks.sh
```

### "Validation fails but I don't see violations"
```bash
# Run with verbose output
node scripts/validations/validate-layer-imports.js 2>&1 | tee validation.log

# Check for hidden characters
cat -A components/path/to/file.tsx
```

## Best Practices

1. **Run validations before committing** - Catch issues early
2. **Fix violations immediately** - Don't accumulate technical debt
3. **Understand the rules** - Know why validations exist
4. **Don't bypass hooks** - They're there to help
5. **Add validations for new rules** - Keep governance automated
6. **Keep scripts fast** - Validations should complete in seconds
7. **Provide clear error messages** - Help developers fix issues

## Performance

Validation performance on typical project:
- Layer imports: ~500ms
- Storybook coverage: ~200ms
- Design tokens: ~300ms
- Story composition: ~150ms
- Feature stories: ~200ms
- Behavior stories: ~150ms
- Import aliases: ~400ms

**Total**: ~2 seconds for all validations

## Conclusion

Validation scripts are the enforcement mechanism for design system governance. They:
- Prevent architectural drift
- Catch violations early
- Provide clear feedback
- Enable confident refactoring
- Maintain consistency

Always run validations before committing!
