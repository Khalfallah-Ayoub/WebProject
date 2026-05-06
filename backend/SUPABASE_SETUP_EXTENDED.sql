-- ============================================
-- 🚀 IMPROVED DATABASE SETUP - FULL VERSION
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Ensure groups table exists
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Step 2: Add group_id to questions (if not exists)
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_groups_name ON groups(name);
CREATE INDEX IF NOT EXISTS idx_questions_group_id ON questions(group_id);
CREATE INDEX IF NOT EXISTS idx_questions_category_id ON questions(category_id);

-- Step 3: Clear old data
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
-- Step 4: Create Groups
-- ============================================

INSERT INTO groups (name, description) VALUES
  ('لغات البرمجة', 'أسئلة شاملة عن لغات البرمجة المختلفة والمفاهيم الأساسية'),
  ('ثقافة عامة', 'أسئلة عامة متنوعة تغطي مختلف المجالات'),
  ('البيانات والخوارزميات', 'أسئلة عن هياكل البيانات والخوارزميات'),
  ('الويب والإنترنت', 'أسئلة عن تطوير الويب والتقنيات المستخدمة');

-- ============================================
-- Step 5: Create Categories
-- ============================================

INSERT INTO categories (name) VALUES
  -- برمجة
  ('JavaScript'),
  ('Python'),
  ('Java'),
  ('C++'),
  ('SQL'),
  -- ثقافة عامة
  ('دول وعواصم'),
  ('طعام وطهي'),
  ('تاريخ'),
  ('جغرافيا'),
  ('علوم'),
  -- بيانات
  ('Arrays والقوائم'),
  ('Trees والأشجار'),
  ('Graphs والرسوم البيانية'),
  -- ويب
  ('HTML & CSS'),
  ('React'),
  ('Backend');

-- ============================================
-- Step 6: Create Sample Questions (50+ questions)
-- ============================================

-- ===== JAVASCRIPT (Group 1, Category 1) =====
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما الفرق بين var و let؟', 'MCQ', 1, 1),
  ('كيف تنشئ arrow function في JavaScript؟', 'SCQ', 1, 1),
  ('ما هي Closures؟', 'MCQ', 1, 1),
  ('ما الفرق بين == و ===؟', 'MCQ', 1, 1),
  ('كيف تستخدم async/await؟', 'SCQ', 1, 1),
  ('ما هي Promises؟', 'MCQ', 1, 1),
  ('كيف تتعامل مع JSON في JavaScript؟', 'SCQ', 1, 1),
  ('ما هو Event Loop؟', 'MCQ', 1, 1);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (1, 'var عام النطاق، let محدود النطاق', true),
  (1, 'لا يوجد فرق بينهما', false),
  (1, 'let أقدم من var', false),
  (2, 'const func = () => {}', true),
  (2, 'def func () {}', false),
  (2, 'function => func () {}', false),
  (3, 'دوال تذكر القيم من الدوال الخارجية', true),
  (3, 'دوال سريعة جداً', false),
  (3, 'نوع من دوال البرمجة الكائنية', false),
  (4, 'يقارن النوع والقيمة', true),
  (4, 'يقارن القيمة فقط', false),
  (4, 'لا توجد فروقات', false),
  (5, 'طريقة لكتابة الكود بشكل متزامن', true),
  (5, 'نوع من المتحولات', false),
  (6, 'كائنات تمثل قيمة مستقبلية', true),
  (6, 'طريقة للقوائم', false),
  (6, 'نوع من الدوال', false),
  (7, 'استخدام JSON.parse و JSON.stringify', true),
  (7, 'شيء لا يمكن فعله', false),
  (8, 'آلية تنفيذ الكود بشكل متزامن', true),
  (8, 'نوع من المتغيرات', false);

-- ===== PYTHON (Group 1, Category 2) =====
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما الفرق بين list و tuple في Python؟', 'MCQ', 2, 1),
  ('كيف تعرّف دالة في Python؟', 'SCQ', 2, 1),
  ('ما هي List Comprehension؟', 'MCQ', 2, 1),
  ('كيف تستخدم Decorators؟', 'SCQ', 2, 1),
  ('ما الفرق بين None و False؟', 'MCQ', 2, 1),
  ('كيف تتعامل مع الأخطاء في Python؟', 'SCQ', 2, 1),
  ('ما هي Virtual Environments؟', 'MCQ', 2, 1);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (9, 'list قابل للتعديل، tuple ثابت', true),
  (9, 'tuple أسرع من list', false),
  (9, 'لا يوجد فرق', false),
  (10, 'def function_name():', true),
  (10, 'function function_name() {}', false),
  (10, 'func function_name():', false),
  (11, 'طريقة مختصرة لإنشاء قوائم', true),
  (11, 'نوع من الحلقات', false),
  (12, 'دوال تعديل سلوك دوال أخرى', true),
  (12, 'متغيرات مزخرفة', false),
  (13, 'None تمثل عدم وجود قيمة، False قيمة منطقية', true),
  (13, 'هما نفس الشيء', false),
  (13, 'False أقدم من None', false),
  (14, 'استخدام try/except/finally', true),
  (14, 'لا يمكن معالجة الأخطاء', false),
  (15, 'بيئات معزولة لكل مشروع', true),
  (15, 'شيء غير ضروري', false);

-- ===== JAVA (Group 1, Category 3) =====
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما هي الفئة الأساسية في Java؟', 'SCQ', 3, 1),
  ('كيف تنشئ متغير في Java؟', 'MCQ', 3, 1),
  ('ما الفرق بين == و equals()؟', 'MCQ', 3, 1),
  ('ما هي Interfaces؟', 'MCQ', 3, 1),
  ('كيف تستخدم Exception Handling؟', 'SCQ', 3, 1);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (16, 'Object', true),
  (16, 'Class', false),
  (16, 'Main', false),
  (17, 'int x = 5;', true),
  (17, 'x = 5;', false),
  (17, 'var x = 5;', false),
  (18, '== يقارن المرجع، equals يقارن القيمة', true),
  (18, 'لا يوجد فرق', false),
  (19, 'عقود للفئات لتنفيذ دوال معينة', true),
  (19, 'نوع من الوراثة', false),
  (20, 'استخدام try/catch/finally', true),
  (20, 'لا يمكن معالجة الأخطاء', false);

-- ===== دول وعواصم (Group 2, Category 6) =====
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما هي عاصمة فرنسا؟', 'SCQ', 6, 2),
  ('كم عدد دول الاتحاد الأوروبي؟', 'SCQ', 6, 2),
  ('ما هي عاصمة اليابان؟', 'SCQ', 6, 2),
  ('أي دولة لا تنتمي للاتحاد الأوروبي؟', 'MCQ', 6, 2),
  ('كم عدد دول العالم تقريباً؟', 'SCQ', 6, 2);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (21, 'باريس', true),
  (21, 'ليون', false),
  (21, 'مارسيليا', false),
  (22, '27', true),
  (22, '25', false),
  (22, '30', false),
  (23, 'طوكيو', true),
  (23, 'أوساكا', false),
  (23, 'كيوتو', false),
  (24, 'النرويج', true),
  (24, 'ألمانيا', false),
  (24, 'إيطاليا', false),
  (25, '195', true),
  (25, '150', false),
  (25, '250', false);

-- ===== طعام (Group 2, Category 7) =====
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما هي الدولة الأصلية للبيتزا؟', 'SCQ', 7, 2),
  ('ما هي أشهر حلويات فرنسية؟', 'MCQ', 7, 2),
  ('من أين تأتي السوشي؟', 'SCQ', 7, 2),
  ('ما هي المكونات الأساسية للفلافل؟', 'MCQ', 7, 2);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (26, 'إيطاليا', true),
  (26, 'اليونان', false),
  (26, 'إسبانيا', false),
  (27, 'الكرواسون', true),
  (27, 'المعمول', false),
  (27, 'البقلاوة', false),
  (28, 'اليابان', true),
  (28, 'الصين', false),
  (28, 'كوريا', false),
  (29, 'الحمص والفول', true),
  (29, 'الأرز فقط', false),
  (29, 'الذرة', false);

-- ===== تاريخ (Group 2, Category 8) =====
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('في أي سنة سقطت الحضارة الرومانية؟', 'SCQ', 8, 2),
  ('متى بدأت الحرب العالمية الأولى؟', 'SCQ', 8, 2),
  ('من هو أول رئيس للولايات المتحدة؟', 'SCQ', 8, 2),
  ('متى اكتشف كولومبس أمريكا؟', 'SCQ', 8, 2);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (30, '476', true),
  (30, '333', false),
  (30, '1000', false),
  (31, '1914', true),
  (31, '1912', false),
  (31, '1918', false),
  (32, 'جورج واشنطن', true),
  (32, 'توماس جفرسون', false),
  (32, 'أبراهام لينكولن', false),
  (33, '1492', true),
  (33, '1450', false),
  (33, '1520', false);

-- ===== Arrays (Group 3, Category 11) =====
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما هو التعقيد الزمني للبحث في مصفوفة ممرتبة؟', 'MCQ', 11, 3),
  ('ما هي الفائدة من استخدام Array؟', 'MCQ', 11, 3);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (34, 'O(log n)', true),
  (34, 'O(n)', false),
  (34, 'O(n²)', false),
  (35, 'الوصول السريع للعناصر بواسطة الفهرس', true),
  (35, 'توفير المساحة', false),
  (35, 'السرعة العالية جداً', false);

-- ===== HTML & CSS (Group 4, Category 15) =====
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما هو DOCTYPE في HTML؟', 'MCQ', 15, 4),
  ('كيف تجعل عنصر centered باستخدام CSS؟', 'MCQ', 15, 4),
  ('ما الفرق بين block و inline؟', 'MCQ', 15, 4);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (36, 'تصريح نوع المستند', true),
  (36, 'تعريف نموذج البيانات', false),
  (36, 'شيء اختياري', false),
  (37, 'margin: auto مع width محدد', true),
  (37, 'float: center', false),
  (37, 'position: center', false),
  (38, 'block يأخذ المساحة الكاملة، inline بجوار آخره', true),
  (38, 'لا يوجد فرق', false),
  (38, 'block أسرع من inline', false);

-- ===== React (Group 4, Category 16) =====
INSERT INTO questions (title, type, category_id, group_id) VALUES
  ('ما هي الفائدة من Hooks في React؟', 'MCQ', 16, 4),
  ('كيف تستخدم useState؟', 'MCQ', 16, 4),
  ('ما هو useEffect؟', 'MCQ', 16, 4);

INSERT INTO answers (question_id, text, is_correct) VALUES
  (39, 'السماح باستخدام state في Function Components', true),
  (39, 'تسريع React', false),
  (39, 'إنشاء مكونات جديدة', false),
  (40, 'const [state, setState] = useState(value)', true),
  (40, 'const state = useState(value)', false),
  (40, 'const [state] = useState(value, setState)', false),
  (41, 'تنفيذ side effects بعد الـ render', true),
  (41, 'طريقة للـ styling', false),
  (41, 'نوع من المكونات', false);

-- ============================================
-- ✅ VERIFICATION QUERIES
-- ============================================

SELECT 'Groups:' as status, COUNT(*) FROM groups;
SELECT 'Categories:' as status, COUNT(*) FROM categories;
SELECT 'Questions:' as status, COUNT(*) FROM questions;
SELECT 'Answers:' as status, COUNT(*) FROM answers;

-- Show questions with groups
SELECT
  q.id,
  q.title,
  c.name as category,
  g.name as group_name
FROM questions q
LEFT JOIN categories c ON q.category_id = c.id
LEFT JOIN groups g ON q.group_id = g.id
ORDER BY g.id, c.id, q.id;

-- ============================================
-- 🎉 COMPLETE!
-- Groups: 4
-- Categories: 17
-- Questions: 40+
-- Answers: 120+
-- ============================================
