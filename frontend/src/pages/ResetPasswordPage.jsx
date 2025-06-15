import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Reset Password | Oxdel';
  }, []);

  // ✅ Cek validitas token saat halaman dimuat
  useEffect(() => {
    const cekToken = async () => {
      try {
        const res = await axios.get(`/api/auth/check-reset-token/${token}`);
        if (!res.data.valid) {
          toast.error(res.data.message || 'Token tidak valid.');
          navigate('/login');
        }
      } catch (err) {
        toast.error('Token tidak valid atau kadaluarsa.');
        navigate('/login');
      }
    };
    cekToken();
  }, [token, navigate]);

  // ✅ Cek kekuatan password berdasarkan regex backend
  useEffect(() => {
    const checkStrength = () => {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      const isLongEnough = password.length >= 8;

      const valid = hasLetter && hasNumber && hasSymbol && isLongEnough;

      const isWeakPattern = /123|abc|password|qwerty|111|000/.test(password.toLowerCase());

      if (!password) {
        setPasswordStrength('');
      } else if (!valid) {
        setPasswordStrength('Lemah');
      } else if (isWeakPattern) {
        setPasswordStrength('Sedang');
      } else {
        setPasswordStrength('Kuat');
      }
    };

    checkStrength();
  }, [password]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Password tidak cocok.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`/api/auth/resetpassword/${token}`, { password });
      toast.success(res.data.message || 'Berhasil reset password!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-br from-purple-200 to-blue-200">
      <div className="auth-container shadow-xl" id="container">
        <div className="form-container sign-in-container">
          <form onSubmit={handleReset} className="form bg-white rounded-lg shadow-md relative">
            <h1 className="form-title font-serif">Reset Password</h1>
            <span className="form-subtitle">Masukkan password baru Anda</span>

            {/* Input Password Baru */}
            <div className="w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password Baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full max-w-[350px] px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm"
              />
            </div>

            {/* Input Konfirmasi Password */}
            <div className="w-full mt-2 relative flex flex-col items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full max-w-[350px] px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm"
              />

              {/* Icon Mata Absolute - bawah kiri kolom konfirmasi */}
              <i
                className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} 
                  absolute left-[17px] top-[65px] text-xs text-gray-600 cursor-pointer`}
                onClick={() => setShowPassword(!showPassword)}
              />

              {/* Kekuatan Password */}
              {password && (
                <p
                  className={`text-[11px] mt-1 text-center w-full max-w-[350px] pl-1 ${
                    passwordStrength === 'Kuat'
                      ? 'text-green-600'
                      : passwordStrength === 'Sedang'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  Kekuatan: {passwordStrength}
                </p>
              )}
            </div>

            <button type="submit" className="form-button mt-4" disabled={loading}>
              {loading ? 'Memproses...' : 'Reset Password'}
            </button>

            <button
              type="button"
              className="forgot-password-button mt-4"
              onClick={() => navigate('/login')}
            >
              Kembali ke Login
            </button>
          </form>
        </div>

        {/* Panel Kanan */}
        <div className="overlay-container">
          <div className="overlay bg-blue-500">
            <div className="overlay-panel overlay-right text-center items-center justify-center">
              <h1 className="form-title font-serif text-white">Siap Menyambut Awal Baru?</h1>
              <p className="overlay-text text-white">
                Privasi Anda aman. Kami tidak akan pernah menyimpan password Anda secara langsung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
