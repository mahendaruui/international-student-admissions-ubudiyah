-- Supabase Storage Setup for International Student Admissions System
-- This script sets up storage buckets and policies for secure document uploads

-- Create storage buckets for different types of documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('application-documents', 'application-documents', false, 52428800, ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/jpg'
    ])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for application documents bucket

-- Policy: Users can upload documents to their own application folders
CREATE POLICY "Users can upload documents to their own applications" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'application-documents' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = (
            SELECT application_number::text
            FROM applications
            WHERE profile_id = (
                SELECT id FROM profiles
                WHERE clerk_user_id = auth.uid()
            )
        )
    );

-- Policy: Users can view their own application documents
CREATE POLICY "Users can view their own application documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'application-documents' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] IN (
            SELECT application_number::text
            FROM applications
            WHERE profile_id = (
                SELECT id FROM profiles
                WHERE clerk_user_id = auth.uid()
            )
        )
    );

-- Policy: Users can update their own application documents
CREATE POLICY "Users can update their own application documents" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'application-documents' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] IN (
            SELECT application_number::text
            FROM applications
            WHERE profile_id = (
                SELECT id FROM profiles
                WHERE clerk_user_id = auth.uid()
            )
        )
    );

-- Policy: Admins can view all application documents
CREATE POLICY "Admins can view all application documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'application-documents' AND
        EXISTS (
            SELECT 1 FROM profiles
            WHERE clerk_user_id = auth.uid()
            AND role IN ('admin', 'staff')
        )
    );

-- Policy: Admins can manage all application documents
CREATE POLICY "Admins can manage all application documents" ON storage.objects
    FOR ALL USING (
        bucket_id = 'application-documents' AND
        EXISTS (
            SELECT 1 FROM profiles
            WHERE clerk_user_id = auth.uid()
            AND role IN ('admin', 'staff')
        )
    );

-- Create profile pictures bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('profile-pictures', 'profile-pictures', true, 2097152, ARRAY[
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp'
    ])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile pictures bucket

-- Policy: Users can upload their own profile picture
CREATE POLICY "Users can upload their own profile picture" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'profile-pictures' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()
    );

-- Policy: Anyone can view profile pictures (public bucket)
CREATE POLICY "Anyone can view profile pictures" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'profile-pictures'
    );

-- Policy: Users can update their own profile picture
CREATE POLICY "Users can update their own profile picture" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'profile-pictures' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()
    );

-- Policy: Users can delete their own profile picture
CREATE POLICY "Users can delete their own profile picture" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'profile-pictures' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()
    );

-- Grant necessary permissions
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.buckets TO anon;
GRANT SELECT ON storage.objects TO anon;