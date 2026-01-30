---
title: Rate Limits
sidebar_position: 8
---

# Rate Limits

The VREM API enforces rate limits to ensure fair usage and platform stability.

## Default Limits

| Scope | Limit |
|-------|-------|
| **Per IP** | 100 requests per minute |
| **Per user** | 300 requests per minute |

Limits may vary by endpoint. Write operations (POST, PUT, PATCH, DELETE) may have lower limits than read operations (GET).

## Rate Limit Headers

Every response includes rate limit information in the headers:

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

## Handling 429 Responses

When you exceed the rate limit, the API returns:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 30
```

Best practices:

- **Respect the `Retry-After` header** — Wait the specified number of seconds before retrying.
- **Implement exponential backoff** — If you continue to hit limits, increase the wait time between retries.
- **Cache responses** — Avoid redundant requests by caching GET responses where appropriate.
- **Batch operations** — Where possible, use bulk endpoints to reduce the number of requests.
