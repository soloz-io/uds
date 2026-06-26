/**
 * Icon registry for managing SVG icons
 * This allows for consistent icon usage across components
 */

export type IconElementType = 'path' | 'circle' | 'line' | 'rect' | 'polyline' | 'polygon';

export interface IconElement {
  type: IconElementType;
  attrs: Record<string, string>;
}

export interface IconDefinition {
  name: string;
  viewBox: string;
  /** Single path string (simple icons) */
  path?: string;
  /** Multi-element support (complex icons with paths, circles, lines, etc.) */
  elements?: IconElement[];
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
  'play': {
    name: 'play',
    viewBox: '0 0 24 24',
    path: 'M8 5v14l11-7z',
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

  // Database icon
  'database': {
    name: 'database',
    viewBox: '0 0 24 24',
    path: 'M12 2C8.13 2 5 4.69 5 8c0 3.31 3.13 6 7 6s7-2.69 7-6c0-3.31-3.13-6-7-6zM5 12v4c0 3.31 3.13 6 7 6s7-2.69 7-6v-4M5 8v4',
  },
  // Server icon
  'server': {
    name: 'server',
    viewBox: '0 0 24 24',
    path: 'M20 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2M4 18v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12h16M4 12v2a2 2 0 002 2h12a2 2 0 002-2v-2M8 6h.01M16 6h.01M8 18h.01M16 18h.01',
  },
  // Person icons
  'user': {
    name: 'user',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'circle', attrs: { cx: '12', cy: '8', r: '4' } },
      { type: 'path', attrs: { d: 'M20 21a8 8 0 1 0-16 0' } },
    ],
  },
  // Plugin specific icons
  'bot': {
    name: 'bot',
    viewBox: '0 0 24 24',
    path: 'M12 8V4H8 M2 14h2 M20 14h2 M15 13v2 M9 13v2 M4 8h16v12H4z',
  },
  'github': {
    name: 'github',
    viewBox: '0 0 24 24',
    path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  },
  'credit-card': {
    name: 'credit-card',
    viewBox: '0 0 24 24',
    path: 'M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zM1 10h22',
  },
  'video': {
    name: 'video',
    viewBox: '0 0 24 24',
    path: 'M23 7l-7 5 7 5V7z M1 5h15v14H1z',
  },
  'globe': {
    name: 'globe',
    viewBox: '0 0 24 24',
    path: 'M12 22a10 10 0 100-20 10 10 0 000 20z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  },

  // ---- Migrated lucide-react icons (multi-element support) ----

  'arrow-down': {
    name: 'arrow-down',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'M12 5v14' } },
      { type: 'path', attrs: { d: 'm19 12-7 7-7-7' } },
    ],
  },
  'zap': {
    name: 'zap',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z' } },
    ],
  },
  'eye-off': {
    name: 'eye-off',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49' } },
      { type: 'path', attrs: { d: 'M14.084 14.158a3 3 0 0 1-4.242-4.242' } },
      { type: 'path', attrs: { d: 'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143' } },
      { type: 'path', attrs: { d: 'm2 2 20 20' } },
    ],
  },
  'git-branch': {
    name: 'git-branch',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'line', attrs: { x1: '6', y1: '3', x2: '6', y2: '15' } },
      { type: 'circle', attrs: { cx: '18', cy: '6', r: '3' } },
      { type: 'circle', attrs: { cx: '6', cy: '18', r: '3' } },
      { type: 'path', attrs: { d: 'M18 9a9 9 0 0 1-9 9' } },
    ],
  },
  'pencil': {
    name: 'pencil',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' } },
      { type: 'path', attrs: { d: 'm15 5 4 4' } },
    ],
  },
  'send': {
    name: 'send',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z' } },
      { type: 'path', attrs: { d: 'm21.854 2.147-10.94 10.939' } },
    ],
  },
  'grip-vertical': {
    name: 'grip-vertical',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'circle', attrs: { cx: '9', cy: '12', r: '1' } },
      { type: 'circle', attrs: { cx: '9', cy: '5', r: '1' } },
      { type: 'circle', attrs: { cx: '9', cy: '19', r: '1' } },
      { type: 'circle', attrs: { cx: '15', cy: '12', r: '1' } },
      { type: 'circle', attrs: { cx: '15', cy: '5', r: '1' } },
      { type: 'circle', attrs: { cx: '15', cy: '19', r: '1' } },
    ],
  },
  'redo-2': {
    name: 'redo-2',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'm15 14 5-5-5-5' } },
      { type: 'path', attrs: { d: 'M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13' } },
    ],
  },
  'undo-2': {
    name: 'undo-2',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'M9 14 4 9l5-5' } },
      { type: 'path', attrs: { d: 'M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11' } },
    ],
  },
  'copy': {
    name: 'copy',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'rect', attrs: { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' } },
      { type: 'path', attrs: { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' } },
    ],
  },
  'paperclip': {
    name: 'paperclip',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'm16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551' } },
    ],
  },
  'brain': {
    name: 'brain',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'M12 18V5' } },
      { type: 'path', attrs: { d: 'M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4' } },
      { type: 'path', attrs: { d: 'M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5' } },
      { type: 'path', attrs: { d: 'M17.997 5.125a4 4 0 0 1 2.526 5.77' } },
      { type: 'path', attrs: { d: 'M18 18a4 4 0 0 0 2-7.464' } },
      { type: 'path', attrs: { d: 'M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517' } },
      { type: 'path', attrs: { d: 'M6 18a4 4 0 0 1-2-7.464' } },
      { type: 'path', attrs: { d: 'M6.003 5.125a4 4 0 0 0-2.526 5.77' } },
    ],
  },
  'book': {
    name: 'book',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20' } },
    ],
  },
  'columns-3': {
    name: 'columns-3',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'rect', attrs: { width: '18', height: '18', x: '3', y: '3', rx: '2' } },
      { type: 'path', attrs: { d: 'M9 3v18' } },
      { type: 'path', attrs: { d: 'M15 3v18' } },
    ],
  },
  'chevrons-left': {
    name: 'chevrons-left',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'm11 17-5-5 5-5' } },
      { type: 'path', attrs: { d: 'm18 17-5-5 5-5' } },
    ],
  },
  'chevrons-right': {
    name: 'chevrons-right',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'm6 17 5-5-5-5' } },
      { type: 'path', attrs: { d: 'm13 17 5-5-5-5' } },
    ],
  },
  'circle-check': {
    name: 'circle-check',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
      { type: 'path', attrs: { d: 'm9 12 2 2 4-4' } },
    ],
  },
  'circle-x': {
    name: 'circle-x',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
      { type: 'path', attrs: { d: 'm15 9-6 6' } },
      { type: 'path', attrs: { d: 'm9 9 6 6' } },
    ],
  },
  'circle-slash': {
    name: 'circle-slash',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
      { type: 'line', attrs: { x1: '9', y1: '15', x2: '15', y2: '9' } },
    ],
  },
  'clock': {
    name: 'clock',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'M12 6v6l4 2' } },
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '10' } },
    ],
  },
  'dot': {
    name: 'dot',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'circle', attrs: { cx: '12.1', cy: '12.1', r: '1' } },
    ],
  },
  'wrench': {
    name: 'wrench',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z' } },
    ],
  },
  'external-link': {
    name: 'external-link',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'M15 3h6v6' } },
      { type: 'path', attrs: { d: 'M10 14 21 3' } },
      { type: 'path', attrs: { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' } },
    ],
  },
  'message-circle': {
    name: 'message-circle',
    viewBox: '0 0 24 24',
    elements: [
      { type: 'path', attrs: { d: 'M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719' } },
    ],
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