import { defineConfig } from 'dumi';
import { resolve } from 'path';

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
      { title: 'API', link: '/api' },
      { title: '参考', link: '/reference' },
      { title: '生态', link: '/ecosystem' },
      { title: 'GitHub', link: 'https://github.com/heluxjs/helux' },
    ],
  },
  // #443082 #e8ae56
  theme: {
    // '@c-primary': '#e8ae56',
    '@c-primary': '#645ab7',
    'primary-color': '#e8ae56',
  },
  logo: 'https://tnfe.gtimg.com/image/dlykfuw8ai_1703851692543.png',
  alias: {
    'src/demos': resolve(__dirname, 'src/demos'),
    '@/demos': resolve(__dirname, 'docs/demos'),
  },
});
