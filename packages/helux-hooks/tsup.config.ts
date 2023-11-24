import { defineConfig } from 'tsup';
import ep from 'esbuild-plugin-external-global';

const { externalGlobalPlugin } = ep;

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: false,
    treeshake: false,
    minify: 'terser',
    external: ['react'],
    globalName: 'HeluxHooks',
    esbuildPlugins: [
      externalGlobalPlugin({
        'react': 'window.React',
      }),
    ],
  },
]);
