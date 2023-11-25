import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest-setup.ts', // for vitest runner
    // setupFiles: './__tests__/vitest-setup.ts', // for local command 'npm run test'
  },
});
