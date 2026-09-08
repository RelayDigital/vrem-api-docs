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

/**
 * Scalar's renderer is loaded from a CDN at runtime — that is how its
 * Docusaurus plugin works, there is no bundled mode. Its default is the
 * UNVERSIONED `.../npm/@scalar/api-reference`, which means the reference page
 * silently re-renders with whatever jsdelivr publishes that day: a dependency
 * that can change our flagship page without us shipping anything, and break it
 * without us touching it.
 *
 * So it is pinned. Raising this is a deliberate edit, tested like any other.
 */
const SCALAR_CDN = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.67.0';

const config: Config = {
  title: 'Vremly API',
  tagline: 'REST API for real-estate media production',
  favicon: 'img/favicon.ico',
  url: 'https://docs.vremly.com',
  baseUrl: '/',
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

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://cdn.jsdelivr.net',
      },
    },
  ],

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
          customCss: ['./src/css/custom.css', './src/css/mcp-guide.css'],
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
      '@scalar/docusaurus',
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
      // Light, because vremly.com is light — near-white ground, black buttons,
      // green only as an ambient wash. A dark-first docs site looked like a
      // different product, which is how this drifted into another tenant's
      // palette in the first place. Dark remains available via the toggle.
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Vremly',
      logo: {
        alt: 'Vremly',
        src: 'img/logo.png',
        srcDark: 'img/logo-dark.png',
        width: 28,
        height: 28,
      },
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
          to: '/guides/webhooks',
          label: 'Webhooks',
          position: 'left',
        },
        // The specification itself, one click from every page. An integrator
        // pointing a code generator or an agent at the API wants this file, and
        // previously the only way to find it was to read llms.txt.
        //
        // `pathname://` is required for anything under static/: without it
        // Docusaurus resolves the href against its route table, finds no route,
        // and fails the build as a broken link even though the file is served.
        {
          href: 'pathname:///openapi/openapi.json',
          label: 'OpenAPI',
          position: 'right',
        },
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
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies ThemeConfig,
};

export default config;
