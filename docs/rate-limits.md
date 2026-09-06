---
title: Rate Limits
sidebar_position: 8
---

# Rate Limits

The Vremly API rate-limits requests to keep the platform stable under automated
traffic. There are three windows, and **all of them apply at once** — a request
is rejected if it breaches any one.

## The Limits

| Window | Limit |
|--------|-------|
| Burst | **3 requests per second** |
| Short | **20 requests per 10 seconds** |
| Sustained | **100 requests per minute** |

:::caution The burst limit is the one you will hit first
Three requests per second is far tighter than 100 per minute, so a script that
fires ten requests in a second is rejected on the fourth — even though it is
well under the per-minute figure. If you are looping over a list, add a short
delay between calls or process in small batches.
:::

## What Counts As One Caller

The window you are measured in depends on how you authenticate.

| Authentication | Bucket |
|---|---|
| `Authorization: Bearer <jwt>` | **Not rate-limited.** These limits target public and machine traffic. |
| `x-api-key: <key>` | **Per API key.** Each key has its own independent allowance. |
| No credentials (public endpoints) | **Per client IP.** |

The per-key bucket matters if you automate through a hosted platform. GoHighLevel,
n8n Cloud, Zapier and similar tools send requests from shared egress addresses,
so an IP-based limit would make every customer on that platform compete for one
allowance. Because the bucket follows the key, your workflows are only ever
limited by your own traffic.

It also means **issuing a second API key gives you a second allowance**. If one
integration is noisy — a bulk backfill, say — give it its own key so it cannot
starve the rest.

## Rate Limit Headers

Responses carry the current state of your allowance:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1710500460
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed in the window |
| `X-RateLimit-Remaining` | Requests remaining in the current window |
| `X-RateLimit-Reset` | Unix timestamp when the limit resets |

## Endpoint-Specific Limits

Some endpoints are tighter than the defaults above, because they are attractive
to abuse rather than because they are expensive. Authentication is limited to
**5 attempts per minute**, registration to **3 per minute**, and public form
submissions to **10 per minute**. These are per IP, since the caller is
unauthenticated by definition.

## Handling 429 Responses

When you exceed a limit, the API returns:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 30
```

Best practices:

- **Respect the `Retry-After` header** — wait the specified number of seconds before retrying.
- **Implement exponential backoff** — if you continue to hit limits, increase the wait time between retries.
- **Watch `X-RateLimit-Remaining`** — slow down before you are rejected rather than after.
- **Cache responses** — avoid redundant requests by caching `GET` responses where appropriate.
- **Batch operations** — where possible use bulk endpoints to reduce request count.
- **Use a separate key per integration** — buckets are per key, so noisy jobs stay isolated.
