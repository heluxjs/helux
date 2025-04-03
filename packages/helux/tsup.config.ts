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

/**
 * 不能将类型“import("/Users/fancyzhong/Desktop/code/my-opensource/helux/node_modules/.pnpm/esbuild@0.17.19/node_modules/esbuild/lib/main").Plugin”
 * 分配给类型“import("/Users/fancyzhong/Desktop/code/my-opensource/helux/node_modules/.pnpm/esbuild@0.25.1/node_modules/esbuild/lib/main").Plugin”。
 */
