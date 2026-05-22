# Theme Support

Complete guide to theme support and dark mode implementation in Storybook stories.

## Overview

The AI Design System supports multiple themes:
- `light` - Light mode
- `dark-neutral` - Dark mode with neutral colors
- `dark-green` - Dark mode with green accent
- `dark-violet` - Dark mode with violet accent (default)

All components must work correctly in all themes.

## Global Theme Configuration

### Theme Toolbar

Configured in `.storybook/preview.ts`:

```tsx
globalTypes: {
  theme: {
    description: 'Global theme for components',
    defaultValue: 'dark-violet',
    toolbar: {
      title: 'Theme',
      icon: 'circlehollow',
      items: ['light', 'dark-neutral', 'dark-green', 'dark-violet'],
      dynamicTitle: true,
    },
  },
}
```

**Usage**: Click the theme icon in Storybook toolbar to switch themes globally.

### Theme Decorator

Automatically applies theme to all stories:

```tsx
const withTheme = (Story: any, context: any) => {
  const { theme } = context.globals

  useEffect(() => {
    const htmlElement = document.documentElement
    
    // Remove existing theme classes
    htmlElement.classList.remove('light', 'dark-neutral', 'dark-green', 'dark-violet')
    
    // Add the selected theme class
    htmlElement.classList.add(theme)
  }, [theme])

  return Story()
}

const preview: Preview = {
  decorators: [withTheme],
  // ...
}
```

**How it works**:
1. Reads theme from global context
2. Removes all theme classes from `<html>`
3. Adds selected theme class
4. Re-renders story with new theme

## Theme Implementation in Components

### Using Design Tokens

Components automatically adapt to themes when using design tokens:

```tsx
// ✅ CORRECT - Uses design tokens
<div className="bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>
```

**How it works**:
- CSS variables are defined for each theme
- Tailwind classes reference these variables
- Theme switch updates CSS variables
- Components automatically re-render with new colors

### Theme-Aware CSS Variables

Defined in generated token files:

**Light theme** (`_generated-tokens.css`):
```css
:root {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(222.2 84% 4.9%);
  --color-primary: hsl(221.2 83.2% 53.3%);
  /* ... */
}
```

**Dark themes** (`_generated-tokens.dark-*.css`):
```css
.dark-neutral {
  --color-background: hsl(222.2 84% 4.9%);
  --color-foreground: hsl(210 40% 98%);
  --color-primary: hsl(217.2 91.2% 59.8%);
  /* ... */
}

.dark-green {
  --color-background: hsl(222.2 84% 4.9%);
  --color-primary: hsl(142.1 76.2% 36.3%);
  /* ... */
}

.dark-violet {
  --color-background: hsl(222.2 84% 4.9%);
  --color-primary: hsl(263.4 70% 50.4%);
  /* ... */
}
```

## Dark Mode Story Pattern

### Basic Dark Mode Story

**Purpose**: Explicitly demonstrate component in dark mode for documentation

**Pattern**:
```tsx
export const DarkMode: Story = {
  render: () => (
    <div 
      className="dark-neutral" 
      style={{ 
        padding: '24px', 
        background: 'hsl(222.2 84% 4.9%)', 
        borderRadius: '8px' 
      }}
    >
      {/* Components */}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All variants automatically adapt to dark mode.',
      },
    },
    backgrounds: { disable: true },
  },
}
```

**Key Elements**:
1. **Wrapper div** with theme class (`dark-neutral`, `dark-green`, or `dark-violet`)
2. **Dark background** using exact color from theme
3. **Padding** for visual spacing
4. **Border radius** for polished appearance
5. **Disable backgrounds** parameter to prevent Storybook background interference

### Complete Dark Mode Example

```tsx
/**
 * Dark Mode Preview
 *
 * All variants in dark mode to verify theming compatibility.
 * The Button component automatically adapts to dark mode via design tokens.
 */
export const DarkMode: Story = {
  render: () => (
    <div 
      className="dark-neutral" 
      style={{ 
        padding: '24px', 
        background: 'hsl(222.2 84% 4.9%)', 
        borderRadius: '8px' 
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Variants */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        
        {/* States */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="default" disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants automatically adapt to dark mode with appropriate contrast and visibility.',
      },
    },
    backgrounds: { disable: true },
  },
}
```

### Multi-Theme Comparison Story

**Purpose**: Show component in all themes side-by-side

```tsx
/**
 * All Themes Comparison
 *
 * Shows the component in all available themes for comparison.
 */
export const AllThemes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Light Theme */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          Light Theme
        </h3>
        <div 
          className="light" 
          style={{ 
            padding: '24px', 
            background: 'hsl(0 0% 100%)', 
            borderRadius: '8px',
            border: '1px solid hsl(214.3 31.8% 91.4%)'
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button variant="default">Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
      </div>

      {/* Dark Neutral */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          Dark Neutral
        </h3>
        <div 
          className="dark-neutral" 
          style={{ 
            padding: '24px', 
            background: 'hsl(222.2 84% 4.9%)', 
            borderRadius: '8px' 
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button variant="default">Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
      </div>

      {/* Dark Green */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          Dark Green
        </h3>
        <div 
          className="dark-green" 
          style={{ 
            padding: '24px', 
            background: 'hsl(222.2 84% 4.9%)', 
            borderRadius: '8px' 
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button variant="default">Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
      </div>

      {/* Dark Violet */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          Dark Violet (Default)
        </h3>
        <div 
          className="dark-violet" 
          style={{ 
            padding: '24px', 
            background: 'hsl(222.2 84% 4.9%)', 
            borderRadius: '8px' 
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button variant="default">Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Component appearance across all available themes.',
      },
    },
    backgrounds: { disable: true },
  },
}
```

## Theme Colors Reference

### Background Colors

```tsx
// Light
background: 'hsl(0 0% 100%)'           // White

// Dark (all variants)
background: 'hsl(222.2 84% 4.9%)'      // Very dark blue
```

### Border Colors

```tsx
// Light
border: '1px solid hsl(214.3 31.8% 91.4%)'  // Light gray

// Dark
border: '1px solid hsl(217.2 32.6% 17.5%)'  // Dark gray
```

## Testing Themes

### Manual Testing

1. **Open Storybook**
2. **Navigate to component story**
3. **Click theme toolbar icon**
4. **Switch between themes**:
   - light
   - dark-neutral
   - dark-green
   - dark-violet
5. **Verify**:
   - Colors adapt correctly
   - Contrast is sufficient
   - Text is readable
   - Borders are visible
   - Hover states work
   - Focus states work

### Automated Testing

Use Chromatic for visual regression testing across themes:

```tsx
// .storybook/preview.ts
export const parameters = {
  chromatic: {
    // Test all themes
    modes: {
      light: {
        theme: 'light',
      },
      darkNeutral: {
        theme: 'dark-neutral',
      },
      darkGreen: {
        theme: 'dark-green',
      },
      darkViolet: {
        theme: 'dark-violet',
      },
    },
  },
}
```

## Common Theme Issues

### Issue 1: Hardcoded Colors

**Problem**:
```tsx
// ❌ Hardcoded color doesn't adapt to theme
<div style={{ color: '#3b82f6' }}>Text</div>
```

**Solution**:
```tsx
// ✅ Use design token
<div className="text-primary">Text</div>
```

### Issue 2: Missing Dark Mode Contrast

**Problem**:
```tsx
// ❌ Light gray text on dark background (poor contrast)
<div className="text-gray-300">Text</div>
```

**Solution**:
```tsx
// ✅ Use semantic token with proper contrast
<div className="text-foreground">Text</div>
```

### Issue 3: Invisible Borders

**Problem**:
```tsx
// ❌ Border color doesn't adapt
<div style={{ border: '1px solid #e5e7eb' }}>Content</div>
```

**Solution**:
```tsx
// ✅ Use border token
<div className="border border-border">Content</div>
```

### Issue 4: Background Bleed

**Problem**:
```tsx
// ❌ Component background doesn't match theme
<div style={{ background: 'white' }}>Content</div>
```

**Solution**:
```tsx
// ✅ Use background token
<div className="bg-background">Content</div>
```

## Best Practices

1. **Always use design tokens** - Never hardcode colors
2. **Test all themes** - Verify component in all 4 themes
3. **Include dark mode story** - Required for primitives
4. **Check contrast** - Ensure WCAG AA compliance (4.5:1)
5. **Disable backgrounds** - Use `backgrounds: { disable: true }` in dark mode stories
6. **Use semantic tokens** - `text-foreground` not `text-gray-900`
7. **Test hover states** - Verify hover works in all themes
8. **Test focus states** - Ensure focus rings are visible
9. **Document theme behavior** - Explain how component adapts
10. **Use theme wrapper** - Wrap dark mode stories with theme class

## Theme Token Reference

### Common Semantic Tokens

```tsx
// Backgrounds
bg-background          // Main background
bg-foreground          // Inverted background
bg-card                // Card background
bg-popover             // Popover background
bg-muted               // Muted background
bg-accent              // Accent background

// Text
text-foreground        // Main text
text-muted-foreground  // Muted text
text-primary           // Primary text
text-secondary         // Secondary text
text-destructive       // Error/danger text
text-accent-foreground // Accent text

// Borders
border-border          // Default border
border-input           // Input border
border-ring            // Focus ring

// Interactive
bg-primary             // Primary button
bg-secondary           // Secondary button
bg-destructive         // Destructive button
hover:bg-primary/90    // Primary hover
hover:bg-accent        // Accent hover
```

## Quick Reference

### Dark Mode Story Template

```tsx
export const DarkMode: Story = {
  render: () => (
    <div 
      className="dark-neutral" 
      style={{ 
        padding: '24px', 
        background: 'hsl(222.2 84% 4.9%)', 
        borderRadius: '8px' 
      }}
    >
      {/* Your components */}
    </div>
  ),
  parameters: {
    backgrounds: { disable: true },
  },
}
```

### Theme Testing Checklist

- [ ] Component uses design tokens (no hardcoded colors)
- [ ] Tested in light theme
- [ ] Tested in dark-neutral theme
- [ ] Tested in dark-green theme
- [ ] Tested in dark-violet theme
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Borders are visible in all themes
- [ ] Hover states work in all themes
- [ ] Focus states work in all themes
- [ ] Dark mode story included (primitives)
- [ ] Documentation mentions theme support
