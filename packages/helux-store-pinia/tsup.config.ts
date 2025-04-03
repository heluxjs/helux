import ep from 'esbuild-plugin-external-global';
import { defineConfig } from 'tsup';

const { externalGlobalPlugin } = ep;

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife'],
    dts: false,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: false,
    minify: 'terser',
    external: ['helux'],
    globalName: 'HeluxStorePinia',
    esbuildPlugins: [
      // @ts-ignore
      externalGlobalPlugin({
        helux: 'window.Helux',
      }),
    ],
  },
]);
