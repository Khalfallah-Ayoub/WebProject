# 📖 Supabase Setup - Step by Step

## 🎯 Goal
Setup database to have Groups + Categories + Questions with proper relationships

## ✅ What You Need
- Supabase project URL
- Access to SQL Editor
- The SQL script: `backend/SUPABASE_SETUP.sql`

---

## 📋 Steps

### Step 1: Login to Supabase
1. Open: https://app.supabase.com
2. Login with your account
3. Select your project

### Step 2: Open SQL Editor
1. Click **SQL Editor** in left menu
2. Click **New Query** button
3. Empty SQL editor opens

### Step 3: Copy the Script
1. Open file: `backend/SUPABASE_SETUP.sql`
2. Copy ALL content (Ctrl+A, Ctrl+C)
3. Paste into Supabase editor (Ctrl+V)

### Step 4: Run the Script
1. Click **Run** button (or Ctrl+Enter)
2. Wait for execution...
3. See results at bottom

**Expected Output:**

```
Groups Created: 2
Categories Created: 6
Questions Created: 12
Answers Created: 36
```

✅ **If you see this, everything worked!**

### Step 5: Verify in Table Editor
1. Click **Table Editor** in left menu
2. Check these tables:

#### groups table
- Click "groups"
- Should show 2 rows:
  - لغات البرمجة
  - ثقافة عامة

#### categories table
- Click "categories"
- Should show 6 rows:
  - JavaScript
  - Python
  - Java
  - دول
  - طعام
  - تاريخ

#### questions table
- Click "questions"
- Should show 12 rows
- Check that **group_id** column exists and has values

#### answers table
- Click "answers"
- Should show 36 rows
- Each question has 2-3 answers

### Step 6: Check Relationships
1. Click on one question row
2. Verify it shows:
   - category_id (1-6)
   - group_id (1-2)
3. Group and category should link properly

---

## 🎯 Final Check

Run this verification query in SQL Editor:

```sql
SELECT
  q.id,
  q.title,
  c.name as category,
  g.name as group_name
FROM questions q
LEFT JOIN categories c ON q.category_id = c.id
LEFT JOIN groups g ON q.group_id = g.id
ORDER BY q.id;
```

**Expected:** 12 rows showing:
```
1  | ما الفرق بين var و let؟ | JavaScript | لغات البرمجة
2  | كيف تنشئ arrow function... | JavaScript | لغات البرمجة
3  | ما هو الفرق بين list... | Python | لغات البرمجة
... (12 total)
```

---

## ✨ What's Created

### 2 Groups
```
1. لغات البرمجة (Programming Languages)
   - JavaScript (2 questions)
   - Python (2 questions)
   - Java (2 questions)

2. ثقافة عامة (General Culture)
   - دول (Countries) (2 questions)
   - طعام (Food) (2 questions)
   - تاريخ (History) (2 questions)
```

### 12 Sample Questions
All with answers, properly linked to groups/categories

---

## 🔧 If Something Goes Wrong

### "Error: relation 'groups' already exists"
- It's OK! The script checks IF NOT EXISTS
- Just continue with other parts
- Or delete that section and run rest

### "Error: table 'questions' doesn't have column 'group_id'"
- The column should be added automatically
- If not, run this separately:
```sql
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS group_id INTEGER REFERENCES groups(id) ON DELETE SET NULL;
```

### "No output after running"
- Scroll down to see results
- Check if there are errors shown
- Try running verification query

### "Can't see the new columns"
- Refresh Table Editor (F5)
- Click away then back on table name
- Data might be loading

---

## 🎉 Once Complete

1. Close Supabase
2. Go to your app at: webproject-x7ch.onrender.com
3. Refresh page
4. Student should see 2 groups ✅
5. All features should work!

---

## 📱 Testing Flow

```
Frontend → API Request → Backend → Supabase DB
                                      ↓
                              (groups/categories/questions)
                                      ↓
                                  Returns JSON
                                      ↓
                              Frontend displays
```

If any step fails:
- Check Supabase has data
- Check Backend deployed
- Check Frontend updated
- Clear browser cache

---

**That's it! Run the SQL and the system will work!** 🚀
