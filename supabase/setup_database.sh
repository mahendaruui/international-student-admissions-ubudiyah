#!/bin/bash

# International Student Admissions Database Setup Script
# This script runs all the necessary SQL files to set up the database

echo "🚀 Setting up International Student Admissions Database..."
echo "📍 Supabase URL: https://jydtzoxaypswsuvsvngc.supabase.co"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if user is logged in to Supabase
echo "🔐 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "❌ You are not logged in to Supabase. Please run:"
    echo "   supabase login"
    exit 1
fi

# Link to the project (if not already linked)
echo "🔗 Linking to Supabase project..."
supabase link --project-ref jydtzoxaypswsuvsvngc

echo ""
echo "📊 Running database migrations..."

# Run the main schema migration
echo "📋 Creating database schema..."
supabase db push --db-url postgresql://postgres.jydtzoxaypswsuvsvngc:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

echo ""
echo "📁 Setting up storage buckets and policies..."
supabase db reset < storage_setup.sql

echo ""
echo "✅ Database setup completed successfully!"
echo ""
echo "📋 Summary of what was created:"
echo "   ✅ Tables: profiles, applications, educational_background, application_documents"
echo "   ✅ Reference tables: countries, study_programs, admission_intakes"
echo "   ✅ Row Level Security policies"
echo "   ✅ Storage buckets: application-documents, profile-pictures"
echo "   ✅ Functions: generate_application_number"
echo "   ✅ Triggers: auto-generate application numbers, update timestamps"
echo "   ✅ Initial data: 50+ countries, 7 sample study programs, 2 admission intakes"
echo ""
echo "🔗 Database URL: https://jydtzoxaypswsuvsvngc.supabase.co"
echo "🎯 Your international student admissions system is ready!"