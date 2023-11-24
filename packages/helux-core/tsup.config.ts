import copyStaticFile from 'esbuild-copy-static-files';
import { defineConfig } from 'tsup';

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
    external: [],
    globalName: 'HeluxCore',
    esbuildPlugins: [
      copyStaticFile({
        src: './src/index.d.ts',
        dest: './dist/index.d.ts',
      }),
      copyStaticFile({
        src: './src/types',
        dest: './dist/types',
      }),
    ],
  },
]);
