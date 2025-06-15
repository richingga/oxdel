import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectIfAuthenticated = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Atau ke '/' jika ingin redirect ke beranda
    }
  }, []);

  return children;
};

export default RedirectIfAuthenticated;
