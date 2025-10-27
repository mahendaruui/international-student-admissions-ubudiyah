# Database Setup Guide
## International Student Admissions System - Universitas Ubudiyah Indonesia

This guide will help you set up the complete database schema for the international student admissions system using Supabase.

## 📋 Overview

The database includes the following components:
- **User Profiles** - Linked to Clerk authentication
- **Applications Management** - Complete application workflow
- **Document Storage** - Secure file uploads with access controls
- **Educational Background** - Academic history tracking
- **Study Programs** - Available academic programs
- **Admission Intakes** - Application periods and deadlines
- **Countries Reference** - Geographical data
- **Row-Level Security** - Data access protection
- **Storage Buckets** - Document and profile image storage

## 🔧 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Supabase CLI**: Install the Supabase CLI
   ```bash
   npm install -g supabase
   ```
3. **Login to Supabase**:
   ```bash
   supabase login
   ```

## 🚀 Quick Setup

### 1. Environment Configuration

The `.env.local` file has already been configured with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jydtzoxaypswsuvsvngc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5ZHR6b3hheXBzd3N1dnN2bmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDg1MzgsImV4cCI6MjA3NzEyNDUzOH0.mbODK_bDPrhtQnEhp7I62L6DBEuAgYxbGcob0DF6gm4
```

### 2. Run Database Setup

Use the automated setup script:

```bash
# Navigate to the project root
cd /workspace/repo

# Run the setup script
./supabase/setup_database.sh
```

### 3. Manual Setup (Alternative)

If the automated script doesn't work, you can run the migrations manually:

```bash
# Link to your Supabase project
supabase link --project-ref jydtzoxaypswsuvsvngc

# Push the database schema
supabase db push

# Set up storage buckets (run in Supabase SQL editor)
# Copy and paste the contents of supabase/storage_setup.sql
```

## 📊 Database Schema

### Core Tables

#### `profiles`
User profiles linked to Clerk authentication
- Stores personal information, contact details, and role
- Links to countries for nationality and residence
- Supports applicant and admin roles

#### `applications`
Main application records
- Auto-generated application numbers (e.g., UIA-2025-0001)
- Links to study programs and admission intakes
- Tracks application status and payment status
- Stores admin notes and review decisions

#### `educational_background`
Academic history for each applicant
- Multiple records per applicant allowed
- Supports different education levels
- Includes GPA with different scales
- Links to institution countries

#### `application_documents`
Document management
- Supports multiple document types (passport, transcript, etc.)
- Links to Supabase Storage for file URLs
- Tracks verification status and admin reviews

### Reference Tables

#### `countries`
Geographical reference data
- 50+ countries pre-populated
- ISO country codes included

#### `study_programs`
Available academic programs
- Multiple program types (bachelor, master, etc.)
- Faculty organization
- Admission requirements (JSON)

#### `admission_intakes`
Application periods
- Multiple intakes per year
- Important dates management
- Active/inactive status

## 🔐 Security Features

### Row-Level Security (RLS)

The database implements comprehensive RLS policies:

- **Users can only access their own data**
- **Admins can access all data**
- **Application documents are isolated by user**
- **Profile pictures are publicly viewable but only editable by owners**

### Storage Policies

- **Application documents**: Private, user and admin access only
- **Profile pictures**: Public view, owner edit only
- **File size limits**: 50MB for documents, 2MB for profile pictures
- **Allowed file types**: PDF, Word, images

## 📁 Database Files

- `supabase/migrations/20250126000000_international_admissions_schema.sql` - Main schema
- `supabase/storage_setup.sql` - Storage buckets and policies
- `supabase/setup_database.sh` - Automated setup script
- `types/database.types.ts` - TypeScript type definitions
- `lib/admissions.ts` - Database utility functions

## 🔗 Database Connections

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Client Configuration

The database is configured to work with:
- **Next.js App Router**
- **Clerk Authentication**
- **TypeScript** with full type safety
- **Supabase Client** for server and client operations

## 🧪 Testing the Database

After setup, you can test the database by:

1. **Check connection** in your Next.js app
2. **Verify tables** in Supabase dashboard
3. **Test RLS policies** with different user roles
4. **Upload test documents** to storage buckets

### Sample Queries

```sql
-- Test profile creation
SELECT * FROM profiles LIMIT 1;

-- Test application number generation
SELECT generate_application_number();

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'applications';
```

## 📚 Data Access Patterns

### Application Flow

1. **User Registration** → Create profile in `profiles` table
2. **Start Application** → Create record in `applications` table
3. **Add Education** → Populate `educational_background` table
4. **Upload Documents** → Store in `application_documents` and Supabase Storage
5. **Submit Application** → Update application status
6. **Admin Review** → Admin updates status and adds notes

### Admin Operations

- **View all applications** with filtering and search
- **Update application status** with audit trail
- **Verify uploaded documents**
- **Manage study programs and intakes**
- **Generate reports and statistics**

## 🚨 Important Notes

- **Never expose SERVICE_ROLE_KEY** in client-side code
- **Always validate user permissions** before database operations
- **Use RLS policies** for data security
- **Monitor database usage** and quotas
- **Back up your data** regularly

## 🆘 Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify environment variables
   - Check Supabase project status
   - Ensure correct project URL

2. **RLS Policy Errors**
   - Check user authentication status
   - Verify policy definitions
   - Test with different user roles

3. **Storage Upload Errors**
   - Check bucket permissions
   - Verify file size limits
   - Ensure correct MIME types

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the database schema in the SQL files
- Test queries in the Supabase SQL Editor
- Check browser console for detailed error messages

---

## ✅ Setup Complete

Once you've completed the setup, your international student admissions system database is ready to use! The system supports:

- ✅ Multi-step application forms
- ✅ Secure document uploads
- ✅ Role-based access control
- ✅ Real-time status updates
- ✅ Admin review workflows
- ✅ Comprehensive data security

Your database is now ready for the international student admission system! 🎉