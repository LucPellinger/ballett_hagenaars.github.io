import type { Plugin } from 'vite';
import { createApi } from './api.ts';

/**
 * Content editor (CMS) – only active with `yarn cms` (Vite mode "cms").
 * Serves a small local API under /__cms/api used by the editor UI in /cms/.
 * Runs only on this computer (localhost); it is never part of the website build.
 */
export function cmsPlugin(): Plugin {
  return {
    name: 'ballett-hagenaars-cms',
    apply: 'serve',
    configureServer(server) {
      const handle = createApi(server.config.root);
      server.middlewares.use('/__cms/api', (req, res) => {
        void handle(req, res);
      });
      server.httpServer?.once('listening', () => {
        setTimeout(() => {
          const base = server.resolvedUrls?.local[0] ?? 'http://localhost:5173/';
          server.config.logger.info(`\n  ✏️  Inhalte-Editor:  ${base}cms/\n`);
        }, 50);
      });
    },
  };
}
