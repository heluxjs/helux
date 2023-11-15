import babel from 'rollup-plugin-babel'; // 支持jsx
import commonjs from 'rollup-plugin-commonjs'; // 支持按commonjs规范来导入外部模块
import resolve from 'rollup-plugin-node-resolve'; // 支持内部的模块路径解析
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies);
const env = process.env.BUILD_ENV;
const bundleName = pkg.name.includes('/') ? pkg.name.split('/')[1] : pkg.name;
const globalName = 'HeluxTypes';

const env2outputConf = {
  commonjs: {
    format: 'cjs',
    dir: 'lib',
  },
  es: {
    format: 'es',
    dir: 'es',
  },
  development: {
    format: 'umd',
    file: `dist/${bundleName}.js`,
    name: globalName,
  },
  production: {
    format: 'umd',
    file: `dist/${bundleName}.min.js`,
    name: globalName,
  },
};

const config = {
  input: 'src-js/index.js',
  external,
  output: {
    ...env2outputConf[env],
    exports: 'named',
    globals: {
      limu: 'limu',
    },
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: '**/node_modules/**',
      runtimeHelpers: true,
    }),
  ],
};

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
    }),
  );
}

export default config;
