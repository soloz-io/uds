# Architectural Violation Detected

**Date:** 2025-01-08  
**Status:** 🚨 CRITICAL - Blocks Build

## Summary

A new validation script (`validate-architectural-patterns.js`) has detected an architectural violation in the workflow components:

**Violation:** Re-export workaround pattern  
**File:** `components/composites/WorkflowElements/WorkflowElements.tsx`  
**Impact:** Bypasses layer architecture rules

---

## The Problem

### What Was Found

`WorkflowElements.tsx` is a pure re-export wrapper that exists ONLY to bypass layer rules:

```typescript
// components/composites/WorkflowElements/WorkflowElements.tsx
export { Canvas } from "@/components/ai-elements/canvas";
export { Connection } from "@/components/ai-elements/connection";
export { Controls } from "@/components/ai-elements/controls";
export { Edge } from "@/components/ai-elements/edge";
export { Panel } from "@/components/ai-elements/panel";
```

### Why This Is Wrong

**Layer Rules:**
- `blocks/` CAN import from: `composites/`, `primitives/`
- `blocks/` CANNOT import from: `ai-elements/`

**The Workaround:**
1. `WorkflowCanvasBlock` (in `blocks/`) needs ai-elements (Canvas, Edge, etc.)
2. But blocks cannot import from ai-elements directly
3. So `WorkflowElements` composite was created to re-export ai-elements
4. Now blocks can import from composites/WorkflowElements (allowed)
5. This bypasses the architectural rule

### Root Cause

**`WorkflowCanvasBlock` is misclassified as a Block.**

According to design system rules:
- **Composites** = Combine primitives + ai-elements
- **Blocks** = Combine composites + primitives (complete UI sections)

`WorkflowCanvasBlock` directly uses ai-elements (Canvas, Edge, Controls, Panel), so it should be a **Composite**, not a Block.

---

## The Fix

### Option 1: Reclassify WorkflowCanvasBlock (RECOMMENDED)

Move `WorkflowCanvasBlock` from `blocks/` to `composites/`:

**Before:**
```
components/
├── blocks/
│   └── WorkflowCanvasBlock/  ❌ Wrong layer
└── composites/
    └── WorkflowElements/      ❌ Workaround
```

**After:**
```
components/
└── composites/
    ├── WorkflowCanvasBlock/  ✅ Correct layer
    └── (delete WorkflowElements)
```

**Changes Required:**
1. Move `components/blocks/WorkflowCanvasBlock/` → `components/composites/WorkflowCanvasBlock/`
2. Delete `components/composites/WorkflowElements/`
3. Update imports in consuming code
4. Update Storybook story title
5. Update exports in `components/composites/index.ts`
6. Remove from `components/blocks/index.ts`

### Option 2: Add Actual Functionality to WorkflowElements

If WorkflowElements should remain, it must have actual code beyond re-exports:

```typescript
// Add actual composite functionality
export function WorkflowCanvas({ children, ...props }) {
  return (
    <Canvas {...props}>
      <Controls />
      {children}
    </Canvas>
  );
}

// Re-exports are now supporting actual components
export { Canvas } from "@/components/ai-elements/canvas";
export { Edge } from "@/components/ai-elements/edge";
```

---

## Validation Script

### New Script Created

**File:** `scripts/validate-architectural-patterns.js`

**Purpose:** Detect anti-patterns that bypass design system governance

**Patterns Detected:**
1. ✅ Re-export workarounds (files that only re-export from forbidden layers)
2. 🔜 Future patterns can be added

### How It Works

1. Scans all component files (excluding stories, tests, index files)
2. Checks if file has ONLY export statements (no actual code)
3. Determines which layers can import from this file
4. Checks if exports are from layers that consumers cannot import from
5. Flags files that exist solely to bypass layer rules

### Integration

Added to validation suite:
```bash
node scripts/run-all-validations.js
```

Now runs 8 validations (was 7):
1. Layer Import Validation
2. **Architectural Patterns Validation** ← NEW
3. Storybook Coverage Validation
4. Design Token Validation
5. Story Composition Validation
6. Feature Story Validation
7. Behavior Stories Validation
8. Import Alias Validation

---

## Impact

### Current State

❌ **Validation fails** - Cannot build or publish until fixed

### Affected Components

- `WorkflowCanvasBlock` (blocks/)
- `WorkflowElements` (composites/)
- Any code importing from WorkflowElements

### Affected Specs

- `.kiro/specs/workflow/workflow-builder-feature.md`
- `.kiro/specs/workflow/workflow-builder-toolbar-feature.md`

---

## Recommendation

**Proceed with Option 1: Reclassify WorkflowCanvasBlock**

**Reasoning:**
1. Follows design system principles correctly
2. Removes the workaround entirely
3. Makes architecture clearer
4. Aligns with similar components (TableToolbar is a composite)

**Next Steps:**
1. Get approval for reclassification
2. Move WorkflowCanvasBlock to composites/
3. Delete WorkflowElements
4. Update all imports
5. Run validations
6. Update specs

---

## Design System Principle

> **Components should be in the correct layer based on what they combine.**
> 
> - If it combines primitives/ai-elements → Composite
> - If it combines composites/primitives → Block
> - If it has state/business logic → Feature
>
> Re-export wrappers that bypass layer rules violate architectural integrity.

---

## References

- Design System Skill: `.kiro/skills/design-system/SKILL.md`
- Layer Architecture: Section "Layer Rules (CRITICAL)"
- Validation Script: `scripts/validate-architectural-patterns.js`
- Run All Validations: `scripts/run-all-validations.js`
