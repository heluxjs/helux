module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/react',
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
};
