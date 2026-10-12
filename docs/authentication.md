---
title: Authentication
sidebar_position: 2
---
# Authentication

Every request to the Vremly API carries an **API key** in the `x-api-key`
header. That is the only credential this API takes.

```bash
curl https://api.vremly.com/projects \
  -H "x-api-key: $VREMLY_API_KEY"
```

A key does not expire on a schedule, carries its own permissions, belongs to one
organization, and can be revoked on its own without disturbing anyone's login.

:::note There is no user login for integrations
Vremly's own web and mobile apps sign people in and hold a session token. That is
first-party plumbing and is deliberately not documented here — a third party
should never be collecting a Vremly user's password. Everything below is the
API-key path, which is the supported one.
:::

---

## API Keys

### Creating a key

Keys are created from **Settings → Developers → API Keys** in the Vremly app, or through the
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
| `ADMIN` | Everything, including scopes added in future, except moving money (see below) |
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

### What no key can do: move money

No API key, whatever its scopes (`ADMIN` included), can charge a card, issue a
refund or take a card-reader payment. The same applies to an AI assistant you
connect, because approving one creates an API key. The routes that do those
things are not in the API reference, and the server refuses them to every key.
They stay available to a person signed in to Vremly.

What a key does instead:

- **To get paid**, send the customer a payment link with
  `POST /invoices/{id}/send-payment-link`, and they pay on a hosted page.
- **To get a card on file**, use `POST /customers/{id}/send-card-setup-link`,
  which emails the customer a link to add it themselves.
- **Cancelling a job that is already paid** cancels it but leaves the invoice
  `PAID`. Nothing is refunded automatically: the business gets an email and
  issues the refund in Vremly. Unpaid invoices on the job are voided, which
  moves no money.
- **A cancellation fee is never charged through a key.** A customer's cancel
  that would cost a fee returns `403` with `CANCELLATION_FEE_NEEDS_APP`, and an
  approval that asks to charge the fee returns `403` with
  `KEY_CANNOT_CHARGE_FEE`; the person finishes either one in Vremly.

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

## Keeping a key safe

- **Treat it like a password.** It is a bearer credential: whoever holds it has
  the access it carries.
- **Give it the least it needs.** A workflow that only reads delivery status
  should hold `READ`, so a mistake in that workflow cannot change anything.
- **One key per integration**, so revoking one does not break the others, and a
  compromised key tells you exactly which system leaked it.
- **Never put it in a URL.** It belongs in the header; query strings end up in
  logs, proxies and browser history.
- **Rotate by issuing the new key first**, switching over, then revoking the old
  one — revocation takes effect immediately.
