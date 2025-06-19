import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import TemplatePicker from './pages/TemplatePicker';
import TemplateBuilder from './components/TemplateBuilder';
import AdminPage from "./pages/AdminPage";
import PublicPageView from './components/PublicPageView';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token is still valid
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <HelmetProvider>
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
        
        <Route path="/template-picker" element={
          <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
            <TemplatePicker />
          </Layout>
        } />

        {/* Builder Routes */}
        <Route path="/builder/template/:templateId" element={
          <TemplateBuilder />
        } />
        
        <Route path="/builder/page/:pageId" element={
          <TemplateBuilder />
        } />

        {/* Admin Route */}
        <Route path="/ox-admin" element={<AdminPage />} />

        {/* Public Page View */}
        <Route path="/:slug" element={<PublicPageView />} />

        {/* 404 Route */}
        <Route path="*" element={
          <Layout isLoggedIn={isLoggedIn} onLogout={handleLogout}>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
                <a 
                  href="/"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Kembali ke Beranda
                </a>
              </div>
            </div>
          </Layout>
        } />
      </Routes>
    </HelmetProvider>
  );
};

export default App;