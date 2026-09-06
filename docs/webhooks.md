---
title: Webhooks
sidebar_position: 6
---

# Webhooks

Webhooks let your system react to things happening in Vremly without polling.
You register a URL, choose the events you care about, and Vremly `POST`s to it
when they occur.

## Event Types

Event names are upper snake case, and are sent verbatim in the payload's `event`
field and the `X-Webhook-Event` header.

| Event | Fires when |
|-------|------------|
| `PROJECT_CREATED` | A project is created |
| `PROJECT_ASSIGNED` | A user is assigned to a project (technician or editor) |
| `PROJECT_STATUS_CHANGED` | A project's status changes (e.g. BOOKED → SHOOTING) |
| `PROJECT_DELIVERED` | Final assets are delivered to the client |
| `DELIVERY_APPROVED` | The client signs off on the delivery |
| `INVOICE_CREATED` | An invoice is created |
| `INVOICE_SENT` | An invoice is sent to the customer |
| `INVOICE_PAID` | An invoice is paid |
| `INVOICE_VOIDED` | An invoice is voided |
| `CUSTOMER_CREATED` | A customer is created |
| `CUSTOMER_UPDATED` | A customer's details change |

:::tip `PROJECT_DELIVERED` and `DELIVERY_APPROVED` are not the same moment
`PROJECT_DELIVERED` fires when your team **sends** the work. `DELIVERY_APPROVED`
fires when the client **accepts** it — and a sent delivery can still come back as
a revision request. If you are advancing a CRM deal to a closed or fulfilled
stage, approval is almost always the signal you want. It is also the moment a
property website goes live.
:::

## Registering a Webhook

```bash
curl -X POST https://api.vremly.com/webhooks/subscriptions \
  -H "x-api-key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/hooks/vremly",
    "events": ["DELIVERY_APPROVED", "INVOICE_PAID"]
  }'
```

The response includes the signing **secret**. Store it — it is what proves a
request came from Vremly.

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/webhooks/subscriptions` | Create a subscription |
| `GET` | `/webhooks/subscriptions` | List your subscriptions |
| `PATCH` | `/webhooks/subscriptions/:id` | Change the URL, events, or active state |
| `DELETE` | `/webhooks/subscriptions/:id` | Remove a subscription |
| `GET` | `/webhooks/subscriptions/:id/deliveries` | Inspect recent delivery attempts |
| `POST` | `/webhooks/subscriptions/:id/test` | Send a test event to your URL |

Managing subscriptions with an API key requires the `WEBHOOKS` scope. See
[Authentication](/guides/authentication).

## Payload Format

```json
{
  "id": "6f1c2a5e-2f4a-4c1e-9f0b-1d2e3f4a5b6c",
  "event": "DELIVERY_APPROVED",
  "timestamp": "1710500460",
  "data": {
    "event": "DELIVERY_APPROVED",
    "orgId": "org_abc123",
    "projectId": "proj_xyz789",
    "deliveryToken": "tok_abc123",
    "customerId": "cust_456",
    "customerEmail": "jane@example.com",
    "approvedByUserId": "user_789",
    "approvedAt": "2026-09-05T12:00:00.000Z",
    "project": {
      "address": "123 Main St",
      "city": "Edmonton",
      "region": "AB",
      "status": "DELIVERED",
      "deliveryUrl": "https://downloads.example.com/delivery/tok_abc123"
    }
  }
}
```

`timestamp` is Unix seconds, as a string, and is the value the signature is
computed over. The event-specific fields live under `data`.

Requests also carry:

| Header | Value |
|---|---|
| `X-Webhook-Id` | The delivery id, same as `id` in the body |
| `X-Webhook-Event` | The event name |
| `X-Webhook-Signature` | `t=<timestamp>,v1=<hmac>` |

## Signature Verification

The signature is an HMAC-SHA256 over the string `` `${timestamp}.${rawBody}` ``,
keyed with your subscription secret, hex encoded.

:::warning Verify against the raw body
Compute the HMAC over the exact bytes you received, before any JSON parsing.
Re-serialising a parsed object changes key order and whitespace, and the
signature will never match.
:::

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(rawBody, signatureHeader, secret) {
  // "t=1710500460,v1=abc123..."
  const parts = Object.fromEntries(
    signatureHeader.split(',').map((p) => p.split('=')),
  );
  if (!parts.t || !parts.v1) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${parts.t}.${rawBody}`)
    .digest('hex');

  // Constant-time compare — a plain === leaks timing information.
  const a = Buffer.from(expected);
  const b = Buffer.from(parts.v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
```

Reject anything whose `t` is far from your own clock — a few minutes is a
reasonable window — so a captured request cannot be replayed indefinitely.

## Retry Policy

Vremly waits up to **10 seconds** for a response. Any non-2xx status, timeout or
connection error is retried:

| Attempt | Delay after the previous try |
|---------|------------------------------|
| 1st retry | 30 seconds |
| 2nd retry | 2 minutes |
| 3rd retry | 10 minutes |
| 4th retry | 30 minutes |
| 5th retry | 2 hours |

After the final attempt the delivery is marked `FAILED` and is not retried
again. Use `GET /webhooks/subscriptions/:id/deliveries` to see what happened.

:::caution Delivery is at-least-once
A retry can arrive after your endpoint has already processed the event — for
example if you succeeded but responded too slowly. **Deduplicate on the `id`
field**, which is stable across every attempt of the same delivery.
:::

## Best Practices

- **Respond fast, work later** — acknowledge with a 2xx immediately and process
  asynchronously. Anything slower than 10 seconds is treated as a failure and
  retried.
- **Deduplicate on `id`** — deliveries are at-least-once, never exactly-once.
- **Verify every request** — check the signature before trusting a payload, and
  compare in constant time.
- **Use HTTPS** — endpoints must be HTTPS in production.
- **Treat events as notifications, not as data** — read the current state back
  from the API when it matters; events can arrive out of order.
