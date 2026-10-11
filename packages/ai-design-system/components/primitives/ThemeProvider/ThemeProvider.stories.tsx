import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider, THEMES } from './ThemeProvider';

const meta: Meta<typeof ThemeProvider> = {
  title: 'Primitives/ThemeProvider',
  component: ThemeProvider,
  argTypes: { theme: { control: 'select', options: THEMES } },
  args: { theme: 'dark-violet' },
};
export default meta;

type Story = StoryObj<typeof ThemeProvider>;

/** The app's theme on the document root: the panel below, and any portal, take its tokens. */
export const Default: Story = {
  render: (args) => (
    <ThemeProvider {...args}>
      <div className="bg-background text-foreground border border-border rounded-lg p-6">
        This app is themed <strong>{args.theme}</strong>.
      </div>
    </ThemeProvider>
  ),
};
