import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://deresys.com.tr',
  build: {
    format: 'directory',
    // Satır içi CSS üretme — CSP'de style-src 'unsafe-inline' gerekmesin
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Satır içi <script> üretme — CSP'de script-src 'unsafe-inline' gerekmesin
      assetsInlineLimit: 0,
    },
  },
});
