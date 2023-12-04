import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    // setupFiles: './vitest-setup.ts', // for vitest runner
    // setupFiles: './__tests__/vitest-setup.ts', // for local command 'npm run test',
    // include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    // include: ['./__tests__/hooks/useGlobalId.test.tsx'],
    // include: ['./__tests__/hook-options/id.test.ts'],
  },
});
