# Extra Credit — Secure Admin Dashboard

A small admin dashboard feature was added to demonstrate secure full-stack development.
The dashboard displays system statistics:
- total residents
- total points outstanding
- total redemptions
- active gift cards

The page consumes the existing secured backend endpoint:
GET /api/admin/stats

---

# Verification

The feature was validated using direct API testing.

Resident token request:

GET /api/admin/stats
Authorization: Bearer <resident-token>


Result:

403 Forbidden


Admin token request:

GET /api/admin/stats
Authorization: Bearer <admin-token>


Result:
200 OK

Example response:

{
"totalResidents": 3,
"totalPointsOutstanding": 52350,
"totalRedemptions": 2,
"activeGiftCards": 7
}

This confirms that the dashboard data is only accessible to authorized administrators.

---

# Frontend Implementation

A simple React component (`AdminDashboard.jsx`) was added.

The component:

1. retrieves the stored JWT token
2. sends an authenticated request to `/api/admin/stats`
3. renders the returned system statistics

Client-side role checks were added only for user experience.  
Actual authorization enforcement occurs on the backend.

---

# Security Considerations

The feature intentionally avoids:

- exposing user PII
- returning raw resident data
- adding new privileged endpoints

Instead, it reuses the hardened backend controls implemented earlier in the audit.
This demonstrates how new features can be built **securely on top of existing security controls**.