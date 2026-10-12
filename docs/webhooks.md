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
| `SHARE_CARD_READY` | A share card (for example a listing's Just listed post) has new images ready to post. See [below](#share_card_ready). |
| `PROJECT_RESCHEDULED` | A booked shoot moves to a new time, including a client's reschedule request your team approves. See [below](#project_rescheduled). |
| `TRIP_STATUS_CHANGED` | The technician's trip changes phase: heading out, arrived, shooting, finished. See [below](#trip_status_changed). |

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

### `SHARE_CARD_READY`

Fires each time a [share card](/guides/share-cards) reaches `READY` with new
images: the first render after delivery, and again whenever a change to the
listing produces a new version. It goes to the media company that delivered the
listing. For a Just listed card it also goes to the listing agent's personal
workspace when the agent's customer record is linked to a verified Vremly
account. It is never sent for sample listings.

The payload carries ids and URLs only, never buyer or lead details:

```json
{
  "id": "0c6b8e1a-3f2d-4e5c-9b7a-1d2e3f4a5b6c",
  "event": "SHARE_CARD_READY",
  "timestamp": "1760292310",
  "data": {
    "event": "SHARE_CARD_READY",
    "occurredAt": "2026-10-12T18:05:10.000Z",
    "cardId": "6f0c1d2e-0000-4000-8000-000000000001",
    "kind": "JUST_LISTED",
    "variant": "JUST_LISTED",
    "projectId": "proj_xyz789",
    "orgId": "org_abc123",
    "contentHash": "9c1e…",
    "images": {
      "story": "https://<cdn>/…-story.jpg",
      "feed": "https://<cdn>/…-feed.jpg",
      "linkPreview": "https://<cdn>/…-link.jpg"
    },
    "apiPath": "/listings/projects/proj_xyz789/share-cards/just-listed?variant=JUST_LISTED"
  }
}
```

`orgId` is the workspace receiving this delivery: the media company's
organization, or the agent's personal workspace on the agent's copy.
`contentHash` identifies the version: the same card can fire again with a new
hash, and the image URLs change with it. To get the caption, the facts and the
tracked links, read the card at `apiPath` with an API key from that workspace.
On the agent's copy it is the `/me/share-cards/just-listed/...` path, which
needs a key minted in their personal workspace.

### `PROJECT_RESCHEDULED`

Fires when a shoot that already had a time moves to a different one: your team
changes the order's time or one shoot's time, or approves a client's request to
reschedule. It does not fire the first time an order is given a time. It goes to
the media company's organization.

```json
{
  "id": "2b7d4c1e-8a3f-4e6b-9c0d-1e2f3a4b5c6d",
  "event": "PROJECT_RESCHEDULED",
  "timestamp": "1760292310",
  "data": {
    "project": {
      "id": "proj_xyz789",
      "scheduledTime": "2026-10-14T16:00:00.000Z",
      "previousScheduledTime": "2026-10-13T16:00:00.000Z",
      "visitId": "visit_abc123"
    }
  }
}
```

`scheduledTime` is the moved shoot's new start. On an order with several shoots
it is not always the order's own date, so read the project if you need that.
`visitId` names the shoot that moved.

### `TRIP_STATUS_CHANGED`

Fires when the technician's trip changes phase: `EN_ROUTE` (heading out),
`ARRIVED`, `IN_PROGRESS` (shooting) and `COMPLETE`. It fires once per change,
never for the location updates in between. It goes to the media company's
organization.

```json
{
  "id": "7e1a9b2c-4d5f-4a6b-8c7d-9e0f1a2b3c4d",
  "event": "TRIP_STATUS_CHANGED",
  "timestamp": "1760292310",
  "data": {
    "project": { "id": "proj_xyz789" },
    "visitId": "visit_abc123",
    "phase": "ARRIVED",
    "previousPhase": "EN_ROUTE"
  }
}
```

The payload never includes a location. To show where the technician is, read
`GET /projects/{id}/tracking`, which applies the same rules as the app about who
may see it. `previousPhase` is `null` when a trip starts. When an owner or admin
closes a stuck trip, the event carries `"phase": "COMPLETE"` and
`"adminResolution": "COMPLETED"` or `"CANCELLED"`.

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
