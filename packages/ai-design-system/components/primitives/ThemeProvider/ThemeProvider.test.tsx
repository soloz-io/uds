import { describe, expect, it } from 'vitest';
import { applyTheme, THEMES, type Theme, type ThemeRoot } from './ThemeProvider';

function fakeRoot(initial: string[] = []) {
  const classes = new Set(initial);
  const attributes = new Map<string, string>();
  const root: ThemeRoot = {
    classList: {
      add: (...names: string[]) => names.forEach((n) => classes.add(n)),
      remove: (...names: string[]) => names.forEach((n) => classes.delete(n)),
    },
    setAttribute: (name, value) => void attributes.set(name, value),
    removeAttribute: (name) => void attributes.delete(name),
  };
  return { root, classes, attributes };
}

describe('applyTheme', () => {
  it('puts the theme class and data-theme on the root', () => {
    const { root, classes, attributes } = fakeRoot(['app-shell']);
    applyTheme(root, 'dark-violet');
    expect([...classes].sort()).toEqual(['app-shell', 'dark-violet']);
    expect(attributes.get('data-theme')).toBe('dark-violet');
  });

  it('leaves exactly one theme on the root', () => {
    const { root, classes } = fakeRoot(['dark-green', 'light']);
    applyTheme(root, 'dark-neutral');
    expect([...classes].filter((c) => (THEMES as readonly string[]).includes(c))).toEqual(['dark-neutral']);
  });

  it('undoes itself, leaving the root as it found other classes', () => {
    const { root, classes, attributes } = fakeRoot(['app-shell']);
    const undo = applyTheme(root, 'light');
    undo();
    expect([...classes]).toEqual(['app-shell']);
    expect(attributes.has('data-theme')).toBe(false);
  });

  it('refuses a theme the design system does not define', () => {
    expect(() => applyTheme(fakeRoot().root, 'dark-blue' as Theme)).toThrow('Unknown theme "dark-blue"');
  });
});
