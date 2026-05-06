import React, { useState, useEffect } from 'react';
import { adminLogin, getQuizGroups, getCategoriesByGroup, startQuizByGroup } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [userType, setUserType] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('type'); // 'type', 'login', 'selectGroup', 'selectCategory'
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingGroups, setLoadingGroups] = useState(false);

  useEffect(() => {
    if (userType === 'student' && step === 'selectGroup') {
      fetchGroups();
    }
  }, [userType, step]);

  useEffect(() => {
    if (selectedGroup && step === 'selectCategory') {
      fetchCategories(selectedGroup.id);
    }
  }, [selectedGroup, step]);

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const response = await getQuizGroups();
      setGroups(response.groups || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch groups:', err);
      setError('Failed to load groups. Please try again.');
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchCategories = async (groupId) => {
    setLoadingGroups(true);
    try {
      const response = await getCategoriesByGroup(groupId);
      setCategories(response.categories || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoadingGroups(false);
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

    if (!selectedGroup) {
      setError('Please select a group');
      return;
    }

    setLoading(true);
    try {
      const categoryId = selectedCategory ? selectedCategory.id : null;
      const response = await startQuizByGroup(username, selectedGroup.id, categoryId);
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
      setStep('selectGroup');
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

          {step === 'selectGroup' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">[📚] Select Group</h1>
                <p className="text-gray-600 mt-2">Welcome, {username}!</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  [!] {error}
                </div>
              )}

              {loadingGroups ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading groups...</p>
                </div>
              ) : groups.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No groups available. Please contact admin.</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => {
                        setSelectedGroup(group);
                        setSelectedCategory(null);
                        setStep('selectCategory');
                      }}
                      className={`w-full p-4 rounded-lg text-left font-semibold transition-all ${
                        selectedGroup?.id === group.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{group.name}</span>
                        <span className="text-sm opacity-75">{group.question_count} Q</span>
                      </div>
                      {group.description && (
                        <div className="text-sm opacity-75 mt-1">{group.description}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  setStep('type');
                  setSelectedGroup(null);
                  setError('');
                }}
                className="w-full py-2 rounded-lg font-semibold bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all"
              >
                [-] Back
              </button>
            </>
          )}

          {step === 'selectCategory' && selectedGroup && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">[📖] Select Category</h1>
                <p className="text-gray-600 mt-2">{selectedGroup.name}</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  [!] {error}
                </div>
              )}

              {loadingGroups ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No categories available in this group.</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {/* Random/Mixed Option */}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full p-4 rounded-lg text-left font-semibold transition-all ${
                      selectedCategory === null
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>🎲 Random/Mixed</span>
                      <span className="text-sm opacity-75">All categories</span>
                    </div>
                  </button>

                  {/* Categories */}
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full p-4 rounded-lg text-left font-semibold transition-all ${
                        selectedCategory?.id === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm opacity-75">{category.question_count} Q</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleStudentQuizStart}>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-lg font-semibold text-white transition-all mb-3 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {loading ? 'Starting...' : '[OK] Start Quiz'}
                </button>
              </form>

              <button
                onClick={() => {
                  setStep('selectGroup');
                  setSelectedCategory(null);
                  setError('');
                }}
                className="w-full py-2 rounded-lg font-semibold bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all"
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
