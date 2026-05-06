-- ============================================
-- 🚀 COMPLETE DATABASE SETUP FOR SUPABASE
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Create Groups Table
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_groups_name ON groups(name);

-- Step 2: Add group_id to questions table (if not exists)
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL;

-- Create index on group_id
CREATE INDEX IF NOT EXISTS idx_questions_group_id ON questions(group_id);

-- Step 3: Clear old data (CAUTION: This deletes everything!)
DELETE FROM answers;
DELETE FROM quiz_sessions;
DELETE FROM questions;
DELETE FROM categories;
DELETE FROM groups;

-- Reset sequences
ALTER SEQUENCE groups_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE questions_id_seq RESTART WITH 1;

-- ============================================
-- Step 4: Create Sample Groups
-- ============================================

INSERT INTO groups (name, description) VALUES
  ('لغات البرمجة', 'أسئلة عن لغات البرمجة المختلفة'),
  ('ثقافة عامة', 'أسئلة عامة متنوعة');

-- ============================================
-- Step 5: Create Sample Categories
-- ============================================

INSERT INTO categories (name) VALUES
  ('JavaScript'),    -- ID: 1
  ('Python'),        -- ID: 2
  ('Java'),          -- ID: 3
  ('دول'),          -- ID: 4
  ('طعام'),         -- ID: 5
  ('تاريخ');         -- ID: 6

-- ============================================
-- Step 6: Create Sample Questions & Answers
-- ============================================

-- JavaScript Questions (Group 1)
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما الفرق بين var و let؟', 'MCQ', 1, 1),
  ('كيف تنشئ arrow function في JavaScript؟', 'SCQ', 1, 1);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (1, 'var عام، let محدود النطاق', true),
  (1, 'لا يوجد فرق', false),
  (1, 'let أقدم من var', false),
  (2, 'const func = () => {}', true),
  (2, 'def func () {}', false),
  (2, 'function => func () {}', false);

-- Python Questions (Group 1)
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما هو الفرق بين list و tuple في Python؟', 'MCQ', 2, 1),
  ('كيف تعرّف دالة في Python؟', 'SCQ', 2, 1);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (3, 'list قابل للتعديل، tuple ثابت', true),
  (3, 'tuple أسرع من list', false),
  (3, 'لا يوجد فرق', false),
  (4, 'def function_name():', true),
  (4, 'function function_name() {}', false),
  (4, 'func function_name():', false);

-- Java Questions (Group 1)
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما هي الفئة الأساسية في Java؟', 'SCQ', 3, 1),
  ('كيف تنشئ متغير في Java؟', 'MCQ', 3, 1);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (5, 'Object', true),
  (5, 'Class', false),
  (5, 'Main', false),
  (6, 'int x = 5;', true),
  (6, 'x = 5;', false),
  (6, 'var x = 5;', false);

-- Countries Questions (Group 2)
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما هي عاصمة فرنسا؟', 'SCQ', 4, 2),
  ('كم عدد دول الاتحاد الأوروبي؟', 'SCQ', 4, 2);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (7, 'باريس', true),
  (7, 'ليون', false),
  (7, 'مارسيليا', false),
  (8, '27', true),
  (8, '25', false),
  (8, '30', false);

-- Food Questions (Group 2)
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما هي الدولة الأصلية للبيتزا؟', 'SCQ', 5, 2),
  ('ما هي أشهر حلويات فرنسية؟', 'MCQ', 5, 2);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (9, 'إيطاليا', true),
  (9, 'اليونان', false),
  (9, 'إسبانيا', false),
  (10, 'الكرواسون', true),
  (10, 'المعمول', false),
  (10, 'البقلاوة', false);

-- History Questions (Group 2)
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('في أي سنة سقطت الحضارة الرومانية؟', 'SCQ', 6, 2),
  ('متى بدأت الحرب العالمية الأولى؟', 'SCQ', 6, 2);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (11, 'سنة 476', true),
  (11, 'سنة 333', false),
  (11, 'سنة 1000', false),
  (12, 'سنة 1914', true),
  (12, 'سنة 1912', false),
  (12, 'سنة 1918', false);

-- ============================================
-- ✅ VERIFICATION
-- ============================================

-- Check Groups
SELECT 'Groups Created:' as status, COUNT(*) as count FROM groups;

-- Check Categories
SELECT 'Categories Created:' as status, COUNT(*) as count FROM categories;

-- Check Questions
SELECT 'Questions Created:' as status, COUNT(*) as count FROM questions;

-- Check Answers
SELECT 'Answers Created:' as status, COUNT(*) as count FROM answers;

-- Show Questions with Group Info
SELECT
  q.id,
  q.title,
  c.name as category,
  g.name as group_name,
  (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id) as answer_count
FROM questions q
LEFT JOIN categories c ON q.category_id = c.id
LEFT JOIN groups g ON q.group_id = g.id
ORDER BY q.id;

-- ============================================
-- 🎉 DONE!
-- ============================================
-- 2 Groups created
-- 6 Categories created
-- 12 Questions created with answers
-- All linked properly
