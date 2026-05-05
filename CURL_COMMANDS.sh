#!/bin/bash

# 🎓 Quiz Platform API - CURL Commands
# Base URL: https://webproject-x7ch.onrender.com
# Date: 2026-05-05

BASE_URL="https://webproject-x7ch.onrender.com"

echo "════════════════════════════════════════════════════════════════"
echo "Quiz Platform API - CURL Test Commands"
echo "════════════════════════════════════════════════════════════════"
echo ""

# 1. Health Check
echo "1️⃣ Health Check"
echo "─────────────────────────────────────────────────────────────"
echo "curl -s '$BASE_URL/health' | python3 -m json.tool"
echo ""
echo "Response:"
curl -s "$BASE_URL/health" | python3 -m json.tool 2>/dev/null
echo ""
echo ""

# 2. Admin Login
echo "2️⃣ Admin Login"
echo "─────────────────────────────────────────────────────────────"
echo 'curl -X POST "$BASE_URL/admin/login" \'
echo '  -H "Content-Type: application/json" \'
echo "  -d '{\"username\":\"admin\",\"password\":\"password123\"}' | python3 -m json.tool"
echo ""
echo "Response:"
LOGIN=$(curl -s -X POST "$BASE_URL/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}')
echo "$LOGIN" | python3 -m json.tool 2>/dev/null
TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo ""
echo "Saved Token: $TOKEN"
echo ""
echo ""

# 3. Get All Questions
echo "3️⃣ Get All Questions"
echo "─────────────────────────────────────────────────────────────"
echo 'curl "$BASE_URL/admin/questions" \'
echo '  -H "Authorization: Bearer {TOKEN}" | python3 -m json.tool'
echo ""
echo "Response:"
curl -s -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/admin/questions" | python3 -m json.tool 2>/dev/null
echo ""
echo ""

# 4. Create Question (SCQ)
echo "4️⃣ Create Question (SCQ)"
echo "─────────────────────────────────────────────────────────────"
echo 'curl -X POST "$BASE_URL/admin/questions" \'
echo '  -H "Content-Type: application/json" \'
echo '  -H "Authorization: Bearer {TOKEN}" \'
echo "  -d '{"
echo '    "title": "What is the capital of France?",'
echo '    "type": "SCQ",'
echo '    "categoryId": 1,'
echo '    "answers": ['
echo '      {"text": "Paris", "isCorrect": true},'
echo '      {"text": "London", "isCorrect": false}'
echo '    ]'
echo "  }' | python3 -m json.tool"
echo ""
echo "Response:"
curl -s -X POST "$BASE_URL/admin/questions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "What is the capital of France?",
    "type": "SCQ",
    "categoryId": 1,
    "answers": [
      {"text": "Paris", "isCorrect": true},
      {"text": "London", "isCorrect": false}
    ]
  }' | python3 -m json.tool 2>/dev/null
echo ""
echo ""

# 5. Create Question (MCQ)
echo "5️⃣ Create Question (MCQ)"
echo "─────────────────────────────────────────────────────────────"
echo 'curl -X POST "$BASE_URL/admin/questions" \'
echo '  -H "Content-Type: application/json" \'
echo '  -H "Authorization: Bearer {TOKEN}" \'
echo "  -d '{"
echo '    "title": "Which are programming languages?",'
echo '    "type": "MCQ",'
echo '    "categoryId": 1,'
echo '    "answers": ['
echo '      {"text": "Python", "isCorrect": true},'
echo '      {"text": "HTML", "isCorrect": false}'
echo '    ]'
echo "  }' | python3 -m json.tool"
echo ""
echo ""

# 6. Update Question
echo "6️⃣ Update Question"
echo "─────────────────────────────────────────────────────────────"
echo 'curl -X PUT "$BASE_URL/admin/questions/1" \'
echo '  -H "Content-Type: application/json" \'
echo '  -H "Authorization: Bearer {TOKEN}" \'
echo "  -d '{"
echo '    "title": "Updated Question",'
echo '    "type": "SCQ",'
echo '    "categoryId": 1,'
echo '    "answers": [{"text": "Answer", "isCorrect": true}]'
echo "  }' | python3 -m json.tool"
echo ""
echo ""

# 7. Delete Question
echo "7️⃣ Delete Question"
echo "─────────────────────────────────────────────────────────────"
echo 'curl -X DELETE "$BASE_URL/admin/questions/1" \'
echo '  -H "Authorization: Bearer {TOKEN}"'
echo ""
echo ""

# 8. Start Quiz
echo "8️⃣ Start Quiz Session"
echo "─────────────────────────────────────────────────────────────"
echo 'curl -X POST "$BASE_URL/quiz/start" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d "{\"username\":\"student_name\"}" | python3 -m json.tool'
echo ""
echo "Response:"
QUIZ=$(curl -s -X POST "$BASE_URL/quiz/start" \
  -H "Content-Type: application/json" \
  -d '{"username":"test_student"}')
echo "$QUIZ" | python3 -m json.tool 2>/dev/null
SESSION=$(echo "$QUIZ" | grep -o '"sessionId":[0-9]*' | cut -d':' -f2)
echo ""
echo ""

# 9. Get Quiz Questions
echo "9️⃣ Get Quiz Questions"
echo "─────────────────────────────────────────────────────────────"
echo "curl '$BASE_URL/quiz/{sessionId}' | python3 -m json.tool"
echo ""
echo ""

# 10. Submit Answer
echo "🔟 Submit Answer"
echo "─────────────────────────────────────────────────────────────"
echo 'curl -X POST "$BASE_URL/quiz/answer" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d "'
echo '  {
echo '    "sessionId": 1,'
echo '    "questionId": 1,'
echo '    "answerIds": [1]'
echo '  }' | python3 -m json.tool"
echo ""
echo ""

# 11. Submit Quiz
echo "1️⃣1️⃣ Submit Quiz"
echo "─────────────────────────────────────────────────────────────"
echo 'curl -X POST "$BASE_URL/quiz/submit" \'
echo '  -H "Content-Type: application/json" \'
echo '  -d "{\"sessionId\": 1}" | python3 -m json.tool'
echo ""
echo ""

# 12. Get Results
echo "1️⃣2️⃣ Get Admin Results"
echo "─────────────────────────────────────────────────────────────"
echo 'curl "$BASE_URL/admin/results" \'
echo '  -H "Authorization: Bearer {TOKEN}" | python3 -m json.tool'
echo ""
echo "Response:"
curl -s -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/admin/results" | python3 -m json.tool 2>/dev/null
echo ""
echo ""

echo "════════════════════════════════════════════════════════════════"
echo "All endpoints tested on: $BASE_URL"
echo "════════════════════════════════════════════════════════════════"
