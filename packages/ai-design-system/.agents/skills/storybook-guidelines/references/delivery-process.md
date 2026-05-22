# Storybook Delivery Process

## Overview

Component development is **NOT complete** until the component has been tested and demonstrated in Storybook using Chrome DevTools MCP. This document defines the delivery process and acceptance criteria.

---

## Definition of Done

A component is considered **delivered and complete** when:

1. ✅ Component implementation exists
2. ✅ Storybook stories are written
3. ✅ Stories are tested in Chrome using MCP
4. ✅ Visual comparison with design is performed
5. ✅ All deviations are fixed
6. ✅ All validations pass

**Until all steps are complete, the task is NOT done.**

---

## Delivery Workflow

### Step 1: Component Implementation

**Actions:**
- Implement component following layer architecture
- Follow design token usage (no hardcoded values)
- Ensure accessibility compliance
- Add proper TypeScript types

**Validation:**
```bash
# Run layer import validation
node scripts/validate-layer-imports.js

# Run design token validation
node scripts/validate-design-tokens.js

# Run import alias validation
node scripts/validate-import-aliases.js
```

**Exit Criteria:**
- All validation scripts pass
- Component builds without errors
- TypeScript types are correct

---

### Step 2: Storybook Story Creation

**Actions:**
- Create `ComponentName.stories.tsx` file
- Write required stories (Default, variants, states)
- Add comprehensive JSDoc documentation
- Configure argTypes for interactive controls
- Add dark mode story

**Validation:**
```bash
# Run Storybook coverage validation
node scripts/validate-storybook-coverage.js
```

**Exit Criteria:**
- All required stories exist
- Documentation is comprehensive
- Coverage validation passes

---

### Step 3: Storybook Testing with Chrome MCP

**Purpose:** Test and demonstrate the component in a real browser environment using Chrome DevTools MCP.

#### 3.1 Start Storybook

```bash
pnpm storybook
```

Wait for Storybook to start (typically at `http://localhost:6006`).

#### 3.2 Open Chrome MCP

Use Chrome DevTools MCP to:
- Navigate to Storybook URL
- Take snapshots of component states
- Test interactions
- Verify responsive behavior
- Check accessibility

**MCP Commands:**
```typescript
// Navigate to Storybook
mcp_chrome_devtools_navigate_page({
  type: "url",
  url: "http://localhost:6006"
})

// Take snapshot of component
mcp_chrome_devtools_take_snapshot({
  verbose: false
})

// Take screenshot
mcp_chrome_devtools_take_screenshot({
  filePath: "screenshots/ComponentName-Default.png"
})

// Test interaction (e.g., click button)
mcp_chrome_devtools_click({
  uid: "button-uid-from-snapshot"
})

// Verify accessibility
mcp_chrome_devtools_lighthouse_audit({
  device: "desktop",
  mode: "snapshot"
})
```

#### 3.3 Test All Stories

For each story in the component:

1. **Navigate to story**
   - Use Storybook sidebar or direct URL
   - Example: `http://localhost:6006/?path=/story/primitives-button--default`

2. **Take snapshot**
   - Capture component structure
   - Verify elements are present
   - Check ARIA attributes

3. **Take screenshot AND VISUALLY INSPECT IT**
   - Save visual reference
   - **CRITICAL: Open and look at the screenshot file**
   - Verify component renders correctly
   - Check for broken layouts, missing elements, or visual glitches
   - Compare with design mockup
   - Document any deviations

4. **Verify functional rendering (for interactive components)**
   - For workflow/canvas components: Check edges/connections render with valid paths
   - For data visualizations: Verify charts/graphs display data correctly
   - For forms: Ensure all fields and controls are visible and positioned correctly
   - Use DOM inspection to verify critical elements have non-zero dimensions

5. **Test interactions**
   - Click buttons
   - Fill inputs
   - Toggle states
   - Verify behavior

6. **Test responsive behavior**
   - Resize viewport
   - Test mobile/tablet/desktop
   - Verify layout adapts correctly

7. **Test dark mode**
   - Switch theme using Storybook toolbar
   - Verify colors adapt correctly
   - Check contrast ratios

**Exit Criteria:**
- All stories are accessible in Storybook
- **Screenshots have been visually inspected and component renders correctly**
- All interactions work as expected
- No console errors
- Accessibility audit passes

---

### Step 4: Visual Comparison with Design

**Purpose:** Ensure the implemented component matches the original design specification.

#### 4.1 Prepare Design Reference

- Locate original design mockup/screenshot
- Identify key visual elements:
  - Colors
  - Spacing
  - Typography
  - Borders/shadows
  - States (hover, active, disabled)

#### 4.2 Compare Implementation

**Use Chrome MCP to capture screenshots:**

```typescript
// Capture each variant
mcp_chrome_devtools_take_screenshot({
  filePath: "screenshots/Button-Default.png"
})

mcp_chrome_devtools_take_screenshot({
  filePath: "screenshots/Button-Destructive.png"
})

mcp_chrome_devtools_take_screenshot({
  filePath: "screenshots/Button-Disabled.png"
})
```

**Compare side-by-side:**
- Design mockup (left)
- Storybook screenshot (right)

**Check for deviations:**
- ❌ Wrong colors
- ❌ Incorrect spacing
- ❌ Wrong font size/weight
- ❌ Missing states
- ❌ Incorrect borders/shadows
- ❌ Layout issues

#### 4.3 Document Deviations

Create a deviation report:

```markdown
## Component: Button
## Story: Destructive

### Deviations Found:
1. **Color mismatch**
   - Design: `#DC2626` (red-600)
   - Implementation: `#EF4444` (red-500)
   - Fix: Update to use `--color-destructive` token

2. **Spacing issue**
   - Design: 16px padding
   - Implementation: 12px padding
   - Fix: Update padding to `--spacing-4`

3. **Missing hover state**
   - Design: Shows darker red on hover
   - Implementation: No hover effect
   - Fix: Add hover:bg-destructive/90
```

**Exit Criteria:**
- All deviations are documented
- Root causes are identified
- Fix plan is clear

---

### Step 5: Fix Deviations

**Actions:**
- Fix each documented deviation
- Update component code
- Update design tokens if needed
- Re-test in Storybook

**Validation:**
```bash
# Re-run validations
pnpm run validate

# Rebuild Storybook
pnpm storybook
```

**Verification:**
- Re-capture screenshots using Chrome MCP
- Compare with design again
- Verify all deviations are resolved

**Exit Criteria:**
- All deviations are fixed
- Visual comparison shows 100% match
- No new issues introduced

---

### Step 6: Cleanup Before Push

**Purpose:** Remove all temporary testing artifacts before committing and pushing changes.

**Actions:**
- Delete all screenshots taken during testing
- Delete all snapshots saved during testing
- Delete any Lighthouse reports generated
- Verify no test artifacts remain

**Verify clean state:**
```bash
git status
# Should NOT show any screenshots/, snapshots/, or lighthouse-reports/ files
```

**Exit Criteria:**
- No screenshot files in working directory
- No snapshot files in working directory
- No Lighthouse report files in working directory
- `git status` shows only intended source changes

---

### Step 7: Final Validation

**Actions:**
- Run all validation scripts
- Test all stories one final time
- Verify accessibility
- Check documentation completeness

**Validation Checklist:**
```bash
# Layer architecture
✓ node scripts/validate-layer-imports.js

# Design tokens
✓ node scripts/validate-design-tokens.js

# Import aliases
✓ node scripts/validate-import-aliases.js

# Storybook coverage
✓ node scripts/validate-storybook-coverage.js

# Build
✓ pnpm build:lib
```

**Chrome MCP Final Check:**
```typescript
// Run accessibility audit
mcp_chrome_devtools_lighthouse_audit({
  device: "desktop",
  mode: "snapshot",
  outputDirPath: "lighthouse-reports"
})

// Verify no console errors
mcp_chrome_devtools_list_console_messages({
  types: ["error", "warn"]
})
```

**Exit Criteria:**
- All validations pass
- No console errors
- Accessibility score ≥ 95
- Build succeeds
- Documentation is complete

---

## Delivery Checklist

Use this checklist to verify component delivery:

### Implementation
- [ ] Component code follows layer architecture
- [ ] Design tokens used (no hardcoded values)
- [ ] TypeScript types are correct
- [ ] Accessibility attributes present
- [ ] Layer import validation passes
- [ ] Design token validation passes
- [ ] Import alias validation passes

### Storybook Stories
- [ ] `ComponentName.stories.tsx` exists
- [ ] Default story exists
- [ ] All variants have stories
- [ ] All states have stories (disabled, loading, etc.)
- [ ] Dark mode story exists
- [ ] JSDoc documentation is comprehensive
- [ ] ArgTypes are configured
- [ ] Storybook coverage validation passes

### Chrome MCP Testing
- [ ] Storybook started successfully
- [ ] All stories are accessible
- [ ] Snapshots taken for all stories
- [ ] Screenshots captured for all variants
- [ ] **Screenshots visually inspected - component renders correctly**
- [ ] **For interactive components: Verified functional rendering (edges, connections, data display)**
- [ ] Interactions tested (clicks, inputs, etc.)
- [ ] Responsive behavior verified
- [ ] Dark mode tested
- [ ] No console errors
- [ ] Accessibility audit passes

### Visual Comparison
- [ ] Design mockup located
- [ ] Screenshots compared side-by-side
- [ ] Deviations documented
- [ ] All deviations fixed
- [ ] Re-tested after fixes
- [ ] Visual match confirmed

### Final Validation
- [ ] All validation scripts pass
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Accessibility score ≥ 95
- [ ] Documentation complete

### Cleanup Before Push
- [ ] Screenshots directory deleted
- [ ] Snapshots directory deleted
- [ ] Lighthouse reports deleted
- [ ] `git status` shows no test artifacts

---

## Common Issues and Solutions

### Issue: Screenshots taken but not visually inspected

**Symptoms:**
- Automated checks pass (no console errors, accessibility OK)
- Component appears broken when actually viewed
- Edges/connections missing in workflow components
- Layout completely broken but tests pass

**Root Cause:**
- Taking screenshots without opening and looking at them
- Relying only on automated checks
- Not verifying actual visual rendering

**Solutions:**
1. **ALWAYS open and look at every screenshot you take**
2. For workflow/canvas components: Verify edges render with valid coordinates (not all zeros)
3. Use DOM inspection to check critical elements have non-zero dimensions
4. Compare screenshot with expected design/layout
5. If something looks wrong in the screenshot, investigate immediately

**Example DOM Check for Workflow Components:**
```typescript
// Check if edges have valid paths (not all zeros)
const iframe = document.querySelector('iframe[id="storybook-preview-iframe"]');
const iframeDoc = iframe.contentDocument;
const firstEdge = iframeDoc.querySelector('.react-flow__edge path');
const pathD = firstEdge?.getAttribute('d');
// Valid: "M490,65 C490,96.5 397.96875,96.5 397.96875,128"
// Invalid: "M0,0 C0,0 0,0 0,0" (all zeros = broken)
```

### Issue: Storybook won't start

**Symptoms:**
- `pnpm storybook` fails
- Port 6006 already in use

**Solutions:**
```bash
# Kill existing Storybook process
pkill -f storybook

# Or use different port
pnpm storybook --port 6007
```

### Issue: Chrome MCP can't connect

**Symptoms:**
- MCP commands fail
- "Page not found" errors

**Solutions:**
1. Verify Storybook is running: `http://localhost:6006`
2. Check Chrome DevTools MCP is configured
3. Restart Chrome if needed
4. Use `mcp_chrome_devtools_list_pages()` to verify

### Issue: Visual deviations found

**Symptoms:**
- Colors don't match design
- Spacing is incorrect
- States are missing

**Solutions:**
1. Check design token usage
2. Verify CSS variables are loaded
3. Review component props
4. Test in different themes
5. Check browser DevTools for computed styles

### Issue: Accessibility audit fails

**Symptoms:**
- Lighthouse score < 95
- Missing ARIA attributes
- Color contrast issues

**Solutions:**
1. Add missing ARIA labels
2. Fix color contrast (4.5:1 minimum)
3. Ensure keyboard navigation works
4. Add focus indicators
5. Test with screen reader

---

## Best Practices

### 1. Test Early and Often
- Don't wait until the end to test in Storybook
- Test each story as you write it
- Catch issues early

### 2. Use Chrome MCP Systematically
- Follow the same testing pattern for every component
- Document your testing process
- Save screenshots for reference

### 3. **ALWAYS Visually Inspect Screenshots**
- **CRITICAL: Taking screenshots is useless if you don't look at them**
- Open every screenshot file and verify the component renders correctly
- Check for broken layouts, missing elements, incorrect positioning
- For workflow/canvas components: Verify edges/connections are visible
- For data visualizations: Verify charts display correctly
- Don't rely solely on automated checks - they can't detect visual issues

### 4. Compare with Design Frequently
- Don't rely on memory
- Use side-by-side comparison
- Measure spacing/sizes precisely

### 5. Understand Context Before Copying Reference Code
- Reference implementations may have different use cases
- Example: Horizontal workflow (left-right) vs vertical workflow (top-bottom)
- Verify the reference matches your actual requirements
- Don't blindly copy without understanding the differences

### 6. Document Everything
- Record deviations as you find them
- Note why deviations exist
- Track fixes applied

### 7. Automate Where Possible
- Use validation scripts
- Run checks before committing
- Set up git hooks

---

## Example: Complete Delivery Flow

### Component: Button

**Step 1: Implementation**
```bash
# Create component
# components/primitives/Button/Button.tsx

# Validate
node scripts/validate-layer-imports.js
✓ All layer import rules are satisfied!
```

**Step 2: Stories**
```bash
# Create stories
# components/primitives/Button/Button.stories.tsx

# Validate coverage
node scripts/validate-storybook-coverage.js
✓ All components have Storybook coverage
```

**Step 3: Chrome MCP Testing**
```bash
# Start Storybook
pnpm storybook
# Storybook running at http://localhost:6006

# Use Chrome MCP
mcp_chrome_devtools_navigate_page({ url: "http://localhost:6006/?path=/story/primitives-button--default" })
mcp_chrome_devtools_take_snapshot()
mcp_chrome_devtools_take_screenshot({ filePath: "screenshots/Button-Default.png" })

# CRITICAL: Open and visually inspect the screenshot
# Verify button renders correctly, has proper styling, no layout issues
```

**Step 4: Visual Comparison**
```markdown
## Deviations Found:
1. Padding: 12px → should be 16px
2. Border radius: 4px → should be 6px
```

**Step 5: Fix Deviations**
```tsx
// Update Button.tsx
className: "px-4 py-2 rounded-md" // Fixed padding and radius
```

**Step 6: Final Validation**
```bash
pnpm run validate
✓ All validations passed!

pnpm build:lib
✓ Build success
```

**Result:** ✅ Component delivered and complete!

---

## Summary

**Remember:** A component is NOT done until:
1. It's tested in Storybook using Chrome MCP
2. **Screenshots are taken AND visually inspected**
3. Visual comparison with design is performed
4. All deviations are fixed
5. All validations pass

**CRITICAL RULE: Taking screenshots without looking at them is worse than not taking them at all - it creates false confidence that testing was done.**

**This is the standard for component delivery in the AI Design System.**
