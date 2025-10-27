# Security Guidelines: International Student Admissions System for Universitas Ubudiyah

This document provides a comprehensive set of security guidelines tailored for the International Student Admissions System built with Next.js 14, Clerk, Supabase, Stripe, and related services. Adhering to these recommendations will help ensure the system is secure by design, resilient, and maintainable.

---

## 1. Security by Design & Threat Modeling

- Perform a formal threat model (e.g., STRIDE) early and update it as features evolve.
- Identify critical assets (PII, payment data, documents, admin interfaces) and map possible attack vectors.
- Maintain a security backlog and track mitigations in your issue tracker.

## 2. Authentication & Access Control

### 2.1 Authentication
- Use Clerk for user management; enforce multi‐factor authentication (MFA) for staff/admin accounts.
- Configure Clerk to:  
  - Enforce strong password policies (minimum 12 characters, complexity rules, rotation reminders).  
  - Limit login attempts and implement rate limiting or account lockout on brute‐force attempts.
  - Store session tokens in Secure, HttpOnly cookies with `SameSite=Lax` or `Strict`.

### 2.2 Authorization & RBAC
- Define clear roles: `applicant`, `reviewer`, `admin`.
- Implement server‐side role checks on every API and page route. Do not rely on client‐side flags.
- Use Supabase Row Level Security (RLS) policies:
  - Applicants can only read/write their own `profiles`, `applications`, `documents`.
  - Reviewers/admins have scoped access to relevant application data.
- Validate and verify JWTs (from Clerk or Supabase) on API routes; reject tokens missing claims or expired (`exp`).

## 3. Input Handling & Processing

- Employ Zod (or a similar schema validator) on both client and server for all incoming data.
- Prevent SQL/NoSQL injection by using Supabase’s parameterized queries or ORM methods; never concatenate SQL strings.
- Sanitize and context‐aware encode all user‐supplied content rendered in React (e.g., document names, comments).
- Validate file uploads strictly:
  - Allowlist MIME types (e.g., `application/pdf`, `image/jpeg`).  
  - Enforce maximum file size limits (e.g., 5 MB).  
  - Store files outside the public webroot in Supabase Storage with restricted ACLs.
- Validate redirect targets against an allow‐list (e.g., post‐login, post‐logout redirects).

## 4. Data Protection & Privacy

- Enable TLS 1.2+ for all endpoints; redirect HTTP -> HTTPS via Next.js middleware or proxy config.
- Encrypt PII and sensitive fields at rest (Supabase supports encryption-at-rest by default).
- Use Argon2 or bcrypt with a unique salt for any custom password handling (if ever needed).
- Do not log sensitive data (full SSNs, passport numbers). Mask or truncate when logging is required.
- Securely manage environment variables:
  - Store secrets (Supabase keys, Stripe API keys) in a secrets manager (e.g., AWS Secrets Manager, Vault) or GitHub Actions secrets.  
  - Do not commit `.env.local` or other secret files to source control.

## 5. API & Service Security

- Enforce HTTPS for all external service calls (Supabase, Stripe, OpenAI).
- Validate Stripe webhook signatures (`Stripe-Signature` header) to prevent spoofing.
- Implement rate limiting on critical Next.js API routes (e.g., login, form submission) using middleware like `express-rate-limit` or Vercel’s built-in rate limiter.
- Configure a restrictive CORS policy:
  - Only allow trusted origins for API endpoints.
  - Use exact origin matches; avoid wildcard (`*`).
- Expose minimum data in API responses; omit internal IDs or metadata unless necessary.
- Use appropriate HTTP verbs: GET for reads, POST for creates, PUT/PATCH for updates, DELETE for removals.
- Version your API (e.g., `/api/v1/applications`) to manage breaking changes safely.

## 6. Web Application Security Hygiene

- Prevent CSRF on all state‐changing forms and API calls:
  - Use Anti‐CSRF tokens (e.g., `next-csrf`) or leverage Clerk’s built‐in protections.
- Apply security headers via next.config.js or a custom server:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`  
  - `Content-Security-Policy:` restrict sources (scripts, styles, images) to self‐hosted or allowlisted CDNs only.  
  - `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors 'none'`  
  - `X-Content-Type-Options: nosniff`  
  - `Referrer-Policy: strict-origin-when-cross-origin`
- Secure cookies:
  - Always set `Secure`, `HttpOnly`, and `SameSite` attributes.
- Avoid storing any tokens or PII in `localStorage` or `sessionStorage`.
- Validate subresource integrity (SRI) hashes for any third‐party scripts.

## 7. Infrastructure & Configuration Management

- Harden Next.js production environment:
  - Disable debug logs and Next.js telemetry in production.
  - Use environment-specific config and avoid exposing internal build info.
- Harden Supabase and PostgreSQL:
  - Use least-privilege service accounts; separate read/write and admin roles.  
  - Rotate service keys and database passwords regularly.
- Secure Stripe configuration:
  - Store webhook secrets in a secret store; verify events before processing.  
  - Use separate test and live keys; never run live operations in test mode.
- Network security:
  - Expose only necessary ports (80/443).  
  - Use VPCs or private networking for backend services if supported.

## 8. Dependency Management

- Use a lockfile (`package-lock.json` or `yarn.lock`) and commit it to version control.
- Scan dependencies regularly with SCA tools (e.g., GitHub Dependabot, Snyk) and address vulnerabilities promptly.
- Avoid unused or deprecated libraries; review and prune at least quarterly.
- Vet the security posture of new libraries before adoption.

## 9. DevOps & CI/CD Security

- Integrate automated security checks into CI:
  - Linting for code quality (ESLint with security plugins).  
  - Vulnerability scanning (Snyk, npm audit).  
  - Secret scanning (GitHub secret scanning or TruffleHog).
- Use Infrastructure as Code (IaC) with secure defaults (e.g., Terraform, Pulumi) and review plans before apply.
- Enforce branch protection rules, PR reviews, and require passing checks before merging.
- Rotate CI/CD keys and tokens; store them encrypted in your CI platform.

## 10. Monitoring, Logging & Incident Response

- Implement centralized logging (e.g., Logflare, Datadog) with access controls.
- Mask sensitive fields in logs; avoid PII leakage.
- Set up real-time alerts for:
  - Repeated failed login attempts  
  - Suspicious API usage spikes  
  - Dependency vulnerability alerts
- Define an incident response plan: triage, containment, eradication, recovery, and post‐mortem.

---

**By following these guidelines, the International Student Admissions System will be equipped with robust, layered defenses against common threats, ensure data privacy, and maintain secure operations as it evolves.**