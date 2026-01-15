import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3';
import { createPinia } from 'pinia';
import '../src/main.css';

setup((app) => {
  app.use(createPinia());
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
