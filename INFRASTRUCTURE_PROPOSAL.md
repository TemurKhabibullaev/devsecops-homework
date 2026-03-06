# Infrastructure & CI/CD Proposal

This section proposes a production-ready deployment model for the rewards platform using AWS-managed services, infrastructure-as-code, and automated CI/CD.

The design prioritizes:

- secure deployments
- automated testing
- observability
- compliance readiness (SOC 2)

# Environment strategy

Use at least three environments:
- dev
- staging
- prod

Production should require:
- protected branch
- pull request review
- successful CI
- manual approval before deploy

---

# CI/CD Pipeline Design

The CI/CD pipeline is implemented using **GitHub Actions**.
The pipeline separates **PR validation** from **deployment workflows** to ensure code quality and security before changes reach production.

---

## Pull Request Pipeline

Every pull request triggers the following checks:

1. Install dependencies
2. Run linting checks
3. Run unit tests
4. Build the frontend application
5. Run dependency vulnerability scans
6. Run secret scanning
7. Run static application security testing (SAST)
8. Validate infrastructure configuration
9. Generate a Terraform plan

Example checks include:

- `eslint`
- `npm test`
- `npm audit`
- `gitleaks`
- `CodeQL`
- `terraform fmt`
- `terraform validate`

This pipeline ensures insecure or broken code cannot be merged into the main branch.

---

## Deployment Pipeline

Deployment runs when code is merged into the main branch.

Steps include:
1. Authenticate to AWS using **GitHub OIDC federation**
2. Apply infrastructure changes using Terraform
3. Deploy Lambda functions
4. Update AppSync GraphQL schema and resolvers
5. Upload the React frontend build to S3
6. Invalidate the CloudFront cache
7. Run smoke tests
8. Send deployment notifications

Using **OIDC authentication** avoids storing long-lived AWS credentials in GitHub secrets.

---

# Infrastructure as Code

All infrastructure is managed using **Terraform**.

Benefits include:
- repeatable infrastructure
- version-controlled configuration
- easier auditing of infrastructure changes
- safer multi-environment deployments

---

## Terraform Structure
- infra/
- modules/
- appsync/
- lambda/
- iam/
- s3_frontend/
- cloudfront/
- monitoring/
- environments/
- dev/
- staging/
- prod/

Each environment maintains isolated infrastructure and configuration.
Production deployments require manual approval.

---

# Monitoring & Observability

Monitoring is implemented using AWS-native observability services.

---

## Logging

Application logs from Lambda and AppSync are sent to **CloudWatch Logs**.

Logs include:

- request IDs
- API errors
- authentication failures
- administrative actions

Sensitive data such as passwords or tokens must never be logged.

---

## Metrics

Operational metrics are collected from:

**AppSync**
- request count
- error rates
- latency

**Lambda**
- invocation count
- duration
- errors
- throttles

**CloudFront**
- 4xx and 5xx error rates
- cache hit ratio

---

## Alerts

CloudWatch alarms trigger alerts when abnormal behavior is detected.

Example alerts:
- high API error rate
- Lambda error spikes
- authentication failure spikes
- elevated CloudFront errors

Alerts are delivered through **SNS integrations** such as Slack or PagerDuty.

---

# SOC 2 Readiness Considerations

The infrastructure and pipeline design support SOC 2 compliance practices and integrate with **Drata** for automated evidence collection.

---

## Access Control

- least-privilege IAM policies
- separate roles for CI/CD deployments
- production deployments require approval
- SSO enforced for AWS and GitHub access

---

## Change Management

All code and infrastructure changes must go through:
1. pull request review
2. CI validation
3. Terraform plan review
4. controlled deployment

This ensures every change has an auditable record.

---

## Secrets Management

Sensitive configuration values are stored in **AWS Secrets Manager**, including:
- database credentials
- JWT secrets
- payment provider keys

Secrets are retrieved at runtime by Lambda functions rather than stored in code.

---

## Logging & Audit Trails

Security-relevant events are recorded using:
- **CloudTrail** for AWS API activity
- **CloudWatch Logs** for application behavior
- **GitHub audit logs** for repository activity

These logs provide the evidence required for compliance audits.

---
# Rollout Plan
**Phase 1 — foundation**
* add GitHub Actions CI
* add secret scanning and CodeQL
* add Terraform skeleton
* move secrets to Secrets Manager
* deploy frontend to S3/CloudFront

**Phase 2 — backend modernization**
* deploy API to Lambda
* add AppSync schema and resolvers
* separate dev/staging/prod
* add CloudWatch dashboards and alarms

**Phase 3 — compliance and hardening**
* enable CloudTrail, GuardDuty, AWS Config
* connect AWS and GitHub to Drata
* formalize approval workflow for prod
* add backup / recovery runbooks and incident playbooks

---

# Summary

This proposed infrastructure introduces:
- automated CI/CD pipelines
- infrastructure-as-code using Terraform
- serverless backend architecture using AppSync and Lambda
- centralized monitoring and alerting
- secure secrets management
- SOC 2–aligned operational controls