import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    globals: true,
  },
});
