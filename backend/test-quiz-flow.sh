#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

API="http://localhost:3000"

echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}   نظام الاختبارات - اختبار الـ APIs${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}\n"

# Step 1: Get all groups
echo -e "${YELLOW}1️⃣  جلب جميع المجموعات:${NC}"
echo "GET $API/quiz/groups"
curl -s "$API/quiz/groups" | jq '.'
echo -e "\n"

# Step 2: Create a group (Admin)
echo -e "${YELLOW}2️⃣  إنشاء مجموعة جديدة (Admin):${NC}"
echo "POST $API/admin/groups"
ADMIN_TOKEN="your_token_here"
GROUP_RESPONSE=$(curl -s -X POST "$API/admin/groups" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "لغات البرمجة",
    "description": "أسئلة عن لغات البرمجة المختلفة"
  }')
echo "$GROUP_RESPONSE" | jq '.'
GROUP_ID=$(echo "$GROUP_RESPONSE" | jq -r '.group.id')
echo -e "Group ID: $GROUP_ID\n"

# Step 3: Create a category (Admin)
echo -e "${YELLOW}3️⃣  إنشاء فئة (Admin):${NC}"
echo "POST $API/admin/categories"
CATEGORY_RESPONSE=$(curl -s -X POST "$API/admin/categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name": "JavaScript"}')
echo "$CATEGORY_RESPONSE" | jq '.'
CATEGORY_ID=$(echo "$CATEGORY_RESPONSE" | jq -r '.category.id')
echo -e "Category ID: $CATEGORY_ID\n"

# Step 4: Create a question (Admin)
echo -e "${YELLOW}4️⃣  إنشاء سؤال مع المجموعة والفئة (Admin):${NC}"
echo "POST $API/admin/questions"
QUESTION_RESPONSE=$(curl -s -X POST "$API/admin/questions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "ما هو الفرق بين var و let في JavaScript؟",
    "type": "MCQ",
    "categoryId": '"$CATEGORY_ID"',
    "groupId": '"$GROUP_ID"',
    "answers": [
      {"text": "var عام، let محدود بـ block scope", "isCorrect": true},
      {"text": "لا يوجد فرق", "isCorrect": false},
      {"text": "let أقدم من var", "isCorrect": false}
    ]
  }')
echo "$QUESTION_RESPONSE" | jq '.'
echo -e "\n"

# Step 5: Student - Get categories in group
echo -e "${YELLOW}5️⃣  الطالب - جلب الفئات في المجموعة:${NC}"
echo "GET $API/quiz/groups/$GROUP_ID/categories"
curl -s "$API/quiz/groups/$GROUP_ID/categories" | jq '.'
echo -e "\n"

# Step 6A: Student - Start quiz with specific category
echo -e "${YELLOW}6️⃣ أ) الطالب - بدء اختبار من فئة محددة:${NC}"
echo "POST $API/quiz/start-by-group"
QUIZ_RESPONSE=$(curl -s -X POST "$API/quiz/start-by-group" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "أحمد محمود",
    "groupId": '"$GROUP_ID"',
    "categoryId": '"$CATEGORY_ID"'
  }')
echo "$QUIZ_RESPONSE" | jq '.'
SESSION_ID=$(echo "$QUIZ_RESPONSE" | jq -r '.sessionId')
echo -e "Session ID: $SESSION_ID\n"

# Step 6B: Student - Start quiz with random categories (mixed)
echo -e "${YELLOW}6️⃣ ب) الطالب - بدء اختبار عشوائي من المجموعة (مختلط):${NC}"
echo "POST $API/quiz/start-by-group (بدون categoryId)"
QUIZ_RANDOM=$(curl -s -X POST "$API/quiz/start-by-group" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "محمد علي",
    "groupId": '"$GROUP_ID"'
  }')
echo "$QUIZ_RANDOM" | jq '.'
SESSION_ID_2=$(echo "$QUIZ_RANDOM" | jq -r '.sessionId')
echo -e "Session ID: $SESSION_ID_2\n"

# Step 7: Student - Get quiz questions
echo -e "${YELLOW}7️⃣  الطالب - الحصول على أسئلة الاختبار:${NC}"
echo "GET $API/quiz/$SESSION_ID"
curl -s "$API/quiz/$SESSION_ID" | jq '.'
echo -e "\n"

echo -e "${GREEN}✅ اختبار الـ APIs اكتمل!${NC}\n"
echo -e "${BLUE}المتغيرات المهمة:${NC}"
echo -e "  Group ID: $GROUP_ID"
echo -e "  Category ID: $CATEGORY_ID"
echo -e "  Session ID: $SESSION_ID (محدد)"
echo -e "  Session ID 2: $SESSION_ID_2 (عشوائي)"
