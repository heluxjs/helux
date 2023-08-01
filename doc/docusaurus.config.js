// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const HEL_GIT = 'https://github.com/tnfe/hel';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'hel-micro',
  tagline: '模块联邦sdk化，免构建、热更新、工具链无关的微模块方案',
  // url: 'https://your-docusaurus-test-site.com',
  // baseUrl: '/',
  url: 'https://tnfe.github.io',
  baseUrl: '/hel/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/hel.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['en', 'zh-Hans'],
    path: 'i18n',
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/tnfe/hel/doc',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'http://localhost:3000/hel/blog',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'hel-micro',
        logo: {
          alt: 'hel-micro-logo',
          src: 'https://tnfe.gtimg.com/image/1k4xi9izbk_1651642720099.png',
        },
        items: [
          // {
          //   type: 'doc',
          //   docId: 'intro',
          //   position: 'left',
          //   label: 'Tutorial',
          // },
          {
            type: 'docSidebar', // docSidebar
            position: 'left',
            sidebarId: 'tutorial', // foldername
            label: '教程', // navbar title
            docId: 'tutorial/intro',
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'api',
            label: 'api',
            docId: 'docs/api/intro',
          },
          {
            type: 'docSidebar', // docSidebar
            position: 'left',
            sidebarId: 'changelog', // foldername
            label: '日志', // navbar title
            docId: 'changelog',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: HEL_GIT,
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/tutorial/intro',
              },
            ],
          },
          {
            title: '社区',
            items: [
              {
                label: '议题',
                href: 'https://github.com/tnfe/hel/issues',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: '更新日志',
                to: '/docs/changelog/intro',
              },
              {
                label: 'GitHub',
                href: HEL_GIT,
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Tencent PCG TNTWeb.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

if (process.env.IS_LOCAL === 'true') {
  /** @type any */
  const navbar = config.themeConfig ? config.themeConfig.navbar : [];
  navbar.items.push(
    {
      type: 'docSidebar',
      position: 'left',
      sidebarId: 'tutorial-basics',
      label: 'tutorial-basics',
    },
    {
      type: 'docSidebar',
      position: 'left',
      sidebarId: 'tutorial-extras',
      label: 'tutorial-extras',
    },
  );
}

module.exports = config;
