# 📝 تعديلات الفرونت اند - Frontend Changes

## 🎯 الملخص

تم تحديث الفرونت اند ليعكس النظام الجديد مع فصل الفئات عن المجموعات.

---

## 📂 الملفات المعدَّلة

### 1️⃣ `src/services/api.js` ✏️

#### الدوال الجديدة:

**للمجموعات والفئات:**
```javascript
// جلب جميع المجموعات
getQuizGroups()

// جلب الفئات في مجموعة معينة
getCategoriesByGroup(groupId)
```

**بدء الاختبار:**
```javascript
// بدء اختبار من مجموعة وفئة محددة (أو جميع الفئات إذا لم تحدد فئة)
startQuizByGroup(username, groupId, categoryId = null)
```

**لـ Admin (إدارة المجموعات):**
```javascript
getAdminGroups(token)
createGroup(token, name, description)
updateGroup(token, id, name, description)
deleteGroup(token, id)
getGroupQuestions(token, groupId)
```

#### الدوال القديمة (لا تزال مدعومة):
```javascript
// للتوافقية مع النظام القديم
getExamSetsByAllCategories()
startQuiz(username, examSetId = null)
```

---

### 2️⃣ `src/pages/LoginPage.jsx` ✏️

#### التغييرات الرئيسية:

**الخطوات الجديدة:**
```
1. type (اختيار Admin أو Student)
   ↓
2. selectGroup (اختيار مجموعة)
   ↓
3. selectCategory (اختيار فئة أو عشوائي)
   ↓
4. بدء الاختبار
```

#### الحالات الجديدة:

**1. selectGroup:**
- عرض قائمة بجميع المجموعات
- عرض عدد الأسئلة في كل مجموعة
- عرض وصف المجموعة

**2. selectCategory:**
- عرض جميع الفئات في المجموعة المختارة
- خيار 🎲 "Random/Mixed" لاختبار عشوائي من جميع الفئات
- عرض عدد الأسئلة في كل فئة

#### المتغيرات:
```javascript
const [groups, setGroups] = useState([])           // المجموعات
const [categories, setCategories] = useState([])   // الفئات في المجموعة
const [selectedGroup, setSelectedGroup] = useState(null)       // المجموعة المختارة
const [selectedCategory, setSelectedCategory] = useState(null) // الفئة المختارة
```

---

## 🔄 التدفق الجديد للطالب:

```
1. يدخل الطالب ويختار اسم المستخدم
   ↓
2. يختار مجموعة:
   📚 لغات البرمجة (45 Q)
   🤖 الذكاء الاصطناعي (30 Q)
   🌍 ثقافة عامة (60 Q)
   ↓
3. يختار واحد من:
   🎲 Random/Mixed (أسئلة عشوائية من جميع الفئات)
   أو
   📖 JavaScript (15 Q)
   📖 Python (18 Q)
   📖 Java (12 Q)
   ↓
4. يضغط [OK] Start Quiz
   ↓
5. يبدأ الاختبار
```

---

## 📋 التغييرات التفصيلية

### في api.js:

**قبل:**
```javascript
export const getExamSetsByAllCategories = async () => {
  // كانت تجلب exam_sets مرتبطة بكل category
}
```

**بعد:**
```javascript
export const getQuizGroups = async () => {
  // تجلب المجموعات فقط
}

export const getCategoriesByGroup = async (groupId) => {
  // تجلب الفئات في مجموعة معينة
}

export const startQuizByGroup = async (username, groupId, categoryId = null) => {
  // بدء اختبار من مجموعة وفئة
}
```

### في LoginPage.jsx:

**حالات العملية:**
```javascript
// قبل:
// 'type', 'login', 'selectExamSet'

// بعد:
// 'type', 'login', 'selectGroup', 'selectCategory'
```

**عرض البيانات:**
```javascript
// قبل: عرض categories, exam_sets منفصلة

// بعد:
// - groups مع عدد الأسئلة والوصف
// - categories مع عدد الأسئلة
// - خيار Random/Mixed
```

---

## 🧪 اختبار التعديلات:

### للطالب:
1. اختر Student في LoginPage
2. أدخل اسم المستخدم
3. اختر مجموعة من القائمة الجديدة
4. اختر فئة أو Random/Mixed
5. اضغط Start Quiz

### للتحقق:
```javascript
// تحقق من أن:
// 1. getQuizGroups() ترجع المجموعات
// 2. getCategoriesByGroup(groupId) ترجع الفئات
// 3. startQuizByGroup() تبدأ الاختبار بنجاح
```

---

## ⚠️ ملاحظات مهمة:

1. **التوافقية:** النظام القديم يعمل مع الجديد (getExamSetsByAllCategories لا تزال موجودة)
2. **API الجديدة:** استخدم startQuizByGroup للنظام الجديد
3. **خيار Random:** إذا لم تحدد categoryId، سيحصل الطالب على أسئلة عشوائية

---

## 🚀 كيفية الاستخدام في Frontend:

### 1. جلب المجموعات:
```javascript
const response = await getQuizGroups();
// النتيجة: { groups: [{id, name, description, question_count}, ...] }
```

### 2. جلب الفئات في مجموعة:
```javascript
const response = await getCategoriesByGroup(groupId);
// النتيجة: { categories: [{id, name, question_count}, ...] }
```

### 3. بدء الاختبار:
```javascript
// مع فئة محددة:
const response = await startQuizByGroup(username, groupId, categoryId);

// أو عشوائي من جميع الفئات:
const response = await startQuizByGroup(username, groupId);
// النتيجة: { sessionId, questions: [...] }
```

---

## 📁 الملفات الأخرى (دون تغيير):

- `QuizPage.jsx` - تعمل كما هي (لا تحتاج تعديল)
- `AdminDashboard.jsx` - قد تحتاج تحديث لاحقاً (للإدارة)
- `index.jsx` - لم تتغير
- `App.jsx` - لم تتغيرة

---

## 🎁 الملفات الجديدة المقترحة:

للمستقبل يمكن إضافة:
1. `GroupManagement.jsx` - لإدارة المجموعات (Admin)
2. `GroupSelectionFlow.jsx` - منطق منفصل لاختيار المجموعة/الفئة
3. `hooks/useQuizFlow.js` - custom hook للتعامل مع منطق الاختيار

---

## ✅ ملخص التحديثات:

| الملف | العملية | الحالة |
|------|---------|--------|
| api.js | إضافة functions جديدة | ✅ اكتمل |
| LoginPage.jsx | تحديث التدفق | ✅ اكتمل |
| QuizPage.jsx | لم يحتج تعديل | ✅ موافق |
| AdminDashboard.jsx | اختياري (لاحقاً) | ⏳ في الانتظار |

---

**آخر تحديث: 2026-05-06**
**الإصدار: 1.0.0**
