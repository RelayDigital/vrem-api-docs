---
title: Media Management
sidebar_position: 5
---

# Media Management

Photos, video, floor plans and the rest of a shoot's output attach to a
project. Uploads do not pass through the Vremly API — the API issues a
presigned S3 URL, your client sends the bytes straight to S3, and then you tell
Vremly the object exists.

## Media types

`mediaType` accepts exactly these values:

| Value | What it is |
|---|---|
| `PHOTO` | Still photography — HDR, twilight, aerial |
| `VIDEO` | Walkthroughs and cinematic tours |
| `FLOORPLAN` | 2D and 3D floor plans |
| `VIRTUAL_TOUR` | Panoramic tour assets |
| `PROPERTY_WEBSITE` | Property site assets |
| `BROCHURE` | Generated print material |
| `DOCUMENT` | Supporting files |

## Uploading

Three steps. There is no single-request upload endpoint — a multipart POST of
a 60MB RAW file through the API would tie up a request the whole time it
transferred, so the bytes go to S3 directly instead.

### 1. Ask for a presigned URL

```bash
curl -X POST https://api.vremly.com/media/presign \
  -H "x-api-key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "proj_abc123",
    "filename": "front-exterior.jpg",
    "contentType": "image/jpeg",
    "mediaType": "PHOTO"
  }'
```

All four fields are required. The response:

```json
{
  "uploadUrl": "https://s3.amazonaws.com/...&X-Amz-Signature=...",
  "key": "org_.../proj_abc123/photo/front-exterior.jpg",
  "cdnUrl": "https://cdn.example.com/org_.../proj_abc123/photo/front-exterior.jpg"
}
```

:::warning The presigned URL *is* the upload authority
Anyone holding that URL can write that object for the hour it stays valid, no
credential required. Vremly checks your permission at the moment it issues the
URL, not when the bytes arrive. Treat it like a password: do not log it, and do
not hand it to a browser you do not control.
:::

### 2. PUT the bytes to S3

Send the file to `uploadUrl` directly. **No Vremly headers** — not
`x-api-key`, not `Authorization`. The signature covers the request, and adding
headers it was not signed with makes S3 reject it.

```bash
curl -X PUT "<uploadUrl>" \
  -H "Content-Type: image/jpeg" \
  --data-binary @front-exterior.jpg
```

The `Content-Type` must match the `contentType` you presigned with, for the
same reason.

### 3. Confirm it

S3 does not tell Vremly about the object, so this step is what creates the
media record. Skip it and the file sits in the bucket, invisible in the app.

```bash
curl -X POST https://api.vremly.com/media/confirm-upload \
  -H "x-api-key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "proj_abc123",
    "filename": "front-exterior.jpg",
    "size": 4194304,
    "type": "PHOTO",
    "key": "org_.../proj_abc123/photo/front-exterior.jpg",
    "cdnUrl": "https://cdn.example.com/..."
  }'
```

`projectId`, `filename`, `size` and `type` are required. Pass back the `key`
and `cdnUrl` you were given in step 1.

## Listing a project's media

```bash
curl https://api.vremly.com/media/project/proj_abc123 \
  -H "x-api-key: <your-api-key>"
```

The project's own route returns the same set:

```bash
curl https://api.vremly.com/projects/proj_abc123/media \
  -H "x-api-key: <your-api-key>"
```

## Other operations

| Method | Path | Purpose |
|---|---|---|
| `PATCH` | `/media/reorder` | Change display order |
| `PATCH` | `/media/{id}/rename` | Rename a file |
| `PATCH` | `/media/{id}/showcase` | Flag an item as a showcase image |
| `DELETE` | `/media/{id}` | Remove an item |
| `GET` | `/media/{id}` | Fetch one item |

Uploading, changing or deleting media needs a key with `WRITE`; listing needs
only `READ`. See [Authentication](/guides/authentication).

## Delivery is separate

Getting media onto a project is not the same as delivering it to the client.
Delivery has its own routes and its own events — `PROJECT_DELIVERED` when your
team sends the work, `DELIVERY_APPROVED` when the client accepts it. See
[Webhooks](/guides/webhooks).
