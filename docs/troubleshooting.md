---
title: Troubleshooting
sidebar_position: 9
---

# Troubleshooting

Common issues and solutions when working with the Vremly API.

## Authentication Issues

### "Missing or invalid JWT token" (401)

**Cause**: The `Authorization` header is missing, malformed, or the token has expired.

**Solution**:

1. Verify the header format is `Authorization: Bearer <token>` (note the space after "Bearer").
2. Check that the token hasn't expired — re-authenticate via `/auth/login` to get a fresh token.
3. Ensure you're not accidentally including extra whitespace or newline characters in the token.

```bash
# Correct format
curl https://api.vremly.com/projects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### "Not a member of the specified organization" (403)

**Cause**: The `x-org-id` header is missing or the authenticated user doesn't belong to that organization.

**Solution**:

1. List your organizations to get valid IDs:

```bash
curl https://api.vremly.com/organizations \
  -H "Authorization: Bearer <token>"
```

2. Use a valid organization ID from the response in the `x-org-id` header.

### OAuth token rejected

**Cause**: The third-party token (Google or Facebook) is invalid or expired.

**Solution**:

- Ensure the OAuth token is fresh — these tokens have short lifespans.
- Verify you're using the correct token type: Google requires an **ID token**, Facebook requires an **access token**.

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

**Cause**: A resource with the same unique identifier already exists (e.g., duplicate email during registration).

**Solution**: Use different values for the conflicting field, or log in to the existing account.

## Rate Limiting

### "Too Many Requests" (429)

**Cause**: You've exceeded the API rate limit (100 requests/minute per IP or 300/minute per user).

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

### Upload returns an error

**Cause**: Incorrect content type or missing required fields.

**Solution**:

- Use `multipart/form-data` (not `application/json`) for uploads.
- Include all required fields: `projectId`, `file`, and `type`.
- Ensure the `type` value is one of: `PHOTO`, `VIDEO`, `FLOORPLAN`, `DOCUMENT`.

```bash
curl -X POST https://api.vremly.com/media/upload \
  -H "Authorization: Bearer <token>" \
  -H "x-org-id: <organization-id>" \
  -F "projectId=<project-id>" \
  -F "file=@photo.jpg" \
  -F "type=PHOTO"
```

## Webhook Issues

### Webhook payloads not arriving

**Solution**:

- Ensure your endpoint is publicly accessible over HTTPS.
- Return a `200` response within 5 seconds — process events asynchronously.
- Check that your endpoint URL is correctly configured (contact support for setup).

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

- Verify you're using the raw request body (not a parsed/re-serialized version).
- Ensure you're comparing the full `sha256=<hash>` string, not just the hash portion.
- Double-check your webhook secret hasn't been rotated.

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
