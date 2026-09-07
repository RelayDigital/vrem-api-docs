# Vremly developer documentation

Source for **[docs.vremly.com](https://docs.vremly.com)** — the guides and API
reference for the [Vremly](https://vremly.com) API.

## Connect an AI assistant

Vremly has an MCP server. Create an API key in the Vremly app under
**Settings → API Keys**, then:

```bash
claude mcp add vremly --env VREMLY_API_KEY=your-api-key \
  -- npx -y github:RelayDigital/vremly-mcp
```

Or add it to your MCP host's config directly:

```json
{
  "mcpServers": {
    "vremly": {
      "command": "npx",
      "args": ["-y", "github:RelayDigital/vremly-mcp"],
      "env": {
        "VREMLY_API_KEY": "your-api-key"
      }
    }
  }
}
```

Nothing to clone or build — `npx` fetches and compiles it on first run. Source:
**[RelayDigital/vremly-mcp](https://github.com/RelayDigital/vremly-mcp)**.
Guide: **[docs.vremly.com/guides/mcp](https://docs.vremly.com/guides/mcp)**.

**Give it a `READ` key unless it needs to write.** Scopes are enforced on our
servers on every request, so a read-only key cannot be talked into changing
anything.

## Calling the API directly

```bash
curl https://api.vremly.com/projects -H "x-api-key: $VREMLY_API_KEY"
```

No `x-org-id` — a key belongs to one organization and the server derives it
from the key. Start at
[docs.vremly.com/guides/getting-started](https://docs.vremly.com/guides/getting-started).

Machine-readable entry points:

- [`/llms.txt`](https://docs.vremly.com/llms.txt) — index of these docs
- [`/openapi/openapi.json`](https://docs.vremly.com/openapi/openapi.json) — the
  full contract, 854 paths

## Running this site

```bash
npm install
npm start          # dev server
npm run build      # production build
npm run serve      # serve the build
```

Built with [Docusaurus](https://docusaurus.io) and
[Scalar](https://scalar.com) for the interactive reference. Vercel deploys
`main` automatically.

## How the API reference is produced

**Do not hand-write endpoint documentation.** Everything under `/api-reference`
renders from `static/openapi/openapi.json`, which is generated from the
backend's source. Improving the reference means improving the NestJS Swagger
decorators in `apps/backend`, not editing anything here. Only the guides in
`docs/` are written by hand.

To refresh the specification after a backend change:

```bash
cd apps/backend && npm run openapi:emit     # in the Vremly monorepo
cp openapi.json <this-repo>/static/openapi/openapi.json
```

> `openapi:emit` **must** run compiled — the script builds first for this
> reason. Run through `ts-node` it skips the compile-time `@nestjs/swagger`
> transformer and emits a document where ~80% of request bodies are an empty
> object, while still exiting 0 and listing every path. `prebuild` prints the
> path count on every build so a degraded spec is visible in the log.

The spec must live under `static/` — that is what makes it reachable at
`/openapi/openapi.json`, the URL `llms.txt` gives agents as the authority.

## Writing guides

Guides live in `docs/`, ordered by `sidebars.ts`. Two rules:

1. **Verify every route and field against the specification**, not against what
   seems reasonable. Guides here have previously documented endpoints that did
   not exist.
2. **The API strips unknown body fields rather than rejecting them**
   (`whitelist: true`), so a wrong field name in an example fails silently for
   whoever copies it.

`onBrokenLinks: 'throw'` fails the build on a bad internal link. Files under
`static/` are not routes — link them with a `pathname:///` prefix.
