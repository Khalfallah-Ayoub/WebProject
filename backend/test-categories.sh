#!/bin/bash

# 🧪 Category Management API Testing Script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="password"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     Category Management API Testing${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Step 1: Admin Login
echo -e "${YELLOW}[1] Logging in as admin...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$ADMIN_USERNAME\",\"password\":\"$ADMIN_PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed!${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Login successful!${NC}"
echo -e "Token: ${TOKEN:0:20}...\n"

# Step 2: Get all categories
echo -e "${YELLOW}[2] Getting all categories...${NC}"
curl -s -X GET "$API_URL/admin/categories" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 3: Create a new category
echo -e "${YELLOW}[3] Creating new category: JavaScript...${NC}"
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/admin/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"JavaScript"}')

CATEGORY_ID=$(echo "$CREATE_RESPONSE" | jq '.category.id')
echo "$CREATE_RESPONSE" | jq '.'
echo ""

# Step 4: Get category by ID
echo -e "${YELLOW}[4] Getting category by ID: $CATEGORY_ID...${NC}"
curl -s -X GET "$API_URL/admin/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 5: Update category
echo -e "${YELLOW}[5] Updating category name to: TypeScript...${NC}"
curl -s -X PUT "$API_URL/admin/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"TypeScript"}' | jq '.'
echo ""

# Step 6: Create another category
echo -e "${YELLOW}[6] Creating another category: Python...${NC}"
curl -s -X POST "$API_URL/admin/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Python"}' | jq '.'
echo ""

# Step 7: Get all categories again
echo -e "${YELLOW}[7] Getting all categories again...${NC}"
curl -s -X GET "$API_URL/admin/categories" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Step 8: Delete category
echo -e "${YELLOW}[8] Deleting category ID: $CATEGORY_ID...${NC}"
curl -s -X DELETE "$API_URL/admin/categories/$CATEGORY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Testing completed! ✅${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
