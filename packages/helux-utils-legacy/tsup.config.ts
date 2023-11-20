import { defineConfig } from 'tsup';
// import copyStaticFile from "esbuild-copy-static-files"

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
  },
]);
