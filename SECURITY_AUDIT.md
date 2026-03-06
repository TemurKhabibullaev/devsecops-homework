# Security Audit — Rewards Platform

## Overview

This audit reviewed the security of the CasaPerks rewards platform, including:

- Express backend (`server/`)
- React frontend (`client/`)
- environment configuration
- authentication and admin APIs

The goal was to identify vulnerabilities, prioritize risk, and fix the **most critical issues**.

---

# Files Modified

Security fixes were implemented in the following files:
- `server/middleware/auth.js`
- `server/index.js`
- `server/routes/admin.js`
- `.gitignore`
- `.env.example`

---

# Critical Findings

## 1. Secrets Committed to Repository

**Severity:** Critical

A `.env` file containing credentials was committed to the repository.

Exposed data included:

- MongoDB connection string
- AWS credentials
- Stripe API keys
- JWT secret
- admin credentials

If this repository were public, attackers could access the database, impersonate users, or escalate privileges.

### Fix

- Removed `.env` from Git tracking
- Added `.env` to `.gitignore`
- Added `.env.example` to document required variables

Production systems should use a secret manager such as AWS Secrets Manager or Vault.

---

## 2. Broken Access Control on Admin Endpoints

**Severity:** Critical

Admin routes (`/api/admin/*`) were accessible without proper authorization.

This allowed access to endpoints capable of:

- exporting all application data
- impersonating users
- viewing internal configuration

### Fix

Implemented authentication and role-based authorization.

Changes:

- `/api/admin` now requires a valid JWT
- access restricted to `admin` and `super_admin` roles
- dangerous endpoints disabled:
- /api/admin/export
- /api/admin/impersonate

---

## 3. Insecure JWT Authentication

**Severity:** Critical

The authentication middleware had several weaknesses:

- JWT secret hardcoded in source code
- password included in JWT payload
- improper Authorization header parsing
- tokens logged in server logs

These issues could allow attackers to forge tokens or extract credentials.

### Fix

- moved JWT secret to environment variable
- removed password from token payload
- implemented proper Bearer token parsing
- added token expiration
- removed token logging and detailed error output

---

## 4. Sensitive Data Exposure via Debugging and Logging

**Severity:** Critical

Sensitive information was exposed through:

- `/api/debug` endpoint exposing environment variables
- `/api/health` revealing database connection strings
- request logging containing headers and bodies
- login logs containing plaintext passwords
- startup logs printing secrets
- error responses exposing stack traces

### Fix

- removed `/api/debug`
- sanitized `/api/health`
- removed request body/header logging
- removed password and token logging
- removed secret output from startup logs
- sanitized error responses
- added login rate limiting

---

## 5. Excessive Personal Data in Login Responses

**Severity:** Critical

The login endpoint returned unnecessary personal data including:

- SSN
- address
- date of birth
- payment card information
- emergency contact data

This exposed highly sensitive PII.

### Fix

Login responses were reduced to only the fields required by the client application.

---

# Medium Severity Issues

### Overly Permissive CORS

The API originally allowed requests from any origin.

**Fix:** restricted CORS to a configured frontend origin.

---

### No Login Rate Limiting

The login endpoint allowed unlimited authentication attempts.

**Fix:** implemented rate limiting using `express-rate-limit`.

---

### Excessive Error Information

Error responses returned full stack traces.

**Fix:** production responses now return minimal error information.

---

# Verification

After remediation, the following checks were performed:
- `/api/debug` endpoint removed
- `/api/health` no longer exposes internal configuration
- login responses no longer include sensitive data
- `/api/admin/*` endpoints require authentication
- non-admin users receive `403 Forbidden`
- admin users can access admin endpoints successfully

---

## Extra Credit — Secure Admin Dashboard

A small admin dashboard feature was added using the existing secured admin stats endpoint:

`GET /api/admin/stats`

Security design:
- endpoint requires JWT authentication
- endpoint enforces admin-only authorization
- resident users receive `403 Forbidden`
- admin users receive aggregate system statistics only
- no sensitive resident data is returned

Verification performed:
- resident token request to `/api/admin/stats` returned `403 Forbidden`
- admin token request to `/api/admin/stats` returned `200 OK`
- response included:
  - total residents
  - total points outstanding
  - total redemptions
  - active gift cards

---

# Summary

The application initially contained several high-impact vulnerabilities:
- exposed credentials
- broken access control
- insecure authentication
- sensitive data exposure in logs and APIs

The implemented fixes significantly reduce the attack surface and bring the platform closer to secure API development practices.
