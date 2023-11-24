import copyStaticFile from 'esbuild-copy-static-files';
import { defineConfig } from 'tsup';
export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: false,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: false,
    minify: 'terser',
    external: [],
    globalName: 'HeluxUtils',
    esbuildPlugins: [
      copyStaticFile({
        src: './src/index.d.ts',
        dest: './dist/index.d.ts',
      }),
    ],
  },
]);
