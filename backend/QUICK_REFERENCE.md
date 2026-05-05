# Quick Reference Guide - Category Management API

## 🚀 التشغيل السريع

### 1. تشغيل الخادم:
```bash
cd backend
npm start
# أو
node app.js
```

### 2. تشغيل الاختبارات:
```bash
npm test
```

### 3. اختبار إدارة الفئات:
```bash
./test-categories.sh
```

---

## 📝 أمثلة التطبيق

### JavaScript/Node.js:
```javascript
const fetch = require('node-fetch');

// 1. تسجيل الدخول
async function login() {
  const response = await fetch('http://localhost:3000/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: 'password'
    })
  });
  const data = await response.json();
  return data.token;
}

// 2. إضافة فئة
async function addCategory(token, name) {
  const response = await fetch('http://localhost:3000/admin/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });
  return response.json();
}

// 3. الحصول على جميع الفئات
async function getCategories(token) {
  const response = await fetch('http://localhost:3000/admin/categories', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

// مثال على الاستخدام:
(async () => {
  const token = await login();
  await addCategory(token, 'JavaScript');
  const categories = await getCategories(token);
  console.log(categories);
})();
```

---

### Python:
```python
import requests
import json

# Configuration
API_URL = "http://localhost:3000"

# 1. تسجيل الدخول
def login():
    response = requests.post(
        f"{API_URL}/admin/login",
        json={"username": "admin", "password": "password"}
    )
    return response.json()["token"]

# 2. إضافة فئة
def add_category(token, name):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{API_URL}/admin/categories",
        json={"name": name},
        headers=headers
    )
    return response.json()

# 3. الحصول على جميع الفئات
def get_categories(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"{API_URL}/admin/categories",
        headers=headers
    )
    return response.json()

# 4. تحديث فئة
def update_category(token, category_id, name):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.put(
        f"{API_URL}/admin/categories/{category_id}",
        json={"name": name},
        headers=headers
    )
    return response.json()

# 5. حذف فئة
def delete_category(token, category_id):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.delete(
        f"{API_URL}/admin/categories/{category_id}",
        headers=headers
    )
    return response.json()

# الاستخدام:
token = login()
add_category(token, "JavaScript")
categories = get_categories(token)
print(json.dumps(categories, indent=2))
```

---

### cURL:
```bash
# 1. تسجيل الدخول
TOKEN=$(curl -s -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}' | jq -r '.token')

echo "Token: $TOKEN"

# 2. إضافة فئة
curl -X POST http://localhost:3000/admin/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"JavaScript"}' | jq '.'

# 3. الحصول على جميع الفئات
curl -X GET http://localhost:3000/admin/categories \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 4. تحديث فئة (ID=1)
curl -X PUT http://localhost:3000/admin/categories/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"TypeScript"}' | jq '.'

# 5. حذف فئة (ID=1)
curl -X DELETE http://localhost:3000/admin/categories/1 \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## 📊 الرموز الخاصة بالأخطاء

```
✅ 201 Created      - تم الإنشاء بنجاح
✅ 200 OK           - تم بنجاح
❌ 400 Bad Request  - بيانات غير صحيحة
❌ 401 Unauthorized - غير مصرح (لم تسجل دخول)
❌ 404 Not Found    - الفئة غير موجودة
❌ 409 Conflict     - تضارب (مثل اسم مكرر)
```

---

## 🔍 معالجة الأخطاء

```javascript
// مثال على معالجة الأخطاء:
async function createCategoryWithErrorHandling(token, name) {
  try {
    const response = await fetch('http://localhost:3000/admin/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });

    const data = await response.json();

    if (!response.ok) {
      switch (response.status) {
        case 400:
          console.error('بيانات غير صحيحة:', data.error);
          break;
        case 401:
          console.error('غير مصرح - يجب تسجيل الدخول أولاً');
          break;
        case 409:
          console.error('اسم الفئة موجود بالفعل');
          break;
        default:
          console.error('خطأ:', data.error);
      }
      return null;
    }

    return data.category;
  } catch (error) {
    console.error('خطأ في الاتصال:', error);
    return null;
  }
}
```

---

## 🐛 استكشاف الأخطاء

إذا واجهت مشاكل:

1. **تأكد من تشغيل الخادم:**
   ```bash
   # في نافذة terminal جديدة
   cd backend && npm start
   ```

2. **تأكد من اتصال قاعدة البيانات:**
   ```bash
   curl http://localhost:3000/health
   ```

3. **تحقق من الـ JWT Token:**
   ```bash
   # استخدم https://jwt.io لفك تشفير الـ token
   ```

4. **افحص السجلات:**
   ```bash
   # ستجد الأخطاء في terminal
   ```

---

**تم بنجاح! ✅**
