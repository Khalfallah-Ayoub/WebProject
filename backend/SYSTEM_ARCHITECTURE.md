# 📚 نظام الاختبارات المحدث - التوثيق الشامل

## 🎯 النظام الجديد

تم تقسيم الأسئلة إلى بعدين منفصلين:

### 1️⃣ **الفئات (Categories)**
- موضوع السؤال الأساسي
- أمثلة: JavaScript, Python, Java, الدول, الطعام, العلوم
- **كل سؤال يجب أن ينتمي إلى فئة واحدة فقط**

### 2️⃣ **المجموعات (Groups)**
- تجميع أوسع للأسئلة
- أمثلة: لغات البرمجة، الذكاء الاصطناعي، ثقافة عامة
- **كل سؤال قد ينتمي إلى مجموعة واحدة أو لا ينتمي لأي مجموعة**

---

## 📊 البنية في قاعدة البيانات

```sql
-- جدول الفئات
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- جدول المجموعات
CREATE TABLE groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول الأسئلة (محدّث)
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('SCQ', 'MCQ')),
  category_id INTEGER REFERENCES categories(id),     ← مطلوب
  group_id INTEGER REFERENCES groups(id),             ← اختياري
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 API Endpoints الجديدة

### 📱 للطلاب (Public)

#### 1. الحصول على جميع المجموعات
```
GET /quiz/groups
```

**الاستجابة:**
```json
{
  "groups": [
    {
      "id": 1,
      "name": "لغات البرمجة",
      "description": "...",
      "question_count": 50
    },
    ...
  ]
}
```

---

#### 2. الحصول على فئات مجموعة معينة
```
GET /quiz/groups/:groupId/categories
```

**مثال:**
```
GET /quiz/groups/1/categories
```

**الاستجابة:**
```json
{
  "categories": [
    {"id": 5, "name": "JavaScript", "question_count": 15},
    {"id": 6, "name": "Python", "question_count": 18},
    {"id": 7, "name": "Java", "question_count": 12}
  ]
}
```

---

#### 3. بدء اختبار بمجموعة وفئة محددة
```
POST /quiz/start-by-group
```

**الطلب:**
```json
{
  "username": "اسم الطالب",
  "groupId": 1,
  "categoryId": 5
}
```

**الاستجابة:**
```json
{
  "sessionId": 42,
  "questions": [
    {
      "id": 101,
      "title": "السؤال",
      "type": "MCQ",
      "categoryId": 5,
      "groupId": 1,
      "answers": [...]
    },
    ...
  ]
}
```

---

#### 4. بدء اختبار عشوائي من مجموعة (جميع الفئات)
```
POST /quiz/start-by-group
```

**الطلب (بدون categoryId):**
```json
{
  "username": "اسم الطالب",
  "groupId": 1
}
```

**النتيجة:** أسئلة عشوائية من جميع الفئات في المجموعة

---

### 🛠️ للإدارة (Protected - يتطلب مصادقة)

#### 1. الحصول على جميع المجموعات
```
GET /admin/groups
```

#### 2. الحصول على مجموعة معينة
```
GET /admin/groups/:id
```

#### 3. إنشاء مجموعة جديدة
```
POST /admin/groups
```

**الطلب:**
```json
{
  "name": "لغات البرمجة",
  "description": "وصف مفصل"
}
```

#### 4. تحديث مجموعة
```
PUT /admin/groups/:id
```

#### 5. حذف مجموعة
```
DELETE /admin/groups/:id
```

#### 6. الحصول على أسئلة مجموعة
```
GET /admin/groups/:id/questions
```

---

#### 7. إنشاء سؤال مع المجموعة والفئة
```
POST /admin/questions
```

**الطلب:**
```json
{
  "title": "عنوان السؤال",
  "type": "MCQ",
  "categoryId": 5,      // مطلوب
  "groupId": 1,         // اختياري
  "answers": [
    {"text": "الإجابة 1", "isCorrect": true},
    {"text": "الإجابة 2", "isCorrect": false}
  ]
}
```

#### 8. تحديث سؤال
```
PUT /admin/questions/:id
```

#### 9. حذف سؤال
```
DELETE /admin/questions/:id
```

---

## 🔄 تدفقات الاستخدام

### السيناريو 1: اختيار فئة محددة

1. **الطالب يختار المجموعة:**
   ```
   GET /quiz/groups
   └─ يختار "لغات البرمجة" (id: 1)
   ```

2. **يختار الفئة من المجموعة:**
   ```
   GET /quiz/groups/1/categories
   └─ يختار "JavaScript" (id: 5)
   ```

3. **يبدأ الاختبار من تلك الفئة:**
   ```
   POST /quiz/start-by-group
   {
     "username": "أحمد",
     "groupId": 1,
     "categoryId": 5
   }
   ```

   **النتيجة:** أسئلة JS فقط

---

### السيناريو 2: اختيار عشوائي (مختلط)

1. **الطالب يختار المجموعة:**
   ```
   GET /quiz/groups
   └─ يختار "لغات البرمجة" (id: 1)
   ```

2. **يختار "الأسئلة العشوائية من المجموعة":**
   ```
   POST /quiz/start-by-group
   {
     "username": "محمد",
     "groupId": 1
   }
   ```

   **النتيجة:** أسئلة عشوائية من JavaScript, Python, و Java معاً

---

### السيناريو 3: إدارة البيانات

**الأدمن ينشئ البيانات:**
```
1. POST /admin/groups
   └─ إنشاء "لغات البرمجة"

2. POST /admin/categories
   └─ إنشاء "JavaScript", "Python", "Java"

3. POST /admin/questions (×10 لـ JavaScript)
   ├─ categoryId: 5 (JavaScript)
   ├─ groupId: 1 (لغات البرمجة)
   └─ الإجابات

4. POST /admin/questions (×15 لـ Python)
   ├─ categoryId: 6 (Python)
   ├─ groupId: 1 (لغات البرمجة)
   └─ الإجابات
```

---

## 📋 العلاقات

```
Group "لغات البرمجة" (id: 1)
├── Category "JavaScript" (id: 5)
│   ├── Question 101
│   ├── Question 102
│   └── Question 103
├── Category "Python" (id: 6)
│   ├── Question 104
│   ├── Question 105
│   └── Question 106
└── Category "Java" (id: 7)
    ├── Question 107
    ├── Question 108
    └── Question 109

Group "الذكاء الاصطناعي" (id: 2)
├── Category "Machine Learning"
│   └── Questions...
└── Category "Deep Learning"
    └── Questions...
```

---

## ✅ ملخص الفروقات

| الخاصية | الفئات | المجموعات |
|-------|------|---------|
| الغرض | موضوع/نوع السؤال | تجميع أوسع |
| مثال | JavaScript, Python | لغات البرمجة |
| في السؤال | إلزامي | اختياري |
| السلوك | سؤال واحد = فئة واحدة | سؤال واحد = 0 أو مجموعة واحدة |

---

## 🚀 خطوات التطبيق

### Backend:
- ✅ Migration جديد لجدول groups
- ✅ تحديث schema
- ✅ groupService جديد
- ✅ groupController جديد
- ✅ تحديث questionService و Controller
- ✅ API endpoints جديدة

### Frontend (ما يزال مطلوباً):
- [ ] صفحة اختيار المجموعة
- [ ] صفحة اختيار الفئة من المجموعة
- [ ] خيار "أسئلة عشوائية"
- [ ] واجهة الاختبار

---

## 🔗 الملفات المرتبطة

- `migrations/004_add_groups.sql` - Migration
- `db/schema.js` - البنية الأساسية
- `services/groupService.js` - منطق المجموعات
- `services/quizService.js` - منطق الاختبارات المحدث
- `controllers/admin/groupController.js` - تحكم الإدارة
- `controllers/quiz/sessionController.js` - تحكم الطالب
- `routes/quizRoutes.js` - المسارات
