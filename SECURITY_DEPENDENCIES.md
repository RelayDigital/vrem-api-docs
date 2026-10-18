# Docs dependency security review — 2026-10-18

- Kept Docusaurus 3.10.2; compatible lockfile updates include proxy-addr, shell-quote, websocket-driver, webpack-dev-server, Joi, js-yaml and other vulnerable transitives. Scalar's plugin resolves to 0.8.51; the route's served standalone renderer stays pinned to the existing 1.67.0 asset.
- Tested explicit overrides: Tinypool 2.1.2, serialize-javascript 7.0.5, postcss-selector-parser 7.1.6, and SockJS's UUID 11.1.1. These remove findings blocked by upstream dependency ranges, without a Docusaurus downgrade.
- Production-declared dependency graph: **68 findings (18 critical, 28 high, 22 moderate) → 29 high parent/leaf findings**, all from `braces` through chokidar/micromatch/fast-glob. **Zero critical and moderate findings remain.**
- The deployment is static `build/` output (`vercel.json`); these Node build/dev packages are not a running production service.

## Override compatibility and validation

Docusaurus already requires Node >=20. Tinypool 2 drops Node 18, so its runtime minimum does not raise this site's existing minimum. `scripts/check-security-overrides.cjs` exercises Docusaurus's pool constructor/run/worker-data contract, serializer behavior, selector round trips and SockJS UUID v4 CommonJS use. The normal build does not enable SSG worker threads, so the additional pool check is intentional.

Production build and TypeScript pass. Route-only Scalar loading/configuration test passes. Before/after browser checks of `/`, `/api`, `/api-reference` at 390 and 1440px show identical heading/layout measurements and no page errors; homepage/API screenshots are pixel-identical. API reference geometry is unchanged. More/auth controls and hover states pass in light/dark themes at 390/1004/1440px. Clean frozen installation passes.

## Remaining advisory: build/development tools only

GHSA-vfj7-8cjw-p6xm affects `braces` through 3.0.3. The upstream advisory lists no patched version: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm . Deeply nested attacker-controlled glob patterns can exhaust the Node stack.

The installed callers receive repository/configuration-controlled glob patterns and local source paths. There is no public route accepting a glob pattern and passing it to this parser. This is a reachability assessment, not a claim that the package is patched. Keep build configuration and source changes reviewed; do not expose build/development servers as production services. Review again by **2026-10-25**, or immediately if an input boundary changes or an upstream patch becomes available. Audit counts below include inherited parent-package findings for this single underlying advisory. No audit suppression or forced framework downgrade was added.

## Reproducible installation

- Declared package manager: npm 11.8.0. Verified on Node 22.22.0.
- `.npmrc` sets `ignore-scripts=true`; dependency lifecycle scripts are blocked in ordinary npm installs.
- Clean `npm ci --ignore-scripts --no-audit` verified from the exact manifests/lockfile in an isolated directory; caches retained.
- Existing optional platform packages provide native binaries without install scripts. No blanket lifecycle-script approval was added.
- No production deployment or infrastructure change performed.
