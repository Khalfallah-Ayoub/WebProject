-- Create exam_sets table for storing different test groups/levels
CREATE TABLE IF NOT EXISTS exam_sets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(category_id, name)
);

-- Create exam_set_questions junction table
CREATE TABLE IF NOT EXISTS exam_set_questions (
  exam_set_id INTEGER NOT NULL REFERENCES exam_sets(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  PRIMARY KEY(exam_set_id, question_id)
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_exam_sets_category_id ON exam_sets(category_id);
CREATE INDEX IF NOT EXISTS idx_exam_set_questions_exam_set_id ON exam_set_questions(exam_set_id);