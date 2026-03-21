import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/sunbird-pdf-player.ts',
      name: 'SunbirdPdfPlayer',
      fileName: 'sunbird-pdf-player',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  }
});
