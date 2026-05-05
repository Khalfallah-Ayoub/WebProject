import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import QuizPage from './pages/QuizPage';
import './index.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'admin' or 'student'

  const handleLogin = (userData, type) => {
    setUser(userData);
    setUserType(type);
    if (type === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('quiz');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUserType(null);
    setCurrentPage('login');
    localStorage.removeItem('token');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'admin':
        return <AdminDashboard user={user} onLogout={handleLogout} />;
      case 'quiz':
        return <QuizPage user={user} onLogout={handleLogout} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {renderPage()}
    </div>
  );
}
