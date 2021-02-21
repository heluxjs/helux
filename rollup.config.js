import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import { eslint } from 'rollup-plugin-eslint';
import pkg from './package.json'

const env = process.env.NODE_ENV;

// 排除掉react，不作为打包项目
const external = ['react', 'react-dom'].concat(Object.keys(pkg.peerDependencies || {}));

const config = {
  input: 'src/index.js',
  // output.exports must be 'default', 'named', 'none', 'auto', or left unspecified (defaults to 'auto')
  // exports: 'auto', /** Disable warning for default imports */
  external,
  output: {
    exports: 'named',
    format: 'umd',
    name: 'concent',
    globals: {
      // avoid (!) Missing global variable name
      react: 'React',
      'react-dom': 'ReactDOM',
    }
  },
  plugins: [
    nodeResolve(),
    babel({
      exclude: '**/node_modules/**',
      runtimeHelpers: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    commonjs({
      namedExports: {
        'node_modules/react-is/index.js': ['isValidElementType'],
      }
    }),
    eslint({
      include: ['src/**/*.js'] // 需要检查的部分
    }),
  ]
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
}

export default config;
