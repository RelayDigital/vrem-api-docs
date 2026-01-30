---
title: Organization Context
sidebar_position: 3
---

# Organization Context

Most VREM API resources are scoped to an organization. This guide explains how organization context works and when it's required.

## The x-org-id Header

Pass the organization ID in the `x-org-id` header to access org-scoped resources:

```bash
curl https://api.vrem.com/projects \
  -H "Authorization: Bearer <token>" \
  -H "x-org-id: org_abc123"
```

Without this header, org-scoped endpoints return a **403 Forbidden** error.

## Which Endpoints Require It?

| Scope | Example Endpoints | Headers Required |
|-------|-------------------|------------------|
| **User-only** | `/users/me`, `/auth/login` | Bearer token |
| **Org-scoped** | `/projects`, `/orders`, `/customers`, `/media` | Bearer token + `x-org-id` |
| **Public** | `/auth/register`, `/inquiries` (create) | None |

## Agent Access Pattern

Agents have a special access model. Agents can:

- Access their own assigned projects **without** the `x-org-id` header
- Work across multiple organizations without being a member of each one
- View project details for any project they're assigned to

This means agent-specific endpoints (like fetching assigned projects) only require the Bearer token.

## Listing Organizations

To find your available organization IDs:

```bash
GET /organizations
Authorization: Bearer <token>
```

Returns an array of organizations you belong to, each with an `id` field you can use as the `x-org-id` value.
