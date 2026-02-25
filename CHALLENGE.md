# CasaPerks DevSecOps Take-Home Challenge

## Context

You've been given access to a repository containing a rewards platform application built with Express and React. This application was built quickly for an internal demo and has never been through a security review. It is representative of real-world code that a fast-moving startup might produce under deadline pressure.

**Your job is to find out what's wrong, prioritize what matters, fix the critical issues, and propose infrastructure improvements.**

AI tool usage is **required**. You must document your AI workflow: which tools you used, how you used them, what you accepted, what you rejected, and why. Submissions without evidence of AI usage will not advance.

---

## Part 1: Security Audit

Conduct a thorough security audit of the repository. Identify and document all vulnerabilities you find, categorized by severity (Critical, High, Medium, Low).

The application contains flaws across multiple categories. You are not expected to find every single one, but depth and prioritization matter more than a long list.

## Part 2: Fix the Critical Issues

Choose the 3–5 most critical vulnerabilities you identified and fix them. Submit your fixes as commits in a forked repository with clear, well-written commit messages that explain what the vulnerability was and how your fix addresses it.

## Part 3: Infrastructure & CI/CD Proposal

This application has no CI/CD pipeline, no infrastructure-as-code, and no monitoring. Propose a production-ready infrastructure setup that addresses:

- CI/CD pipeline design (what runs on every PR, what runs on deploy)
- Infrastructure-as-code approach (AWS-focused — we use AppSync, Lambda, and MongoDB)
- Monitoring and alerting strategy
- SOC 2 readiness considerations (we use Drata for compliance automation)

This proposal can be a written document, a diagram, IaC code, or a combination — whatever best communicates your thinking.

## Part 4: Extra Credit — Full Stack Feature

**This section is optional but encouraged.** If you're interested in a hybrid DevSecOps / Full Stack role, add a small feature to the application:

- Add an admin dashboard page that shows system stats (total residents, points outstanding, recent redemptions)
- The feature should be built securely — applying the lessons from your own audit

This demonstrates both your ability to build and your ability to build securely.

---

## What We're Evaluating

- **Security instincts:** Can you see what's wrong and prioritize what matters most?
- **Remediation quality:** Are your fixes correct, complete, and well-explained?
- **Infrastructure thinking:** Can you design systems that are secure, observable, and maintainable?
- **AI workflow:** How you leverage AI tools is a core evaluation criteria — document your process
- **Communication:** How you present your findings is part of the evaluation
- **Full stack ability (extra credit):** Can you build features that are secure by design?

## Submission

Fork the repository, push your work, and share the link. How you present your findings and proposals beyond the code is up to you.

**Time budget:** 2–3 hours. If you find yourself going significantly beyond 3 hours, stop. We'd rather see a well-prioritized partial audit with clear reasoning than an exhaustive but shallow checklist.

**Deadline:** 5 business days from receipt.

## Round 2 Review

After submission, you'll schedule a 30-minute review call where you'll walk through your findings, discuss your decisions, and do a short live exercise. Come ready to explain your thinking.
