# Quiz Platform Frontend

بسيط وسهل الاستخدام Frontend للمنصة مبني مع React و Tailwind CSS

## 🚀 الميزات

- ✅ صفحة Login للأدمين والمستخدمين
- ✅ لوحة تحكم شاملة للأدمين (إدارة الفئات والنتائج)
- ✅ صفحة اختبار تفاعلية للطلاب
- ✅ تصميم بسيط وجميل مع Tailwind CSS
- ✅ متصل مع Backend API مباشرة

## 📦 التثبيت والتشغيل

### 1. تثبيت المكتبات
```bash
cd frontend
npm install
```

### 2. تشغيل التطبيق
```bash
npm start
```

سيفتح التطبيق تلقائياً على `http://localhost:3000`

### 3. البناء للإنتاج
```bash
npm run build
```

## 📁 هيكل المشروع

```
frontend/
├── public/
│   └── index.html          # HTML الرئيسي
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx   # صفحة تسجيل الدخول
│   │   ├── AdminDashboard.jsx  # لوحة تحكم الأدمين
│   │   └── QuizPage.jsx    # صفحة الاختبارات
│   ├── services/
│   │   └── api.js          # خدمات الـ API
│   ├── App.jsx             # الموجه الرئيسي
│   ├── index.jsx           # نقطة الدخول
│   └── index.css           # التنسيقات
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 🔐 بيانات الدخول التجريبية

### Admin
- **Username:** `admin`
- **Password:** `password123`

### Student
- أي اسم مستخدم (مثال: `student1`)

## 🎯 الصفحات الرئيسية

### 1. Login Page
- تسجيل دخول للأدمين والطلاب
- واجهة تفاعلية وبسيطة
- معالجة الأخطاء

### 2. Admin Dashboard
- ✅ إدارة الفئات (إضافة، تعديل، حذف)
- ✅ عرض نتائج الاختبارات
- ✅ إحصائيات شاملة

### 3. Quiz Page
- ✅ عرض الأسئلة بشكل تفاعلي
- ✅ دعم أسئلة MCQ و SCQ
- ✅ تتبع التقدم
- ✅ مراجعة الإجابات

## 🔗 الاتصال بـ Backend

تأكد من أن الـ Backend يعمل على:
```
https://webproject-x7ch.onrender.com
```

جميع طلبات API تتصل بهذا الرابط تلقائياً.

## 🛠️ المكتبات المستخدمة

- **React 18.2.0** - للواجهة التفاعلية
- **React DOM 18.2.0** - لـ rendering الواجهة
- **Tailwind CSS 3.3.0** - للتنسيقات الحديثة
- **React Scripts 5.0.1** - لبناء التطبيق

## 🎨 Tailwind CSS v3

التطبيق يستخدم Tailwind CSS v3 بدون مشاكل CLI:

```bash
# التثبيت
npm install -D tailwindcss postcss autoprefixer

# لا حاجة لـ CLI إضافي
```

## 📝 ملاحظات

- ✅ التطبيق بسيط جداً للمبتدئين في React
- ✅ بدون مكتبات معقدة (بدون Redux, Axios, etc)
- ✅ استخدام fetch API مباشر
- ✅ localStorage لحفظ البيانات

## 🚀 نصائح للتطوير

1. **إضافة صفحات جديدة:**
   - أنشئ ملف في `src/pages/` مثل `NewPage.jsx`
   - أضفه إلى الموجه في `App.jsx`

2. **إضافة دوال API:**
   - أضفها في `src/services/api.js`
   - استخدمها في الصفحات مع `try/catch`

3. **تحسين التصميم:**
   - استخدم فئات Tailwind الموجودة
   - أضف ألوان جديدة في `tailwind.config.js`

## 📚 الموارد الإضافية

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [API Examples](../API_EXAMPLES.json)

---

**تم تطويره بنجاح! 🎉**
