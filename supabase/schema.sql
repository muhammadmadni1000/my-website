-- ==============================================================================
-- StudentHub - Database Setup & RLS / Permission Fix for Supabase
-- ==============================================================================
-- Run this entire script in your Supabase SQL Editor:
-- (Supabase Dashboard -> SQL Editor -> New query -> Paste & Run)
--
-- This script fixes:
-- 1. PostgreSQL table permission denied (error 42501) by granting table privileges to anon/authenticated
-- 2. Ensures the 9 required fields exist (including photo column)
-- 3. Enables Row Level Security (RLS) with full permissive read, insert, update, and delete policies
-- ==============================================================================

-- 1. Create table if not already created
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo TEXT,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Ensure photo column exists if the table was created previously
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS photo TEXT;

-- 3. Convert semester column to VARCHAR if it was previously created as INTEGER
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'students' AND column_name = 'semester' AND data_type = 'integer'
    ) THEN
        ALTER TABLE public.students ALTER COLUMN semester TYPE VARCHAR(50) USING 'Semester ' || semester::text;
    END IF;
END $$;

-- 4. Update status check constraint to support 'Active', 'Inactive', 'Suspended'
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_status_check;
ALTER TABLE public.students ADD CONSTRAINT students_status_check CHECK (status IN ('Active', 'Inactive', 'Suspended'));

-- 5. CRITICAL FIX: Grant table privileges to anon and authenticated roles
-- (Fixes: "permission denied for table students (code 42501)")
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.students TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 7. Create Permissive Policies for Anon & Authenticated roles (full CRUD)
DROP POLICY IF EXISTS "Allow public read access" ON public.students;
DROP POLICY IF EXISTS "Allow public insert access" ON public.students;
DROP POLICY IF EXISTS "Allow public update access" ON public.students;
DROP POLICY IF EXISTS "Allow public delete access" ON public.students;

CREATE POLICY "Allow public read access"
    ON public.students FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert access"
    ON public.students FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update access"
    ON public.students FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete access"
    ON public.students FOR DELETE
    TO anon, authenticated
    USING (true);

-- 8. Seed Starter Data (only inserts if table is empty)
INSERT INTO public.students (
    photo, student_id, full_name, email, phone, department, semester, gender, status
)
SELECT 
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'STU-2026-001',
    'Alex Rivera',
    'alex.rivera@studenthub.edu',
    '+1 (555) 234-5678',
    'Computer Science',
    'Semester 7',
    'Female',
    'Active'
WHERE NOT EXISTS (SELECT 1 FROM public.students WHERE student_id = 'STU-2026-001');

INSERT INTO public.students (
    photo, student_id, full_name, email, phone, department, semester, gender, status
)
SELECT 
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'STU-2026-002',
    'Liam Chen',
    'liam.chen@studenthub.edu',
    '+1 (555) 876-5432',
    'Mechanical Engineering',
    'Semester 5',
    'Male',
    'Active'
WHERE NOT EXISTS (SELECT 1 FROM public.students WHERE student_id = 'STU-2026-002');

INSERT INTO public.students (
    photo, student_id, full_name, email, phone, department, semester, gender, status
)
SELECT 
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    'STU-2026-003',
    'Emma Watson',
    'emma.watson@studenthub.edu',
    '+1 (555) 345-6789',
    'Business Administration',
    'Semester 8',
    'Female',
    'Active'
WHERE NOT EXISTS (SELECT 1 FROM public.students WHERE student_id = 'STU-2026-003');

INSERT INTO public.students (
    photo, student_id, full_name, email, phone, department, semester, gender, status
)
SELECT 
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    'STU-2026-004',
    'Marcus Johnson',
    'marcus.j@studenthub.edu',
    '+1 (555) 456-7890',
    'Data Science',
    'Semester 3',
    'Male',
    'Active'
WHERE NOT EXISTS (SELECT 1 FROM public.students WHERE student_id = 'STU-2026-004');
