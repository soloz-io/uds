import * as React from 'react';

/**
 * The design system's themes. Each is a set of CSS tokens selected by a class
 * on the document's root element (app/_generated-tokens*.css): `light` is the
 * `:root` default, each dark theme its own class.
 */
export const THEMES = ['light', 'dark-neutral', 'dark-green', 'dark-violet'] as const;
export type Theme = (typeof THEMES)[number];

/** The parts of an element applyTheme touches: its classes and one attribute. */
export interface ThemeRoot {
  classList: Pick<DOMTokenList, 'add' | 'remove'>;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

/**
 * Put one theme on a root element: its class, and `data-theme`. Any other
 * theme's class is removed first, so a root never carries two. Returns the
 * undo, which takes the theme off again.
 */
export function applyTheme(root: ThemeRoot, theme: Theme): () => void {
  if (!THEMES.includes(theme)) throw new Error(`Unknown theme "${theme}": one of ${THEMES.join(', ')}`);
  root.classList.remove(...THEMES);
  root.classList.add(theme);
  root.setAttribute('data-theme', theme);
  return () => {
    root.classList.remove(theme);
    root.removeAttribute('data-theme');
  };
}

export interface ThemeProviderProps {
  /** This app's theme. Each app chooses its own; there is no default. */
  theme: Theme;
  children?: React.ReactNode;
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/**
 * Themes this app's document. The theme goes on the document's root element,
 * not a wrapper, because dialogs, sheets, menus and tooltips render in portals
 * on document.body, outside any wrapper: only the root's class reaches them.
 *
 * One per app, and per document: an app in an iframe (a session's computer)
 * has its own document and themes it with its own provider. Applied before the
 * browser paints, so the app never shows another theme first.
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useIsomorphicLayoutEffect(() => applyTheme(document.documentElement, theme), [theme]);
  return <>{children}</>;
}
