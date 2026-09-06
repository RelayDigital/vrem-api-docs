---
title: Authentication
sidebar_position: 2
---

# Authentication

The Vremly API accepts two kinds of credential:

| Credential | Header | Use it for |
|---|---|---|
| **JWT Bearer token** | `Authorization: Bearer <token>` | A signed-in person acting in an app |
| **API key** | `x-api-key: <key>` | A script, a server, or an automation platform |

If you are building an integration — GoHighLevel, n8n, Zapier, a cron job, a
`curl` one-liner — you want an **API key**. It does not expire on a schedule, it
carries its own permissions, and it is revocable without disturbing anyone's
login.

---

## API Keys

### Creating a key

Keys are created from **Settings → API Keys** in the Vremly app, or through the
API itself with an existing key or session:

```bash
curl -X POST https://api.vremly.com/api-keys \
  -H "Authorization: Bearer <token>" \
  -H "x-org-id: <organization-id>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "n8n production",
    "scopes": ["READ", "WRITE"]
  }'
```

:::warning The key is shown once
The response contains the only copy of the raw key. Vremly stores a hash, not
the key itself, so it cannot be shown again or recovered — if it is lost, revoke
it and issue another.
:::

### Using a key

Send it as `x-api-key`. Do **not** also send an `Authorization` header; if both
are present the Bearer token wins.

```bash
curl https://api.vremly.com/projects \
  -H "x-api-key: <your-api-key>"
```

A key belongs to one organization, and the server derives the organization from
the key. **You do not need to send `x-org-id` with an API key** — it is set for
you, and a value you supply is replaced. A key can therefore never reach another
organization's data, however it is called.

### Scopes

Every key carries scopes, and they are enforced on every request.

| Scope | Grants |
|---|---|
| `READ` | Safe methods — `GET`, `HEAD`, `OPTIONS` |
| `WRITE` | Everything `READ` allows, plus `POST`, `PUT`, `PATCH`, `DELETE` |
| `ADMIN` | Everything, including scopes added in future |
| `BULK_IMPORT` | The bulk import endpoints |
| `WEBHOOKS` | Managing webhook subscriptions |

Two rules are worth knowing:

- **`WRITE` implies `READ`.** A key that can change a thing can read it back.
- **A narrow scope is not a general one.** `BULK_IMPORT` permits bulk import and
  nothing else; it does not become a general write credential.

Grant the least a given integration needs. A workflow that only reads delivery
status should hold `READ`, so a mistake in that workflow cannot alter anything.

A request whose key lacks the required scope returns `403` and names what was
missing and what the key holds, so you can fix it without guessing:

```json
{
  "statusCode": 403,
  "message": "API key missing required scope. Needs one of: WRITE. This key holds: READ."
}
```

### Revoking a key

```bash
curl -X DELETE https://api.vremly.com/api-keys/<key-id> \
  -H "Authorization: Bearer <token>" \
  -H "x-org-id: <organization-id>"
```

Revocation takes effect immediately. Keys may also carry an expiry date, and a
key whose creating user is deactivated stops working.

### Rate limits

Each key gets its own allowance rather than sharing one with every other caller
from the same address — which matters on hosted automation platforms, where many
customers share egress IPs. See [Rate Limits](/guides/rate-limits).

---

## JWT Bearer Tokens

Tokens identify a **person**. Use them for an app a human signs in to.

### Obtaining a token

**Register** a new account:

```bash
curl -X POST https://api.vremly.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "Jane Doe",
    "password": "secure-password",
    "accountType": "AGENT"
  }'
```

**Login** to an existing account:

```bash
curl -X POST https://api.vremly.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure-password"
  }'
```

Both return a response with a `token` field.

### OAuth (Google & Facebook)

```bash
curl -X POST https://api.vremly.com/auth/oauth/google \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<google-id-token>",
    "accountType": "AGENT"
  }'
```

```bash
curl -X POST https://api.vremly.com/auth/oauth/facebook \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<facebook-access-token>",
    "accountType": "AGENT"
  }'
```

The `accountType` field is only required for first-time sign-ups.

### Using the token

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Refreshing

Tokens expire. To exchange a valid token for a fresh one without asking the user
to sign in again:

```bash
curl -X POST https://api.vremly.com/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{ "token": "<current-token>" }'
```

Re-authenticating through `/auth/login` also works, and is the only option once
a token has fully expired.

### Organization context

A Bearer token identifies a person, and a person may belong to several
organizations — so most resource endpoints also need an `x-org-id` header
naming which one you mean:

```
Authorization: Bearer <token>
x-org-id: <organization-id>
```

A few endpoints are about the user rather than an organization (`/users/me`) and
need only the token. See [Organization Context](/guides/organization-context).

API keys do not need this header — the organization comes from the key.

---

## Choosing Between Them

| | API key | Bearer token |
|---|---|---|
| Identifies | An integration | A person |
| Expires | Only if you set an expiry | Yes, on a schedule |
| Organization | Fixed to one, automatically | Chosen per request via `x-org-id` |
| Permissions | Scopes on the key | The user's role |
| Rate limited | Per key | Not rate limited |
| Revoke | Individually, instantly | By changing the password |

A server-to-server integration should always use an API key. Storing a user's
password to mint tokens ties your integration to one employee's account, and it
stops working the day they leave.
