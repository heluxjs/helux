import copyStaticFile from 'esbuild-copy-static-files';
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
    external: ['helux-core', 'react'],
    globalName: 'Helux',
    esbuildPlugins: [
      copyStaticFile({
        src: './src/index.d.ts',
        dest: './dist/index.d.ts',
      }),
      externalGlobalPlugin({
        react: 'window.React',
      }),
    ],
  },
]);
