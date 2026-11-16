import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths so the built bundle works from any static host or sub-path.
  base: './',
  build: {
    // The era GeoJSON is bundled into the main chunk, so it is large by design (~0.7 MB gzipped).
    chunkSizeWarningLimit: 3000,
    // Three pages: the atlas, the history quiz at quiz/ (served as /mexicana/quiz/), and the states and cities quiz at places/.
    rolldownOptions: { input: { atlas: 'index.html', quiz: 'quiz/index.html', places: 'places/index.html' } },
  },
});
