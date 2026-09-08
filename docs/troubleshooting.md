---
title: Troubleshooting
sidebar_position: 9
---

# Troubleshooting

Common issues and solutions when working with the Vremly API.

## Authentication Issues

### 401 on every request

**Cause**: The key is missing, malformed, revoked, or expired.

**Solution**:

1. The header is `x-api-key`, not `Authorization`. Send the key exactly as
   issued, with no surrounding whitespace or newline.
2. Confirm the key has not been revoked or passed its expiry in
   **Settings → Developers → API Keys**. Revocation takes effect immediately.
3. If you are sending an `Authorization` header as well, remove it.

```bash
curl https://api.vremly.com/projects \
  -H "x-api-key: $VREMLY_API_KEY"
```

### 403 naming a scope

**Cause**: The key is valid but does not carry the permission the endpoint
needs.

```json
{
  "statusCode": 403,
  "message": "API key missing required scope. Needs one of: WRITE. This key holds: READ."
}
```

**Solution**: Issue a new key with the scope named. Scopes cannot be added to an
existing key. See [Authentication](/guides/authentication).

### 404 where you expected data

**Cause**: The id belongs to a different organization, or does not exist. A key
is locked to one organization, so an id copied from another workspace reads as
missing rather than forbidden — deliberately, since a `403` would confirm the
record exists.

**Solution**: Check the id came from the same organization the key belongs to.
There is no header to switch; see
[Organization Context](/guides/organization-context).

## Request Issues

### "Bad Request" with validation errors (400)

**Cause**: Required fields are missing or have invalid values.

**Solution**: Check the `message` array in the response for specific field errors:

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be at least 8 characters"
  ],
  "error": "Bad Request"
}
```

Fix each listed validation error and retry.

### "Conflict" (409)

**Cause**: A resource with the same unique identifier already exists — a
customer with that email, or a webhook subscription for that URL.

**Solution**: Fetch the existing record and update it instead of creating a
second one.

## Rate Limiting

### "Too Many Requests" (429)

**Cause**: You've exceeded a rate limit. Three windows apply at once — **3 per
second, 20 per 10 seconds, 100 per minute** — and the burst limit catches most
callers first. API-key traffic is counted **per key**, not per IP, so a shared
egress address on a hosted automation platform is not the cause.

**Solution**:

1. Read the `Retry-After` header to know how long to wait.
2. Implement exponential backoff in your integration.
3. Cache GET responses to reduce redundant requests.
4. Use batch endpoints where available.

```bash
# Check rate limit headers in any response
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1710500460
```

## Media Upload Issues

### There is no single upload endpoint

**Cause**: Posting a file to the API directly. Uploading is three steps —
`POST /media/presign`, a `PUT` of the bytes to the returned S3 URL, then
`POST /media/confirm-upload`. See [Media Management](/guides/media-management).

### The S3 PUT returns 403 SignatureDoesNotMatch

**Cause**: The request does not match what was signed.

**Solution**:

- Send **no Vremly headers** on the S3 PUT — not `x-api-key`, not
  `Authorization`. The signature covers the request, and an unexpected header
  invalidates it.
- Send the same `Content-Type` you passed as `contentType` when presigning.
- Check the URL has not expired. It is valid for one hour.

### The upload succeeded but the file is not in the app

**Cause**: Step 3 was skipped. S3 does not tell Vremly the object arrived, so
without `POST /media/confirm-upload` the bytes sit in the bucket with no media
record pointing at them.

**Solution**: Confirm it, passing back the `key` and `cdnUrl` from the presign
response, plus `projectId`, `filename`, `size` and `type`.

### 400 on the presign request

**Cause**: A missing or invalid field. All four of `projectId`, `filename`,
`contentType` and `mediaType` are required.

**Solution**: `mediaType` must be one of `PHOTO`, `VIDEO`, `FLOORPLAN`,
`VIRTUAL_TOUR`, `PROPERTY_WEBSITE`, `BROCHURE`, `DOCUMENT`.

## Webhook Issues

### Webhook payloads not arriving

**Solution**:

- Ensure your endpoint is publicly accessible over HTTPS.
- Return a `2xx` within **10 seconds** — anything slower counts as a failure and
  is retried. Acknowledge first, process asynchronously.
- Check the subscription exists and is active:
  `GET /webhooks/subscriptions`. Registration is self-serve, not a support
  request.
- Inspect what actually happened:
  `GET /webhooks/subscriptions/:id/deliveries`.

### Duplicate webhook events

**Cause**: Webhook retries can cause the same event to be delivered multiple times.

**Solution**: Use the `id` field in the payload to deduplicate events in your handler:

```javascript
const processedEvents = new Set();

function handleWebhook(payload) {
  if (processedEvents.has(payload.id)) return;
  processedEvents.add(payload.id);
  // Process the event
}
```

### Signature verification failing

**Solution**:

- Verify you're using the raw request body, not a parsed and re-serialised
  version — re-serialising changes key order and whitespace, and the signature
  will never match.
- Parse the header correctly. It is `X-Webhook-Signature: t=<unix>,v1=<hmac>` —
  **not** `sha256=<hash>`. Compute the HMAC-SHA256 over `` `${t}.${rawBody}` ``
  and compare against `v1`.
- Double-check the secret hasn't been rotated.

See [Webhooks](/guides/webhooks) for a working verification example.

## Project Workflow Issues

### Cannot transition project status

**Cause**: Your role doesn't have permission for that status transition.

**Solution**:

- **Admins/Managers** can transition between any statuses.
- **Technicians** can only mark shooting as complete.
- **Editors** can only mark editing as complete and trigger delivery.

Contact an admin if you need a status change outside your role's permissions.

## Still Need Help?

If you're experiencing an issue not covered here, contact the Vremly support team for assistance.
