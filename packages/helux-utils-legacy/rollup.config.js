import typescript from 'rollup-plugin-typescript';
// 避免 Error: 'default' is not exported by node_modules ... 错误
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const globalName = 'HeluxUtils';
module.exports = {
  input: 'src/index.ts',
  plugins: [
    commonjs(),
    typescript({
      // exclude: 'node_modules/**',
      typescript: require('typescript'),
    }),
    // 如不想压缩，不配置 terser() 即可
    terser(),
  ],
  output: [
    {
      format: 'umd',
      name: globalName,
      file: `dist/${pkg.name}.min.js`,
    },
  ],
};
