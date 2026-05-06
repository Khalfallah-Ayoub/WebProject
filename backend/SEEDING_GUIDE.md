# 🌱 Database Seeding Guide

## ✨ What This Does

The seeding script (`seeds.js`) will:
1. **Clear all existing data** from the database
2. **Create sample groups:**
   - لغات البرمجة (Programming Languages)
   - ثقافة عامة (General Culture)

3. **Create sample categories:**
   - **Programming:** JavaScript, Python, Java
   - **Culture:** دول (Countries), طعام (Food), تاريخ (History)

4. **Populate 12 sample questions** with answers across all categories and groups

---

## 🚀 How to Run

### Step 1: Install Dependencies (if not already done)
```bash
cd backend
npm install
```

### Step 2: Ensure Database Connection
Make sure your database connection is configured in `db/pool.js` and the database is running.

### Step 3: Run the Seeding Script
```bash
node seeds.js
```

### Expected Output:
```
🌱 Starting database seeding...

🗑️  Clearing existing data...
✅ Data cleared.

📚 Creating groups...
✅ Created 2 groups
   - لغات البرمجة (ID: 1)
   - ثقافة عامة (ID: 2)

📑 Creating categories...
✅ Created category: JavaScript (ID: 1)
✅ Created category: Python (ID: 2)
...

❓ Creating sample questions...
✅ Created question: ما الفرق بين var و let؟
✅ Created question: كيف تنشئ arrow function في JavaScript؟
...

🎉 Database seeding completed successfully!

📊 Summary:
   Groups: 2
   Categories: 6
   Questions: 12
   Answers: 36
```

---

## 📊 Data Structure Created

```
Groups (2)
├── لغات البرمجة
│   ├── JavaScript (2 questions)
│   ├── Python (2 questions)
│   └── Java (2 questions)
│
└── ثقافة عامة
    ├── دول (2 questions)
    ├── طعام (2 questions)
    └── تاريخ (2 questions)
```

---

## ⚠️ Important Notes

1. **Data Clearing:** This script **DELETES all existing data** before seeding. Only run if you want to reset the database.

2. **Fresh Start:** Perfect for development and testing. Safe to run multiple times.

3. **Categories & Groups:** 
   - 6 categories created
   - 2 groups created
   - Each group has 3 categories

4. **Sample Questions:** 12 questions total:
   - 6 programming questions
   - 6 culture questions
   - Each with 2-3 answers

---

## 🎯 What to Do Next

### 1. Run Backend Server
```bash
npm start
```

### 2. Run Frontend
```bash
cd frontend
npm install  # if not done
npm start
```

### 3. Test the System
1. Go to `http://localhost:3000`
2. Choose **Student** (not Admin for now)
3. Enter a username
4. You should see **2 groups**: لغات البرمجة, ثقافة عامة
5. Click on a group to see its **3 categories**
6. Select a category or Random/Mixed
7. Start the quiz!

---

## 🔧 Admin Panel

You can now log in as Admin to:
1. **View/Manage Groups** - New [G] Groups tab
2. **Add/Edit Questions** - Group field now available
3. **View Categories** - All categories linked to groups

### Demo Credentials:
- Username: `admin`
- Password: `password123`

---

## 📝 Customizing the Seed Data

To modify the sample data, edit `seeds.js` and change the `groupsData`, `categoriesData`, or `sampleQuestions` arrays.

Then run:
```bash
node seeds.js
```

---

**Happy Testing! 🎉**
