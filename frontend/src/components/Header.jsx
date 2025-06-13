// 📁 src/components/Header.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Komponen Header Final yang dinamis
// Menggabungkan desain visual dengan logika login/logout.
const Header = ({ isLoggedIn, onLogout }) => {
    const location = useLocation();

    // Jangan tampilkan header di halaman login/daftar
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    if (isAuthPage) return null;

    // Fungsi untuk menentukan apakah sebuah link aktif
    const isActive = (path) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center bg-white/30 backdrop-blur-md rounded-full border border-white/40 shadow-lg">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-slate-900">
                    <span className="text-blue-600">Ox</span>del
                </Link>
                
                {/* Menu Navigasi (menggunakan Link dari React Router) */}
                <div className="hidden md:flex items-center space-x-2 bg-slate-100/50 p-1 rounded-full">
                    <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Buat Website</Link>
                    <Link to="/undangan" className={`nav-link ${isActive('/undangan') ? 'active' : ''}`}>Undangan Digital</Link>
                </div>

                {/* Tombol Aksi Dinamis */}
                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <>
                            <Link to="/dashboard" className="hidden sm:block text-slate-700 hover:text-blue-600 font-semibold text-sm transition-colors">Dashboard</Link>
                            <button 
                                onClick={onLogout} 
                                className="px-5 py-2.5 rounded-full font-semibold text-sm text-white bg-slate-600 hover:bg-slate-700 shadow-lg transition-all duration-300"
                            >
                                Keluar
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hidden sm:block text-slate-700 hover:text-blue-600 font-semibold text-sm transition-colors">Login</Link>
                            <Link to="/login" className="px-5 py-2.5 rounded-full font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-400/50 transition-all duration-300 transform hover:-translate-y-0.5">
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;

// --- Catatan untuk Implementasi ---
/*
1. Simpan kode ini sebagai file 'Header.jsx' di dalam folder 'frontend/src/components/'.
2. Pastikan file 'frontend/src/index.css' Anda berisi gaya berikut untuk menu:

   .nav-link {
       @apply px-4 py-2 rounded-full font-semibold text-sm text-slate-700 hover:bg-white hover:text-blue-600 transition-all duration-300;
   }
   .nav-link.active {
       @apply bg-white text-blue-600;
   }

3. Gunakan komponen Header ini di dalam komponen Layout atau App utama Anda.
   Contoh di App.jsx:
   
   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import Header from './components/Header';
   
   function App() {
       const [isLoggedIn, setIsLoggedIn] = useState(false);
       // ... logika login/logout ...

       return (
           <Router>
                <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                <Routes>
                    // ... definisi rute Anda ...
                </Routes>
           </Router>
       );
   }
*/
