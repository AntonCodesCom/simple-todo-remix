import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./app/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'jsdom',
  },
});
