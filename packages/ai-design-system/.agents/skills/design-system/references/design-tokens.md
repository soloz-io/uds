# Design Tokens

Complete guide to the design token system in the AI Design System.

## Overview

Design tokens are the single source of truth for design decisions. They replace hardcoded values with semantic, reusable tokens that:
- Enable consistent theming
- Support light/dark modes
- Allow design changes without code changes
- Improve maintainability
- Enable design-to-code workflows

## Token System

The design system uses **Style Dictionary** to build tokens from source files into CSS custom properties and Tailwind configuration.

### Build Process

```bash
# Build tokens once
pnpm tokens:build

# Watch for changes
pnpm tokens:watch
```

This generates:
- `app/_generated-tokens.css` - CSS custom properties
- `app/_generated-tokens.dark-*.css` - Dark mode variants
- Tailwind configuration updates

## Token Categories

### Colors

**Semantic color tokens** (preferred):
```tsx
// ✅ Use semantic tokens
<div className="bg-primary text-primary-foreground" />
<div className="bg-secondary text-secondary-foreground" />
<div className="bg-destructive text-destructive-foreground" />
<div className="bg-muted text-muted-foreground" />
```

**Available color tokens**:
- `primary` / `primary-foreground`
- `secondary` / `secondary-foreground`
- `destructive` / `destructive-foreground`
- `muted` / `muted-foreground`
- `accent` / `accent-foreground`
- `card` / `card-foreground`
- `popover` / `popover-foreground`
- `background` / `foreground`
- `border` / `input` / `ring`

**CSS variables**:
```tsx
// ✅ Use CSS variables for custom styling
<div style={{ color: "var(--color-primary)" }} />
<div style={{ backgroundColor: "var(--color-muted)" }} />
```

**FORBIDDEN**:
```tsx
// ❌ Never use hardcoded colors
<div style={{ color: "#3b82f6" }} />
<div style={{ backgroundColor: "rgb(59, 130, 246)" }} />
<div className="text-[#3b82f6]" />
```

### Spacing

**Tailwind spacing scale** (preferred):
```tsx
// ✅ Use Tailwind spacing classes
<div className="p-4 m-2 gap-6" />
<div className="px-8 py-4" />
<div className="space-y-4" />
```

**Spacing scale**:
- `0` = 0px
- `1` = 0.25rem (4px)
- `2` = 0.5rem (8px)
- `3` = 0.75rem (12px)
- `4` = 1rem (16px)
- `6` = 1.5rem (24px)
- `8` = 2rem (32px)
- `12` = 3rem (48px)
- `16` = 4rem (64px)

**CSS variables**:
```tsx
// ✅ Use CSS variables for custom spacing
<div style={{ padding: "var(--spacing-4)" }} />
<div style={{ gap: "var(--spacing-6)" }} />
```

**FORBIDDEN**:
```tsx
// ❌ Never use hardcoded spacing
<div style={{ padding: "16px" }} />
<div style={{ margin: "1rem" }} />
<div className="p-[16px]" />
```

### Typography

**Tailwind typography classes** (preferred):
```tsx
// ✅ Use Tailwind typography
<h1 className="text-4xl font-bold" />
<p className="text-base leading-relaxed" />
<span className="text-sm text-muted-foreground" />
```

**Font sizes**:
- `text-xs` = 0.75rem (12px)
- `text-sm` = 0.875rem (14px)
- `text-base` = 1rem (16px)
- `text-lg` = 1.125rem (18px)
- `text-xl` = 1.25rem (20px)
- `text-2xl` = 1.5rem (24px)
- `text-3xl` = 1.875rem (30px)
- `text-4xl` = 2.25rem (36px)

**Font weights**:
- `font-normal` = 400
- `font-medium` = 500
- `font-semibold` = 600
- `font-bold` = 700

**Line heights**:
- `leading-none` = 1
- `leading-tight` = 1.25
- `leading-snug` = 1.375
- `leading-normal` = 1.5
- `leading-relaxed` = 1.625
- `leading-loose` = 2

### Border Radius

**Tailwind radius classes** (preferred):
```tsx
// ✅ Use Tailwind radius
<div className="rounded-lg" />
<div className="rounded-full" />
<div className="rounded-t-md" />
```

**Radius scale**:
- `rounded-none` = 0
- `rounded-sm` = 0.125rem (2px)
- `rounded` = 0.25rem (4px)
- `rounded-md` = 0.375rem (6px)
- `rounded-lg` = 0.5rem (8px)
- `rounded-xl` = 0.75rem (12px)
- `rounded-2xl` = 1rem (16px)
- `rounded-full` = 9999px

**CSS variables**:
```tsx
// ✅ Use CSS variables
<div style={{ borderRadius: "var(--radius)" }} />
```

### Shadows

**Tailwind shadow classes** (preferred):
```tsx
// ✅ Use Tailwind shadows
<div className="shadow-sm" />
<div className="shadow-md" />
<div className="shadow-lg" />
```

**Shadow scale**:
- `shadow-sm` = Small shadow
- `shadow` = Default shadow
- `shadow-md` = Medium shadow
- `shadow-lg` = Large shadow
- `shadow-xl` = Extra large shadow
- `shadow-2xl` = 2X large shadow
- `shadow-none` = No shadow

## Using Tokens in Components

### With CVA (Class Variance Authority)

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base classes using tokens
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

### With Inline Styles

```tsx
// ✅ Use CSS variables for dynamic values
export function CustomComponent({ color }: { color?: string }) {
  return (
    <div
      style={{
        color: color || "var(--color-foreground)",
        backgroundColor: "var(--color-background)",
        padding: "var(--spacing-4)",
        borderRadius: "var(--radius)",
      }}
    />
  );
}
```

### With Tailwind Classes

```tsx
// ✅ Use Tailwind classes with tokens
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      {children}
    </div>
  );
}
```

## Theme Support

### Light and Dark Modes

The design system automatically supports light and dark modes through CSS custom properties:

```tsx
// ✅ Tokens automatically adapt to theme
<div className="bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

**How it works**:
1. CSS variables are defined for light mode in `_generated-tokens.css`
2. Dark mode overrides are in `_generated-tokens.dark-*.css`
3. Theme switching updates the CSS variables
4. Components automatically use the current theme

### Theme Variants

The design system includes multiple theme variants:
- `dark-neutral` - Neutral dark theme
- `dark-green` - Green accent dark theme
- `dark-violet` - Violet accent dark theme

**Switching themes**:
```tsx
// Theme is controlled by data attribute on <html>
<html data-theme="dark-neutral">
```

## Token Validation

The `validate-design-tokens.js` script enforces token usage:

```bash
node scripts/validate-design-tokens.js
```

**What it catches**:
- Hardcoded hex colors: `#3b82f6`
- RGB/RGBA colors: `rgb(59, 130, 246)`
- HSL/HSLA colors: `hsl(217, 91%, 60%)`
- Hardcoded spacing: `16px`, `1rem`, `2em`
- Hardcoded values in arbitrary classes: `text-[#3b82f6]`

**What it allows**:
- Tailwind classes: `bg-primary`, `p-4`, `text-lg`
- CSS variables: `var(--color-primary)`, `var(--spacing-4)`
- Relative units in specific contexts: `width: '100%'`, `height: 'auto'`

## Common Patterns

### Pattern 1: Button with Variants

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input hover:bg-accent",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
      },
    },
  }
);
```

### Pattern 2: Card with Token-Based Styling

```tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4">
        {children}
      </div>
    </div>
  );
}
```

### Pattern 3: Dynamic Color with Fallback

```tsx
export function Badge({ color, children }: { color?: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{
        backgroundColor: color || "var(--color-primary)",
        color: "var(--color-primary-foreground)",
      }}
    >
      {children}
    </span>
  );
}
```

### Pattern 4: Responsive Spacing

```tsx
export function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-4 py-8 md:px-8 md:py-12 lg:px-16 lg:py-16">
      {children}
    </section>
  );
}
```

## Extending Tokens

### Adding New Tokens

1. **Edit token source** in `tokens/` directory
2. **Build tokens**: `pnpm tokens:build`
3. **Use in components**: Reference via Tailwind or CSS variables
4. **Validate**: Run `node scripts/validate-design-tokens.js`

### Custom Token Values

```tsx
// ✅ Define custom tokens in CSS
:root {
  --custom-spacing: 1.5rem;
  --custom-color: hsl(var(--primary));
}

// Use in components
<div style={{ padding: "var(--custom-spacing)" }} />
```

## Best Practices

1. **Always use tokens** - Never hardcode values
2. **Prefer Tailwind classes** - More maintainable than inline styles
3. **Use semantic tokens** - `bg-primary` not `bg-blue-500`
4. **Support dark mode** - Use theme-aware tokens
5. **Validate regularly** - Run token validation script
6. **Document custom tokens** - Add comments for custom values
7. **Use CVA for variants** - Consistent variant management
8. **Test in both themes** - Verify light and dark modes

## Troubleshooting

### "Token not found"
- Check token is defined in `_generated-tokens.css`
- Rebuild tokens: `pnpm tokens:build`
- Verify Tailwind configuration includes token

### "Dark mode not working"
- Check `data-theme` attribute on `<html>`
- Verify dark mode CSS is loaded
- Check token has dark mode override

### "Validation fails but I'm using tokens"
- Ensure using Tailwind classes, not arbitrary values
- Use `var(--token)` syntax for CSS variables
- Check for typos in token names

## Conclusion

Design tokens are the foundation of the design system's consistency and maintainability. By using tokens:
- Designs stay consistent
- Themes work automatically
- Changes propagate globally
- Code is more maintainable
- Dark mode is effortless

Always use tokens, never hardcode values!
