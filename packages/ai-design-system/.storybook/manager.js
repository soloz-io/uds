import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

addons.setConfig({
  theme: themes.dark,
  sidebar: {
    order: ['Features', 'Blocks', 'Composites', 'Primitives'],
  },
});