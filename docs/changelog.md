---
title: Changelog
sidebar_position: 10
---

# Changelog

Notable changes and updates to the Vremly API.

## 2026-10-12 — Keys no longer move money

### Removed

API keys, and the AI assistants that connect through them, can no longer charge
a card, refund or take a card-reader payment. The server refuses these to every
key, whatever its scopes, and they are gone from the reference: charging an
invoice to a saved card, refunds (including adjustment refunds), the in-app
payment sheet, staff card capture for a customer, and the marketplace slot and
job cancels that capture a cancellation fee.

To get paid, send `POST /invoices/{id}/send-payment-link`. Cancelling a paid job
through a key leaves its invoice paid, and the business is emailed to refund it
in Vremly. See [Authentication](/guides/authentication#what-no-key-can-do-move-money).

### Added

- [Share Cards](/guides/share-cards) guide, and the `SHARE_CARD_READY`,
  `PROJECT_RESCHEDULED` and `TRIP_STATUS_CHANGED` webhook events
- Reviewed operations for scheduling, dispatch, training, equipment, payroll,
  evaluations and booking workflows. Each needs a grant for its business area (or `ADMIN`),
  recorded on each operation in the OpenAPI document as
  `x-vremly-required-scopes`
- Rate limits are now a per-key budget; see [Rate Limits](/guides/rate-limits)

## v1.0 — Initial Release

### Endpoints

- **Auth**: Registration, login, OAuth (Google & Facebook), OTP verification
- **Organizations**: CRUD, member management, settings, invitations
- **Projects**: Full lifecycle management (BOOKED → SHOOTING → EDITING → DELIVERED)
- **Orders**: Checkout, status tracking, cancellations
- **Customers**: Customer management within organizations
- **Media**: Upload, storage (S3 + CloudFront CDN), project association
- **Delivery**: Public gallery links, approval workflows, comments
- **Messages**: In-app messaging per project
- **Packages**: Service packages and add-ons with pricing
- **Notifications**: In-app notification management
- **Dashboard**: Analytics and metrics
- **Availability**: Scheduling and work hours
- **Webhooks**: 9 event types with signature verification and retry policy

### Integrations

- **Stripe**: Payment processing and webhook handling
- **Cronofy**: Calendar integration
- **Nylas**: Email and calendar sync
- **ICS**: Calendar feed support

### Documentation

- Getting started guide
- Authentication and OAuth flows
- Organization context and scoping
- Project workflow guide
- Media management guide
- Webhooks guide with signature verification
- Error handling reference
- Rate limits reference
- Full OpenAPI 3.0 specification with 115 endpoints
