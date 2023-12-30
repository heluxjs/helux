import { defineConfig } from 'dumi';

export default defineConfig({
  favicons: ['https://tnfe.gtimg.com/image/dlykfuw8ai_1703851692543.png'],
  locales: [
    { id: 'zh-CN', name: '中文' },
    { id: 'en-US', name: 'English' },
  ],
  outputPath: '../docs', // 输出到 <root>/docs 配合 github-pages 的 /docs 配置
  base: '/helux',
  publicPath: '/helux/',
  // exportStatic: {},
  themeConfig: {
    name: 'Helux',
    nav: [
      { title: '指南', link: '/guide' },
      { title: '参考', link: '/reference' },
      { title: '教程', link: '/examples' },
      { title: '生态', link: '/ecosystem' },
      { title: 'GitHub', link: 'https://github.com/heluxjs/helux' },
    ],
  },
  // #443082 #e8ae56
  theme: {
    '@c-primary': '#443082',
    'primary-color': '#443082',
  },
  logo: 'https://tnfe.gtimg.com/image/dlykfuw8ai_1703851692543.png',
});
