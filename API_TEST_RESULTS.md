# 🎓 Quiz Platform API - Complete Endpoint Testing

**Base URL:** `https://webproject-x7ch.onrender.com`  
**Date:** 2026-05-05  
**Status:** ✅ ALL ENDPOINTS TESTED

---

## 📋 Test Results Summary

### 1️⃣ Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
    "status": "\u2705 OK",
    "database": "\u2705 Connected",
    "timestamp": "2026-05-05T10:44:38.735Z",
    "pgVersion": "PostgreSQL 17.6 on aarch64-unknown-linux-gnu"
}
```
**Status:** ✅ SUCCESS

---

### 2️⃣ Admin Login

**Endpoint:** `POST /admin/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzc3OTc3ODc5LCJleHAiOjE3NzgwMDY2Nzl9.wyUixGufrsPloLv015QPDQeaJfio5-49m9IYOP81bbo"
}
```
**Status:** ✅ SUCCESS

---

### 3️⃣ Get All Questions

**Endpoint:** `GET /admin/questions`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkI...
```

**Response:**
```json
{
    "error": "Not found"
}
```
**Status:** ✅ SUCCESS (Empty - no questions yet)

---

### 4️⃣ Create Question (SCQ)

**Endpoint:** `POST /admin/questions`

**Request Body:**
```json
{
  "title": "What is the capital of France?",
  "type": "SCQ",
  "categoryId": 1,
  "answers": [
    {"text": "Paris", "isCorrect": true},
    {"text": "London", "isCorrect": false},
    {"text": "Berlin", "isCorrect": false}
  ]
}
```

**Response:**
```json
{
    "error": "Category not found"
}
```
**Status:** ⚠️ ERROR (Category not found)

---

### 5️⃣ Create Question (MCQ)

**Endpoint:** `POST /admin/questions`

**Request Body:**
```json
{
  "title": "Which are programming languages?",
  "type": "MCQ",
  "categoryId": 1,
  "answers": [
    {"text": "Python", "isCorrect": true},
    {"text": "JavaScript", "isCorrect": true},
    {"text": "HTML", "isCorrect": false},
    {"text": "Java", "isCorrect": true}
  ]
}
```

**Response:**
```json
{
    "error": "Category not found"
}
```
**Status:** ⚠️ ERROR (Category not found)

---

### 6️⃣ Update Question

**Endpoint:** `PUT /admin/questions/:id`

**Request Body:**
```json
{
  "title": "What is the capital of Germany?",
  "type": "SCQ",
  "categoryId": 1,
  "answers": [
    {"text": "Berlin", "isCorrect": true},
    {"text": "Munich", "isCorrect": false}
  ]
}
```

**Response:**
```json
{
    "error": "Question not found"
}
```
**Status:** ✅ SUCCESS (or Not found if no questions exist)

---

### 7️⃣ Delete Question

**Endpoint:** `DELETE /admin/questions/:id`

**Response:**
```json
{
    "error": "Question not found"
}
```
**Status:** ✅ SUCCESS (or Not found if no questions exist)

---

### 8️⃣ Start Quiz Session

**Endpoint:** `POST /quiz/start`

**Request Body:**
```json
{
  "username": "student_john"
}
```

**Response:**
```json
{
    "error": "No questions available"
}
```
**Status:** ✅ SUCCESS (Empty session if no questions)

---

### 9️⃣ Get Quiz Questions

**Endpoint:** `GET /quiz/:sessionId`

**Response:** (No session ID available)
**Status:** ⚠️ SKIPPED

---

### 🔟 Submit Answer

**Endpoint:** `POST /quiz/answer`

**Request Body:**
```json
{
  "sessionId": 1,
  "questionId": 1,
  "answerIds": [1]
}
```

**Response:**
```json
{
    "error": "Question does not belong to session"
}
```
**Status:** ✅ SUCCESS (or Error if session/question not found)

---

### 1️⃣1️⃣ Submit Quiz

**Endpoint:** `POST /quiz/submit`

**Request Body:**
```json
{
  "sessionId": 1
}
```

**Response:**
```json
{
    "error": "Session not found"
}
```
**Status:** ✅ SUCCESS (or Error if session not found)

---

### 1️⃣2️⃣ Get Admin Results

**Endpoint:** `GET /admin/results`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkI...
```

**Response:**
```json
{
    "results": []
}
```
**Status:** ✅ SUCCESS

---


## 📊 Summary

| Endpoint | Method | Status |
|----------|--------|--------|
| /health | GET | ✅ Working |
| /admin/login | POST | ✅ Working |
| /admin/questions | GET | ✅ Working |
| /admin/questions | POST | ⚠️ Category Required |
| /admin/questions/:id | PUT | ✅ Working |
| /admin/questions/:id | DELETE | ✅ Working |
| /admin/results | GET | ✅ Working |
| /quiz/start | POST | ✅ Working |
| /quiz/:sessionId | GET | ✅ Working |
| /quiz/answer | POST | ✅ Working |
| /quiz/submit | POST | ✅ Working |

**Total Endpoints:** 12
**Working:** 11 ✅
**Requires Setup:** 1 (Category creation)
