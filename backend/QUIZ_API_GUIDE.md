# نظام الاختبارات الجديد - دليل الواجهات البرمجية

## 📱 تدفق الطالب الجديد

### 1️⃣ **الخطوة الأولى: اختيار المجموعة**

#### Endpoint:
```
GET /quiz/groups
```

#### الاستجابة:
```json
{
  "groups": [
    {
      "id": 1,
      "name": "لغات البرمجة",
      "description": "أسئلة عن لغات البرمجة المختلفة",
      "question_count": 45
    },
    {
      "id": 2,
      "name": "الذكاء الاصطناعي",
      "description": "أسئلة متخصصة في الذكاء الاصطناعي",
      "question_count": 30
    },
    {
      "id": 3,
      "name": "ثقافة عامة",
      "description": "أسئلة ثقافية متنوعة",
      "question_count": 60
    }
  ]
}
```

---

### 2️⃣ **الخطوة الثانية: اختيار الفئة (ضمن المجموعة)**

#### Endpoint:
```
GET /quiz/groups/:groupId/categories
```

#### المثال:
```
GET /quiz/groups/1/categories
```

#### الاستجابة:
```json
{
  "categories": [
    {
      "id": 5,
      "name": "JavaScript",
      "question_count": 15
    },
    {
      "id": 6,
      "name": "Python",
      "question_count": 18
    },
    {
      "id": 7,
      "name": "Java",
      "question_count": 12
    }
  ]
}
```

---

### 3️⃣ **الخطوة الثالثة: بدء الاختبار**

#### Endpoint:
```
POST /quiz/start-by-group
```

#### الخيارات:

**أ) اختيار فئة محددة:**
```json
POST /quiz/start-by-group
{
  "username": "أحمد محمود",
  "groupId": 1,
  "categoryId": 5
}
```

**ب) اختيار عشوائي من جميع الفئات (مختلط):**
```json
POST /quiz/start-by-group
{
  "username": "أحمد محمود",
  "groupId": 1
}
```

#### الاستجابة:
```json
{
  "sessionId": 42,
  "questions": [
    {
      "id": 101,
      "title": "ما هو الفرق بين var و let في JavaScript؟",
      "type": "MCQ",
      "categoryId": 5,
      "groupId": 1,
      "answers": [
        {
          "id": 1001,
          "text": "var عام، let محدود بـ block scope"
        },
        {
          "id": 1002,
          "text": "لا يوجد فرق"
        },
        {
          "id": 1003,
          "text": "let أقدم من var"
        }
      ]
    },
    ...
  ]
}
```

---

## 🛠️ عمليات الإدارة (Admin)

### إنشاء مجموعة:
```json
POST /admin/groups
{
  "name": "لغات البرمجة",
  "description": "أسئلة عن لغات البرمجة المختلفة"
}
```

### إنشاء سؤال مع المجموعة والفئة:
```json
POST /admin/questions
{
  "title": "ما هو الفرق بين var و let؟",
  "type": "MCQ",
  "categoryId": 5,      // الفئة: مثل JavaScript
  "groupId": 1,         // المجموعة: مثل لغات البرمجة
  "answers": [
    {
      "text": "var عام، let محدود بـ block scope",
      "isCorrect": true
    },
    {
      "text": "لا يوجد فرق",
      "isCorrect": false
    }
  ]
}
```

### الحصول على أسئلة مجموعة معينة:
```
GET /admin/groups/:groupId/questions
```

---

## 📊 البنية الجديدة

```
جدول groups (المجموعات)
├── id
├── name          (مثل: لغات البرمجة، ذكاء اصطناعي)
├── description
└── created_at

جدول categories (الفئات)  
├── id
└── name          (مثل: JavaScript, Python, Java)

جدول questions
├── id
├── title
├── type          (SCQ, MCQ)
├── category_id   ← ارتباط بالفئة
├── group_id      ← ارتباط بالمجموعة (اختياري)
└── created_at
```

---

## ✅ البيانات في المثال

**المجموعات:**
- `id: 1, name: "لغات البرمجة"`

**الفئات:**
- `id: 5, name: "JavaScript"`
- `id: 6, name: "Python"`
- `id: 7, name: "Java"`

**السؤال:**
```
{
  "id": 101,
  "title": "ما هو الفرق بين var و let؟",
  "type": "MCQ",
  "categoryId": 5,      // ينتمي إلى JavaScript
  "groupId": 1          // ينتمي إلى لغات البرمجة
}
```

---

## 🔄 سيناريوهات الاستخدام

### السيناريو 1️⃣: طالب يريد أسئلة JavaScript فقط
1. `GET /quiz/groups` → اختيار "لغات البرمجة" (id: 1)
2. `GET /quiz/groups/1/categories` → اختيار "JavaScript" (id: 5)
3. `POST /quiz/start-by-group` مع `groupId: 1, categoryId: 5`

### السيناريو 2️⃣: طالب يريد أسئلة عشوائية من كل لغات البرمجة
1. `GET /quiz/groups` → اختيار "لغات البرمجة" (id: 1)
2. `POST /quiz/start-by-group` مع `groupId: 1` (بدون categoryId)
3. سيحصل على أسئلة عشوائية من JavaScript و Python و Java معاً

### السيناريو 3️⃣: طالب يريد ثقافة عامة عشوائية
1. `GET /quiz/groups` → اختيار "ثقافة عامة" (id: 3)
2. `POST /quiz/start-by-group` مع `groupId: 3` (بدون categoryId)
