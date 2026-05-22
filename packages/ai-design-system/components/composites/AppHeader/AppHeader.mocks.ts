/**
 * Mock data for AppHeader stories and tests
 *
 * Imported by:
 * - AppHeader.stories.tsx
 */

import type { TabItem } from './AppHeader'

export const mockTabs: TabItem[] = [
  { value: 'agent', label: 'Agent' },
  { value: 'editor', label: 'Editor' }
]

export const mockTabsSingle: TabItem[] = [
  { value: 'single', label: 'Single Tab' }
]

export const mockTabsEmpty: TabItem[] = []

export const mockTabsMany: TabItem[] = [
  { value: 'agent', label: 'Agent' },
  { value: 'editor', label: 'Editor' },
  { value: 'settings', label: 'Settings' },
  { value: 'analytics', label: 'Analytics' }
]
