module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: ['eslint:recommended'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  rules: {
    'constructor-super': 0,
    camelcase: 0,
    '@typescript/no-unused-vars': 0,
  },
};
