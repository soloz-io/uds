import type { Preview } from '@storybook/react-vite'
import { themes } from 'storybook/theming'
import { useEffect } from 'react'
import type { ReactElement } from 'react'
// @ts-expect-error Storybook side-effect CSS import is resolved by Vite at runtime.
import '../app/globals.css'

const THEME_CLASSES = ['light', 'dark-neutral', 'dark-green', 'dark-violet'] as const

const WithTheme = (
  Story: () => ReactElement,
  context: { globals: { theme?: string } }
): ReactElement => {
  const { theme } = context.globals

  useEffect(() => {
    const selectedTheme =
      typeof theme === 'string' && THEME_CLASSES.includes(theme as (typeof THEME_CLASSES)[number])
        ? theme
        : 'dark-violet'

    const htmlElement = document.documentElement
    const bodyElement = document.body

    // Apply on both html and body to support stories that scope theme to either element.
    htmlElement.classList.remove(...THEME_CLASSES)
    bodyElement.classList.remove(...THEME_CLASSES)
    htmlElement.classList.add(selectedTheme)
    bodyElement.classList.add(selectedTheme)

    // Helpful for future theming hooks/selectors.
    htmlElement.setAttribute('data-theme', selectedTheme)
    bodyElement.setAttribute('data-theme', selectedTheme)
  }, [theme])

  return Story()
}

const preview: Preview = {
  decorators: [WithTheme],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    docs: {
      theme: themes.dark,
    },

    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
      ],
    },

    options: {
      storySort: {
        order: [
          'Pages',
          'Features',
          'Blocks',
          'Composites',
          'Primitives'
        ],
      },
    },
  },

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
  },
};

export default preview;