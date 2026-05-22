# UI Library - Design System

The official design system and component library for Bizmatters, built with Next.js, React, Tailwind CSS, and shadcn/ui.

## Getting Started

### Initial Setup

After cloning the repository, set up the git hooks for design system governance:

```bash
cd packages/ui-lib
./scripts/setup-hooks.sh
```

This will install pre-commit hooks that enforce:
- Layer import architecture validation
- Storybook coverage validation

### Development Server

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Storybook

Run Storybook for component development and documentation:

```bash
pnpm storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the component library.
