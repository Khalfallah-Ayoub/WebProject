# 📚 Category Management Implementation Guide

## ✅ الميزات المضافة

تم إضافة نظام كامل لإدارة الفئات (Categories) من قبل المسؤولين (Admins).

---

## 📁 الملفات المضافة

### 1. **services/categoryService.js**
خدمة إدارة الفئات مع جميع العمليات:

```javascript
// جميع العمليات المتاحة:
- getAllCategories()      // الحصول على جميع الفئات
- getCategoryById(id)     // الحصول على فئة بواسطة ID
- createCategory(name)    // إضافة فئة جديدة
- updateCategory(id, name) // تعديل فئة
- deleteCategory(id)      // حذف فئة
```

**المميزات:**
- ✅ التحقق من صحة البيانات
- ✅ معالجة الأخطاء (تكرار أسماء الفئات، عدم وجود الفئة)
- ✅ الحماية من حذف الفئات التي تحتوي على أسئلة
- ✅ حد أقصى 100 حرف لاسم الفئة

---

### 2. **controllers/admin/categoryController.js**
متحكمات إدارة الفئات للأدمين:

```javascript
- getAdminCategories()        // GET - جميع الفئات
- getAdminCategoryById()      // GET - فئة واحدة
- createAdminCategory()       // POST - إضافة فئة
- updateAdminCategory()       // PUT - تعديل فئة
- deleteAdminCategory()       // DELETE - حذف فئة
```

---

### 3. **تحديث routes/adminRoutes.js**
إضافة المسارات المحمية للفئات:

```javascript
GET    /admin/categories          // الحصول على جميع الفئات
GET    /admin/categories/:id      // الحصول على فئة واحدة
POST   /admin/categories          // إضافة فئة جديدة
PUT    /admin/categories/:id      // تعديل فئة
DELETE /admin/categories/:id      // حذف فئة
```

---

## 🔐 الحماية والأمان

- ✅ جميع المسارات محمية بـ JWT (JSON Web Token)
- ✅ يجب تسجيل الدخول كمسؤول أولاً
- ✅ التحقق من صحة البيانات قبل حفظها في قاعدة البيانات
- ✅ معالجة آمنة للأخطاء

---

## 📡 أمثلة على الطلبات (HTTP Requests)

### 1️⃣ تسجيل الدخول كمسؤول
```bash
POST /admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}

Response:
{
  "token": "eyJhbGc..."
}
```

### 2️⃣ الحصول على جميع الفئات
```bash
GET /admin/categories
Authorization: Bearer {token}

Response:
{
  "categories": [
    { "id": 1, "name": "JavaScript" },
    { "id": 2, "name": "Python" }
  ]
}
```

### 3️⃣ إضافة فئة جديدة
```bash
POST /admin/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Java"
}

Response: (201 Created)
{
  "category": {
    "id": 3,
    "name": "Java"
  }
}
```

### 4️⃣ تعديل فئة
```bash
PUT /admin/categories/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "TypeScript"
}

Response:
{
  "category": {
    "id": 1,
    "name": "TypeScript"
  }
}
```

### 5️⃣ حذف فئة
```bash
DELETE /admin/categories/1
Authorization: Bearer {token}

Response:
{
  "deleted": true,
  "id": 1
}
```

---

## 🛡️ رموز الأخطاء

| الرمز | الوصف |
|------|--------|
| 201 | تم الإنشاء بنجاح |
| 400 | بيانات غير صحيحة |
| 401 | غير مصرح (لم تسجل دخول) |
| 404 | الفئة غير موجودة |
| 409 | تضارب (فئة مكررة / فئة تحتوي على أسئلة) |

---

## 🗄️ قاعدة البيانات

جدول الفئات موجود بالفعل:

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
```

**روابط آمنة:**
```sql
category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT
```

- `ON DELETE RESTRICT` يمنع حذف الفئة إذا كانت تحتوي على أسئلة ✅

---

## ✨ سير العمل

1. **المسؤول يسجل الدخول** → يحصل على JWT token
2. **يستخدم الـ token** في جميع الطلبات اللاحقة
3. **يمكن:**
   - 📋 عرض جميع الفئات
   - ➕ إضافة فئات جديدة
   - ✏️ تعديل الفئات الموجودة
   - ❌ حذف الفئات (إذا لم تحتوي على أسئلة)

---

## 📝 ملاحظات مهمة

- يجب أن يكون اسم الفئة فريداً (لا يمكن تكرار الأسماء)
- لا يمكن حذف فئة إذا كانت تحتوي على أسئلة
- طول اسم الفئة يجب أن لا يتجاوز 100 حرف
- جميع الطلبات تحتاج إلى JWT token في الـ header

---

## 🧪 الاختبار

لاختبار الميزات الجديدة استخدم Postman أو أي أداة أخرى لإرسال الطلبات HTTP:

```bash
# الأدوات الموصى بها:
- Postman
- Thunder Client
- cURL
- Insomnia
```

---

## 🚀 التكامل مع الأسئلة

عند إنشاء أسئلة جديدة، يجب تحديد `categoryId`:

```bash
POST /admin/questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "ما هو JavaScript?",
  "type": "SCQ",
  "categoryId": 1,
  "answers": [
    { "text": "لغة برمجة", "isCorrect": true },
    { "text": "قاعدة بيانات", "isCorrect": false }
  ]
}
```

---

**تم الانتهاء من تطوير نظام إدارة الفئات بنجاح! ✅**
