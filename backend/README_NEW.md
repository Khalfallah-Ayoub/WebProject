# 🎓 نظام الاختبارات المحسّن - Enhanced Quiz System

**تم تطوير نظام اختبارات محسّن مع فصل الفئات عن المجموعات**

---

## 📊 ما الجديد؟

### المشكلة القديمة:
- الأسئلة كانت مرتبطة بفئة واحدة فقط
- لا يوجد تجميع أعم للأسئلة

### الحل الجديد:
- **فئات (Categories)**: موضوع السؤال (JavaScript, Python, الدول, الطعام)
- **مجموعات (Groups)**: تجميع أعم (لغات البرمجة، ثقافة عامة، الذكاء الاصطناعي)
- **اختبارات مرنة**: فئة محددة أو عشوائية من مجموعة

---

## 🎯 التدفق من منظور الطالب

```
1. يدخل الطالب
   ↓
2. يختار مجموعة:
   • لغات البرمجة
   • الذكاء الاصطناعي
   • ثقافة عامة
   ↓
3. يختار فئة من المجموعة:
   • JavaScript / Python / Java (من لغات البرمجة)
   • أو "عشوائي" (أسئلة من جميع الفئات)
   ↓
4. يبدأ الاختبار
```

---

## 📁 الملفات المضافة/المعدلة

### ✨ ملفات جديدة:

| الملف | الوصف |
|------|--------|
| `migrations/004_add_groups.sql` | جدول groups والتعديلات على questions |
| `services/groupService.js` | منطق إدارة المجموعات |
| `controllers/admin/groupController.js` | تحكم المجموعات للإدارة |
| `test-quiz-flow.sh` | script اختبار شامل |
| `QUIZ_API_GUIDE.md` | دليل الـ APIs |
| `SYSTEM_ARCHITECTURE.md` | بنية النظام الكاملة |
| `QUICK_START.md` | خطوات البدء السريع |
| `CHANGES_SUMMARY.md` | ملخص کامل للتعديلات |
| `POSTMAN_COLLECTION.json` | مجموعة Postman |

### 🔄 ملفات معدّلة:

| الملف | التعديل |
|------|---------|
| `db/schema.js` | إضافة جدول `groups` و `group_id` للـ questions |
| `services/quizService.js` | APIs جديدة للطلاب |
| `services/questionService.js` | دعم `group_id` في الأسئلة |
| `controllers/admin/questionController.js` | التعامل مع `group_id` |
| `controllers/quiz/sessionController.js` | APIs الطلاب الجديدة |
| `routes/adminRoutes.js` | مسارات جديدة للمجموعات |
| `routes/quizRoutes.js` | مسارات جديدة للطلاب |

---

## 🔌 API Endpoints

### 👥 للطلاب (Public)

```bash
GET  /quiz/groups                          # جلب المجموعات
GET  /quiz/groups/:groupId/categories      # جلب الفئات في مجموعة
POST /quiz/start-by-group                  # بدء الاختبار
```

### ⚙️ للإدارة (Protected)

```bash
GET    /admin/groups                       # جلب المجموعات
GET    /admin/groups/:id                   # جلب مجموعة معينة
POST   /admin/groups                       # إنشاء مجموعة
PUT    /admin/groups/:id                   # تحديث مجموعة
DELETE /admin/groups/:id                   # حذف مجموعة
GET    /admin/groups/:id/questions         # أسئلة المجموعة
```

---

## 📝 أمثلة الاستخدام

### الطالب - اختيار فئة محددة:
```bash
curl -X POST http://localhost:3000/quiz/start-by-group \
  -H "Content-Type: application/json" \
  -d '{
    "username": "أحمد",
    "groupId": 1,
    "categoryId": 5
  }'
```

### الطالب - اختيار عشوائي/مختلط:
```bash
curl -X POST http://localhost:3000/quiz/start-by-group \
  -H "Content-Type: application/json" \
  -d '{
    "username": "محمد",
    "groupId": 1
  }'
```

### الإدارة - إنشاء سؤال:
```bash
curl -X POST http://localhost:3000/admin/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "ما الفرق بين var و let؟",
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

## 🗄️ بنية قاعدة البيانات

```sql
groups (جديد)
├── id SERIAL PRIMARY KEY
├── name VARCHAR(100) UNIQUE
├── description TEXT
└── created_at TIMESTAMP

categories (دون تغيير)
├── id SERIAL PRIMARY KEY
└── name TEXT UNIQUE

questions (محدّث)
├── id SERIAL PRIMARY KEY
├── title TEXT
├── type TEXT (SCQ, MCQ)
├── category_id INTEGER → categories (إلزامي)
├── group_id INTEGER → groups (اختياري) ← جديد
└── created_at TIMESTAMP

answers (دون تغيير)
├── id SERIAL PRIMARY KEY
├── question_id INTEGER → questions
├── text TEXT
└── is_correct BOOLEAN
```

---

## 🚀 البدء السريع

### 1. تشغيل الخادم:
```bash
cd backend
npm install
npm start
```

### 2. اختبار الـ API:
```bash
# الحصول على المجموعات
curl http://localhost:3000/quiz/groups

# الحصول على الفئات
curl http://localhost:3000/quiz/groups/1/categories

# بدء الاختبار
curl -X POST http://localhost:3000/quiz/start-by-group \
  -H "Content-Type: application/json" \
  -d '{"username":"أحمد","groupId":1}'
```

### 3. استخدام Postman:
- افتح Postman
- استورد `POSTMAN_COLLECTION.json`
- عدّل `base_url` و `admin_token` في Variables

---

## 📚 التوثيق الكاملة

| الملف | الموضوع |
|------|---------|
| `QUIZ_API_GUIDE.md` | شرح تفصيلي للـ APIs |
| `SYSTEM_ARCHITECTURE.md` | فهم بنية النظام |
| `QUICK_START.md` | خطوات البدء |
| `CHANGES_SUMMARY.md` | ملخص كل التعديلات |
| `README.md` (هذا الملف) | نظرة عامة |

---

## ✅ الميزات

- ✅ فصل الفئات عن المجموعات
- ✅ اختبارات مخصصة بفئة محددة
- ✅ اختبارات عشوائية من مجموعة
- ✅ API واضحة وموثقة
- ✅ التوافقية مع النظام القديم
- ✅ أداء محسّن مع indexes

---

## 🧪 الاختبار

```bash
# تشغيل script الاختبار الشامل
bash backend/test-quiz-flow.sh
```

---

## 📋 الخطوات التالية (Frontend)

- [ ] واجهة اختيار المجموعة
- [ ] واجهة اختيار الفئة
- [ ] خيار "عشوائي/مختلط"
- [ ] واجهة الاختبار المحدثة
- [ ] صفحة النتائج

---

## 🎓 مثال عملي

### السيناريو: طالب يريد أسئلة JavaScript من "لغات البرمجة"

**1. الأدمن ينشئ البيانات:**
```javascript
// 1. إنشاء مجموعة
POST /admin/groups
{ "name": "لغات البرمجة" }
// Response: { id: 1 }

// 2. إنشاء فئة
POST /admin/categories
{ "name": "JavaScript" }
// Response: { id: 5 }

// 3. إضافة أسئلة
POST /admin/questions
{
  "title": "ما الفرق بين var و let؟",
  "categoryId": 5,  // JavaScript
  "groupId": 1,     // لغات البرمجة
  "answers": [...]
}
```

**2. الطالب يبدأ الاختبار:**
```javascript
// 1. جلب المجموعات
GET /quiz/groups
// يرى "لغات البرمجة"

// 2. جلب الفئات
GET /quiz/groups/1/categories
// يرى "JavaScript", "Python", "Java"

// 3. اختيار JavaScript وبدء الاختبار
POST /quiz/start-by-group
{
  "username": "أحمد",
  "groupId": 1,
  "categoryId": 5
}
// النتيجة: أسئلة JavaScript فقط من مجموعة لغات البرمجة
```

---

## 💡 نصائح مهمة

1. **الفئات إلزامية** - كل سؤال يجب أن ينتمي لفئة واحدة
2. **المجموعات اختيارية** - السؤال قد لا ينتمي لأي مجموعة
3. **بدء الاختبار** - يتطلب دائماً groupId، categoryId اختياري
4. **الأداء** - إضافة indexes لتسريع الاستعلامات
5. **التوافقية** - النظام القديم يعمل بدون تعديلات

---

## 🔧 استكشاف الأخطاء

### خطأ: "Group not found"
- تأكد من Group ID صحيح
- استخدم `GET /quiz/groups` للتحقق

### خطأ: "No questions available"
- تأكد من إضافة أسئلة للمجموعة/الفئة
- استخدم Admin untuk menambah pertanyaan

### خطأ: "Database error"
- تأكد من تطبيق Migration
- احقق من اتصال قاعدة البيانات

---

## 📞 الدعم

للأسئلة أو الاستفسارات:
- راجع التوثيق في الملفات .md
- شغل script الاختبار: `test-quiz-flow.sh`
- استخدم Postman collection للتحقق من الـ APIs

---

## 🎉 الخلاصة

تم بناء نظام اختبارات محسّن يوفر:
- تنظيم هرمي واضح (مجموعات → فئات → أسئلة)
- مرونة في الاختيار (فئة محددة أو عشوائي)
- إدارة سهلة للبيانات
- APIs موثقة وسهلة الاستخدام
- أداء محسّن

**🚀 النظام جاهز للاستخدام!**
