-- Add content column to resumes table
ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS match_score DECIMAL(5,2);

-- Create table for resume keywords
CREATE TABLE IF NOT EXISTS resume_keywords (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    keyword VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resume_id, keyword)
);

-- Create table for resume suggestions
CREATE TABLE IF NOT EXISTS resume_suggestions (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER REFERENCES resumes(id) ON DELETE CASCADE,
    section VARCHAR(50) NOT NULL,
    suggestion TEXT NOT NULL,
    implemented BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_resume_keywords_resume_id ON resume_keywords(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_suggestions_resume_id ON resume_suggestions(resume_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_resumes_updated_at
    BEFORE UPDATE ON resumes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
