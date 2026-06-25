Figure 4.1: High-Level Architecture of the Privacy-Preserving Verification Platform

flowchart TD

```
U[User]
SP[Public Service Provider]
FE[Frontend Portal<br/>React / Next.js]

APIGW[API Gateway / Backend Services]

AUTH[Authentication Service]
CONSENT[Consent Management Service]
VERIFY[Verification Service]
AUDIT[Append-Only Audit Logging Service]

DB[(PostgreSQL Database)]

U --> FE
SP --> FE

FE --> APIGW

APIGW --> AUTH
APIGW --> CONSENT
APIGW --> VERIFY
APIGW --> AUDIT

AUTH --> DB
CONSENT --> DB
VERIFY --> DB
AUDIT --> DB

SP -->|Verification Request| APIGW

CONSENT -->|Approve / Reject Access| U

VERIFY -->|Scoped Verification Response| SP
```








Figure 4.2: Privacy-Preserving Verification Workflow


flowchart TD

```
A[Service Provider Requests Verification]

B[Verification Request Created]

C[User Receives Consent Request]

D{Approve Request?}

E[Reject Request]

F[Generate Scoped Verification Token]

G[Verification Service Validates Scope]

H[Return Approved Attribute Only]

I[Audit Log Recorded]

J[Verification Complete]

A --> B
B --> C
C --> D

D -->|No| E
E --> I

D -->|Yes| F
F --> G
G --> H
H --> I
I --> J
```



Figure 4.3: Consent Lifecycle Workflow

flowchart TD

```
A[Verification Request Created]

B[Pending Consent]

C[Approved]

D[Rejected]

E[Active Verification Access]

F[Revoked by User]

G[Consent Expired]

H[Access Terminated]

A --> B

B -->|Approve| C
B -->|Reject| D

C --> E

E -->|User Revokes Access| F
E -->|Consent Duration Ends| G

F --> H
G --> H
```


Figure 4.4: System Component Diagram.

flowchart TD

    FE[Frontend Portal]

    APIGW[API Gateway]

    AUTH[Authentication Service]

    CONSENT[Consent Management Service]

    VERIFY[Verification Service]

    AUDIT[Append-Only Audit Logging Service]

    DB[(PostgreSQL Database)]

    FE --> APIGW

    APIGW --> AUTH
    APIGW --> CONSENT
    APIGW --> VERIFY
    APIGW --> AUDIT

    AUTH --> DB
    CONSENT --> DB
    VERIFY --> DB
    AUDIT --> DB

    CONSENT --> VERIFY
    VERIFY --> AUDIT
    CONSENT --> AUDIT



Figure 4.5: Entity Relationship Diagram of the Verification Platform

Users
│
├── id
├── fullName
├── email
├── passwordHash
└── role

        │
        │ 1:N
        ▼

VerificationRequests
│
├── id
├── userId
├── serviceProviderId
├── requestedAttribute
├── status
└── createdAt

        │
        │ 1:1
        ▼

Consents
│
├── id
├── requestId
├── status
├── expiresAt
└── revokedAt

        │
        │ 1:N
        ▼

AuditLogs
│
├── id
├── requestId
├── action
├── timestamp
└── actor

ServiceProviders
│
├── id
├── name
├── apiKey
└── createdAt


Figure 4.6: Verification Request Sequence Flow

Service Provider
        |
        | Request Verification
        v
API Gateway
        |
        | Create Verification Request
        v
Consent Service
        |
        | Notify User
        v
User
        |
        | Approve Request
        v
Consent Service
        |
        | Generate Permission
        v
Verification Service
        |
        | Verify Requested Attribute
        v
Service Provider
        |
        | Receive Scoped Response
        v
Audit Logging Service



Figure 4.7: Backend Service Architecture

Frontend Portal
        |
        v
API Gateway
        |
        ├──────── Authentication Service
        │
        ├──────── Consent Management Service
        │
        ├──────── Verification Service
        │
        └──────── Audit Logging Service
                     |
                     v
              PostgreSQL





Figure 4.8: Attribute-Scoped Privacy Enforcement Model

              Requested Data

┌─────────────────────┐
│ Full User Profile   │
└─────────────────────┘

          │

          ▼

Consent Engine

          │

          ▼

Attribute Filter

          │

          ▼

Scoped Response

{
  "isActiveStudent": true
}


Figure 4.9: Minimum Viable Product Scope

MVP

├── User Authentication
├── Service Provider Registration
├── Verification Requests
├── Consent Approval
├── Consent Revocation
├── Scoped Verification Response
├── Audit Logging
└── Verification Dashboard

Excluded

├── Advanced Cryptography
├── Mobile Applications
├── Blockchain
├── National Identity Integration
└── Production Deployment



// Entity Relationship Diagram