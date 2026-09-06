---
title: Organization Context
sidebar_position: 3
---

# Organization Context

Most Vremly resources belong to an organization, so a request has to say which
one it is for.

:::tip Using an API key? You can skip this page.
A key belongs to exactly one organization and the server derives it from the
key. **Do not send `x-org-id`** — it is not required, and a value you supply is
replaced. This is also why a key can never reach another organization's data,
however it is called.

The rest of this page is about Bearer tokens, which identify a person who may
belong to several organizations.
:::

## The `x-org-id` header

With a Bearer token, name the organization explicitly:

```bash
curl https://api.vremly.com/projects \
  -H "Authorization: Bearer <token>" \
  -H "x-org-id: org_abc123"
```

## What happens if you leave it out

It does not simply fail. The server falls back to your **personal
organization** — so the request usually succeeds, against a different
organization than you meant. An integration that forgets the header does not
error; it quietly reads an empty workspace, which is a much harder bug to spot.

Send it explicitly on every org-scoped call.

## The errors you can get

| Status | Meaning |
|---|---|
| `401` | No valid credential on the request at all. |
| `404` | The `x-org-id` names an organization that does not exist. |
| `403` | The organization exists, but you are not a member of it. |

`404` rather than `403` for an unknown id is deliberate: answering "that
organization exists, you just cannot see it" would let anyone confirm which
organization ids are real.

## Which endpoints need it

| Kind | Examples | With a Bearer token |
|---|---|---|
| Public | `POST /auth/register`, `POST /auth/login`, `POST /inquiries` | Nothing |
| About the user | `/users/me`, `/auth/me`, `/me/notifications` | Token only |
| Org-scoped | `/projects`, `/orders`, `/customers`, `/media` | Token + `x-org-id` |

When in doubt, check the endpoint in the [API Reference](/api-reference) — each
operation lists the credentials it accepts.

## Finding your organization ids

```bash
curl https://api.vremly.com/organizations \
  -H "Authorization: Bearer <token>"
```

Each entry has an `id` to use as the `x-org-id` value.

`GET /auth/me/bootstrap` returns the signed-in user together with the
organizations they can reach, which is usually what an app wants on start-up
rather than two separate calls.

## Agents reach work across organizations

An agent — the client an organization shoots for — can be given access to
specific projects without being a member of the organization that runs them.
Those routes are about the person rather than an organization, so they take the
token alone and **must not** be sent `x-org-id`; adding it puts the request
through organization membership checks the agent deliberately does not satisfy.
