import {themes as prismThemes} from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type { Options as PresetOptions, ThemeConfig } from '@docusaurus/preset-classic';

/**
 * docs.vremly.com
 *
 * The API reference is NOT hand-written. `prebuild` runs
 * scripts/fetch-openapi.sh, which pulls the specification from the running
 * backend's /api-json into static/openapi/openapi.json. Everything under
 * /api-reference is rendered from that document, so it cannot drift from the
 * server — improving the reference means improving the NestJS Swagger
 * decorators in apps/backend, not editing anything here. Only the guides under
 * docs/ are written by hand.
 */

/** Pinned Scalar standalone renderer, served locally for reliable reference loading. */
const SCALAR_CDN = '/vendor/scalar-api-reference-1.67.0.js';

const config: Config = {
  title: 'Vremly API',
  tagline: 'REST API for real-estate media production',
  favicon: 'img/vremly-mark-white.svg',
  url: 'https://docs.vremly.com',
  baseUrl: '/',
  // These are used above the fold on every page; fetch them before CSS/React
  // can paint fallback glyphs or an empty wordmark and then swap them in.
  headTags: [
    ...[
      'inter-latin-variable.woff2',
      'ibm-plex-sans-latin-variable.woff2',
      'ibm-plex-serif-latin-700-italic.woff2',
    ].map((font) => ({
      tagName: 'link' as const,
      attributes: {
        rel: 'preload',
        as: 'font',
        type: 'font/woff2',
        href: `/fonts/${font}`,
        crossorigin: 'anonymous',
      },
    })),
    {
      tagName: 'link' as const,
      attributes: { rel: 'preload', as: 'image', href: '/img/vremly-wordmark-black.svg' },
    },
  ],
  organizationName: 'RelayDigital',
  projectName: 'vrem-api-docs',
  onBrokenLinks: 'throw',

  // Moved out of the top level, where it is deprecated and slated for removal
  // in Docusaurus v4.
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

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
          // Array, not a string: mcp-guide.css is scoped to the MCP quickstart
          // and kept separate so it can be removed along with that page.
          customCss: ['./src/css/mcp-guide.css', './src/css/custom.css'],
        },
      } satisfies PresetOptions,
    ],
  ],

  themes: [
    // Search, built at compile time into a static index served from our own
    // origin. Deliberately not Algolia DocSearch: that needs an approved
    // application and an account whose outage takes search down with it, for a
    // site this size. Nothing here leaves the reader's browser.
    //
    // It indexes the GUIDES only. /api-reference is a single client-rendered
    // route with no server-rendered prose to crawl — Scalar ships its own
    // search over the specification, which is the better tool for finding an
    // endpoint anyway.
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        docsRouteBasePath: '/guides',
        indexBlog: false,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  plugins: [
    [
      require.resolve('./plugins/scalar-reference/index.cjs'),
      {
        label: 'API Reference',
        route: '/api-reference',
        // Suppressed because the navbar below already links here. Left on, the
        // plugin injects a SECOND "API Reference" item and the navbar shows the
        // same destination twice.
        showNavLink: false,
        cdn: SCALAR_CDN,
        configuration: {
          // By URL, not inlined content: static/openapi/openapi.json is served
          // at this path, and it is the same file llms.txt points agents at.
          // One copy, one source of truth.
          url: '/openapi/openapi.json',
          hideDownloadButton: false,
          showDeveloperTools: "never",
          agent: {disabled: true},
          // The palette is NOT set here. Scalar keeps its own light/dark state,
          // independent of the site's — so configuring colours through the
          // plugin renders a light reference under a dark navbar the moment a
          // reader uses the Docusaurus theme toggle.
          //
          // Instead src/css/custom.css sets Scalar's CSS variables under
          // `html[data-theme=…]`, the attribute Docusaurus actually toggles.
          // One toggle, both halves of the page. See the Scalar block there.
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/vremly-lockup-mono.png',
    metadata: [
      {
        name: 'description',
        content:
          'REST API for real-estate media production — shoots, customers, media delivery, invoicing and webhooks. Call it from GoHighLevel, n8n, or curl.',
      },
    ],
    colorMode: {
      // Developer workspace starts dark; readers can switch to light mode.
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Developers',
      logo: {
        alt: 'Vremly',
        src: 'img/vremly-wordmark-black.svg',
        width: 89,
        height: 16,
      },
      items: [
        { to: '/', label: 'Home', position: 'left', activeBaseRegex: '^/$' },
        { to: '/api', label: 'API', position: 'left', activeBaseRegex: '^/api' },
        { to: '/guides/mcp', label: 'AI assistants', position: 'left' },
        { label: 'Resources', position: 'left', items: [
          { label: 'Guides', to: '/guides/' },
          { label: 'API reference', to: '/api-reference' },
          { label: 'Changelog', to: '/guides/changelog' },
          { label: 'Training', href: 'https://training.vremly.com' },
          { label: 'Help center', href: 'https://vremly.com/support' },
        ] },
        { type: 'html', value: '<a href="https://app.vremly.com" class="docs-dashboard-action">Open dashboard</a>', className: 'docs-dashboard-item', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guides',
          items: [
            // docs/overview.md sets `slug: /`, so it is the docs root, not
            // /guides/overview.
            { label: 'Overview', to: '/guides/' },
            { label: 'Getting Started', to: '/guides/getting-started' },
            { label: 'Authentication', to: '/guides/authentication' },
            { label: 'Webhooks', to: '/guides/webhooks' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'API Reference', to: '/api-reference' },
            { label: 'Rate Limits', to: '/guides/rate-limits' },
            { label: 'Error Handling', to: '/guides/error-handling' },
            { label: 'Troubleshooting', to: '/guides/troubleshooting' },
          ],
        },
        {
          title: 'For machines',
          items: [
            {
              label: 'OpenAPI document',
              href: 'pathname:///openapi/openapi.json',
            },
            { label: 'llms.txt', href: 'pathname:///llms.txt' },
          ],
        },
        {
          title: 'Vremly',
          items: [
            { label: 'Platform', href: 'https://app.vremly.com' },
            { label: 'vremly.com', href: 'https://vremly.com' },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Vremly. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies ThemeConfig,
};

export default config;
