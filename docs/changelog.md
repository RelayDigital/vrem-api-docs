---
title: Changelog
sidebar_position: 10
---

# Changelog

Notable changes and updates to the Vremly API.

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
