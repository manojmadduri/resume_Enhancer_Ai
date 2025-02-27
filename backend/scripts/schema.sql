-- Drop existing tables if they exist
DROP TABLE IF EXISTS resume_versions CASCADE;
DROP TABLE IF EXISTS resume_keywords CASCADE;
DROP TABLE IF EXISTS resume_suggestions CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    auth_provider VARCHAR(50) DEFAULT 'email',
    firebase_uid VARCHAR(128) UNIQUE,
    is_email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create resumes table
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    original_file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    format VARCHAR(4) NOT NULL CHECK (format IN ('PDF', 'DOCX')),
    current_customization JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create resume suggestions table
CREATE TABLE resume_suggestions (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    section VARCHAR(255) NOT NULL,
    suggestion TEXT NOT NULL,
    implemented BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create resume keywords table
CREATE TABLE resume_keywords (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create resume versions table
CREATE TABLE resume_versions (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    version_name VARCHAR(255) NOT NULL,
    customizations JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resume_suggestions_resume_id ON resume_suggestions(resume_id);
CREATE INDEX idx_resume_keywords_resume_id ON resume_keywords(resume_id);
CREATE INDEX idx_resume_versions_resume_id ON resume_versions(resume_id);
