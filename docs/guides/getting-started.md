---
title: Getting Started
sidebar_position: 1
---

# Getting Started

This guide walks you through making your first API call to the VREM platform.

## 1. Create an Account

Register a new account using the `/auth/register` endpoint:

```bash
curl -X POST https://api.vrem.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@example.com",
    "name": "Your Name",
    "password": "your-password",
    "accountType": "AGENT"
  }'
```

Valid account types for self-serve registration: `AGENT`, `PROVIDER`.

The response includes a JWT token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-id",
    "email": "you@example.com",
    "name": "Your Name",
    "accountType": "AGENT"
  }
}
```

## 2. Authenticate

For subsequent requests, include the token in the `Authorization` header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

If you already have an account, obtain a token via `/auth/login`:

```bash
curl -X POST https://api.vrem.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@example.com",
    "password": "your-password"
  }'
```

## 3. List Your Organizations

Most operations are scoped to an organization. List the ones you belong to:

```bash
curl https://api.vrem.com/organizations \
  -H "Authorization: Bearer <token>"
```

## 4. Make an Org-Scoped Request

Pass the `x-org-id` header to access organization resources:

```bash
curl https://api.vrem.com/projects \
  -H "Authorization: Bearer <token>" \
  -H "x-org-id: <organization-id>"
```

## Next Steps

- [Authentication](/guides/guides/authentication) — OAuth flows and token lifecycle
- [Organization Context](/guides/guides/organization-context) — How org scoping works
- [API Reference](/api-reference) — Explore all endpoints
