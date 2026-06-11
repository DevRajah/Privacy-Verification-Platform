# Privacy-Preserving Verification Platform for Public Services

An MSc Software Engineering dissertation MVP focused on reducing unnecessary disclosure of personal information during public-service verification.

The platform allows service providers to request verification of specific attributes while users maintain control through consent approval, rejection, revocation, and expiry management.

---

## Research Problem

Traditional verification systems often require users to disclose complete identity documents or excessive personal information to prove a single attribute.

Examples:

- Student verification requiring full student cards
- Housing verification requiring full identity documents
- Public-service eligibility checks exposing unnecessary personal data

This creates privacy, transparency, and access-control challenges.

---

## Proposed Solution

This platform implements a privacy-preserving verification model where:

- Service providers request only specific attributes
- Users explicitly approve requested attributes
- Verification responses return only approved attributes
- Full identity documents are never disclosed
- Audit logs provide verification transparency
- Consent lifecycle management controls access over time

---

## Research Gaps Addressed

### 1. Limited Consent Lifecycle Management

Addressed through:

- Consent approval
- Consent rejection
- Consent revocation
- Consent expiry

### 2. Limited Verification Transparency

Addressed through:

- Audit logging
- Verification history
- Provider activity tracking
- User activity tracking

### 3. Coarse-Grained Access Control

Addressed through:

- Fine-grained attribute-scoped verification
- Attribute-level consent approval
- Minimal disclosure responses

### 4. Public-Service Integration Challenges

Addressed through:

- Service-provider APIs
- Verification request workflows
- Provider verification dashboards
- Standardized verification responses

---

## Core Features

### User Features

- Register account
- Login
- View verification requests
- Approve consent
- Reject consent
- Revoke consent
- View audit history

### Service Provider Features

- Register provider account
- Login
- Create verification requests
- View request status
- Receive verification results
- View audit history

### Administrator Features

- View platform summary
- View all verification requests
- View all audit logs

---

## Fine-Grained Verification Example

### Requested Attribute

```json
{
  "requestedAttribute": "STUDENT_STATUS"
}
```

### Verification Response

```json
{
  "success": true,
  "message": "Verification result generated successfully",
  "data": {
    "requestId": "123",
    "verifiedAttribute": "STUDENT_STATUS",
    "result": {
      "isActiveStudent": true
    }
  }
}
```

### What Is NOT Returned

```json
{
  "fullName": "Micheal Adekunle",
  "dateOfBirth": "...",
  "address": "...",
  "passportNumber": "...",
  "studentStatus": true
}
```

This demonstrates privacy-preserving minimal disclosure.

---

## Technology Stack

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- PostgreSQL
- Prisma ORM

### Security

- JWT Authentication
- Role-Based Access Control (RBAC)

### Validation

- Zod

### Infrastructure

- Docker

---

## Architecture

Core services:

- Authentication Service
- Consent Management Service
- Verification Service
- Audit Logging Service

The Verification Service acts as an attribute-filtering layer that ensures only explicitly approved attributes are disclosed.

---

## API Endpoints

### Authentication

```txt
POST /api/auth/register-user
POST /api/auth/register-provider
POST /api/auth/login
GET  /api/auth/me
```

### Verification Requests

```txt
POST /api/verification-requests
GET  /api/verification-requests/user
GET  /api/verification-requests/provider
GET  /api/verification-requests/:requestId
```

### Consents

```txt
GET   /api/consents/my-consents
PATCH /api/consents/:consentId/approve
PATCH /api/consents/:consentId/reject
PATCH /api/consents/:consentId/revoke
```

### Verifications

```txt
GET /api/verifications/:requestId/result
```

### Audit Logs

```txt
GET /api/audit-logs/user
GET /api/audit-logs/provider
```

### Admin

```txt
GET /api/admin/summary
GET /api/admin/audit-logs
GET /api/admin/verification-requests
```

### Health

```txt
GET /api/health
```

---

## Dissertation Alignment

This project supports the MSc dissertation:

**Privacy-Preserving Verification Platform for Public Services**

The platform demonstrates how fine-grained attribute-scoped verification can reduce unnecessary disclosure of personal information while improving transparency, consent management, and accountability within public-service verification workflows.

---

## Author

Micheal Adekunle

MSc Software Engineering

Privacy-Preserving Verification Platform for Public Services