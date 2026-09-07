---
title: MCP Server
sidebar_position: 7
---

# MCP Server

Vremly ships a [Model Context Protocol](https://modelcontextprotocol.io) server,
so an AI assistant can work with your projects, customers, media and invoices
directly instead of you copying data between it and the app.

It is a client of this same REST API. Everything on this page is governed by
the API key you give it — the assistant has exactly the access that key has,
and no more.

## Install

```bash
cd apps/mcp-server
npm install
npm run build
```

Then register it with your assistant. For Claude Code, in your MCP settings:

```json
{
  "mcpServers": {
    "vremly": {
      "command": "node",
      "args": ["/absolute/path/to/apps/mcp-server/dist/index.js"],
      "env": {
        "VREMLY_API_KEY": "your-api-key"
      }
    }
  }
}
```

Create the key under **Settings → API Keys** in the Vremly app.

### Configuration

| Variable | Default | Purpose |
|---|---|---|
| `VREMLY_API_KEY` | *(required)* | Your organization API key. |
| `VREMLY_API_URL` | `https://api.vremly.com` | API base URL. |
| `VREMLY_MCP_READ_ONLY` | unset | `1` refuses anything but `GET`/`HEAD`/`OPTIONS`. |
| `VREMLY_MCP_TIMEOUT_MS` | `30000` | Per-request timeout. |
| `VREMLY_OPENAPI_PATH` | bundled | Point at a different OpenAPI document. |

## What it exposes

Three tools, not one per endpoint:

| Tool | Purpose |
|---|---|
| `vremly_search_endpoints` | Find endpoints by keyword. |
| `vremly_describe_endpoint` | The endpoint's parameters, required body fields and responses. |
| `vremly_request` | Call it, and return the status and body. |

The API has over a thousand operations. A tool per operation would cost more
context to list than most tasks cost to do, and many assistants cap how many
tools they will accept. Search → describe → request reaches all of them at a
fixed cost, and because the search reads the OpenAPI document directly there is
no generated tool list to fall out of date.

:::tip Describing before calling is not optional
The API validates with `whitelist: true`: a body field it does not recognise is
**silently dropped**, not rejected. A request built from a guessed field name
returns `201` having ignored the field. `vremly_describe_endpoint` is what
stops an assistant guessing.
:::

## Permissions

**What the assistant can do is decided by the key, checked on our servers, on
every request.**

| Scope | Grants |
|---|---|
| `READ` | `GET`, `HEAD`, `OPTIONS` |
| `WRITE` | Everything `READ` allows, plus `POST`, `PUT`, `PATCH`, `DELETE` |
| `ADMIN` | Everything |
| `BULK_IMPORT` | The bulk import endpoints only |
| `WEBHOOKS` | Managing webhook subscriptions |

A key belongs to one organization and the server derives the organization from
it, so the assistant can never reach another organization's data.

:::warning Give it a READ key unless it needs to write
That is the guarantee that holds even if the assistant is prompt-injected by
something it reads — a listing description, an email, a web page. A read-only
key cannot be talked into deleting a project, because the refusal happens on
our servers and not in the assistant's judgement.

`VREMLY_MCP_READ_ONLY=1` is a convenience, **not** a security boundary:
anything able to set that variable could also unset it. The key's scopes are
the boundary.
:::

Requests are rate limited per key — 3/second, 20/10 seconds, 100/minute. See
[Rate Limits](/guides/rate-limits).

## Keeping it current

The OpenAPI document ships with the server and is refreshed from the backend:

```bash
cd apps/backend && npm run openapi:emit
cd ../mcp-server && npm run build
```

## Other agent-readable resources

- [`/llms.txt`](pathname:///llms.txt) — a machine-readable index of this
  documentation, following the llms.txt convention.
- [The OpenAPI document](pathname:///openapi/openapi.json) — the complete
  contract. It is the authority whenever a guide disagrees with it.
