---
id: overview
title: Overview
slug: /
sidebar_position: 1
---

# Vremly API

A REST API over real-estate media production: shoots, the people who staff
them, the media they produce, delivery to the client, and invoicing. It is what
you call to make Vremly do something from GoHighLevel, n8n, a cron job, or a
line of `curl`.

## Base URL

```
https://api.vremly.com
```

## Authentication

Two credentials, and which one you want depends on whether the caller is a
machine or a person.

| | API key | Bearer token |
|---|---|---|
| Header | `x-api-key` | `Authorization: Bearer …` plus `x-org-id` |
| Identifies | An integration | A person |
| Organization | Fixed to one, derived from the key | Chosen per request |
| Expires | Only if you set an expiry | Yes |
| Permissions | Scopes on the key | The user's role |

**If you are building an integration, you want an API key.** It does not expire
on a schedule, it carries its own scopes, and it is revocable without
disturbing anyone's login.

```bash
curl https://api.vremly.com/projects \
  -H "x-api-key: <your-api-key>"
```

No `x-org-id` — the server derives the organization from the key, and a value
you supply is replaced. See [Authentication](/guides/authentication).

## Two things that surprise people

- **Unknown request fields are silently dropped.** Validation runs with
  `whitelist: true`, so a misspelled field is discarded rather than rejected
  and the request still succeeds. A `2xx` does not prove the server got what
  you meant to send.
- **`PROJECT_DELIVERED` and `DELIVERY_APPROVED` are different moments.** The
  first is your team sending the work; the second is the client accepting it,
  and a sent delivery can come back as a revision request. If you are advancing
  a CRM stage on "fulfilled", you want approval.

## Format

- HTTPS only
- `application/json`
- OpenAPI 3.0 — the [specification](pathname:///openapi/openapi.json) is
  generated from the backend's own source, and is the authority whenever these
  guides disagree with it

## Where to go

- [Getting Started](/guides/getting-started) — a first request in two minutes
- [Authentication](/guides/authentication) — keys, scopes, tokens
- [Projects Workflow](/guides/projects-workflow) — the shoot lifecycle
- [Media Management](/guides/media-management) — the three-step upload
- [Webhooks](/guides/webhooks) — events, signatures, retries
- [MCP Server](/guides/mcp) — connect an AI assistant
- [API Reference](/api-reference) — every endpoint, with a live console
- [Troubleshooting](/guides/troubleshooting) — when something returns 4xx
