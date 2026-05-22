/**
 * Icon registry for managing SVG icons
 * This allows for consistent icon usage across components
 */

export interface IconDefinition {
  name: string;
  viewBox: string;
  path: string;
}

/**
 * Default icon set with common UI icons
 * Icons are defined as SVG path data for optimal performance
 */
export const defaultIcons: Record<string, IconDefinition> = {
  // Navigation icons
  'chevron-down': {
    name: 'chevron-down',
    viewBox: '0 0 24 24',
    path: 'M6 9l6 6 6-6',
  },
  'chevron-up': {
    name: 'chevron-up',
    viewBox: '0 0 24 24',
    path: 'M18 15l-6-6-6 6',
  },
  'chevron-left': {
    name: 'chevron-left',
    viewBox: '0 0 24 24',
    path: 'M15 18l-6-6 6-6',
  },
  'chevron-right': {
    name: 'chevron-right',
    viewBox: '0 0 24 24',
    path: 'M9 18l6-6-6-6',
  },
  'chevrons-up-down': {
    name: 'chevrons-up-down',
    viewBox: '0 0 24 24',
    path: 'M7 15l5 5 5-5M7 9l5-5 5 5',
  },
  'arrow-left': {
    name: 'arrow-left',
    viewBox: '0 0 24 24',
    path: 'M19 12H5m7 7l-7-7 7-7',
  },
  'arrow-right': {
    name: 'arrow-right',
    viewBox: '0 0 24 24',
    path: 'M5 12h14m-7-7 7 7-7 7',
  },
  
  // Action icons
  'plus': {
    name: 'plus',
    viewBox: '0 0 24 24',
    path: 'M12 5v14m-7-7h14',
  },
  'minus': {
    name: 'minus',
    viewBox: '0 0 24 24',
    path: 'M5 12h14',
  },
  'x': {
    name: 'x',
    viewBox: '0 0 24 24',
    path: 'M18 6L6 18M6 6l12 12',
  },
  'check': {
    name: 'check',
    viewBox: '0 0 24 24',
    path: 'M20 6L9 17l-5-5',
  },
  
  // Interface icons
  'search': {
    name: 'search',
    viewBox: '0 0 24 24',
    path: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  'settings': {
    name: 'settings',
    viewBox: '0 0 24 24',
    path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  'menu': {
    name: 'menu',
    viewBox: '0 0 24 24',
    path: 'M4 6h16M4 12h16M4 18h16',
  },
  'more-horizontal': {
    name: 'more-horizontal',
    viewBox: '0 0 24 24',
    path: 'M12 12h.01M19 12h.01M5 12h.01',
  },
  'more-vertical': {
    name: 'more-vertical',
    viewBox: '0 0 24 24',
    path: 'M12 5h.01M12 12h.01M12 19h.01',
  },
  
  // Status icons
  'alert-circle': {
    name: 'alert-circle',
    viewBox: '0 0 24 24',
    path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4m0 4h.01',
  },
  'check-circle': {
    name: 'check-circle',
    viewBox: '0 0 24 24',
    path: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
  },
  'info': {
    name: 'info',
    viewBox: '0 0 24 24',
    path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16v-4m0-4h.01',
  },
  'warning': {
    name: 'warning',
    viewBox: '0 0 24 24',
    path: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01',
  },
  
  // File and document icons
  'file': {
    name: 'file',
    viewBox: '0 0 24 24',
    path: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8m8 4H8m8-8H8',
  },
  'folder': {
    name: 'folder',
    viewBox: '0 0 24 24',
    path: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
  },
  'download': {
    name: 'download',
    viewBox: '0 0 24 24',
    path: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-5l5 5 5-5m-5 5V3',
  },
  'upload': {
    name: 'upload',
    viewBox: '0 0 24 24',
    path: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m14-7l-5-5-5 5m5-5v12',
  },
  
  // Communication icons
  'mail': {
    name: 'mail',
    viewBox: '0 0 24 24',
    path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  },
  'phone': {
    name: 'phone',
    viewBox: '0 0 24 24',
    path: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z',
  },
  
  // Graph and visualization icons
  'circle': {
    name: 'circle',
    viewBox: '0 0 24 24',
    path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
  },
  'square': {
    name: 'square',
    viewBox: '0 0 24 24',
    path: 'M3 3h18v18H3z',
  },
  'triangle': {
    name: 'triangle',
    viewBox: '0 0 24 24',
    path: 'M12 2l10 18H2z',
  },
  'diamond': {
    name: 'diamond',
    viewBox: '0 0 24 24',
    path: 'M6 3h12l4 6-10 12L2 9z',
  },
  
  // Additional action icons
  'save': {
    name: 'save',
    viewBox: '0 0 24 24',
    path: 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8',
  },
  'loader-2': {
    name: 'loader-2',
    viewBox: '0 0 24 24',
    path: 'M21 12a9 9 0 11-6.219-8.56',
  },
  'refresh-cw': {
    name: 'refresh-cw',
    viewBox: '0 0 24 24',
    path: 'M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16M3 21v-5h5',
  },
  'trending-up': {
    name: 'trending-up',
    viewBox: '0 0 24 24',
    path: 'M22 7l-8.5 8.5-5-5L2 17m20-10h-7m7 0v7',
  },
  'trending-down': {
    name: 'trending-down',
    viewBox: '0 0 24 24',
    path: 'M22 17l-8.5-8.5-5 5L2 7m20 10h-7m7 0v-7',
  },
  'rocket': {
    name: 'rocket',
    viewBox: '0 0 24 24',
    path: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z',
  },
  'file-text': {
    name: 'file-text',
    viewBox: '0 0 24 24',
    path: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8m8 4H8m8-8H8',
  },
  'message-square': {
    name: 'message-square',
    viewBox: '0 0 24 24',
    path: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  },
};

/**
 * Type-safe icon names from the default icon set
 * Use this type to ensure icon names are valid at compile time
 */
export type IconName = keyof typeof defaultIcons;

/**
 * Icon registry class for managing custom icons
 */
class IconRegistry {
  private icons: Map<string, IconDefinition> = new Map();

  constructor() {
    // Register default icons
    Object.values(defaultIcons).forEach(icon => {
      this.register(icon);
    });
  }

  /**
   * Register a new icon
   */
  register(icon: IconDefinition): void {
    this.icons.set(icon.name, icon);
  }

  /**
   * Register multiple icons at once
   */
  registerMany(icons: IconDefinition[]): void {
    icons.forEach(icon => this.register(icon));
  }

  /**
   * Get an icon by name
   */
  get(name: string): IconDefinition | undefined {
    return this.icons.get(name);
  }

  /**
   * Check if an icon exists
   */
  has(name: string): boolean {
    return this.icons.has(name);
  }

  /**
   * Get all registered icon names
   */
  getNames(): string[] {
    return Array.from(this.icons.keys());
  }

  /**
   * Remove an icon from the registry
   */
  unregister(name: string): boolean {
    return this.icons.delete(name);
  }
}

// Export singleton instance
export const iconRegistry = new IconRegistry();