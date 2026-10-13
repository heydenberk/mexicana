import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths so the built bundle works from any static host or sub-path.
  base: './',
  // The era GeoJSON is bundled into the main chunk, so it is large by design (~0.7 MB gzipped).
  build: { chunkSizeWarningLimit: 3000 },
});
