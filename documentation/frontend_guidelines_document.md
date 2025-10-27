# Frontend Guideline Document for International Student Admissions System

This document outlines the frontend architecture, design principles, and technologies for the International Student Admissions System at Universitas Ubudiyah. It is written in clear, everyday language to ensure that anyone can understand the setup.

## 1. Frontend Architecture

### 1.1 Overview of Technologies
- **Next.js 14 (App Router)**: Provides server-side rendering (SSR), static site generation (SSG), and a file-based routing system. This creates fast, SEO-friendly pages and scales well as the application grows.
- **Clerk**: Handles user authentication—sign-up, login, password recovery—so you don’t have to build or maintain your own auth system.
- **Supabase**: Acts as our backend-as-a-service (BaaS). It offers a Postgres database, real-time subscriptions, and storage for file uploads.
- **Stripe**: Manages application fee payments securely. Webhooks keep the database in sync when payments succeed.
- **Tailwind CSS & Shadcn UI**: A utility-first CSS framework plus a set of accessible, prebuilt components for rapid UI development.
- **TanStack React Query**: Manages data fetching, caching, and synchronization with Supabase, making the app feel fast and responsive.
- **Framer Motion**: Creates smooth UI animations (e.g., animated hero sections or form transitions).
- **clsx & tailwind-merge**: Utilities to compose and conditionally merge CSS class names.
- **OpenAI API Hooks**: A placeholder for future AI-powered assistance (chatbot or form helper).

### 1.2 Scalability, Maintainability, Performance
- **Server & Client Components**: Next.js splits rendering duties, so static content is prebuilt, and dynamic parts load on demand.
- **File-Based Routing**: New pages are simply new files—no extra configuration needed.
- **Component-Based Structure**: Encourages reusable, isolated components that are easy to test and maintain.
- **Batched Data Fetching**: React Query avoids redundant calls, keeps the UI snappy, and handles retries and error states automatically.
- **Real-Time Updates**: Supabase subscriptions push status changes to the UI without manual refresh.

## 2. Design Principles

### 2.1 Usability
- **Clear Form Flow**: Break the multi-step application into logical sections (Personal Info, Education, Documents, Payment).
- **Progress Indicators**: Show applicants where they are in the process.
- **Inline Validation**: Use Zod on the client and server to catch errors early and show helpful messages.

### 2.2 Accessibility
- Follow **WCAG 2.1** guidelines:
  - Semantic HTML elements (labels, fieldsets, headings).
  - Proper ARIA attributes on dialogs, modals, and custom components.
  - Keyboard navigation and focus management in all interactive pieces.
  - Sufficient color contrast for text and interactive elements.

### 2.3 Responsiveness
- **Mobile-first design**: Layout and font sizes adapt to phone, tablet, and desktop.
- **Flexbox & Grid**: Tailwind utilities make responsive layouts straightforward.
- **Touch-friendly controls**: Buttons and form fields have enough padding for easy tapping.

### 2.4 Consistency & Clarity
- Use a shared set of design tokens for colors, spacing, and typography.
- Keep interaction patterns (buttons, modals, toasts) uniform across the site.

## 3. Styling and Theming

### 3.1 Styling Approach
- **Utility-First with Tailwind CSS**: Write minimal custom CSS—compose styles with prebuilt utility classes.
- **Component Styles with Shadcn UI**: Use and extend accessible, themeable components (buttons, inputs, dialogs).

### 3.2 Theming
- **Light & Dark Mode**: Configure Tailwind’s `dark` variant. Store user preference in local storage or system setting.
- **Design Tokens** in `tailwind.config.js`:
  - Colors, font sizes, spacing, border radii.
  - Custom CSS variables for glassmorphism overlays.

### 3.3 Visual Style
- **Modern Flat Design** with subtle **glassmorphism** on overlays (semi-transparent cards with blur).

### 3.4 Color Palette
```
--color-primary:    #1D4ED8   /* Blue 600 */
--color-secondary:  #9333EA   /* Purple 600 */
--color-accent:     #10B981   /* Green 500 */
--color-background: #F9FAFB   /* Gray 50 */
--color-surface:    #FFFFFF   /* White */
--color-text:       #111827   /* Gray 900 */
--color-muted:      #6B7280   /* Gray 600 */
--color-border:     #E5E7EB   /* Gray 200 */
--color-danger:     #EF4444   /* Red 500 */
--color-warning:    #F59E0B   /* Yellow 500 */
```

### 3.5 Typography
- **Font Family**: Inter (sans-serif) for clean, modern readability.
- **Scale**: Base font-size 16px, headings scale with `text-2xl` to `text-5xl`.

## 4. Component Structure

### 4.1 Organization
- **`app/`** folder: Routes and layout files.
- **`components/ui/`**: Generic, reusable UI parts (Button, Input, Modal, Toast).
- **`components/forms/`**: Form-specific fields and multi-step form logic (ApplicationStep1, DocumentUploader).
- **`components/dashboard/`**: Applicant and admin dashboard widgets.
- **`components/chat/`**: Placeholder components for AI assistance (ChatWindow, ChatInput).

### 4.2 Separation of Concerns
- **Server Components**: For data that can be fetched at build or request time (landing page content, FAQs).
- **Client Components**: For interactive parts (forms, real-time status, chat).

### 4.3 Reusability & Maintainability
- Write small, focused components.
- Leverage TypeScript interfaces for props to catch misuse early.
- Publish shared UI bits in their own folder to avoid duplication.

## 5. State Management

### 5.1 Server State
- **React Query**:
  - Caches Supabase queries.
  - Provides hooks like `useQuery`, `useMutation`, `useInfiniteQuery`.
  - Automatically retries and manages loading/error states.

### 5.2 Client/UI State
- **Context API** or simple **useState/useReducer** for UI controls (dark mode toggle, multi-step form position).
- Avoid global state unless necessary—keep most state close to where it’s used.

## 6. Routing and Navigation

### 6.1 Next.js App Router
- **File-Based Routing**: Each folder under `app/` becomes a route. Example:
  - `/apply` → `app/apply/page.tsx`
  - `/dashboard` → `app/dashboard/page.tsx`
  - `/admin` → `app/admin/page.tsx`
  - `/faq` → `app/faq/page.tsx`
- **Dynamic Segments**: e.g., `app/dashboard/[applicationId]/page.tsx` for detailed views.

### 6.2 Protected Routes
- Wrap pages with Clerk’s `withAuth` HOC or use `<SignedIn>/<SignedOut>` components.
- Redirect unauthorized users to the login page.

### 6.3 Global Navigation
- **Layout Component**: Renders header, footer, and a sidebar or top nav.
- **Command Palette**: Quick keyboard-driven navigation ("Go to My Application", "Check Status").

## 7. Performance Optimization

- **Lazy Loading**: Use `next/dynamic` to load heavy components on demand (e.g., chart libraries, document preview).
- **Image Optimization**: Use `<Image>` from Next.js for automatic resizing and modern formats.
- **Code Splitting**: Next.js splits bundles per route automatically.
- **React Query Prefetching**: Prefetch data when users hover or focus links.
- **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` for expensive computations.
- **Minification & Compression**: Ensure your build pipeline minifies JS/CSS and serves Brotli/Gzip.

## 8. Testing and Quality Assurance

### 8.1 Unit Testing
- **Jest** with **React Testing Library** for component logic and small utility functions.

### 8.2 Integration Testing
- Use **React Testing Library** with **MSW** (Mock Service Worker) to simulate Supabase and Stripe responses.

### 8.3 End-to-End (E2E) Testing
- **Playwright** or **Cypress** to simulate a user journey: sign-up, form completion, file upload, payment, and status check.

### 8.4 Linting & Formatting
- **ESLint** with Next.js and TypeScript plugins.
- **Prettier** for consistent code style.
- **Husky** + **lint-staged** to run checks before commits.

### 8.5 Continuous Integration
- Configure a CI pipeline (GitHub Actions) to run linting, type-checks, and all tests on every PR.

## 9. Internationalization (i18n)

- **next-i18next** or Next.js built-in i18n routing.
- Store translations in `/public/locales/{en, id}/common.json`.
- Wrap text in `t('key')` to switch languages easily.

## 10. Conclusion and Overall Frontend Summary

This guideline lays out a clear, scalable frontend setup for the International Student Admissions System:
- A modern Next.js 14 architecture ensures performance and SEO.
- Clerk and Supabase handle auth and data, removing boilerplate.
- Tailwind CSS + Shadcn UI deliver a consistent, accessible look.
- React Query, code splitting, and SSR/SSG optimize speed.
- A robust testing strategy guards against regressions.
- Internationalization prepares the portal for a global audience.

By following these guidelines, you’ll build a maintainable, high-performance application that meets applicants’ needs and scales with the university’s goals.
