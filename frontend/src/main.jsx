import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#1e293b'
          },
          success: {
            style: {
              color: '#2563eb',
            },
          },
          error: {
            style: {
              color: '#ef4444',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);