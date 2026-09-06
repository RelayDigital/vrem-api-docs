---
title: Projects Workflow
sidebar_position: 4
---

# Projects Workflow

A project is one media production job — a shoot at an address, from booking
through delivery. It is the resource most integrations revolve around.

## Statuses

`ProjectStatus` has nine values. The common path is:

```
PENDING → BOOKED → SHOOTING → UPLOADED → EDITING → IN_REVIEW → DELIVERED
```

| Value | Meaning | Shown in the app as |
|---|---|---|
| `PENDING` | Created, not yet scheduled or staffed | Pending |
| `BOOKED` | Scheduled and assigned | **Assigned** |
| `SHOOTING` | On-site capture under way | **In Progress** |
| `UPLOADED` | Shoot done, media handed to editors | Uploaded |
| `EDITING` | Post-production | Editing |
| `IN_REVIEW` | Quality control before delivery | In Review |
| `DELIVERED` | Sent to the client | Delivered |
| `IN_REVISION` | Client asked for changes after delivery | In Revision |
| `CANCELLED` | Called off | Cancelled |

:::warning Send the value, not the label
`BOOKED` displays as "Assigned" and `SHOOTING` as "In Progress". Those are
display relabels only — the API accepts `BOOKED` and `SHOOTING`. Sending
`"Assigned"` is a 400.
:::

`IN_REVISION` matters if you are driving a CRM: a project can leave `DELIVERED`
and come back. Treat delivery as reversible, and see
[Webhooks](/guides/webhooks) for why `DELIVERY_APPROVED` — not
`PROJECT_DELIVERED` — is the signal that the work is actually accepted.

## Creating a project

The route is `/projects/create`, not `/projects`.

```bash
curl -X POST https://api.vremly.com/projects/create \
  -H "x-api-key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "scheduledTime": "2026-03-15T10:00:00Z",
    "addressLine1": "123 Main St",
    "city": "Edmonton",
    "region": "AB",
    "postalCode": "T5J 0N3",
    "customerId": "cust_xyz789",
    "packageId": "pkg_abc123"
  }'
```

Only `scheduledTime` is required. The address is separate fields —
`addressLine1`, `addressLine2`, `city`, `region`, `postalCode`, `countryCode`
— not one combined string.

:::danger A misspelled field disappears silently
The API validates with `whitelist: true`, so fields it does not recognise are
**stripped, not rejected**. Post `address` instead of `addressLine1` and you
get a `201` for a project with no address. Check field names against
[the reference](/api-reference) rather than inferring them.
:::

Other fields the endpoint accepts: `lat`, `lng`, `notes`, `projectManagerId`,
`technicianId`, `editorId`, `mediaTypes`, `estimatedDuration`,
`selectedAddOnIds`, `bookingAnswers`, `discountId`, `discountCode`.

## Assigning people

| Method | Path | Assigns |
|---|---|---|
| `PATCH` | `/projects/{id}/assign-technician` | The photographer or videographer |
| `PATCH` | `/projects/{id}/assign-editor` | The editor |
| `PATCH` | `/projects/{id}/assign-project-manager` | The project manager |
| `PATCH` | `/projects/{id}/assign-customer` | The customer the job belongs to |

```bash
curl -X PATCH https://api.vremly.com/projects/proj_abc123/assign-technician \
  -H "x-api-key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{ "userId": "user_123" }'
```

## Changing status

```bash
curl -X PATCH https://api.vremly.com/projects/proj_abc123/status \
  -H "x-api-key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{ "status": "EDITING" }'
```

Who may move a project between which statuses depends on the role behind the
credential, and a transition your key is not entitled to make returns `403`.
`PROJECT_STATUS_CHANGED` fires on every successful change, so you can react
without polling.

## Listing and filtering

```bash
curl https://api.vremly.com/projects \
  -H "x-api-key: <your-api-key>"
```

`GET /projects/status-counts` returns the counts per status, which is cheaper
than fetching every project to build a pipeline view.

## Permissions

Reading projects needs `READ`; creating, assigning and changing status need
`WRITE`. The organization comes from the API key, so a key can only ever see
its own organization's projects. See
[Authentication](/guides/authentication).
