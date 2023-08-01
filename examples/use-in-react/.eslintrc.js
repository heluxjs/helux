module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['plugin:react/recommended'],
  env: {
    jest: true,
  },
  globals: {
    JSX: true,
    React: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 0,
    'max-len': 0,
    '@typescript-eslint/naming-convention': 0,
    'react/display-name': 0,
    '@typescript-eslint/prefer-optional-chain': 0,
    '@typescript-eslint/no-namespace': 0,
  },
};
