# Security Audit (App)

## Scope
- Backend: Express API (server/)
- Frontend: React (client/)
- Config: environment variables (.env)

## Critical findings (must-fix)
1) Secrets committed to repo (.env)
- Impact: full compromise (DB, Stripe, AWS)
- Secrets were committed to the repository via a .env file.

Remediation:
- Remove .env from version control
- Add .env to .gitignore
- Provide .env.example template
- Rotate compromised secrets

Future improvement:
- Secrets should be stored in a secret manager (AWS Secrets Manager or Parameter Store) and injected at runtime rather than committed to the repository.

2) Admin routes lack auth + export leaks secrets + impersonation mints tokens
- Impact: unauthorized admin access + data exfiltration + account takeover
- Fix: require JWT + admin role for /api/admin/*; remove/lock export + impersonate

3) JWT implementation insecure (hardcoded secret, password included in token)
- Impact: token forgery + credential leakage
- Fix: JWT_SECRET from env; remove password claim; set expiry; parse Bearer token

Fix implemented:
- Moved JWT secret to environment variable
- Removed password from JWT payload
- Added token expiration
- Parsed Bearer tokens correctly
- Removed token leakage from logs and error responses

4) Debug/logging leaks secrets and credentials
- Impact: secrets in responses/logs, token leakage, easier exploitation
- Fix: remove /api/debug; stop logging headers/body/passwords; sanitize /health

## High/Medium (next)
- CORS too permissive
- No rate limiting on login
- Error handler exposes stack traces in prod

## Fix plan (commit order)
1) secrets
2) auth/JWT
3) admin protection
4) debug/logging
5) rate limiting + CORS tightening

## Validation
- Manual: try admin endpoints without token -> 401/403
- Manual: /api/health no longer returns URIs/secrets
- Tests: auth middleware parses Bearer and rejects invalid tokens
