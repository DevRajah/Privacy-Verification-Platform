# MVP Test Checklist

This document contains the manual test scenarios used to validate the Privacy-Preserving Verification Platform MVP.

---

# 1. Health Check

Endpoint:

```txt
GET /api/health
```

Expected:

```txt
API online
Database connected
```

Result:

```txt
PASS / FAIL
```

---

# 2. User Registration

Endpoint:

```txt
POST /api/auth/register-user
```

Expected:

```txt
User account created successfully
JWT token returned
```

Result:

```txt
PASS / FAIL
```

---

# 3. Service Provider Registration

Endpoint:

```txt
POST /api/auth/register-provider
```

Expected:

```txt
Provider account created successfully
JWT token returned
```

Result:

```txt
PASS / FAIL
```

---

# 4. User Login

Endpoint:

```txt
POST /api/auth/login
```

Expected:

```txt
Valid JWT returned
```

Result:

```txt
PASS / FAIL
```

---

# 5. Provider Login

Endpoint:

```txt
POST /api/auth/login
```

Expected:

```txt
Valid JWT returned
```

Result:

```txt
PASS / FAIL
```

---

# 6. Provider Creates Verification Request

Endpoint:

```txt
POST /api/verification-requests
```

Expected:

```txt
Verification request created
Consent automatically created
Status = PENDING
Audit log created
```

Result:

```txt
PASS / FAIL
```

---

# 7. User Views Verification Requests

Endpoint:

```txt
GET /api/verification-requests/user
```

Expected:

```txt
User sees pending verification request
```

Result:

```txt
PASS / FAIL
```

---

# 8. User Approves Consent

Endpoint:

```txt
PATCH /api/consents/:consentId/approve
```

Expected:

```txt
Consent status becomes APPROVED
Verification request status updated
Audit log created
```

Result:

```txt
PASS / FAIL
```

---

# 9. User Rejects Consent

Endpoint:

```txt
PATCH /api/consents/:consentId/reject
```

Expected:

```txt
Consent status becomes REJECTED
Verification blocked
```

Result:

```txt
PASS / FAIL
```

---

# 10. User Revokes Consent

Endpoint:

```txt
PATCH /api/consents/:consentId/revoke
```

Expected:

```txt
Consent status becomes REVOKED
Future verification blocked
```

Result:

```txt
PASS / FAIL
```

---

# 11. Provider Retrieves Verification Result

Endpoint:

```txt
GET /api/verifications/:requestId/result
```

Expected:

```json
{
  "isActiveStudent": true
}
```

Important:

```txt
Only approved attribute returned.
```

Result:

```txt
PASS / FAIL
```

---

# 12. Minimal Disclosure Validation

Expected:

```txt
Response contains only approved attribute.
```

Must NOT return:

```txt
fullName
email
address
passportNumber
dateOfBirth
```

Result:

```txt
PASS / FAIL
```

---

# 13. User Audit Logs

Endpoint:

```txt
GET /api/audit-logs/user
```

Expected:

```txt
User sees verification history
```

Result:

```txt
PASS / FAIL
```

---

# 14. Provider Audit Logs

Endpoint:

```txt
GET /api/audit-logs/provider
```

Expected:

```txt
Provider sees request history
```

Result:

```txt
PASS / FAIL
```

---

# 15. Admin Summary

Endpoint:

```txt
GET /api/admin/summary
```

Expected:

```txt
System statistics returned
```

Result:

```txt
PASS / FAIL
```

---

# 16. Admin Audit Logs

Endpoint:

```txt
GET /api/admin/audit-logs
```

Expected:

```txt
All audit activity returned
```

Result:

```txt
PASS / FAIL
```

---

# 17. RBAC Validation

Test:

```txt
User attempts provider endpoint
```

Expected:

```txt
403 Forbidden
```

Result:

```txt
PASS / FAIL
```

Test:

```txt
Provider attempts admin endpoint
```

Expected:

```txt
403 Forbidden
```

Result:

```txt
PASS / FAIL
```

---

# 18. Missing Authentication

Expected:

```txt
401 Unauthorized
```

Result:

```txt
PASS / FAIL
```

---

# 19. Invalid Token

Expected:

```txt
401 Unauthorized
```

Result:

```txt
PASS / FAIL
```

---

# 20. Consent Expiry Validation

Expected:

```txt
Expired consent cannot be used for verification.
```

Result:

```txt
PASS / FAIL
```

---

# MVP Completion Criteria

The MVP is considered complete when:

- Users can register and login
- Providers can register and login
- Providers can create verification requests
- Users can approve, reject, revoke consent
- Verification returns only approved attributes
- Audit logs record verification activities
- Admin visibility is available
- RBAC is enforced
- Consent expiry is enforced
- Health endpoint passes
- All test cases above pass successfully