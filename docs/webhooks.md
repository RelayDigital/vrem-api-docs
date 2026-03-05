---
title: Webhooks
sidebar_position: 6
---

# Webhooks

Webhooks allow your application to receive real-time notifications when events occur in Vremly. Instead of polling the API, you register a URL and Vremly sends HTTP POST requests to it when relevant events happen.

## Event Types

| Event | Description |
|-------|-------------|
| `project.assigned` | A user has been assigned to a project (technician or editor) |
| `project.status_changed` | A project's status has changed (e.g., BOOKED → SHOOTING) |
| `project.delivered` | Final assets have been delivered to the client |
| `delivery.approved` | The client has approved the delivered assets |
| `delivery.changes_requested` | The client has requested changes to delivered assets |
| `delivery.comment_added` | A new comment has been added to a delivery |
| `message.created` | A new message was sent in a project channel |
| `order.completed` | A payment order has been completed |
| `order.failed` | A payment order has failed |

## Payload Format

All webhook payloads follow the same structure:

```json
{
  "id": "evt_abc123",
  "type": "project.delivered",
  "timestamp": "2025-03-15T10:30:00Z",
  "data": {
    "projectId": "proj_xyz789",
    "organizationId": "org_abc123",
    "status": "DELIVERED"
  }
}
```

## Signature Verification

Every webhook request includes a signature header for verification:

```
X-Vremly-Signature: sha256=<hmac-signature>
```

Verify the signature using your webhook secret:

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return `sha256=${expected}` === signature;
}
```

## Retry Policy

If your endpoint returns a non-2xx response, Vremly retries the delivery:

| Attempt | Delay |
|---------|-------|
| 1st retry | 1 minute |
| 2nd retry | 5 minutes |
| 3rd retry | 30 minutes |
| 4th retry | 2 hours |
| 5th retry | 24 hours |

After 5 failed attempts, the webhook is marked as failed and no further retries are made.

## Registering a Webhook

:::info Coming Soon
The webhook subscription API is under development. You will be able to register webhooks programmatically via the API. In the meantime, contact support to configure webhooks for your organization.
:::

## Best Practices

- **Respond quickly** — Return a 200 status within 5 seconds. Process the event asynchronously if needed.
- **Handle duplicates** — Webhook deliveries may be retried, so use the `id` field to deduplicate.
- **Verify signatures** — Always verify the `X-Vremly-Signature` header to ensure the request is from Vremly.
- **Use HTTPS** — Webhook endpoints must use HTTPS in production.
