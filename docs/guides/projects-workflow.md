---
title: Projects Workflow
sidebar_position: 4
---

# Projects Workflow

Projects are the core resource in Vremly, representing a real estate media production job from booking through delivery.

## Project Lifecycle

Projects move through a defined set of statuses:

```
BOOKED → SHOOTING → EDITING → DELIVERED
```

| Status | Description |
|--------|-------------|
| **BOOKED** | Project created and scheduled |
| **SHOOTING** | On-site capture in progress |
| **EDITING** | Post-production and editing |
| **DELIVERED** | Final assets delivered to client |

## Creating a Project

```bash
POST /projects
Authorization: Bearer <token>
x-org-id: <organization-id>
Content-Type: application/json

{
  "address": "123 Main St, Austin, TX",
  "scheduledDate": "2025-03-15T10:00:00Z",
  "packageId": "pkg_abc123",
  "customerId": "cust_xyz789"
}
```

## Assigning Team Members

Projects can have **technicians** (photographers/videographers) and **editors** assigned:

```bash
PATCH /projects/:id/assign-technician
PATCH /projects/:id/assign-editor
```

## Status Transitions

Status changes are role-dependent:

- **Admins/Managers** can transition between any statuses
- **Technicians** can mark shooting as complete
- **Editors** can mark editing as complete and trigger delivery

## Delivery

When a project reaches the DELIVERED status, the client receives access to the final media assets. See [Media Management](/guides/guides/media-management) for details on media types and delivery.
