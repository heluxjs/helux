import copyStaticFile from 'esbuild-copy-static-files';
import { defineConfig } from 'tsup';
export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: false,
    minify: 'terser',
    external: [],

    esbuildPlugins: [
      copyStaticFile({
        src: './src/types-api.d.ts',
        dest: './dist/types-api.d.ts',
      }),
    ],
  },
]);
