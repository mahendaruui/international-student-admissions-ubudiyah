# Backend Structure Document

## 1. Backend Architecture

Our system is built around a modern, component-based server-rendered architecture using Next.js 14. Here’s how it all fits together:

• Frontend & Server in One: We use Next.js’s App Router to handle both page rendering and API routes in the same codebase.  
• Modular Design: UI components (forms, buttons, dialogs) live in a `components/` folder, while page-level logic and server functions sit under `app/`.  
• Serverless Functions: API endpoints are deployed as serverless functions (on Vercel), so they scale automatically with traffic.  
• BaaS Integration: Supabase powers our database, real-time updates, authentication hooks, and file storage.  
• Third-Party Services: Clerk handles sign-up and login; Stripe processes payments; OpenAI hooks are in place for future AI features.  

Why this works well:

• Scalability: Serverless endpoints and managed Postgres let us grow without manual server provisioning.  
• Maintainability: Clear folder structure and TypeScript types keep logic organized and easy to update.  
• Performance: Edge caching on Vercel plus built-in React Query caching keeps pages snappy.  

## 2. Database Management

We rely on Supabase’s hosted PostgreSQL database. Key points:

• SQL Database: A single Postgres instance holds all tables.  
• Row Level Security (RLS): Policies ensure each student only sees their own records.  
• Real-time Subscriptions: Clients can listen for status changes and document uploads in real time.  
• Migrations: We manage schema changes via SQL migration scripts under `supabase/migrations/`.  
• Type Safety: After each migration, we regenerate TypeScript types so database fields stay in sync with our code.  

## 3. Database Schema

Below is the human-readable schema, followed by SQL for a Postgres setup.  

### Tables and Relationships (Plain English)

• **profiles**: One row per applicant. Stores basic personal info, links to the authentication system.  
• **applications**: One row per application attempt. Tracks status (draft, submitted, paid, reviewed).  
• **education_history**: Multiple rows per application, capturing each school or program attended.  
• **documents**: Multiple rows per application, storing file metadata (type, URL, upload time).  
• **payments**: One row per Stripe payment. Records amount, currency, payment status, and timestamp.  

Relationships:

• A profile can have many applications.  
• An application can have many education_history records and many documents.  
• Each application can have one or more related payments.  

### SQL Schema (PostgreSQL)

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Education history
CREATE TABLE education_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  institution_name TEXT NOT NULL,
  degree TEXT,
  start_date DATE,
  end_date DATE
);

-- Documents metadata
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  stripe_payment_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 4. API Design and Endpoints

We follow a RESTful pattern via Next.js API routes. Key endpoints:

• **Authentication (Clerk)**:  
  • `/api/auth/*` – Handled by Clerk for sign-up, login, token refresh, password reset.  

• **Profiles**:  
  • `GET /api/profiles/me` – Fetch the current user’s profile.  
  • `PUT /api/profiles/me` – Update profile details.  

• **Applications**:  
  • `POST /api/applications` – Create a new application (in draft state).  
  • `GET /api/applications` – List all applications for the current profile.  
  • `GET /api/applications/[id]` – Get details of one application.  
  • `PATCH /api/applications/[id]` – Update application data or status.  

• **Education History & Documents**:  
  • `POST /api/applications/[id]/education` – Add new education record.  
  • `DELETE /api/applications/[id]/education/[eduId]` – Remove a record.  
  • `POST /api/applications/[id]/documents` – Upload a document.  
  • `GET /api/applications/[id]/documents` – List uploaded documents.  

• **Payments & Webhooks**:  
  • `POST /api/payments/create` – Create a Stripe Checkout session.  
  • `POST /api/webhooks/stripe` – Handle Stripe events (payment success, failure).  

All endpoints require a valid Clerk session, and RLS policies enforce that users only access their own data.

## 5. Hosting Solutions

• **Next.js on Vercel**:  
  • Global Edge Network and CDN for fast page loads worldwide.  
  • Auto-scaling serverless functions for API routes.  
• **Supabase Cloud**:  
  • Managed Postgres database with daily backups and built-in real-time.  
  • Scalable file storage for document uploads.  
• **Stripe**:  
  • PCI-compliant payment processing.  
  
By choosing these managed services, we minimize maintenance overhead and ensure high reliability and global reach at a predictable cost.

## 6. Infrastructure Components

• **CDN & Edge Caching**: Vercel’s network ensures static assets and serverless responses are cached close to users.  
• **Load Balancing**: Vercel automatically routes traffic across multiple edge nodes.  
• **Caching Layer**: React Query in the browser caches API responses; Next.js ISR (incremental static regeneration) can be used for public pages.  
• **Real-time Engine**: Supabase’s WebSocket-based real-time sync for status updates and live dashboards.  
• **Object Storage**: Supabase Storage buckets hold applicant documents securely.  

These pieces work together so users get quick responses, even under heavy load.

## 7. Security Measures

• **Authentication & Authorization**:  
  • Clerk provides secure sign-in, multi-factor options, and session management.  
  • Supabase RLS policies ensure data isolation per user.  
• **Data Encryption**:  
  • TLS/HTTPS in transit for all API calls and data transfers.  
  • At-rest encryption on Supabase Postgres and Storage.  
• **Stripe Webhook Verification**:  
  • All incoming webhooks are verified against Stripe’s signature.  
• **Input Validation**:  
  • Zod schemas on both client and server to validate incoming data.  
• **Content Security**:  
  • Strict Content Security Policy (CSP) headers on Next.js to prevent XSS.  

Together, these controls protect user data and help maintain compliance with privacy standards.

## 8. Monitoring and Maintenance

• **Error Tracking**: Sentry or Logflare for capturing serverless function errors and performance issues.  
• **Performance Monitoring**: Vercel Analytics for page load times; Supabase’s dashboard for database metrics.  
• **Logging**: Structured logs in serverless functions, aggregated via a log service.  
• **Automated Backups & Migrations**:  
  • Supabase handles nightly backups.  
  • Migrations stored in Git ensure schema changes are versioned.  
• **Testing**:  
  • Unit tests for critical business logic.  
  • Integration tests for API routes.  
  • End-to-end tests with Playwright or Cypress simulate real student workflows.  

These practices keep the system healthy and allow us to respond quickly to any issues.

## 9. Conclusion and Overall Backend Summary

This backend setup combines serverless Next.js APIs, a managed Postgres database, and best-in-class third-party services to deliver a secure, scalable, and maintainable admissions system. Key strengths:

• **Speed of Development**: Powerful BaaS and prebuilt UI components let us focus on features, not boilerplate.  
• **Security by Default**: Clerk, RLS, and encrypted transport/data keep applicant information safe.  
• **Global Performance**: Vercel’s edge network, React Query caching, and real-time updates ensure a smooth user experience.  
• **Future-Ready**: Hooks for AI integration, internationalization support, and a clear schema make it easy to expand the system.

With this structure in place, the team can concentrate on building the user-facing admissions workflow and an administrative dashboard that meets Universitas Ubudiyah’s needs.