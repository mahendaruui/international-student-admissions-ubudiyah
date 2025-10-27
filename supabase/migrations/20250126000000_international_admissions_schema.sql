-- International Student Admissions Database Schema
-- Universitas Ubudiyah Indonesia
-- This migration creates tables for student profiles, applications, documents, and admin management

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS application_documents CASCADE;
DROP TABLE IF EXISTS educational_background CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS countries CASCADE;
DROP TABLE IF EXISTS study_programs CASCADE;
DROP TABLE IF EXISTS admission_intakes CASCADE;

-- Create enums for application status and other fields
CREATE TYPE application_status AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'additional_documents_required',
    'accepted',
    'rejected',
    'withdrawn'
);

CREATE TYPE application_payment_status AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded'
);

CREATE TYPE document_type AS ENUM (
    'passport',
    'transcript',
    'certificate',
    'recommendation_letter',
    'english_proficiency',
    'financial_proof',
    'medical_certificate',
    'portfolio',
    'other'
);

CREATE TYPE education_level AS ENUM (
    'high_school',
    'bachelor',
    'master',
    'doctorate',
    'diploma'
);

CREATE TYPE program_type AS ENUM (
    'bachelor',
    'master',
    'doctorate',
    'diploma',
    'certificate'
);

-- Countries table for reference data
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(2) UNIQUE NOT NULL, -- ISO 3166-1 alpha-2
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study Programs table
CREATE TABLE study_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    name_id VARCHAR(200), -- Indonesian name
    description TEXT,
    description_id TEXT, -- Indonesian description
    faculty VARCHAR(100),
    program_type program_type NOT NULL,
    duration_years INTEGER NOT NULL CHECK (duration_years > 0),
    is_active BOOLEAN DEFAULT true,
    admission_requirements JSONB, -- Store requirements as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admission Intakes for managing intake periods
CREATE TABLE admission_intakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL, -- e.g., "2024/2025"
    semester VARCHAR(20) NOT NULL, -- e.g., "Fall", "Spring"
    application_start_date DATE NOT NULL,
    application_deadline DATE NOT NULL,
    results_announcement_date DATE,
    orientation_start_date DATE,
    classes_start_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table linked to Clerk users
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id VARCHAR(255) UNIQUE NOT NULL, -- Link to Clerk user ID
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10), -- 'male', 'female', 'other'
    nationality_id UUID REFERENCES countries(id),
    passport_number VARCHAR(50),
    passport_expiry_date DATE,
    residential_address TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country_id UUID REFERENCES countries(id),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    role VARCHAR(20) DEFAULT 'applicant' CHECK (role IN ('applicant', 'admin', 'staff')),
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Educational Background table
CREATE TABLE educational_background (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    institution_name VARCHAR(200) NOT NULL,
    institution_city VARCHAR(100),
    institution_country_id UUID REFERENCES countries(id),
    education_level education_level NOT NULL,
    field_of_study VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE,
    graduation_date DATE,
    gpa DECIMAL(4,3) CHECK (gpa >= 0 AND gpa <= 10), -- Allow different GPA scales
    gpa_scale INTEGER DEFAULT 10 CHECK (gpa_scale IN (4, 5, 7, 10)), -- Common GPA scales
    is_current BOOLEAN DEFAULT false,
    degree_certificate_url TEXT,
    transcript_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(20) UNIQUE NOT NULL, -- e.g., "UIA-2025-0001"
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES study_programs(id),
    intake_id UUID NOT NULL REFERENCES admission_intakes(id),
    status application_status DEFAULT 'draft',
    payment_status application_payment_status DEFAULT 'pending',
    submission_date TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    admin_notes TEXT,
    admin_reviewer_id UUID REFERENCES profiles(id),
    rejection_reason TEXT,
    acceptance_conditions TEXT,
    application_fee_amount DECIMAL(10,2) DEFAULT 50.00,
    stripe_payment_intent_id VARCHAR(255),
    stripe_payment_status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Add constraints
    CONSTRAINT valid_status_transition CHECK (
        status = 'draft' OR
        (status = 'submitted' AND submission_date IS NOT NULL) OR
        status IN ('under_review', 'additional_documents_required', 'accepted', 'rejected', 'withdrawn')
    )
);

-- Application Documents table
CREATE TABLE application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT CHECK (file_size > 0),
    file_type VARCHAR(50) NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT false,
    verification_notes TEXT,
    admin_reviewer_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_clerk_user_id ON profiles(clerk_user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_applications_profile_id ON applications(profile_id);
CREATE INDEX idx_applications_program_id ON applications(program_id);
CREATE INDEX idx_applications_intake_id ON applications(intake_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_application_number ON applications(application_number);
CREATE INDEX idx_educational_background_profile_id ON educational_background(profile_id);
CREATE INDEX idx_application_documents_application_id ON application_documents(application_id);
CREATE INDEX idx_application_documents_type ON application_documents(document_type);
CREATE INDEX idx_study_programs_active ON study_programs(is_active);
CREATE INDEX idx_admission_intakes_active ON admission_intakes(is_active);

-- Create function to auto-generate application numbers
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TEXT AS $$
DECLARE
    year_prefix TEXT;
    sequence_num INTEGER;
BEGIN
    year_prefix := EXTRACT(YEAR FROM NOW())::TEXT;

    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SPLIT_PART(application_number, '-', 3) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM applications
    WHERE application_number LIKE 'UIA-' || year_prefix || '-%';

    RETURN 'UIA-' || year_prefix || '-' || LPAD(sequence_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-generating application numbers
CREATE OR REPLACE FUNCTION set_application_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_number IS NULL OR NEW.application_number = '' THEN
        NEW.application_number := generate_application_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_application_number
    BEFORE INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION set_application_number();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_educational_background_updated_at BEFORE UPDATE ON educational_background
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_application_documents_updated_at BEFORE UPDATE ON application_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_background ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', ''));

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', ''));

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p2
            WHERE p2.clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
            AND p2.role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles p2
            WHERE p2.clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
            AND p2.role IN ('admin', 'staff')
        )
    );

-- Applications policies
CREATE POLICY "Users can view their own applications" ON applications
    FOR SELECT USING (
        profile_id = (
            SELECT id FROM profiles
            WHERE clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
        )
    );

CREATE POLICY "Users can insert their own applications" ON applications
    FOR INSERT WITH CHECK (
        profile_id = (
            SELECT id FROM profiles
            WHERE clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
        )
    );

CREATE POLICY "Users can update their own applications" ON applications
    FOR UPDATE USING (
        profile_id = (
            SELECT id FROM profiles
            WHERE clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
        )
        AND status IN ('draft', 'additional_documents_required')
    );

CREATE POLICY "Admins can view all applications" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p2
            WHERE p2.clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
            AND p2.role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Admins can update all applications" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles p2
            WHERE p2.clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
            AND p2.role IN ('admin', 'staff')
        )
    );

-- Educational Background policies
CREATE POLICY "Users can view their own educational background" ON educational_background
    FOR SELECT USING (
        profile_id = (
            SELECT id FROM profiles
            WHERE clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
        )
    );

CREATE POLICY "Users can insert their own educational background" ON educational_background
    FOR INSERT WITH CHECK (
        profile_id = (
            SELECT id FROM profiles
            WHERE clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
        )
    );

CREATE POLICY "Users can update their own educational background" ON educational_background
    FOR UPDATE USING (
        profile_id = (
            SELECT id FROM profiles
            WHERE clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
        )
    );

CREATE POLICY "Admins can view all educational backgrounds" ON educational_background
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p2
            WHERE p2.clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
            AND p2.role IN ('admin', 'staff')
        )
    );

-- Application Documents policies
CREATE POLICY "Users can view their own application documents" ON application_documents
    FOR SELECT USING (
        application_id IN (
            SELECT id FROM applications
            WHERE profile_id = (
                SELECT id FROM profiles
                WHERE clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
            )
        )
    );

CREATE POLICY "Users can insert their own application documents" ON application_documents
    FOR INSERT WITH CHECK (
        application_id IN (
            SELECT id FROM applications
            WHERE profile_id = (
                SELECT id FROM profiles
                WHERE clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
            )
        )
    );

CREATE POLICY "Users can update their own application documents" ON application_documents
    FOR UPDATE USING (
        application_id IN (
            SELECT id FROM applications
            WHERE profile_id = (
                SELECT id FROM profiles
                WHERE clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
            )
        )
    );

CREATE POLICY "Admins can view all application documents" ON application_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p2
            WHERE p2.clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
            AND p2.role IN ('admin', 'staff')
        )
    );

-- Study Programs policies (public read, admin write)
CREATE POLICY "Public can view active study programs" ON study_programs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage study programs" ON study_programs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
            AND role IN ('admin')
        )
    );

-- Admission Intakes policies
CREATE POLICY "Public can view active admission intakes" ON admission_intakes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage admission intakes" ON admission_intakes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE clerk_user_id = NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')
            AND role IN ('admin')
        )
    );

-- Countries policies (public read-only)
CREATE POLICY "Public can view countries" ON countries
    FOR SELECT USING (true);

-- Insert initial data
INSERT INTO countries (code, name) VALUES
('ID', 'Indonesia'),
('MY', 'Malaysia'),
('SG', 'Singapore'),
('TH', 'Thailand'),
('PH', 'Philippines'),
('VN', 'Vietnam'),
('MM', 'Myanmar'),
('KH', 'Cambodia'),
('LA', 'Laos'),
('BN', 'Brunei'),
('TL', 'Timor-Leste'),
('US', 'United States'),
('GB', 'United Kingdom'),
('AU', 'Australia'),
('CA', 'Canada'),
('NZ', 'New Zealand'),
('IN', 'India'),
('PK', 'Pakistan'),
('BD', 'Bangladesh'),
('CN', 'China'),
('JP', 'Japan'),
('KR', 'South Korea'),
('SA', 'Saudi Arabia'),
('AE', 'United Arab Emirates'),
('EG', 'Egypt'),
('NG', 'Nigeria'),
('KE', 'Kenya'),
('ZA', 'South Africa'),
('DE', 'Germany'),
('FR', 'France'),
('NL', 'Netherlands'),
('IT', 'Italy'),
('ES', 'Spain'),
('SE', 'Sweden'),
('NO', 'Norway'),
('DK', 'Denmark'),
('FI', 'Finland'),
('CH', 'Switzerland'),
('AT', 'Austria'),
('BE', 'Belgium'),
('IE', 'Ireland'),
('PT', 'Portugal'),
('GR', 'Greece'),
('RU', 'Russia'),
('TR', 'Turkey'),
('IL', 'Israel'),
('BR', 'Brazil'),
('AR', 'Argentina'),
('CL', 'Chile'),
('PE', 'Peru'),
('CO', 'Colombia'),
('MX', 'Mexico');

-- Insert sample study programs
INSERT INTO study_programs (code, name, faculty, program_type, duration_years, description) VALUES
('CS-BCH', 'Computer Science', 'Faculty of Engineering', 'bachelor', 4, 'Bachelor of Computer Science with focus on software development, AI, and data science'),
('BS-BCH', 'Business Administration', 'Faculty of Business', 'bachelor', 4, 'Bachelor in Business Administration with focus on management, marketing, and entrepreneurship'),
('EN-BCH', 'English Literature', 'Faculty of Humanities', 'bachelor', 4, 'Bachelor of Arts in English Literature with focus on language, literature, and cultural studies'),
('IS-BCH', 'Islamic Studies', 'Faculty of Islamic Studies', 'bachelor', 4, 'Bachelor of Islamic Studies with focus on Islamic theology, law, and civilization'),
('CS-MAS', 'Computer Science', 'Faculty of Engineering', 'master', 2, 'Master of Computer Science with focus on advanced algorithms, machine learning, and research'),
('MBA-MAS', 'Business Administration', 'Faculty of Business', 'master', 2, 'Master of Business Administration with focus on strategic management and leadership'),
('IS-MAS', 'Islamic Studies', 'Faculty of Islamic Studies', 'master', 2, 'Master of Islamic Studies with focus on advanced Islamic research and scholarship');

-- Insert sample admission intakes
INSERT INTO admission_intakes (name, academic_year, semester, application_start_date, application_deadline, results_announcement_date, orientation_start_date, classes_start_date) VALUES
('Fall Intake 2025', '2025/2026', 'Fall', '2025-01-01', '2025-06-30', '2025-07-31', '2025-08-15', '2025-09-01'),
('Spring Intake 2026', '2025/2026', 'Spring', '2025-07-01', '2025-12-31', '2026-01-31', '2026-02-15', '2026-03-01');