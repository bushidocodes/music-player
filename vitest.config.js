import { defineConfig } from 'vitest/config';

// Server-side tests run in Node. Kept separate from vite.config.js, which is
// scoped to the browser build (root: 'browser').
export default defineConfig({
  test: {
    environment: 'node',
    include: ['server/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['server/**/*.js'],
      exclude: ['server/**/*.test.js'],
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      all: true,
    },
  },
});
