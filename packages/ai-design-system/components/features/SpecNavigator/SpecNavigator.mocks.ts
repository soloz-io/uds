/**
 * Mock data for SpecNavigator stories and tests
 * 
 * This file contains reusable mock data that can be imported by:
 * - SpecNavigator.stories.tsx (regular stories)
 * - SpecNavigator.behaviors.stories.tsx (behavior tests)
 * - Any other test files that need SpecNavigator mock data
 */

import type { FileGroup } from '@/components/composites/FileQueue'

/**
 * Sample spec groups for stories and tests
 */
export const sampleSpecGroups: FileGroup[] = [
  {
    id: 'playbook',
    title: 'Instructions',
    icon: 'file-text',
    iconColor: 'text-blue-600 dark:text-blue-500',
    files: [
      { id: 'req1', name: 'requirements.md', path: '.kiro/specs/feature/' },
      { id: 'req2', name: 'user-stories.md', path: '.kiro/specs/feature/' },
      { id: 'req3', name: 'acceptance-criteria.md', path: '.kiro/specs/feature/' },
    ],
    defaultOpen: true,
  },
  {
    id: 'cast',
    title: 'Agents',
    icon: 'layout',
    iconColor: 'text-purple-600 dark:text-purple-500',
    files: [
      { id: 'design1', name: 'design.md', path: '.kiro/specs/feature/' },
      { id: 'design2', name: 'architecture.md', path: '.kiro/specs/feature/' },
      { id: 'design3', name: 'data-models.md', path: '.kiro/specs/feature/' },
    ],
    defaultOpen: false,
  },
  {
    id: 'toolkit',
    title: 'Toolbox',
    icon: 'check-square',
    iconColor: 'text-green-600 dark:text-green-500',
    files: [
      { id: 'task1', name: 'tasks.md', path: '.kiro/specs/feature/' },
      { id: 'task2', name: 'implementation-plan.md', path: '.kiro/specs/feature/' },
    ],
    defaultOpen: false,
  },
  {
    id: 'triggers',
    title: 'Triggers',
    icon: 'zap',
    iconColor: 'text-orange-600 dark:text-orange-500',
    files: [
      { id: 'trigger1', name: 'cron-every-20min.md', path: '.kiro/specs/feature/' },
      { id: 'trigger2', name: 'cron-daily-1pm.md', path: '.kiro/specs/feature/' },
      { id: 'trigger3', name: 'on-file-save.md', path: '.kiro/specs/feature/' },
    ],
    defaultOpen: false,
  },
]

/**
 * Empty groups for testing empty state
 */
export const emptySpecGroups: FileGroup[] = [
  {
    id: 'playbook',
    title: 'Instructions',
    icon: 'file-text',
    iconColor: 'text-blue-600 dark:text-blue-500',
    files: [],
    defaultOpen: true,
  },
  {
    id: 'cast',
    title: 'Agents',
    icon: 'layout',
    iconColor: 'text-purple-600 dark:text-purple-500',
    files: [],
    defaultOpen: true,
  },
  {
    id: 'toolkit',
    title: 'Toolbox',
    icon: 'check-square',
    iconColor: 'text-green-600 dark:text-green-500',
    files: [],
    defaultOpen: true,
  },
  {
    id: 'triggers',
    title: 'Triggers',
    icon: 'zap',
    iconColor: 'text-orange-600 dark:text-orange-500',
    files: [],
    defaultOpen: true,
  },
]

/**
 * Large groups for testing scrolling behavior
 */
export const largeSpecGroups: FileGroup[] = [
  {
    id: 'playbook',
    title: 'Instructions',
    icon: 'file-text',
    iconColor: 'text-blue-600 dark:text-blue-500',
    files: Array.from({ length: 25 }, (_, i) => ({
      id: `req${i + 1}`,
      name: `requirement-${i + 1}.md`,
      path: '.kiro/specs/feature/',
    })),
    defaultOpen: true,
  },
  {
    id: 'cast',
    title: 'Agents',
    icon: 'layout',
    iconColor: 'text-purple-600 dark:text-purple-500',
    files: Array.from({ length: 15 }, (_, i) => ({
      id: `design${i + 1}`,
      name: `design-${i + 1}.md`,
      path: '.kiro/specs/feature/',
    })),
    defaultOpen: false,
  },
]
