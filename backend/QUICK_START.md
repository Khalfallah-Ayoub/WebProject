# 🚀 البدء السريع - نظام الاختبارات الجديد

## ✅ المتطلبات

- Node.js
- PostgreSQL
- npm أو yarn

---

## 📦 التثبيت

```bash
cd backend
npm install
```

---

## 🔧 التهيئة

### 1. إعداد قاعدة البيانات

```bash
# تشغيل seed اختياري
npm run seed
```

### 2. بدء الخادم

```bash
npm start
```

الخادم سيعمل على `http://localhost:3000`

---

## 🧪 الاختبار السريع

### 1. التحقق من الخادم

```bash
curl http://localhost:3000/health
```

**الاستجابة:**
```json
{
  "status": "✅ OK",
  "database": "✅ Connected",
  "timestamp": "..."
}
```

---

### 2. الحصول على المجموعات

```bash
curl http://localhost:3000/quiz/groups
```

---

### 3. الحصول على الفئات في مجموعة

```bash
# افترض Group ID = 1
curl http://localhost:3000/quiz/groups/1/categories
```

---

### 4. بدء اختبار

**اختبار بفئة محددة:**
```bash
curl -X POST http://localhost:3000/quiz/start-by-group \
  -H "Content-Type: application/json" \
  -d '{
    "username": "أحمد",
    "groupId": 1,
    "categoryId": 5
  }'
```

**اختبار عشوائي (مختلط):**
```bash
curl -X POST http://localhost:3000/quiz/start-by-group \
  -H "Content-Type: application/json" \
  -d '{
    "username": "محمد",
    "groupId": 1
  }'
```

---

## 👨‍💼 إدارة البيانات (Admin)

### تسجيل الدخول

```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password"
  }'
```

**الاستجابة:**
```json
{
  "token": "your_jwt_token"
}
```

---

### إنشاء مجموعة جديدة

```bash
curl -X POST http://localhost:3000/admin/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "لغات البرمجة",
    "description": "أسئلة عن لغات البرمجة"
  }'
```

---

### إنشاء فئة جديدة

```bash
curl -X POST http://localhost:3000/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "JavaScript"
  }'
```

---

### إنشاء سؤال

```bash
curl -X POST http://localhost:3000/admin/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "ما هو الفرق بين var و let؟",
    "type": "MCQ",
    "categoryId": 5,
    "groupId": 1,
    "answers": [
      {"text": "var عام، let محدود", "isCorrect": true},
      {"text": "لا يوجد فرق", "isCorrect": false}
    ]
  }'
```

---

## 📁 بنية المشروع

```
backend/
├── config/                    # إعدادات قاعدة البيانات
├── controllers/
│   ├── admin/                # تحكم الإدارة
│   │   ├── questionController.js
│   │   ├── categoryController.js
│   │   ├── groupController.js  ← جديد
│   │   └── ...
│   └── quiz/                 # تحكم الطالب
│       └── sessionController.js
├── services/
│   ├── questionService.js     # محدّث
│   ├── groupService.js        ← جديد
│   ├── quizService.js         # محدّث
│   └── ...
├── routes/
│   ├── adminRoutes.js         # محدّث
│   └── quizRoutes.js          # محدّث
├── migrations/
│   └── 004_add_groups.sql     ← جديد
├── db/
│   └── schema.js              # محدّث
├── QUIZ_API_GUIDE.md          ← جديد
├── SYSTEM_ARCHITECTURE.md     ← جديد
└── test-quiz-flow.sh          ← جديد
```

---

## 🐛 استكشاف الأخطاء

### خطأ: Group not found

**السبب:** معرف المجموعة غير صحيح أو المجموعة لم تُنشأ بعد

**الحل:**
```bash
# تحقق من المجموعات الموجودة
curl http://localhost:3000/quiz/groups
```

---

### خطأ: No questions available

**السبب:** المجموعة أو الفئة لا تحتوي على أسئلة

**الحل:** أنشئ أسئلة جديدة عبر الإدارة

---

### خطأ: Database error

**السبب:** Migration لم يُطبق بعد

**الحل:** تأكد من تشغيل:
```bash
npm run migrate
```

---

## 📚 الملاحظات المهمة

1. **كل سؤال يجب أن ينتمي إلى فئة** (categoryId إلزامي)
2. **السؤال قد ينتمي إلى مجموعة اختياري** (groupId اختياري)
3. **الأسئلة بدون مجموعة** يمكن أن تُستخدم فقط عند طلب جميع الأسئلة
4. **الاختبار العشوائي** يختار أسئلة من جميع الفئات في المجموعة

---

## 🔗 المزيد من المعلومات

- تفاصيل API كاملة: `QUIZ_API_GUIDE.md`
- بنية النظام: `SYSTEM_ARCHITECTURE.md`
- اختبار سريع: `test-quiz-flow.sh`

---

## 💡 أمثلة تطبيقية

### مثال 1: مدرسة تريد نظام اختبارات الثقافة العامة

```
1. إنشاء مجموعة: "ثقافة عامة"
2. إنشاء فئات: "الدول", "الطعام", "التاريخ"
3. إضافة أسئلة:
   - Q1: "كم عدد دول العالم؟" → categoryId: دول, groupId: ثقافة عامة
   - Q2: "ما العاصمة الفرنسية؟" → categoryId: دول, groupId: ثقافة عامة
   - Q3: "ما هي أشهر أطباق إيطاليا؟" → categoryId: طعام, groupId: ثقافة عامة
4. الطالب يختار "ثقافة عامة" ثم يختار "دول" فقط
```

### مثال 2: معهد يريد اختبارات لغات برمجة

```
1. إنشاء مجموعة: "لغات البرمجة"
2. إنشاء فئات: "JavaScript", "Python", "Java"
3. إضافة أسئلة متعددة لكل فئة
4. الطالب يختار:
   - يختار "JavaScript" مباشرة → أسئلة JS فقط
   - أو يختار "عشوائي" → أسئلة من JS, Python, Java
```

---

## ✨ الميزات الجديدة

- ✅ نظام فئات ومجموعات منفصل
- ✅ اختبارات مخصصة بفئة محددة
- ✅ اختبارات عشوائية من مجموعة
- ✅ واجهة Admin سهلة
- ✅ API واضحة وموثقة
