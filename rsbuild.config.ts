import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const { publicVars } = loadEnv({ prefixes: ['VITE_'] });

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  source: {
    define: {
      ...publicVars,
    },
  },
  html: {
    title: 'Streetrack',
    tags: [
      {
        tag: 'meta',
        head: true,
        attrs: {
          name: 'description',
          content:
            'Streetrack is a personal finance / expense-tracking application to manage income and expenses in a structured way.',
        },
      },
      {
        tag: 'meta',
        head: true,
        attrs: { name: 'application-name', content: 'Streetrack' },
      },
    ],
  },
});
