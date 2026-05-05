# 🚀 Render.com Deployment Guide

## Prerequisites
- GitHub account with WebProject repository
- Render.com account
- Environment variables ready

## Step-by-Step Deployment

### 1. Create New Web Service on Render

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "Create New" → "Web Service"
4. Select repository: `WebProject`
5. Click "Connect"

### 2. Configure Service

**Basic Settings:**
- Name: `quiz-platform-api` (or your choice)
- Root Directory: `backend`
- Environment: `Node`
- Build Command: `npm install && npm run init-db`
- Start Command: `npm start`
- Plan: Free tier works great for testing

### 3. Add Environment Variables

In the "Environment Variables" section, add:

```
DATABASE_URL=postgresql://postgres.tnhgktfebssssfiplpfg:Ayoub%40100kh@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
DATABASE_SSL=true
JWT_SECRET=2fc4e7f837bea87acf665f93bbf5c3040ac60640d33a01b58b46a82e6477b526
NODE_ENV=production
PORT=3000
```

### 4. Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete (2-3 minutes)
3. Your app URL will be shown (e.g., `https://quiz-platform-api.onrender.com`)

## Verification

Test your deployment:

```bash
# Health check
curl https://your-app-url.onrender.com/health

# Expected response:
{
  "status": "✅ OK",
  "database": "✅ Connected",
  "timestamp": "2026-05-05T10:05:00.000Z",
  "pgVersion": "PostgreSQL 17.6"
}
```

## Testing Endpoints

### 1. Login
```bash
curl -X POST https://your-app-url.onrender.com/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### 2. Get Token from Response
```json
{
  "token": "eyJhbGc...",
  "message": "Login successful"
}
```

### 3. Use Token for Other Requests
```bash
curl https://your-app-url.onrender.com/admin/questions \
  -H "Authorization: Bearer {TOKEN}"
```

## Troubleshooting

### Service won't start
- Check environment variables are set correctly
- Look at "Runtime Logs" for errors
- Ensure DATABASE_URL is correct

### Database connection fails
- Verify DATABASE_URL matches exactly
- Check password encoding (@ → %40)
- Ensure Supabase database is accessible

### Errors in logs
- Database connection issues → check DATABASE_URL
- Port issues → PORT should be 3000
- Module errors → run `npm install` locally first

## Redeploying

To redeploy after code changes:
```bash
git push origin main
```

The service will automatically redeploy when you push to main branch.

## File Structure Deployed

```
backend/
├── app.js
├── config/db.js
├── db/schema.js
├── controllers/
├── services/
├── middleware/
├── routes/
├── utils/
├── scripts/
├── __tests__/
├── package.json
└── README.md
```

## Important Notes

⚠️ **DO NOT commit .env files** - they're in .gitignore

⚠️ **Always set environment variables in Render dashboard**

⚠️ **Default admin credentials are for initial setup only**

⚠️ **Change admin password in production**

## API Documentation

See `backend/README.md` for complete API documentation.

## Support

If you encounter issues:
1. Check Render logs
2. Verify environment variables
3. Test locally first with `npm test`
4. Check database connection with health endpoint

---

**Status:** ✅ Production Ready
**Version:** 1.0.0
