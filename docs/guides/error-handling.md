---
title: Error Handling
sidebar_position: 7
---

# Error Handling

The VREM API uses standard HTTP status codes and returns structured error responses.

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| **200** | Success |
| **201** | Resource created |
| **400** | Bad request — invalid parameters or body |
| **401** | Unauthorized — missing or invalid JWT token |
| **403** | Forbidden — not a member of the specified organization |
| **404** | Not found — resource does not exist |
| **409** | Conflict — resource already exists (e.g., duplicate email) |
| **429** | Too many requests — rate limit exceeded |
| **500** | Internal server error |

## Error Response Format

Error responses include a `message` field describing what went wrong:

```json
{
  "statusCode": 401,
  "message": "Missing or invalid JWT token",
  "error": "Unauthorized"
}
```

Some validation errors include an array of specific issues:

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be at least 8 characters"
  ],
  "error": "Bad Request"
}
```

## Common Error Patterns

### Missing Authorization Header

```
401 Unauthorized
```

Include `Authorization: Bearer <token>` on all authenticated endpoints.

### Missing Organization Context

```
403 Forbidden — Not a member of the specified organization
```

Include `x-org-id: <organization-id>` on org-scoped endpoints. See [Organization Context](/guides/guides/organization-context).

### Resource Not Found

```
404 Not Found
```

The resource ID doesn't exist or you don't have access to it within the current organization.

### Rate Limited

```
429 Too Many Requests
```

You've exceeded the rate limit. Wait and retry. See [Rate Limits](/guides/guides/rate-limits).
