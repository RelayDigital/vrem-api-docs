---
title: Error Handling
sidebar_position: 7
---

# Error Handling

Standard HTTP status codes, with a JSON body describing what went wrong.

## Status codes

| Code | Meaning |
|---|---|
| `200` | Success |
| `201` | Created |
| `400` | Invalid parameters or body |
| `401` | No valid credential — missing, malformed, expired or revoked |
| `403` | Authenticated, but not allowed: a scope your key lacks, or an organization you are not in |
| `404` | Not found, or not visible to you |
| `409` | Conflict — it already exists |
| `429` | Rate limited |
| `500` | Server error |

## Error shape

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "timestamp": "2026-10-12T18:05:10.000Z",
  "path": "/projects"
}
```

`message` is always a string. Validation failures summarise up to three of the
problems in `message` and list every one in `errors`:

```json
{
  "statusCode": 400,
  "message": "Validation failed: email must be an email; url must be a URL address",
  "errors": [
    "email must be an email",
    "url must be a URL address"
  ],
  "timestamp": "2026-10-12T18:05:10.000Z",
  "path": "/customers"
}
```

Read `errors` when it is present: it is the complete list, while `message` is
shortened when there are many.

## The failure with no error

The one that costs the most time does not produce an error at all.

An unknown or misspelled body field is handled one of two ways, depending on
the endpoint:

- **The endpoint publishes a request body schema.** The body is validated with
  unknown fields forbidden, so `address` where the endpoint wanted
  `addressLine1` is rejected with `400` (`property address should not exist`)
  and nothing is changed.
- **The endpoint publishes no body schema** but still reads fields from the
  body. There an unknown or misspelled field is **ignored**: the request can
  succeed having skipped what you meant to send, and nothing in the response
  says so.

Check names against the [API Reference](/api-reference) — or use
[`vremly_describe_endpoint`](/guides/mcp) if an assistant is writing the call.

## Common cases

### 401 on every request

The credential is not being read. With an API key the header is `x-api-key`;
with a token it is `Authorization: Bearer <token>`. If you send both, the
Bearer token wins — which fails if that token has expired while the key is
fine.

### 403 naming a scope

```json
{
  "statusCode": 403,
  "message": "API key missing required scope. Needs one of: WRITE. This key holds: READ."
}
```

A credential problem, not a permissions bug. Issue a new key with the scope
named — scopes cannot be added to an existing key.

### 403 on an organization

The organization exists but you are not a member. Note that **omitting
`x-org-id` does not cause this** — the server falls back to your personal
organization and the request succeeds against the wrong one. See
[Organization Context](/guides/organization-context).

### 404 that should be 200

Either the id is wrong, or it belongs to another organization. An API key is
locked to one organization, so an id copied from a different workspace reads as
missing rather than forbidden — deliberately, since a `403` would confirm the
record exists.

### 429

An API key has its own per-minute budget (120 by default, set when the key is
created), and some endpoints add their own cap with burst limits of 3 per
second and 20 per 10 seconds. The body names the limit you hit. Wait the
seconds in the `Retry-After-<suffix>` header rather than retrying immediately.
See [Rate Limits](/guides/rate-limits).

## Retrying

Retry `429` and `5xx`, with backoff. Do not retry `4xx` — the request will fail
the same way until you change it.

For anything that creates a record, send an `Idempotency-Key` header so a retry
after a timeout does not create a second one.
