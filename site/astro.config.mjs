import { defineConfig } from 'astro/config';
import path from 'path';
import { fileURLToPath } from 'url';

// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  site: 'https://accessiblecommunity.github.io',
  base: '/useable',
  server: { host: true },
  vite: {
    resolve: {
      alias: {
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      }
    },
    ssr: {
      noExternal: ['bootstrap'],
    },
  }
});
