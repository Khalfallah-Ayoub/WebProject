# WebProject

## Backend setup
1. `cd backend`
2. Copy `.env.example` to `.env` and update `DATABASE_URL` and `JWT_SECRET`.
   - For Supabase direct Postgres, use the provided connection string and keep `DATABASE_SSL=true`.
3. Initialize the database: `npm run init-db`
4. Create an admin user: `npm run create-admin -- <username> <password>`
5. Start the API: `npm start`

## Tests
Run `npm test` after setting `DATABASE_URL` and `JWT_SECRET`. The tests insert and remove temporary data.

## API endpoints
**Admin**
- `POST /admin/login`
- `POST /admin/questions`
- `PUT /admin/questions/:id`
- `DELETE /admin/questions/:id`
- `GET /admin/results`

**User**
- `POST /quiz/start`
- `GET /quiz/:sessionId`
- `POST /quiz/answer`
- `POST /quiz/submit`
