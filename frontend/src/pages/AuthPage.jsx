import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [panel, setPanel] = useState('signIn');
  const [emailForVerify, setEmailForVerify] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePanelChange = (newPanel) => {
    setError('');
    setSuccess('');
    setPanel(newPanel);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('/api/auth/register', {
        username: name,
        email,
        password,
      });
      setEmailForVerify(email);
      setSuccess(response.data.message);
      setPanel('verify');
      toast.success('Registrasi berhasil! Silakan verifikasi email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mendaftar.');
      toast.error('Registrasi gagal!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/verify', {
        email: emailForVerify,
        otp,
      });
      setSuccess(response.data.message);
      setPanel('signIn');
      toast.success('Verifikasi berhasil!');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal verifikasi.');
      toast.error('Verifikasi gagal!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      
      // Use AuthContext login method
      login(response.data, response.data.token);
      
      toast.success('Login berhasil!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal login.');
      toast.error('Login gagal!');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setSuccess(res.data.message || 'Link reset telah dikirim ke email.');
      toast.success('Link reset telah dikirim ke email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim link reset.');
      toast.error('Gagal mengirim link reset!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-20 px-4">
      <div className={`auth-container ${panel !== 'signIn' ? 'right-panel-active' : ''}`} id="container">
        {/* LOGIN */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin} className="form">
            <h1 className="form-title font-serif">Selamat Datang!</h1>
            <span className="form-subtitle">Masuk dengan akun Anda</span>

            <div className="form-input-group w-full max-w-[350px]">
              <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                />
                <i
                  className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} absolute left-[20px] bottom-[-25px] text-sm text-gray-600 cursor-pointer`}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              <div className="w-full text-right px-2">
                <button type="button" className="forgot-password-button" onClick={() => handlePanelChange('forgot')}>
                  Lupa password?
                </button>
              </div>
            </div>

            <button type="submit" className="form-button" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
            {error && <p className="form-message error">{error}</p>}
            <p className="mobile-switch">
              Belum punya akun?{' '}
              <button type="button" onClick={() => handlePanelChange('signUp')} className="font-semibold text-blue-600">
                Daftar
              </button>
            </p>
          </form>
        </div>

        {/* DAFTAR */}
        <div className="form-container sign-up-container">
          {panel === 'verify' ? (
            <div className="form">
              <h1 className="form-title font-serif">Verifikasi Email</h1>
              <span className="form-subtitle">
                Kami telah mengirim kode OTP ke <br /> <strong>{emailForVerify}</strong>
              </span>
              <form onSubmit={handleVerify} className="w-full px-8 flex flex-col items-center">
                <input
                  type="text"
                  placeholder="OTP"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-48 text-center tracking-[8px] text-lg"
                />
                <button type="submit" className="form-button" disabled={loading}>
                  {loading ? 'Memverifikasi...' : 'Verifikasi'}
                </button>
                {error && <p className="form-message error">{error}</p>}
                <button type="button" onClick={() => handlePanelChange('signIn')} className="forgot-password-button mt-4">
                  Kembali ke Login
                </button>
              </form>
            </div>
          ) : panel === 'forgot' ? (
            <form onSubmit={handleForgotPassword} className="form">
              <h1 className="form-title font-serif">Reset Password</h1>
              <span className="form-subtitle">Masukkan email Anda untuk menerima link reset</span>
              <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className="form-button" disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
              </button>
              <button type="button" className="forgot-password-button mt-4" onClick={() => handlePanelChange('signIn')}>
                Kembali ke Login
              </button>
              {error && <p className="form-message error">{error}</p>}
              {success && <p className="form-message success">{success}</p>}
            </form>
          ) : (
            <form onSubmit={handleRegister} className="form">
              <h1 className="form-title font-serif">Buat Akun</h1>
              <span className="form-subtitle">Masukkan detail Anda di bawah ini</span>

              <div className="form-input-group w-full max-w-[350px]">
                <input type="text" placeholder="Username" onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <div className="relative w-full">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <i
                    className={`fa ${showRegisterPassword ? 'fa-eye-slash' : 'fa-eye'} absolute left-[20px] bottom-[-25px] text-sm text-gray-600 cursor-pointer`}
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  />
                </div>
              </div>

              <button type="submit" className="form-button" disabled={loading}>
                {loading ? 'Memproses...' : 'Daftar'}
              </button>
              {error && <p className="form-message error">{error}</p>}
              <p className="mobile-switch">
                Sudah punya akun?{' '}
                <button type="button" onClick={() => handlePanelChange('signIn')} className="font-semibold text-blue-600">
                  Masuk
                </button>
              </p>
            </form>
          )}
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="form-title font-serif">Sudah Punya Akun?</h1>
              <p className="overlay-text">Masuk sekarang untuk melanjutkan dan mengelola semua kreasi Anda di satu tempat.</p>
              <button className="form-button ghost-button" onClick={() => handlePanelChange('signIn')}>
                Masuk
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="form-title font-serif">Pengguna Baru?</h1>
              <p className="overlay-text">Daftar sekarang dan mulailah perjalanan digital anda dalam hitungan menit!</p>
              <button className="form-button ghost-button" onClick={() => handlePanelChange('signUp')}>
                Daftar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;