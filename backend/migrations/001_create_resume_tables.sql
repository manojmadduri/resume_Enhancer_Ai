-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
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
CREATE TABLE IF NOT EXISTS resume_suggestions (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    section VARCHAR(255) NOT NULL,
    suggestion TEXT NOT NULL,
    implemented BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create resume keywords table
CREATE TABLE IF NOT EXISTS resume_keywords (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resume_suggestions_resume_id ON resume_suggestions(resume_id);
CREATE INDEX idx_resume_keywords_resume_id ON resume_keywords(resume_id);
CREATE INDEX idx_resume_versions_resume_id ON resume_versions(resume_id);
