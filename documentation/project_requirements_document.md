# Project Requirements Document (PRD)

## 1. Project Overview

The International Student Admissions System for Universitas Ubudiyah is an online portal designed to streamline and automate the entire application process for students from abroad. Applicants can create secure accounts, complete multi-step application forms (including personal details, academic history, and document uploads), pay application fees, and track their admission status in real time. On the administrative side, university staff can review and manage applications via a dedicated dashboard with role-based access controls.

We’re building this portal to reduce manual paperwork, minimize processing errors, and provide a transparent, user-friendly experience for both applicants and staff. The key objectives are:
- Enable applicants to submit complete and validated applications without friction.
- Automate payment processing and status updates.
- Ensure data security and privacy through best-in-class authentication and database policies.
- Provide administrators with an intuitive interface to review, update, and communicate application outcomes.

Success will be measured by: a reduction in processing time, fewer incomplete submissions, positive feedback from international applicants, and stable system performance under peak load.

---

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1)
- User authentication and profile management for applicants (via Clerk).
- Multi-step application form capturing personal info, education history, and file uploads (passport scans, transcripts).
- Secure file storage in Supabase Storage.
- Application fee payment integration with Stripe, plus webhook handling for status updates.
- Real-time status updates using Supabase’s real-time channels.
- Admin dashboard (under `/admin` route) with role-based access control and basic filtering of applications.
- Automated email notifications (registration confirmation, submission receipt, fee payment confirmation, status changes) via an email service (SendGrid or Resend).
- Basic internationalization (i18n) setup using `next-i18next`, supporting English and one additional language.

### Out-of-Scope (Future Phases)
- AI-powered chatbot or form-completion assistant (OpenAI integration is scaffolded but not built out).
- Detailed analytics/reporting module for admissions metrics.
- Mobile-only native applications (we will support responsive web UI).
- Payment refund workflows and advanced financial reconciliations.
- Multi-level administrative roles beyond basic staff/admin separation.
- Third-party integrations outside Stripe and email service.

---

## 3. User Flow

A new applicant lands on the public landing page and clicks “Apply Now.” They are prompted to sign up or log in via Clerk (email/password or social login). Once authenticated, the user is directed to the multi-step application form. They proceed through sections: 1) Personal Information, 2) Educational Background, 3) Document Uploads (passport, transcripts), and finally 4) Fee Payment. Each step validates inputs using Zod (a validation library) before allowing the user to continue.

After completing the form and paying the fee via Stripe, the applicant lands on their personal dashboard. This dashboard shows a summary card of their submission with current status (Pending, Under Review, Accepted, or Rejected). Real-time updates push status changes automatically. Applicants can download submitted documents, view payment receipts, and edit certain profile fields. Email notifications also alert them to any status change.

On the administrative side, staff members access a secure `/admin` route after logging in. They see a paginated list of applicants, complete with filters (status, country, date). Clicking an applicant record opens a detailed view showing all submitted data and uploaded files. Staff can update the application status, trigger email notifications manually if needed, and add review comments.

---

## 4. Core Features

- **Authentication & Authorization**: Clerk-powered sign-up, login, password recovery, and session management. Role-based access: `applicant` vs. `admin`.
- **Applicant Profile**: Editable profile page for personal details and contact info.
- **Multi-Step Application Form**: Custom React components for each section, with client- and server-side validation (Zod).
- **File Uploads**: Supabase Storage integration for secure document uploads, with progress indicators and file-type checks.
- **Payment Processing**: Stripe integration for application fees, with 3D Secure support. Webhook listener updates payment status in Supabase.
- **Real-Time Status Updates**: Supabase real-time subscriptions to push application status changes to the dashboard without refresh.
- **Admin Dashboard**: Listing, filtering, and search of applications; detailed view; status update actions; comment logs.
- **Email Notifications**: Automated transactional emails for key events (SendGrid or Resend).
- **Internationalization (i18n)**: next-i18next setup for dynamic language switching.

---

## 5. Tech Stack & Tools

- **Frontend:** Next.js 14 (App Router), React with Server & Client Components, Tailwind CSS, Shadcn UI.
- **Authentication:** Clerk.
- **Backend & Database:** Supabase (PostgreSQL), including RLS (Row-Level Security) policies.
- **File Storage:** Supabase Storage buckets.
- **Data Fetching & State:** TanStack React Query.
- **Payments:** Stripe (Stripe.js + webhook endpoint).
- **Email Service:** SendGrid or Resend (SMTP/REST API).
- **Validation:** Zod (schema-based validation).
- **i18n:** next-i18next.
- **Animations:** Framer Motion.
- **Type Safety:** TypeScript for frontend and backend types. Auto-generated `types/database.types.ts` from Supabase schema.
- **IDE/Plugins (optional):** VS Code with Windsurf for code navigation, Cursor for AI-assisted coding.

---

## 6. Non-Functional Requirements

- **Performance:** 
  - Page Load Time < 2s on 4G network.
  - Form step transitions < 300ms.
- **Scalability:** Support up to 1,000 concurrent applicants during peak deadlines.
- **Security & Privacy:** 
  - TLS encryption for all traffic.
  - RLS policies so applicants only see their own data.
  - PCI DSS compliance for Stripe integration.
  - GDPR-compliant data handling and retention.
- **Availability:** 99.9% uptime for critical routes (`/apply`, `/dashboard`, `/admin`).
- **Accessibility:** WCAG 2.1 AA compliance for forms and navigational elements.

---

## 7. Constraints & Assumptions

- **Supabase Project:** We assume the provided Supabase project URL and API keys are available and configured with the correct network access.
- **Clerk Availability:** Rely on Clerk’s hosted service for authentication; assume no disruptions.
- **Stripe Webhooks:** Requires publicly accessible webhook endpoint (use Vercel or dedicated server).
- **Email Service Credentials:** Access to SendGrid/Resend API keys and verified sending domain.
- **File Size Limits:** Assume individual file uploads limited to 50 MB by Supabase Storage.

---

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits:** Supabase and Stripe have rate limits. Mitigation: implement retry logic with exponential backoff and monitor quota usage.
- **Large File Uploads:** Users on slow connections may experience timeouts. Mitigation: use resumable uploads or chunked file uploads.
- **RLS Misconfiguration:** Incorrect policies could expose data. Mitigation: write and test RLS policies early, use integration tests to verify isolation.
- **Email Deliverability:** Spam filters may block emails. Mitigation: configure SPF/DKIM records and monitor bounce rates.
- **Webhook Reliability:** Network issues could cause lost Stripe events. Mitigation: persist events, implement idempotency and retry on failure.

---

This PRD provides a clear blueprint for the AI model (and future developers) to build, extend, and maintain the International Student Admissions System without ambiguity. All core components, flows, and technical details are laid out to enable seamless progress to subsequent technical design documents and implementation.