# Import Rules

Complete guide to import rules and the `@/` alias system in the AI Design System.

## Overview

The design system enforces strict import rules to ensure:
- Consistent import paths across the codebase
- Refactor-safe code (imports don't break when files move)
- Better IDE support and autocomplete
- Clearer dependency relationships

## The @/ Alias

The `@/` alias is configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

This maps `@/` to the project root, enabling absolute imports.

## Import Rules

### ✅ REQUIRED: Use @/ for Project Imports

```tsx
// ✅ CORRECT - Use @/ alias
import { Button } from "@/components/primitives/Button";
import { DataTable } from "@/components/composites/DataTable";
import { cn } from "@/lib/utils";
import { useFeature } from "@/hooks/useFeature";
import type { User } from "@/types/user";
```

### ❌ FORBIDDEN: Relative Paths for Project Imports

```tsx
// ❌ INCORRECT - Never use relative paths
import { Button } from "../../primitives/Button";
import { DataTable } from "../composites/DataTable";
import { cn } from "../../../lib/utils";
```

### ✅ ALLOWED: Same-Directory Imports

```tsx
// ✅ ALLOWED - Same directory
import { ButtonVariants } from "./button-variants";
import { types } from "./types";
import { helpers } from "./helpers";
```

### ✅ ALLOWED: Subdirectory Imports

```tsx
// ✅ ALLOWED - Subdirectory
import { Icon } from "./icons/Icon";
import { utils } from "./utils/helpers";
```

### ✅ ALLOWED: External Library Imports

```tsx
// ✅ ALLOWED - External libraries
import { cva } from "class-variance-authority";
import { cn } from "clsx";
import { useState } from "react";
import { Icon } from "lucide-react";
```

## Import Patterns by Directory

### Components

```tsx
// ✅ Importing components
import { Button } from "@/components/primitives/Button";
import { Message } from "@/components/ai-elements/message";
import { DataTable } from "@/components/composites/DataTable";
import { AIConversation } from "@/components/blocks/AIConversation";
import { AIDocEditor } from "@/components/features/AIDocEditor";

// ✅ Importing from ui/ (shadcn)
import { Button as UIButton } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
```

### Utilities

```tsx
// ✅ Importing utilities
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import { api } from "@/lib/api";
```

### Hooks

```tsx
// ✅ Importing hooks
import { useTheme } from "@/hooks/useTheme";
import { useFeature } from "@/hooks/useFeature";
import { useLocalStorage } from "@/hooks/useLocalStorage";
```

### Types

```tsx
// ✅ Importing types
import type { User } from "@/types/user";
import type { ApiResponse } from "@/types/api";
import type { Theme } from "@/types/theme";
```

### Styles

```tsx
// ✅ Importing styles
import "@/styles/globals.css";
import "@/app/_generated-tokens.css";
```

## Layer-Specific Import Rules

### primitives/

```tsx
// ✅ CORRECT - primitives importing from ui/
import { Button as UIButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ❌ INCORRECT - primitives importing from higher layers
import { DataTable } from "@/components/composites/DataTable";
import { Message } from "@/components/ai-elements/message";
```

### ai-elements/

```tsx
// ✅ CORRECT - ai-elements importing from ui/
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ❌ INCORRECT - ai-elements importing from other layers
import { Button } from "@/components/primitives/Button";
import { DataTable } from "@/components/composites/DataTable";
```

### composites/

```tsx
// ✅ CORRECT - composites importing from primitives and ai-elements
import { Button } from "@/components/primitives/Button";
import { Message } from "@/components/ai-elements/message";
import { cn } from "@/lib/utils";

// ❌ INCORRECT - composites importing from ui/ or higher layers
import { Button as UIButton } from "@/components/ui/button";
import { AIConversation } from "@/components/blocks/AIConversation";
```

### blocks/

```tsx
// ✅ CORRECT - blocks importing from composites, primitives, and ai-elements
import { DataTable } from "@/components/composites/DataTable";
import { Button } from "@/components/primitives/Button";
import { Message } from "@/components/ai-elements/message";
import { cn } from "@/lib/utils";

// ❌ INCORRECT - blocks importing from features
import { AIDocEditor } from "@/components/features/AIDocEditor";
```

### features/

```tsx
// ✅ CORRECT - features importing from blocks and composites
import { AIConversation } from "@/components/blocks/AIConversation";
import { DataTable } from "@/components/composites/DataTable";
import { cn } from "@/lib/utils";

// ❌ INCORRECT - features importing from primitives or ai-elements
import { Button } from "@/components/primitives/Button";
import { Message } from "@/components/ai-elements/message";
```

## Validation

The `validate-import-aliases.js` script enforces these rules:

```bash
node scripts/validations/validate-import-aliases.js
```

**What it checks**:
- No `../../` imports
- No `../` imports (except for same-directory `./`)
- All project imports use `@/` alias

**What it allows**:
- `./Component` - Same directory
- `./subdir/Component` - Subdirectory
- `@/components/...` - Project imports
- External library imports

## Common Violations and Fixes

### Violation 1: Relative Component Import

```tsx
// ❌ INCORRECT
import { Button } from "../../primitives/Button";

// ✅ CORRECT
import { Button } from "@/components/primitives/Button";
```

### Violation 2: Relative Utility Import

```tsx
// ❌ INCORRECT
import { cn } from "../../../lib/utils";

// ✅ CORRECT
import { cn } from "@/lib/utils";
```

### Violation 3: Relative Type Import

```tsx
// ❌ INCORRECT
import type { User } from "../../types/user";

// ✅ CORRECT
import type { User } from "@/types/user";
```

### Violation 4: Mixed Import Styles

```tsx
// ❌ INCORRECT - Mixing styles
import { Button } from "@/components/primitives/Button";
import { DataTable } from "../../composites/DataTable";

// ✅ CORRECT - Consistent @/ usage
import { Button } from "@/components/primitives/Button";
import { DataTable } from "@/components/composites/DataTable";
```

## IDE Configuration

### VS Code

The `@/` alias works automatically with `tsconfig.json`. For better autocomplete:

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "javascript.preferences.importModuleSpecifier": "non-relative"
}
```

### Auto-Import Configuration

VS Code will automatically use `@/` imports when:
1. `tsconfig.json` has the path mapping
2. Import module specifier is set to "non-relative"
3. You use auto-import (Ctrl+Space or Cmd+Space)

## Migration Guide

If you have existing code with relative imports:

### Manual Migration

1. **Find relative imports**:
```bash
# Search for relative imports
grep -r "from ['\"]\.\./" components/
```

2. **Replace with @/ imports**:
```tsx
// Before
import { Button } from "../../primitives/Button";

// After
import { Button } from "@/components/primitives/Button";
```

3. **Validate**:
```bash
node scripts/validations/validate-import-aliases.js
```

### Automated Migration

Use the provided migration script:

```bash
bash scripts/fix-import-aliases.sh
```

This script:
1. Scans all `.tsx` and `.ts` files
2. Identifies relative imports
3. Converts to `@/` imports
4. Preserves same-directory imports

## Best Practices

1. **Always use @/ for project imports** - Never use relative paths
2. **Use auto-import** - Let IDE generate correct imports
3. **Keep same-directory imports** - `./Component` is fine
4. **Validate before committing** - Run validation script
5. **Configure IDE** - Set import module specifier to "non-relative"
6. **Be consistent** - Don't mix import styles
7. **Update on refactor** - Imports stay valid when files move

## Benefits of @/ Imports

### 1. Refactor-Safe

```tsx
// With relative imports - breaks when file moves
import { Button } from "../../primitives/Button";

// With @/ imports - stays valid when file moves
import { Button } from "@/components/primitives/Button";
```

### 2. Clearer Dependencies

```tsx
// Relative imports - hard to understand structure
import { Button } from "../../primitives/Button";
import { utils } from "../../../lib/utils";

// @/ imports - clear project structure
import { Button } from "@/components/primitives/Button";
import { utils } from "@/lib/utils";
```

### 3. Better IDE Support

- Autocomplete works better with absolute paths
- Go-to-definition is more reliable
- Refactoring tools work better
- Import suggestions are more accurate

### 4. Easier Code Review

```tsx
// Relative imports - need to trace path
import { Button } from "../../primitives/Button";

// @/ imports - immediately clear
import { Button } from "@/components/primitives/Button";
```

## Troubleshooting

### "Cannot find module '@/components/...'"

**Cause**: TypeScript can't resolve `@/` alias

**Fix**:
1. Check `tsconfig.json` has path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

2. Restart TypeScript server:
   - VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

3. Verify file exists at the path

### "Import works but validation fails"

**Cause**: Using relative path that TypeScript resolves

**Fix**: Replace with `@/` import:
```tsx
// Change this
import { Button } from "../../primitives/Button";

// To this
import { Button } from "@/components/primitives/Button";
```

### "Auto-import uses relative paths"

**Cause**: IDE not configured for non-relative imports

**Fix**: Update VS Code settings:
```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

### "Same-directory import flagged as violation"

**Cause**: Using `../` instead of `./`

**Fix**: Use `./` for same-directory:
```tsx
// ❌ This is flagged
import { helper } from "../helper";

// ✅ This is allowed
import { helper } from "./helper";
```

## Examples

### Good Import Structure

```tsx
// components/composites/DataTable/DataTable.tsx

// ✅ External libraries
import { useState } from "react";
import { cva } from "class-variance-authority";

// ✅ Project imports with @/
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";

// ✅ Same-directory imports
import { DataTablePagination } from "./DataTablePagination";
import { columns } from "./columns";
import { types } from "./types";

export function DataTable() {
  // Component implementation
}
```

### Bad Import Structure

```tsx
// components/composites/DataTable/DataTable.tsx

// ❌ Mixing import styles
import { Button } from "@/components/primitives/Button";
import { Input } from "../../primitives/Input";  // ❌ Relative
import { cn } from "../../../lib/utils";  // ❌ Relative

// ❌ Using ../ for same directory
import { DataTablePagination } from "../DataTable/DataTablePagination";

export function DataTable() {
  // Component implementation
}
```

## Conclusion

Import rules ensure:
- Consistent codebase
- Refactor-safe code
- Better IDE support
- Clearer dependencies
- Easier maintenance

Always use `@/` imports for project code, validate before committing!
