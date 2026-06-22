# Layer Architecture

## Overview

The AI Design System uses a strict 6-layer architecture that enforces unidirectional dependencies and prevents architectural drift.

## The Six Layers

### Layer 1: ui/
**Purpose**: shadcn/ui base components (Radix UI wrappers)
**Can Import**: External libraries only (Radix UI, React, etc.)
**Cannot Import**: Any project code
**Examples**: `button.tsx`, `input.tsx`, `dialog.tsx`

These are the foundational UI primitives from shadcn/ui. They wrap Radix UI components with Tailwind styling.

### Layer 2: primitives/
**Purpose**: Base reusable components
**Can Import**: `components/ui/` ONLY
**Cannot Import**: ai-elements, composites, blocks, features
**Examples**: `Button/`, `Input/`, `Card/`, `Badge/`

Primitives are standalone components that can be used anywhere. They build on top of ui/ components by adding:
- Design token integration
- Variant management with CVA
- Project-specific styling
- Enhanced TypeScript types

```tsx
// ✅ CORRECT - primitives importing from ui/
import { Button as UIButton } from "@/components/ui/button";

// ❌ INCORRECT - primitives importing from higher layers
import { DataTable } from "@/components/composites/DataTable";
```

### Layer 3: ai-elements/
**Purpose**: Specialized AI-specific base components
**Can Import**: `components/ui/` ONLY
**Cannot Import**: primitives, composites, blocks, features
**Examples**: `Message/`, `Artifact/`, `CodeBlock/`, `Loader/`

AI-elements are parallel to primitives but specialized for AI interfaces. They:
- Handle AI-specific patterns (streaming, thinking states)
- Provide AI UX primitives (messages, artifacts, tools)
- Are base-level like primitives but AI-focused

```tsx
// ✅ CORRECT - ai-elements importing from ui/
import { Card } from "@/components/ui/card";

// ❌ INCORRECT - ai-elements importing from primitives
import { Button } from "@/components/primitives/Button";
```

**Why separate from primitives?**
- AI-elements have specialized behavior (streaming, markdown rendering)
- They're domain-specific, not general-purpose
- Keeps primitives clean and focused

### Layer 4: composites/
**Purpose**: Combinations of primitives and ai-elements
**Can Import**: `components/primitives/`, `components/ai-elements/`
**Cannot Import**: `components/ui/`, blocks, features
**Examples**: `DataTable/`, `PromptInput/`, `FileQueue/`, `ToolCallDisplay/`

Composites combine multiple primitives or ai-elements into cohesive components. They:
- Compose lower-level components
- Add interaction logic
- Manage internal state
- Provide higher-level APIs

```tsx
// ✅ CORRECT - composites importing from primitives and ai-elements
import { Button } from "@/components/primitives/Button";
import { Message } from "@/components/ai-elements/message";

// ❌ INCORRECT - composites importing from ui/
import { Button as UIButton } from "@/components/ui/button";

// ❌ INCORRECT - composites importing from blocks
import { AIConversation } from "@/components/blocks/AIConversation";
```

### Layer 5: blocks/
**Purpose**: Complex UI sections
**Can Import**: `components/composites/`, `components/primitives/`, `components/ai-elements/`
**Cannot Import**: `components/ui/`, features
**Examples**: `AIConversation/`, `AppSidebar/`, `FileChangeQueue/`

Blocks are substantial UI sections that:
- Combine multiple composites
- Implement complex layouts
- Manage section-level state
- Provide feature-like functionality

```tsx
// ✅ CORRECT - blocks importing from composites/primitives/ai-elements
import { DataTable } from "@/components/composites/DataTable";
import { Button } from "@/components/primitives/Button";
import { Message } from "@/components/ai-elements/message";

// ❌ INCORRECT - blocks importing from features
import { AIDocEditor } from "@/components/features/AIDocEditor";
```

### Layer 6: features/
**Purpose**: Complete feature implementations
**Can Import**: `components/blocks/`, `components/composites/`
**Cannot Import**: `components/ui/`, ai-elements, primitives
**Examples**: `AIDocEditor/`, `PageLayout/`, `RefinementPanel/`

Features are complete, self-contained implementations that:
- Combine blocks and composites
- Integrate with hooks and state management
- Provide complete user workflows
- Are the highest level of composition

```tsx
// ✅ CORRECT - features importing from blocks and composites
import { AIConversation } from "@/components/blocks/AIConversation";
import { PromptInput } from "@/components/blocks/PromptInput";

// ❌ INCORRECT - features importing from primitives
import { Button } from "@/components/primitives/Button";

// ❌ INCORRECT - features importing from ai-elements
import { Message } from "@/components/ai-elements/message";
```

**Why can't features import primitives?**
- Features should use blocks/composites that wrap primitives
- This enforces proper abstraction levels
- Prevents features from becoming too granular

## Import Rules Summary

| From Layer | Can Import |
|-----------|-----------|
| ui/ | External libraries only |
| primitives/ | ui/ |
| ai-elements/ | ui/ |
| composites/ | primitives/, ai-elements/ |
| blocks/ | composites/, primitives/, ai-elements/ |
| features/ | blocks/, composites/ |

## Common Violations and Fixes

### Violation 1: Composite importing from ui/

```tsx
// ❌ INCORRECT
// components/composites/DataTable/DataTable.tsx
import { Button } from "@/components/ui/button";

// ✅ CORRECT
import { Button } from "@/components/primitives/Button";
```

**Why?** Composites should use primitives, which wrap ui/ components with project-specific enhancements.

### Violation 2: Block importing from features

```tsx
// ❌ INCORRECT
// components/blocks/WorkflowCanvas/WorkflowCanvas.tsx
import { AIDocEditor } from "@/components/features/AIDocEditor";

// ✅ CORRECT
import { Message } from "@/components/ai-elements/message";
```

**Why?** Blocks cannot import from higher layers like features.

### Violation 3: Feature importing from primitives

```tsx
// ❌ INCORRECT
// components/features/AIDocEditor/AIDocEditor.tsx
import { Button } from "@/components/primitives/Button";

// ✅ CORRECT
// Use a block or composite that includes the button
import { EditorToolbar } from "@/components/blocks/EditorToolbar";
```

**Why?** Features should work at the block/composite level, not the primitive level.

### Violation 4: Primitive importing from another primitive

```tsx
// ❌ INCORRECT
// components/primitives/IconButton/IconButton.tsx
import { Button } from "@/components/primitives/Button";

// ✅ CORRECT
// Import from ui/ and build independently
import { Button as UIButton } from "@/components/ui/button";
```

**Why?** Primitives should be independent and only depend on ui/.

## Decision Tree: Which Layer?

```
Is it a shadcn/ui Radix wrapper?
├─ YES → ui/
└─ NO ↓

Is it a base, standalone component?
├─ YES → Is it AI-specific?
│   ├─ YES → ai-elements/
│   └─ NO → primitives/
└─ NO ↓

Does it combine primitives or ai-elements?
├─ YES → composites/
└─ NO ↓

Is it a complex UI section?
├─ YES → blocks/
└─ NO ↓

Is it a complete feature?
└─ YES → features/
```

## Same-Layer Imports

Components CAN import from the same layer:

```tsx
// ✅ ALLOWED - same layer imports
// components/primitives/IconButton/IconButton.tsx
import { buttonVariants } from "./button-variants";
import { IconWrapper } from "./IconWrapper";
```

This is allowed because:
- They're in the same abstraction level
- No architectural boundaries are crossed
- Promotes code reuse within a layer

## External Library Imports

All layers can import from external libraries:

```tsx
// ✅ ALLOWED in any layer
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Icon } from "lucide-react";
```

## Validation

The layer architecture is enforced by `scripts/validations/validate-layer-imports.js`:

```bash
node scripts/validations/validate-layer-imports.js
```

This script:
1. Scans all `.tsx` and `.ts` files
2. Extracts import statements
3. Checks against layer rules
4. Reports violations with file, line, and import path

## Why This Architecture?

1. **Prevents Circular Dependencies** - Unidirectional flow prevents cycles
2. **Enforces Abstraction Levels** - Each layer has a clear purpose
3. **Enables Progressive Disclosure** - Build from simple to complex
4. **Improves Maintainability** - Clear boundaries make changes safer
5. **Facilitates Testing** - Lower layers can be tested independently
6. **Supports Tree-Shaking** - Clear dependencies enable better bundling

## Migration Guide

If you have existing components that violate the architecture:

1. **Identify the violation** - Run `node scripts/validations/validate-layer-imports.js`
2. **Determine correct layer** - Use the decision tree
3. **Move component** - Relocate to correct layer directory
4. **Fix imports** - Update to use allowed layers
5. **Update exports** - Update layer index.ts
6. **Validate** - Re-run validation script
7. **Test** - Ensure component still works

## Best Practices

1. **Start at the bottom** - Build primitives first, then compose upward
2. **Keep layers thin** - Don't skip layers by importing from far below
3. **Use composites** - Don't let blocks import primitives directly
4. **Respect boundaries** - Never violate layer rules, even temporarily
5. **Validate often** - Run validation script before committing
6. **Document decisions** - Comment why a component is in its layer

## Examples

### Good Architecture

```tsx
// primitives/Button/Button.tsx
import { Button as UIButton } from "@/components/ui/button";

// composites/ActionButton/ActionButton.tsx
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";

// blocks/Toolbar/Toolbar.tsx
import { ActionButton } from "@/components/composites/ActionButton";

// features/Editor/Editor.tsx
import { Toolbar } from "@/components/blocks/Toolbar";
```

### Bad Architecture

```tsx
// ❌ Feature importing primitive directly
// features/Editor/Editor.tsx
import { Button } from "@/components/primitives/Button";

// ❌ Block importing ai-element directly
// blocks/ChatPanel/ChatPanel.tsx
import { Message } from "@/components/ai-elements/message";

// ❌ Composite importing from ui/
// composites/DataTable/DataTable.tsx
import { Button } from "@/components/ui/button";
```

## Conclusion

The layer architecture is the foundation of the design system's maintainability. By enforcing strict boundaries, we ensure:
- Predictable dependencies
- Easier refactoring
- Better testing
- Clearer mental models
- Sustainable growth

Always validate your imports and respect the layer boundaries!
