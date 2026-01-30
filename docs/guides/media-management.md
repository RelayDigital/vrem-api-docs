---
title: Media Management
sidebar_position: 5
---

# Media Management

VREM handles various media types associated with real estate projects.

## Media Types

| Type | Description |
|------|-------------|
| **PHOTO** | Still photography (HDR, twilight, aerial) |
| **VIDEO** | Video walkthroughs and cinematic tours |
| **FLOORPLAN** | 2D/3D floor plan renderings |
| **DOCUMENT** | Supporting documents (contracts, notes) |

## Uploading Media

Media files are uploaded to a project via the media endpoints:

```bash
POST /media/upload
Authorization: Bearer <token>
x-org-id: <organization-id>
Content-Type: multipart/form-data

projectId=<project-id>
file=@photo.jpg
type=PHOTO
```

## Accessing Media

Uploaded media is stored in S3 and served via CloudFront CDN. Each media item includes:

- `url` — Public CDN URL for the asset
- `s3Key` — Internal storage key
- `type` — Media type (PHOTO, VIDEO, etc.)
- `projectId` — Associated project

## Listing Media for a Project

```bash
GET /media?projectId=<project-id>
Authorization: Bearer <token>
x-org-id: <organization-id>
```

Returns all media items associated with the project.
