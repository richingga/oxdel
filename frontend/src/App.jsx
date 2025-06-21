import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import ProtectedRoute from './components/ProtectedRoute';
import TemplatePicker from './pages/TemplatePicker';
import TemplateBuilder from './components/TemplateBuilder';
import AdminPage from "./pages/AdminPage";
import PublicPageView from './components/PublicPageView';

const App = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />
          
          <Route path="/login" element={
            <RedirectIfAuthenticated>
              <AuthPage />
            </RedirectIfAuthenticated>
          } />
          
          <Route path="/register" element={
            <RedirectIfAuthenticated>
              <AuthPage />
            </RedirectIfAuthenticated>
          } />
          
          <Route path="/reset-password/:token" element={
            <RedirectIfAuthenticated>
              <ResetPasswordPage />
            </RedirectIfAuthenticated>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/template-picker" element={
            <ProtectedRoute>
              <Layout>
                <TemplatePicker />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Builder Routes */}
          <Route path="/builder/template/:templateId" element={
            <ProtectedRoute>
              <TemplateBuilder />
            </ProtectedRoute>
          } />
          
          <Route path="/builder/page/:pageId" element={
            <ProtectedRoute>
              <TemplateBuilder />
            </ProtectedRoute>
          } />

          {/* Admin Route */}
          <Route path="/ox-admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          } />

          {/* Public Page View */}
          <Route path="/:slug" element={<PublicPageView />} />

          {/* 404 Route */}
          <Route path="*" element={
            <Layout>
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
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;