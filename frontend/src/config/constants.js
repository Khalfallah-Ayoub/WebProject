// API Configuration
export const API_CONFIG = {
  // Production URL
  baseURL: 'https://webproject-x7ch.onrender.com',

  // Development URL (uncomment for local testing)
  // baseURL: 'http://localhost:3000',

  timeout: 10000, // 10 seconds
};

export const ENDPOINTS = {
  // Admin
  admin: {
    login: '/admin/login',
    categories: '/admin/categories',
    questions: '/admin/questions',
    results: '/admin/results',
  },

  // Quiz
  quiz: {
    start: '/quiz/start',
    get: '/quiz/:sessionId',
    answer: '/quiz/answer',
    submit: '/quiz/submit',
  },

  // Health
  health: '/health',
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};
