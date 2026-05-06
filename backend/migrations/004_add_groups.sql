-- Add groups table for question collections
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add group_id column to questions table
ALTER TABLE questions
ADD COLUMN group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_questions_group_id ON questions(group_id);
