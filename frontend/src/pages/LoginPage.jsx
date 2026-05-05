import React, { useState, useEffect } from 'react';
import { adminLogin, startQuiz, getExamSetsByAllCategories } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [userType, setUserType] = useState('admin'); // 'admin' or 'student'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('type'); // 'type', 'login', or 'selectExamSet'
  const [categoriesWithExamSets, setCategoriesWithExamSets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExamSet, setSelectedExamSet] = useState(null);
  const [loadingExamSets, setLoadingExamSets] = useState(false);

  useEffect(() => {
    if (userType === 'student' && step === 'selectExamSet') {
      fetchCategories();
    }
  }, [userType, step]);

  const fetchCategories = async () => {
    setLoadingExamSets(true);
    try {
      const response = await getExamSetsByAllCategories();
      const categories = response.categoriesWithExamSets || [];
      // Filter out categories with no exam sets
      const filtered = categories.filter(cat => cat.exam_sets && cat.exam_sets.length > 0);
      setCategoriesWithExamSets(filtered);
      if (filtered.length === 0) {
        setError('No exam sets available. Contact admin to create exam sets.');
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load exam sets. Please try again.');
    } finally {
      setLoadingExamSets(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin(username, password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('username', username);
        onLogin({ username, token: response.token }, 'admin');
      } else {
        setError(response.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentQuizStart = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!selectedExamSet && selectedCategory && selectedCategory.exam_sets?.length > 0) {
      setError('Please select an exam set');
      return;
    }

    setLoading(true);
    try {
      const response = await startQuiz(username, selectedExamSet);
      if (response.sessionId) {
        localStorage.setItem('sessionId', response.sessionId);
        localStorage.setItem('userType', 'student');
        localStorage.setItem('username', username);
        onLogin({ username, sessionId: response.sessionId }, 'student');
      } else {
        setError(response.error || 'Failed to start quiz');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    if (userType === 'admin' && !password) {
      setError('Please enter a password');
      return;
    }

    if (userType === 'admin') {
      handleAdminLogin(e);
    } else {
      setStep('selectExamSet');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card">
          {step === 'type' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">[*] Quiz Platform</h1>
                <p className="text-gray-600 mt-2">Login to continue</p>
              </div>

              {/* Tab Selection */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => {
                    setUserType('admin');
                    setUsername('');
                    setPassword('');
                    setError('');
                  }}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                    userType === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  [A] Admin
                </button>
                <button
                  onClick={() => {
                    setUserType('student');
                    setUsername('');
                    setPassword('');
                    setError('');
                  }}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                    userType === 'student'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  [S] Student
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  [!] {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {userType === 'admin' && (
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      className="input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-lg font-semibold text-white transition-all ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : userType === 'admin'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? 'Loading...' : `Login as ${userType === 'admin' ? 'Admin' : 'Student'}`}
                </button>
              </form>

              {/* Demo Credentials */}
              {userType === 'admin' && (
                <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 font-semibold mb-2">[*] Demo Credentials:</p>
                  <p className="text-xs text-gray-600">Username: <span className="font-mono">admin</span></p>
                  <p className="text-xs text-gray-600">Password: <span className="font-mono">password123</span></p>
                </div>
              )}
            </>
          )}

          {step === 'selectExamSet' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">[?] Select Test Group</h1>
                <p className="text-gray-600 mt-2">Welcome, {username}!</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  [!] {error}
                </div>
              )}

              {loadingExamSets ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading test groups...</p>
                </div>
              ) : (
              <div className="space-y-4 mb-6">
                {categoriesWithExamSets.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(selectedCategory?.id === category.id ? null : category);
                        setSelectedExamSet(null);
                      }}
                      className={`w-full p-4 rounded-lg text-left font-semibold transition-all ${
                        selectedCategory?.id === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                      {selectedCategory?.id === category.id && category.exam_sets && (
                        <span className="text-sm ml-2">({category.exam_sets.length} [*] groups)</span>
                      )}
                    </button>

                    {selectedCategory?.id === category.id && category.exam_sets && (
                      <div className="mt-2  space-y-2 ml-4">
                        {category.exam_sets.map((examSet) => (
                          <button
                            key={examSet.id}
                            onClick={() => setSelectedExamSet(examSet.id)}
                            className={`w-full p-3 rounded text-left text-sm transition-all ${
                              selectedExamSet === examSet.id
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            [{examSet.difficulty[0].toUpperCase()}] {examSet.name} ({examSet.questionCount} Q)
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              )}

              <form onSubmit={handleStudentQuizStart}>
                <button
                  type="submit"
                  disabled={loading || !selectedExamSet}
                  className={`w-full py-2 rounded-lg font-semibold text-white transition-all ${
                    loading || !selectedExamSet
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? 'Starting...' : '[OK] Start Quiz'}
                </button>
              </form>

              <button
                onClick={() => {
                  setStep('type');
                  setSelectedCategory(null);
                  setSelectedExamSet(null);
                  setError('');
                }}
                className="w-full mt-3 py-2 rounded-lg font-semibold bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all"
              >
                [-] Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
