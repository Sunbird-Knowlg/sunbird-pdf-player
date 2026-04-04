import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/sunbird-pdf-player.ts'),
      name: 'SunbirdPdfPlayer',
      fileName: 'sunbird-pdf-player',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
      },
      onwarn(warning, warn) {
        // Suppress false-positive "not exported" for namespace imports from CJS/ESM dual packages
        if (warning.code === 'MISSING_EXPORT') return;
        warn(warning);
      },
    },
    // Do NOT inline the worker as base64 — keep it as a separate file
    assetsInlineLimit: 0,
  },
  // Dev server: serve the demo page with CSS
  css: {
    postcss: './postcss.config.js',
  },
  // Copy the PDF.js worker to the build output
  assetsInclude: ['**/*.mjs'],
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
    include: ['@project-sunbird/telemetry-sdk'],
  },
  worker: {
    format: 'es',
  },
});
