/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Base path the site is served from.
 * - Custom domain / user site → "/" (default)
 * - GitHub project page       → "/<repo-name>/"
 * CI sets BASE_PATH automatically from `actions/configure-pages` (see .github/workflows/deploy.yml).
 */
const rawBase = process.env.BASE_PATH ?? '/';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

/** Preview deployments (VITE_PREVIEW=true) must not be indexed by search engines. */
const isPreview = process.env.VITE_PREVIEW === 'true';

function noindexOnPreview(): Plugin {
  return {
    name: 'noindex-on-preview',
    transformIndexHtml(html) {
      return isPreview ? html.replace('<head>', '<head>\n    <meta name="robots" content="noindex, nofollow" />') : html;
    },
  };
}

/**
 * GitHub Pages has no SPA fallback. We emit a 404.html that redirects deep links
 * (e.g. /stundenplan) to index.html?redirect=/stundenplan; src/main.tsx restores the URL.
 */
function spaFallback404(): Plugin {
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: '404.html',
        source: `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>Ballettschule Hagenaars</title>
    <script>
      (function () {
        var base = ${JSON.stringify(base)};
        var l = window.location;
        var rest = l.pathname.indexOf(base) === 0 ? l.pathname.slice(base.length) : l.pathname.replace(/^\\//, '');
        l.replace(base + '?redirect=' + encodeURIComponent('/' + rest + l.search) + l.hash);
      })();
    </script>
  </head>
  <body></body>
</html>
`,
      });
    },
  };
}

export default defineConfig({
  base,
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  plugins: [
    react(),
    spaFallback404(),
    noindexOnPreview(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Ballettschule Hagenaars',
        short_name: 'Hagenaars',
        description: 'Ballett, Kindertanz, Modern, Flamenco und Jazz in Haßloch.',
        lang: 'de',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#8f1f16',
        theme_color: '#8f1f16',
        icons: [
          { src: 'icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,jpg,jpeg,woff2}'],
        navigateFallback: `${base}index.html`,
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
