---
title: Authentication
sidebar_position: 2
---

# Authentication

The Vremly API uses **JWT Bearer tokens** for authentication. Tokens are obtained through registration, login, or OAuth flows.

## Obtaining a Token

### Email & Password

**Register** a new account:

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "Jane Doe",
  "password": "secure-password",
  "accountType": "AGENT"
}
```

**Login** to an existing account:

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure-password"
}
```

Both return a response with a `token` field.

### OAuth (Google & Facebook)

Authenticate with a third-party provider:

```bash
POST /auth/oauth/google
Content-Type: application/json

{
  "token": "<google-id-token>",
  "accountType": "AGENT"
}
```

```bash
POST /auth/oauth/facebook
Content-Type: application/json

{
  "token": "<facebook-access-token>",
  "accountType": "AGENT"
}
```

The `accountType` field is only required for first-time sign-ups.

## Using the Token

Include the JWT in the `Authorization` header on all authenticated requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Token Lifecycle

- Tokens are issued at login/registration and expire after a configured TTL.
- To get a fresh token, re-authenticate via `/auth/login` or the OAuth endpoints.
- There is no explicit refresh-token endpoint; simply log in again when the token expires.

## Two Security Schemes

The API uses two security schemes:

| Scheme | Header | Purpose |
|--------|--------|---------|
| **Bearer** | `Authorization: Bearer <token>` | Identifies the user |
| **x-org-id** | `x-org-id: <organization-id>` | Scopes the request to an organization |

Some endpoints require only Bearer auth (e.g., `/users/me`), while most resource endpoints require both. See [Organization Context](/guides/guides/organization-context) for details.
