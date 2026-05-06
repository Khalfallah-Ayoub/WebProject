import React, { useState, useEffect } from 'react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAdminResults,
  getAdminGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from '../services/api';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('groups'); // 'groups', 'categories', 'questions' or 'results'
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Group form states
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
  });

  // Question form states
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    categoryId: '',
    groupId: '',
    title: '',
    type: 'SCQ',
    answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: true }],
  });

  // Results filter states
  const [resultsFilter, setResultsFilter] = useState({
    username: '',
    minPercentage: '',
    maxPercentage: '',
  });

  // Questions filter states
  const [questionsFilter, setQuestionsFilter] = useState({
    title: '',
    categoryId: '',
    type: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'groups') {
      fetchGroups();
    } else if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'questions') {
      fetchQuestions();
    } else {
      fetchResults();
    }
  }, [activeTab]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories(token);
      setCategories(response.categories || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await getAdminQuestions(token);
      setQuestions(response.questions || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await getAdminResults(token);
      setResults(response.results || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await getAdminGroups(token);
      setGroups(response.groups || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError('Category name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await createCategory(token, newCategory);
      if (response.category) {
        setCategories([...categories, response.category]);
        setNewCategory('');
        setSuccess('Category created successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Failed to create category');
      }
    } catch (err) {
      setError('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await updateCategory(token, id, editCategoryName);
      if (response.category) {
        setCategories(
          categories.map((cat) => (cat.id === id ? response.category : cat))
        );
        setEditingCategoryId(null);
        setEditCategoryName('');
        setSuccess('Category updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Failed to update category');
      }
    } catch (err) {
      setError('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await deleteCategory(token, id);
      if (response.deleted) {
        setCategories(categories.filter((cat) => cat.id !== id));
        setSuccess('Category deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Failed to delete category');
      }
    } catch (err) {
      setError('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  // Group handlers
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupForm.name.trim()) {
      setError('Group name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await createGroup(token, groupForm.name, groupForm.description);
      if (response.group) {
        setGroups([...groups, response.group]);
        setGroupForm({ name: '', description: '' });
        setSuccess('Group created successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Failed to create group');
      }
    } catch (err) {
      setError('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGroup = async (id) => {
    if (!groupForm.name.trim()) {
      setError('Group name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await updateGroup(token, id, groupForm.name, groupForm.description);
      if (response.group) {
        setGroups(
          groups.map((grp) => (grp.id === id ? response.group : grp))
        );
        setEditingGroupId(null);
        setGroupForm({ name: '', description: '' });
        setSuccess('Group updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Failed to update group');
      }
    } catch (err) {
      setError('Failed to update group');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (id) => {
    if (!window.confirm('Are you sure you want to delete this group?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await deleteGroup(token, id);
      if (response.deleted) {
        setGroups(groups.filter((grp) => grp.id !== id));
        setSuccess('Group deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Failed to delete group');
      }
    } catch (err) {
      setError('Failed to delete group');
    } finally {
      setLoading(false);
    }
  };

  // Question handlers
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.categoryId || !questionForm.title) {
      setError('Category and title are required');
      return;
    }

    if (!questionForm.answers.every(a => a.text.trim())) {
      setError('All answer texts are required');
      return;
    }

    const hasCorrect = questionForm.answers.some(a => a.isCorrect);
    if (!hasCorrect) {
      setError('At least one correct answer is required');
      return;
    }

    setLoading(true);
    try {
      let response;
      const questionData = {
        categoryId: parseInt(questionForm.categoryId),
        groupId: questionForm.groupId ? parseInt(questionForm.groupId) : null,
        title: questionForm.title,
        type: questionForm.type,
        answers: questionForm.answers,
      };

      if (editingQuestionId) {
        response = await updateQuestion(token, editingQuestionId, questionData);
      } else {
        response = await createQuestion(token, questionData);
      }

      if (response.question) {
        if (editingQuestionId) {
          setQuestions(questions.map(q => q.id === editingQuestionId ? { ...response.question, answers: response.answers } : q));
          setSuccess('Question updated successfully!');
        } else {
          setQuestions([...questions, { ...response.question, answers: response.answers }]);
          setSuccess('Question created successfully!');
        }
        setQuestionForm({ categoryId: '', groupId: '', title: '', type: 'SCQ', answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: true }] });
        setEditingQuestionId(null);
        setShowQuestionForm(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Failed to save question');
      }
    } catch (err) {
      setError('Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.id);
    setQuestionForm({
      categoryId: question.categoryId,
      groupId: question.groupId || '',
      title: question.title,
      type: question.type,
      answers: question.answers || [{ text: '', isCorrect: false }],
    });
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await deleteQuestion(token, id);
      if (response.deleted) {
        setQuestions(questions.filter(q => q.id !== id));
        setSuccess('Question deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error || 'Failed to delete question');
      }
    } catch (err) {
      setError('Failed to delete question');
    } finally {
      setLoading(false);
    }
  };

  // Filter results based on client-side filters
  const getFilteredResults = () => {
    return results.filter(result => {
      const usernameMatch = result.username.toLowerCase().includes(resultsFilter.username.toLowerCase());
      const minMatch = resultsFilter.minPercentage === '' || result.percentage >= parseInt(resultsFilter.minPercentage);
      const maxMatch = resultsFilter.maxPercentage === '' || result.percentage <= parseInt(resultsFilter.maxPercentage);
      return usernameMatch && minMatch && maxMatch;
    });
  };

  // Filter questions based on client-side filters
  const getFilteredQuestions = () => {
    return questions.filter(question => {
      const titleMatch = question.title.toLowerCase().includes(questionsFilter.title.toLowerCase());
      const categoryMatch = questionsFilter.categoryId === '' || question.categoryId.toString() === questionsFilter.categoryId;
      const typeMatch = questionsFilter.type === '' || question.type === questionsFilter.type;
      return titleMatch && categoryMatch && typeMatch;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">[=] Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {user.username}!</p>
          </div>
          <button
            onClick={onLogout}
            className="btn-outline"
          >
            [L] Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'groups'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            [G] Groups
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            [C] Categories
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'questions'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            [Q] Questions
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'results'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            [R] Results
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            [!] {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            [OK] {success}
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            {/* Create Group Form */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">[+] Add New Group</h2>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Group Name</label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="e.g., لغات البرمجة"
                    value={groupForm.name}
                    onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Group description"
                    value={groupForm.description}
                    onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Adding...' : 'Add Group'}
                </button>
              </form>
            </div>

            {/* Groups List */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">[*] Groups</h2>
              {loading && !groups.length ? (
                <p className="text-gray-600">Loading...</p>
              ) : groups.length === 0 ? (
                <p className="text-gray-600">No groups yet. Create one above!</p>
              ) : (
                <div className="space-y-3">
                  {groups.map((group) => (
                    <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {editingGroupId === group.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                className="input w-full"
                                value={groupForm.name}
                                onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                              />
                              <input
                                type="text"
                                className="input w-full"
                                value={groupForm.description}
                                onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="font-semibold text-gray-800 text-lg">{group.name}</h3>
                              {group.description && <p className="text-gray-600 mt-1">{group.description}</p>}
                              <p className="text-sm text-gray-500 mt-1">Questions: {group.question_count || 0}</p>
                            </>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {editingGroupId === group.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateGroup(group.id)}
                                className="text-green-600 hover:text-green-800 font-semibold"
                              >
                                [S] Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingGroupId(null);
                                  setGroupForm({ name: '', description: '' });
                                }}
                                className="text-gray-600 hover:text-gray-800 font-semibold"
                              >
                                [-] Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingGroupId(group.id);
                                  setGroupForm({ name: group.name, description: group.description || '' });
                                }}
                                className="text-blue-600 hover:text-blue-800 font-semibold"
                              >
                                [E] Edit
                              </button>
                              <button
                                onClick={() => handleDeleteGroup(group.id)}
                                className="text-red-600 hover:text-red-800 font-semibold"
                              >
                                [X] Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Create Category Form */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">[+] Add New Category</h2>
              <form onSubmit={handleCreateCategory} className="flex gap-3">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </form>
            </div>

            {/* Categories List */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">[*] Categories</h2>
              {loading && !categories.length ? (
                <p className="text-gray-600">Loading...</p>
              ) : categories.length === 0 ? (
                <p className="text-gray-600">No categories yet. Create one above!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">ID</th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">Name</th>
                        <th className="px-4 py-2 text-right text-gray-700 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">{category.id}</td>
                          <td className="px-4 py-3">
                            {editingCategoryId === category.id ? (
                              <input
                                type="text"
                                className="input"
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                              />
                            ) : (
                              <span className="text-gray-700">{category.name}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            {editingCategoryId === category.id ? (
                              <>
                                <button
                                  onClick={() => handleUpdateCategory(category.id)}
                                  className="text-green-600 hover:text-green-800 font-semibold"
                                >
                                  [S] Save
                                </button>
                                <button
                                  onClick={() => setEditingCategoryId(null)}
                                  className="text-gray-600 hover:text-gray-800 font-semibold"
                                >
                                  [-] Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingCategoryId(category.id);
                                    setEditCategoryName(category.name);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                  [E] Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="text-red-600 hover:text-red-800 font-semibold"
                                >
                                  [X] Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Filter Section */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">[F] Filter Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Question Title</label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Search by title..."
                    value={questionsFilter.title}
                    onChange={(e) => setQuestionsFilter({ ...questionsFilter, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <select
                    className="input w-full"
                    value={questionsFilter.categoryId}
                    onChange={(e) => setQuestionsFilter({ ...questionsFilter, categoryId: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Type</label>
                  <select
                    className="input w-full"
                    value={questionsFilter.type}
                    onChange={(e) => setQuestionsFilter({ ...questionsFilter, type: e.target.value })}
                  >
                    <option value="">All Types</option>
                    <option value="SCQ">SCQ (Single Choice)</option>
                    <option value="MCQ">MCQ (Multiple Choice)</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setQuestionsFilter({ title: '', categoryId: '', type: '' })}
                className="mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm"
              >
                [C] Clear Filters
              </button>
            </div>

            {/* Create/Edit Question Form */}
            {(!showQuestionForm && !editingQuestionId) && (
              <div className="card">
                <button
                  onClick={() => setShowQuestionForm(true)}
                  className="btn-primary"
                >
                  [+] Add New Question
                </button>
              </div>
            )}

            {showQuestionForm && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {editingQuestionId ? '[E] Edit Question' : '[+] Add New Question'}
                </h2>
                <form onSubmit={handleSubmitQuestion} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                    <select
                      className="input w-full"
                      value={questionForm.categoryId}
                      onChange={(e) => setQuestionForm({ ...questionForm, categoryId: e.target.value })}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Group (Optional)</label>
                    <select
                      className="input w-full"
                      value={questionForm.groupId}
                      onChange={(e) => setQuestionForm({ ...questionForm, groupId: e.target.value })}
                    >
                      <option value="">No Group (Generic Question)</option>
                      {groups.map(grp => (
                        <option key={grp.id} value={grp.id}>{grp.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Select a group to associate this question with a specific group</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Question</label>
                    <input
                      type="text"
                      className="input w-full"
                      placeholder="Enter question title"
                      value={questionForm.title}
                      onChange={(e) => setQuestionForm({ ...questionForm, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Type</label>
                    <select
                      className="input w-full"
                      value={questionForm.type}
                      onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value })}
                    >
                      <option value="SCQ">SCQ (Single Choice)</option>
                      <option value="MCQ">MCQ (Multiple Choice)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Answers</label>
                    <div className="space-y-2">
                      {questionForm.answers.map((answer, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            className="input flex-1"
                            placeholder={`Answer ${idx + 1}`}
                            value={answer.text}
                            onChange={(e) => {
                              const newAnswers = [...questionForm.answers];
                              newAnswers[idx].text = e.target.value;
                              setQuestionForm({ ...questionForm, answers: newAnswers });
                            }}
                          />
                          <label className="flex items-center gap-2 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={answer.isCorrect}
                              onChange={(e) => {
                                const newAnswers = [...questionForm.answers];
                                newAnswers[idx].isCorrect = e.target.checked;
                                setQuestionForm({ ...questionForm, answers: newAnswers });
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Correct</span>
                          </label>
                          {questionForm.answers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newAnswers = questionForm.answers.filter((_, i) => i !== idx);
                                setQuestionForm({ ...questionForm, answers: newAnswers });
                              }}
                              className="text-red-600 hover:text-red-800 font-semibold"
                            >
                              [X]
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQuestionForm({
                          ...questionForm,
                          answers: [...questionForm.answers, { text: '', isCorrect: false }],
                        });
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      [+] Add Answer
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? 'Saving...' : editingQuestionId ? '[S] Save' : '[+] Create'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuestionForm(false);
                        setEditingQuestionId(null);
                        setQuestionForm({ categoryId: '', groupId: '', title: '', type: 'SCQ', answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: true }] });
                      }}
                      className="btn-outline"
                    >
                      [-] Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Questions List */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">[*] Questions ({getFilteredQuestions().length})</h2>
              {loading && !questions.length ? (
                <p className="text-gray-600">Loading...</p>
              ) : getFilteredQuestions().length === 0 ? (
                <p className="text-gray-600">
                  {questions.length === 0 ? 'No questions yet. Create one above!' : 'No questions match the selected filters.'}
                </p>
              ) : (
                <div className="space-y-4">
                  {getFilteredQuestions().map((question) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{question.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-semibold">Type:</span> {question.type} | <span className="font-semibold">Category:</span> {question.categoryId} {question.groupId && `| Group: ${question.groupId}`}
                          </p>
                          {question.answers && question.answers.length > 0 && (
                            <div className="mt-2 text-sm">
                              <span className="font-semibold">Answers:</span>
                              <ul className="mt-1 ml-4">
                                {question.answers.map((answer, idx) => (
                                  <li key={idx} className={answer.isCorrect ? 'text-green-700 font-semibold' : 'text-gray-600'}>
                                    {answer.text} {answer.isCorrect ? '[Correct]' : ''}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            [E] Edit
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            [X] Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Filter Section */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">[F] Filter Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Username</label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Search by username..."
                    value={resultsFilter.username}
                    onChange={(e) => setResultsFilter({ ...resultsFilter, username: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Min Percentage</label>
                  <input
                    type="number"
                    className="input w-full"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={resultsFilter.minPercentage}
                    onChange={(e) => setResultsFilter({ ...resultsFilter, minPercentage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Max Percentage</label>
                  <input
                    type="number"
                    className="input w-full"
                    placeholder="100"
                    min="0"
                    max="100"
                    value={resultsFilter.maxPercentage}
                    onChange={(e) => setResultsFilter({ ...resultsFilter, maxPercentage: e.target.value })}
                  />
                </div>
              </div>
              <button
                onClick={() => setResultsFilter({ username: '', minPercentage: '', maxPercentage: '' })}
                className="mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm"
              >
                [C] Clear Filters
              </button>
            </div>

            {/* Results Table */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">[R] Quiz Results</h2>
              {loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : getFilteredResults().length === 0 ? (
                <p className="text-gray-600">
                  {results.length === 0 ? 'No quiz results yet.' : 'No results match the selected filters.'}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">Username</th>
                        <th className="px-4 py-2 text-center text-gray-700 font-semibold">Score</th>
                        <th className="px-4 py-2 text-center text-gray-700 font-semibold">Percentage</th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredResults().map((result, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-700">{result.username}</td>
                          <td className="px-4 py-3 text-center text-gray-700">
                            {result.score}/{result.total_questions}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              result.percentage >= 80
                                ? 'bg-green-100 text-green-800'
                                : result.percentage >= 60
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {result.percentage}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-sm">
                            {new Date(result.finished_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
