# Changelog

## 2026-10-20
- Prevented late brand-font swaps from shifting headings and navigation text; preloaded fonts still render immediately when available.
- Preloaded the brand fonts and both navbar wordmarks so they are available earlier on first load.
- Matched the landing and training headers by keeping one preloaded 89×16 wordmark image and inverting it for dark mode, removing theme-dependent image replacement.
- Removed the refresh-time duplicate wordmark by rendering a single navbar logo image instead of Docusaurus's two-image SSR theme wrapper.

## 2026-10-18
- Fixed mobile API navigation so the sidebar cannot cover its close button after scrolling.
- Fixed the full-page theme canvas and made the header and V mark respond to light/dark mode.
- Replaced the native code-language menu with the same Radix Select primitive and filled styling used in the webapp. Aligned header height, logo rail, and dashboard action with the landing site.
- Added a dedicated developer hub homepage and moved the API documentation workspace to /api.
- Rebuilt the developer homepage with persistent navigation, a copyable quickstart, REST/MCP build paths, workflow guides, and production resources. Added a dark documentation theme and the official white V mark.
- Added original courtyard hero artwork matching the Vremly landscape illustration family.
- Aligned heading/body fonts, official navbar wordmark and homepage pill actions with the landing site. Fonts are served locally; documentation and API examples are unchanged.
