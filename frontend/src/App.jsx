import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import TemplatePicker from './pages/TemplatePicker';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={
        <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
          <HomePage />
        </Layout>
      } />
      <Route path="/login" element={
        <RedirectIfAuthenticated>
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        </RedirectIfAuthenticated>
      } />
      <Route path="/register" element={
        <RedirectIfAuthenticated>
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        </RedirectIfAuthenticated>
      } />
      <Route path="/reset-password/:token" element={
        <RedirectIfAuthenticated>
          <ResetPasswordPage />
        </RedirectIfAuthenticated>
      } />
      <Route path="/dashboard" element={
        <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
          <DashboardPage onLogout={handleLogout} />
        </Layout>
      } />
      <Route path="*" element={
        <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
          <div className="p-10 text-center text-xl text-gray-700">404 — Halaman tidak ditemukan.</div>
        </Layout>
      } />
    </Routes>
  );
};

export default App;
