import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths so the built bundle works from any static host or sub-path.
  base: './',
  build: {
    // The era GeoJSON is bundled into the main chunk, so it is large by design (~0.7 MB gzipped).
    chunkSizeWarningLimit: 3000,
    // Two pages: the atlas, and the quiz at quiz/ (served as /mexicana/quiz/).
    rolldownOptions: { input: { atlas: 'index.html', quiz: 'quiz/index.html' } },
  },
});
