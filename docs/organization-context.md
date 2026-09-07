---
title: Organization Context
sidebar_position: 3
---

# Organization Context

Every resource in Vremly belongs to an organization. If you have used other
multi-tenant APIs you are probably looking for a tenant header to set.

**There isn't one. You don't need it.**

## The organization comes from your key

An API key belongs to exactly one organization, and the server derives the
organization from the key on every request.

```bash
curl https://api.vremly.com/projects \
  -H "x-api-key: $VREMLY_API_KEY"
```

That returns your organization's projects. There is nothing else to send.

:::tip Do not send `x-org-id`
Some responses and older examples mention an `x-org-id` header. It belongs to
Vremly's own first-party apps, where one signed-in person may belong to several
organizations. With an API key it is **not required, and a value you supply is
ignored** — the key wins.
:::

## Why it works this way

Deriving the organization from the credential rather than from a header means a
key cannot reach another organization's data however it is called. There is no
request you can construct, no header you can add, and no id you can guess that
widens its reach. A leaked key exposes exactly one organization, and revoking it
closes exactly that.

It also removes a whole class of bug: there is no "wrong tenant header" to send,
so you cannot accidentally read or write against an organization you did not
mean to.

## Working with more than one organization

Use one key per organization and pick the key, rather than switching a header.
Each key is revocable on its own, and each carries its own scopes — so a
read-only integration against one organization stays read-only even if another
key is broader.

## What you will see if something is wrong

| Status | Meaning |
|---|---|
| `401` | The key is missing, malformed, revoked or expired. |
| `403` | The key is valid but lacks the scope this endpoint needs — the message names which. |
| `404` | The id exists in some other organization, or not at all. |

A `404` where you expected data usually means the id came from a different
workspace. That is deliberate: a `403` would confirm the record exists.

See [Authentication](/guides/authentication) for scopes, and
[Error Handling](/guides/error-handling) for the response shapes.
