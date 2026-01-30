---
id: overview
title: Overview
slug: /
sidebar_position: 1
---

# VREM API Documentation

The VREM (VX Real Estate Media) API lets you build integrations with our real estate media production platform — from scheduling photo and video shoots to managing deliveries and client communications.

## Base URL

```
https://api.vrem.com
```

## Authentication

All authenticated endpoints require a **Bearer JWT token** in the `Authorization` header. Many endpoints also require an **organization context** via the `x-org-id` header.

```bash
curl https://api.vrem.com/projects \
  -H "Authorization: Bearer <token>" \
  -H "x-org-id: <organization-id>"
```

See the [Authentication guide](/guides/guides/authentication) for details on obtaining tokens and the [Organization Context guide](/guides/guides/organization-context) for how org scoping works.

## API Format

- **Protocol**: HTTPS
- **Content-Type**: `application/json`
- **OpenAPI Version**: 3.0

## Quick Links

- [Getting Started](/guides/guides/getting-started) — Make your first API call
- [Authentication](/guides/guides/authentication) — JWT tokens and OAuth flows
- [API Reference](/api-reference) — Full endpoint documentation
- [Webhooks](/guides/guides/webhooks) — Subscribe to real-time events
