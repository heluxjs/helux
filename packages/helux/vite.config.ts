import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // latest total test case count: 228
  test: {
    globals: true,
    environment: 'jsdom',
    // setupFiles: './vitest-setup.ts', // for vitest runner
    // setupFiles: './__tests__/vitest-setup.ts', // for local command 'npm run test',
    // include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    // include: ['./__tests__/hooks/useGlobalId.test.tsx'],
    // include: ['./__tests__/hook-options/arrDep.test.ts'],
    // include: ['__tests__/hooks/useActionLoading.test.ts'],
    // include: ['./__tests__/hooks/useAtom.test.ts'],
    // include: ['./__tests__/atom/base.test.ts'],
    // include: ['./__tests__/atom/mutate.test.ts'],
    // include: ['./__tests__/atom/mutateAsync.test.ts'],
    // include: ['./__tests__/share/change.test.ts'],
    // include: ['./__tests__/hooks/useMutateLoading.test.ts'],
    // include: ['./__tests__/dead-cycle/atomMutateFnChangeSelf.test.ts'],
    // include: ['./__tests__/dead-cycle-not-have/atomMutateFnReturnNew.test.ts'],
    // include: ['__tests__/atom/mutateMulti.test.ts'],
  },
});
