import type { Config } from '@docusaurus/types';
import type { Options as PresetOptions, ThemeConfig } from '@docusaurus/preset-classic';

const config: Config = {
  title: 'VREM API Documentation',
  tagline: 'VX Real Estate Media — Developer Documentation',
  favicon: 'img/favicon.ico',
  url: 'https://docs.vrem.com',
  baseUrl: '/',
  organizationName: 'RelayDigital',
  projectName: 'vrem-api-docs',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'guides',
          path: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies PresetOptions,
    ],
    [
      'redocusaurus',
      {
        specs: [
          {
            spec: 'openapi/openapi.json',
            route: '/api-reference',
          },
        ],
        theme: {
          primaryColor: '#1a1a2e',
          options: {
            disableSearch: false,
            hideDownloadButton: false,
            expandSingleSchemaField: true,
            jsonSampleExpandLevel: 2,
            sortOperationsAlphabetically: false,
            sortTagsAlphabetically: false,
            pathInMiddlePanel: true,
            requiredPropsFirst: true,
          },
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'VREM',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guidesSidebar',
          position: 'left',
          label: 'Guides',
        },
        {
          to: '/api-reference',
          label: 'API Reference',
          position: 'left',
        },
        {
          type: 'html',
          position: 'right',
          value: '<span style="border:1px solid #ccc;border-radius:4px;padding:2px 8px;font-size:12px;color:#888;">v1.0</span>',
        },
        {
          href: 'https://github.com/RelayDigital/vrem-api-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Getting Started', to: '/guides/guides/getting-started' },
            { label: 'Authentication', to: '/guides/guides/authentication' },
            { label: 'API Reference', to: '/api-reference' },
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'VREM Platform', href: 'https://app.vrem.com' },
            { label: 'GitHub', href: 'https://github.com/RelayDigital/vrem-api-docs' },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} VX Real Estate Media. All rights reserved.`,
    },
    prism: {
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies ThemeConfig,
};

export default config;
