// 📁 src/App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Cek status login saat pertama kali dimuat
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
      {/* 🏠 Halaman Utama (Pakai Header & Footer) */}
      <Route path="/" element={
        <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
          <HomePage />
        </Layout>
      } />

      {/* 🔐 Halaman Login & Register (Tanpa Header/Footer) */}
      <Route path="/login" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/register" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />

      {/* 👤 Dashboard User */}
      <Route path="/dashboard" element={
        <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
          <DashboardPage onLogout={handleLogout} />
        </Layout>
      } />

      {/* 🔁 Reset Password */}
      <Route path="/reset-password/:token" element={
        <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
          <ResetPasswordPage />
        </Layout>
      } />

      {/* ⚠️ Fallback 404 */}
      <Route path="*" element={
        <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
          <div className="p-10 text-center text-xl text-gray-700">404 — Halaman tidak ditemukan.</div>
        </Layout>
      } />
    </Routes>
  );
};

export default App;
