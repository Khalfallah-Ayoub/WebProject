# 🎓 Quiz Platform Backend API

A complete REST API for a quiz platform with admin management and automatic grading.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Initialize database
npm run init-db

# Create admin account
npm run create-admin admin password123

# Start server
npm start
```

Server runs on `http://localhost:3000`

## 📡 API Endpoints

### Admin APIs (Require JWT Token)
- `POST /admin/login` - Login and get token
- `POST /admin/questions` - Create question
- `GET /admin/questions` - List all questions
- `PUT /admin/questions/:id` - Update question
- `DELETE /admin/questions/:id` - Delete question
- `GET /admin/results` - View all results

### Quiz APIs
- `POST /quiz/start` - Start quiz session
- `GET /quiz/:sessionId` - Get quiz questions
- `POST /quiz/answer` - Submit answer
- `POST /quiz/submit` - Submit quiz and get score
- `GET /health` - Health check

## 🗄️ Database

PostgreSQL on Supabase
- Connection: `aws-1-eu-central-1.pooler.supabase.com:5432`
- Tables: 8 (admins, categories, questions, answers, quiz_sessions, session_questions, user_answers, settings)

## 🔐 Authentication

JWT Token-based
- Get token: `POST /admin/login`
- Use in header: `Authorization: Bearer {token}`

## 📝 Environment Variables

```
DATABASE_URL=postgresql://postgres.tnhgktfebssssfiplpfg:Ayoub%40100kh@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
DATABASE_SSL=true
JWT_SECRET=2fc4e7f837bea87acf665f93bbf5c3040ac60640d33a01b58b46a82e6477b526
PORT=3000
```

## 🧪 Testing

```bash
npm test
```

All tests pass: 9/9 ✅

## 🎯 Question Types

**SCQ** (Single Choice)
- One correct answer
- Correct = 1 point, Wrong = 0 points

**MCQ** (Multiple Choice)
- Multiple correct answers
- Must select ALL correct answers = 1 point
- Any mistake = 0 points

## 🛠️ Technology Stack

- Node.js + Express
- PostgreSQL
- JWT Authentication
- Bcrypt Password Hashing
- Jest + Supertest
- SOLID Principles

## 📊 Project Structure

```
backend/
├── app.js                 # Express app
├── config/
│   └── db.js             # Database config
├── db/
│   └── schema.js         # Database schema
├── controllers/          # Request handlers
├── services/             # Business logic
├── middleware/           # Custom middleware
├── routes/               # API routes
├── utils/                # Utilities
├── scripts/              # Helper scripts
└── __tests__/            # Integration tests
```

## 🚀 Deployment on Render.com

1. Push code to GitHub/GitLab
2. Create new Web Service on Render
3. Connect your repository
4. Set environment variables:
   - DATABASE_URL
   - JWT_SECRET
   - PORT
5. Build command: `npm install && npm run init-db`
6. Start command: `npm start`

## ✨ Features

✓ Complete REST API (11 endpoints)
✓ JWT Authentication
✓ Auto-grading (SCQ/MCQ)
✓ Session Management
✓ Error Handling
✓ Input Validation
✓ Comprehensive Tests
✓ Clean Code Architecture

## 📝 Notes

- Default admin: `admin` / `password123`
- Questions are randomly selected per session
- Scores calculated automatically
- All times in UTC

---

**Version:** 1.0.0  
**Status:** Production Ready ✅
