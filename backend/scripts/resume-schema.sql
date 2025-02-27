-- Drop existing tables if they exist
DROP TABLE IF EXISTS resume_versions CASCADE;
DROP TABLE IF EXISTS resume_keywords CASCADE;
DROP TABLE IF EXISTS resume_suggestions CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    title VARCHAR(200),
    bio TEXT,
    phone VARCHAR(20),
    location VARCHAR(200),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    skills TEXT[],
    experience_years INTEGER,
    preferred_job_types TEXT[],
    preferred_locations TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    format VARCHAR(4) NOT NULL CHECK (format IN ('PDF', 'DOCX')),
    content TEXT,
    current_customization JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create resume suggestions table
CREATE TABLE IF NOT EXISTS resume_suggestions (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    suggestion TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resume_id, suggestion)
);

-- Create resume keywords table
CREATE TABLE IF NOT EXISTS resume_keywords (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resume_id, keyword)
);

-- Create resume versions table
CREATE TABLE IF NOT EXISTS resume_versions (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    version_name VARCHAR(255) NOT NULL,
    customizations JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_suggestions_resume_id ON resume_suggestions(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_keywords_resume_id ON resume_keywords(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON resume_versions(resume_id);
