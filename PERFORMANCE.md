# Performance work — 2026-10-18

The Scalar adapter in `plugins/scalar-reference` retains the upstream route/configuration serializer and loads the pinned renderer only when the reference page mounts. It cleans up on route exit and supports retry after a script-load failure. The existing renderer, OpenAPI document, styles and request controls are preserved.

`src/theme/Root.tsx` preloads the same hashed font assets as the CSS loader, avoiding duplicate font requests. The reference mount reserves one viewport of space during initialization so the footer does not flash into view before the document loads. No final page dimensions or typography changed.

Validation: TypeScript and production build pass; `node scripts/check-scalar-route.cjs` checks route isolation and serialized function hooks. Browser checks cover no Scalar download on the homepage, one font request per font, client-side entry/exit/remount, controls, hover, and load-error/retry. Screenshot comparisons of the homepage and reference controls match exactly at 1440px and 390px.

Local Lighthouse results improved from 55/61 to 81/99 (mobile/desktop) on the docs homepage, and from 31/44 to 73/72 on the reference. Reference CLS improved from 0.917/0.324 to about 0.081/0.143. These are single-run lab measurements with simulated throttling and uncompressed local static delivery; they are not production or real-user guarantees. The required Scalar bundle is still large on its own route.
