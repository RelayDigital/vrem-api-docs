---
title: Getting Started
sidebar_position: 1
---

# Getting Started

Your first successful request, in about two minutes.

## 1. Create an API key

In the Vremly app, go to **Settings → Developers → API Keys** and create one. Give it the
least it needs — `READ` if the integration only reads.

:::warning You see the key once
The response contains the only copy. Vremly stores a hash, so a lost key cannot
be recovered — revoke it and issue another.
:::

## 2. Make a request

```bash
curl https://api.vremly.com/projects \
  -H "x-api-key: $VREMLY_API_KEY"
```

That is the whole setup. **No `x-org-id` header**: a key belongs to one
organization and the server derives it from the key, so there is no tenant
header to get wrong — and no way for the key to reach another organization's
data.

A `200` with your projects means you are done. If not, see
[Troubleshooting](/guides/troubleshooting).

## 3. React to things happening

Rather than polling, subscribe to events:

```bash
curl -X POST https://api.vremly.com/webhooks/subscriptions \
  -H "x-api-key: $VREMLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/hooks/vremly",
    "events": ["DELIVERY_APPROVED"]
  }'
```

The response contains the signing secret — store it, it is what proves a
request came from Vremly. See [Webhooks](/guides/webhooks) for the payloads and
how to verify the signature.

Managing subscriptions needs a key with the `WEBHOOKS` scope.

## Before you write much code

Two things about this API that will otherwise cost you an afternoon:

- **Unknown body fields are dropped, not rejected.** Validation runs with
  `whitelist: true`, so a misspelled field is silently discarded and the
  request still succeeds. A `201` is not proof the server received what you
  meant to send. Check field names in the [API Reference](/api-reference).
- **A scope you do not hold returns `403`**, naming what was needed and what
  your key has. That is a credential problem, not a bug — reissue the key with
  the scope it names.

## Signing users in is not part of this API

If you were looking for a way to register or log in a Vremly user from your own
product: there isn't one, deliberately.

Vremly's own apps sign people in and hold a session, but that is first-party
plumbing. A third party collecting someone's Vremly password would tie your
integration to one person's account, break the day they leave, and put you in
possession of a credential you should never hold.

Use an API key instead. It represents the **organization**, not a person, so it
keeps working through staff changes and can be revoked on its own.

## Next

- [Authentication](/guides/authentication) — keys, scopes, tokens, refresh
- [Projects Workflow](/guides/projects-workflow) — the shoot lifecycle
- [MCP Server](/guides/mcp) — connect an AI assistant instead of writing a client
- [API Reference](/api-reference) — all 854 endpoints, with a live console
