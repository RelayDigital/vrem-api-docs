---
title: Rate Limits
sidebar_position: 8
---

# Rate Limits

The Vremly API rate-limits requests to keep the platform stable under automated
traffic. Which limits apply depends on how you authenticate.

## API keys

Every key has **its own budget**: the **Rate limit (requests/min)** chosen when
the key was created. It defaults to **120 requests per minute** and can be set
anywhere from 10 to 1000. One budget covers every endpoint the key calls, so
120 means 120 a minute in total, not 120 per endpoint.

Some endpoints also declare **their own cap**, because they are expensive or
attractive to abuse. On an authenticated endpoint that cap is counted per key,
per endpoint, and it comes with two burst limits on the same endpoint:

| Window | Limit |
|--------|-------|
| Burst | **3 requests per second** |
| Short | **20 requests per 10 seconds** |
| The endpoint's cap | Its own number per minute, for example 60 on the [share card](/guides/share-cards) routes |

All of them apply at once, together with the key's budget: a request is
rejected if it breaches any one. Endpoints without a cap of their own apply only
the key's budget.

Public endpoints (ones that need no credential) differ. Where the cap guards
something sensitive, such as a sign-in or a form submission, it is counted per
client IP even when you send a key, because there it exists to bound one caller
at one address. Where it only sheds anonymous load, such as on delivery-link
pages, a request with a key meets only the key's budget.

The budget follows the key, not the address it calls from. GoHighLevel, n8n
Cloud, Zapier and similar tools send requests from shared egress addresses, so
an address-based limit would make every customer on that platform compete for
one allowance. Because the budget is the key's, your workflows are only ever
limited by your own traffic. It also means **a second API key has a second
budget**: give a noisy integration, such as a bulk backfill, its own key so it
cannot starve the rest.

## No credentials

Public endpoints called without a credential are limited **per client IP, per
endpoint**:

| Window | Limit |
|--------|-------|
| Burst | **3 requests per second** |
| Short | **20 requests per 10 seconds** |
| Sustained | **100 requests per minute**, or the endpoint's own cap |

Endpoints that are attractive to abuse have tighter caps, per IP. Password
sign-in is limited to **20 per minute**, account creation to **10 per minute**,
verification codes to **10 per minute**, and public inquiry forms to **10 per
minute**.

Sessions in Vremly's own web and mobile apps are not covered here; integrations
authenticate with an API key ([Authentication](/guides/authentication)).

## Rate Limit Headers

Responses carry the state of each limit that applied to the request. Every
header name ends with the name of the limit it describes:

| Suffix | Limit |
|---|---|
| `-apiKey` | Your key's own budget |
| `-long` | The per-minute limit: the endpoint's own cap, or 100 per minute without a credential |
| `-medium` | 20 per 10 seconds |
| `-short` | 3 per second |

```
X-RateLimit-Limit-apiKey: 120
X-RateLimit-Remaining-apiKey: 95
X-RateLimit-Reset-apiKey: 41
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit-<suffix>` | Requests allowed in the window |
| `X-RateLimit-Remaining-<suffix>` | Requests remaining in the current window |
| `X-RateLimit-Reset-<suffix>` | **Seconds** until the window resets (not a timestamp) |

## Handling 429 Responses

When you exceed a limit, the API returns `429` with a `Retry-After-<suffix>`
header for the limit you hit, in seconds:

```
HTTP/1.1 429 Too Many Requests
Retry-After-apiKey: 12
```

For an API key, the body also says which limit it was and when to retry:

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests: this API key's limit of 120 requests per minute. Retry after 12s.",
  "timestamp": "2026-10-12T18:05:10.000Z",
  "path": "/projects"
}
```

Best practices:

- **Respect the `Retry-After-<suffix>` header** — wait the specified number of seconds before retrying.
- **Implement exponential backoff** — if you continue to hit limits, increase the wait time between retries.
- **Watch `X-RateLimit-Remaining-apiKey`** — slow down before you are rejected rather than after.
- **Cache responses** — avoid redundant requests by caching `GET` responses where appropriate.
- **Batch operations** — where possible use bulk endpoints to reduce request count.
- **Use a separate key per integration** — budgets are per key, so noisy jobs stay isolated.
