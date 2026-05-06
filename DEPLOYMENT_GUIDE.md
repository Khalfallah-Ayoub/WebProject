# 🚀 DEPLOYMENT GUIDE - Render + Supabase

**Date:** 2026-05-06  
**Status:** Code pushed, ready for database setup

---

## 📋 Current Status

✅ **Code Pushed to GitHub**
- Render will auto-deploy the updated backend
- New group APIs are now available
- Frontend changes deployed

⏳ **Database Setup Needed**
- Run SQL script in Supabase
- Populate with sample data
- Verify API connections

---

## 🔧 Step-by-Step Setup

### Step 1: Wait for Render Auto-Deploy (2-3 minutes)
1. Code was pushed to GitHub
2. Render checks for changes every few minutes
3. Backend will auto-rebuild and deploy

**How to verify:**
- Go to your Render dashboard
- Check deployment status
- Wait for "Deployed" status ✅

---

### Step 2: Setup Supabase Database

#### 2A: Open Supabase SQL Editor
1. Go to your Supabase project: https://app.supabase.com
2. Click SQL Editor (left menu)
3. Click "New Query"

#### 2B: Run the Setup Script
1. Copy contents of `backend/SUPABASE_SETUP.sql`
2. Paste into Supabase SQL Editor
3. Click "Run" button

**Expected Output:**
```
Groups Created: 2
Categories Created: 6
Questions Created: 12
Answers Created: 36
```

#### 2C: Verify in Supabase
1. Go to Table Editor
2. Check these tables exist:
   - groups (2 rows)
   - categories (6 rows)
   - questions (12 rows with group_id)
   - answers (36 rows)

---

### Step 3: Test in Frontend

#### Test 3A: Student Mode
1. Go to your app
2. Click **[S] Student**
3. Enter username

**Expected:**
```
✅ See 2 Groups:
   📚 لغات البرمجة (6 Q)
   🌍 ثقافة عامة (6 Q)
```

4. Click group → see 3 categories
5. Select category → start quiz ✅

#### Test 3B: Admin Mode
1. Click **[A] Admin**
2. Username: admin | Password: password123
3. Click **[G] Groups** tab - see 2 groups ✅
4. Click **[Q] Questions** tab 
5. Create new question - see Group field ✅

---

## ✅ Success Checklist

- [ ] Render deployment complete
- [ ] Supabase script executed
- [ ] Database has 2 groups
- [ ] Database has 6 categories
- [ ] Database has 12 questions
- [ ] Student sees groups
- [ ] Admin Groups tab works
- [ ] Question form has group field
- [ ] Quiz starts with correct questions

---

## 📞 Help

**Groups not showing?**
1. Verify Supabase script ran
2. Refresh browser
3. Check browser console for errors

**Admin Groups tab missing?**
1. Wait for Render to deploy
2. Clear browser cache (Ctrl+F5)
3. Restart dev server if local

**Create script failed?**
1. Run each section separately
2. Check error messages
3. Verify table names

---

**Everything is ready. Run the SQL script and test!** 🎉
