# Frontend - التثبيت والتشغيل

## المتطلبات

- **Node.js 14+** أو أحدث
- **npm** أو **yarn**

تحقق من الإصدار:
```bash
node --version
npm --version
```

## خطوات التثبيت

### 1. الدخول إلى مجلد Frontend

```bash
cd frontend
```

### 2. تثبيت المكتبات

```bash
npm install
```

أو باستخدام yarn:
```bash
yarn install
```

### 3. إعدادات البيئة (اختياري)

إذا كنت تريد تشغيل الـ Backend محلياً:
1. افتح `src/services/api.js`
2. غيّر `API_URL` إلى `http://localhost:3000`

### 4. تشغيل التطبيق

```bash
npm start
```

سيفتح التطبيق تلقائياً على:
```
http://localhost:3000
```

## اختبار التطبيق

### 1. تسجيل الدخول كمسؤول
- اختر tab **Admin**
- Username: `admin`
- Password: `password123`
- اضغط **Login**

### 2. استكشاف لوحة التحكم
- **Categories Tab:** إضافة/تعديل/حذف الفئات
- **Results Tab:** عرض نتائج الطلاب

### 3. القيام بامتحان كطالب
- عود إلى صفحة Login
- اختر tab **Student**
- أدخل أي اسم مستخدم (مثلاً: `student1`)
- اضغط **Login**
- اجب على الأسئلة
- اضغط **Submit Quiz** عند الانتهاء

## البناء للإنتاج

```bash
npm run build
```

سينتج عن هذا مجلد `build/` يحتوي على الملفات الثابتة الجاهزة للـ deployment.

## استكشاف الأخطاء

### المشكلة: "node_modules not found"
```bash
npm install
```

### المشكلة: "Port 3000 is already in use"
```bash
PORT=3001 npm start
```

### المشكلة: "Cannot connect to backend"
- تأكد من أن الـ Backend يعمل
- تحقق من الرابط في `src/services/api.js`
- افتح DevTools (F12) وتحقق من الأخطاء في Console

## الملفات المهمة

```
frontend/
├── src/
│   ├── App.jsx                 # الموجه الرئيسي
│   ├── pages/
│   │   ├── LoginPage.jsx       # تسجيل الدخول
│   │   ├── AdminDashboard.jsx  # لوحة الأدمين
│   │   └── QuizPage.jsx        # صفحة الامتحان
│   ├── services/
│   │   └── api.js              # واجهة الـ API
│   ├── config/
│   │   └── constants.js        # الثوابت والإعدادات
│   └── index.css               # التنسيقات الأساسية
├── public/
│   └── index.html              # HTML الرئيسي
├── package.json
├── tailwind.config.js          # إعدادات Tailwind
└── postcss.config.js           # إعدادات PostCSS
```

## الأوامر الأساسية

```bash
# تثبيت المكتبات
npm install

# تشغيل في development
npm start

# البناء للإنتاج
npm run build

# الاختبار
npm test
```

## تشغيل مع Docker (اختياري)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t quiz-frontend .
docker run -p 3000:3000 quiz-frontend
```

---

**تم! الآن التطبيق جاهز للاستخدام! 🚀**
