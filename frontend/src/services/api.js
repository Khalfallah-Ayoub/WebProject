const API_URL = 'https://webproject-x7ch.onrender.com';

// Admin APIs
export const adminLogin = async (username, password) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const getCategories = async (token) => {
  const response = await fetch(`${API_URL}/admin/categories`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const createCategory = async (token, name) => {
  const response = await fetch(`${API_URL}/admin/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  return response.json();
};

export const updateCategory = async (token, id, name) => {
  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  return response.json();
};

export const deleteCategory = async (token, id) => {
  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const getAdminQuestions = async (token) => {
  const response = await fetch(`${API_URL}/admin/questions`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const createQuestion = async (token, questionData) => {
  const response = await fetch(`${API_URL}/admin/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(questionData),
  });
  return response.json();
};

export const updateQuestion = async (token, id, questionData) => {
  const response = await fetch(`${API_URL}/admin/questions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(questionData),
  });
  return response.json();
};

export const deleteQuestion = async (token, id) => {
  const response = await fetch(`${API_URL}/admin/questions/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

export const getAdminResults = async (token) => {
  const response = await fetch(`${API_URL}/admin/results`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return response.json();
};

// Exam Sets APIs
export const getExamSetsByAllCategories = async () => {
  const response = await fetch(`${API_URL}/admin/exam-sets`);
  return response.json();
};

// Quiz APIs
export const startQuiz = async (username, examSetId = null) => {
  const response = await fetch(`${API_URL}/quiz/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, examSetId }),
  });
  return response.json();
};

export const getQuizQuestions = async (sessionId) => {
  const response = await fetch(`${API_URL}/quiz/${sessionId}`);
  return response.json();
};

export const submitAnswer = async (sessionId, questionId, answerIds) => {
  const response = await fetch(`${API_URL}/quiz/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, questionId, answerIds }),
  });
  return response.json();
};

export const submitQuiz = async (sessionId) => {
  const response = await fetch(`${API_URL}/quiz/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  return response.json();
};
