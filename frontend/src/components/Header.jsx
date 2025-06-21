import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// --- ICONS (Inline SVG) ---
const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
);
const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();

    const toggleMenu = () => setMenuOpen((prev) => !prev);
    
    const navLinkClass = "font-semibold text-slate-700 hover:text-blue-600 transition-colors";

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        window.location.href = '/';
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="container mx-auto px-6">
                <nav className="relative flex justify-between items-center bg-white/80 backdrop-blur-md rounded-full border border-slate-200 shadow-lg px-6 py-3">
                    <a href="/" className="text-2xl font-bold text-slate-900">
                        <span className="text-blue-600">Ox</span>del
                    </a>

                    <div className="flex items-center gap-2">
                         {/* --- Desktop Auth Buttons --- */}
                        <div className="hidden sm:flex items-center gap-2">
                            {isAuthenticated ? (
                                <>
                                    <a href="/dashboard" className="px-4 py-2 rounded-full font-semibold text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300">
                                        Dashboard
                                    </a>
                                    {user?.role === 'admin' && (
                                        <a href="/ox-admin" className="px-4 py-2 rounded-full font-semibold text-sm text-purple-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300">
                                            Admin
                                        </a>
                                    )}
                                    <button onClick={handleLogout} className="px-5 py-2.5 rounded-full font-semibold text-sm text-white bg-red-600 hover:bg-red-700 transition-all duration-300">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <a href="/login" className="px-4 py-2 rounded-full font-semibold text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300">Login</a>
                                    <a href="/register" className="px-5 py-2.5 rounded-full font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-400/50 transition-all duration-300 transform hover:-translate-y-0.5">Daftar</a>
                                </>
                            )}
                        </div>
                        
                        {/* --- Mobile Menu Button --- */}
                        <div className="md:hidden">
                            <button onClick={toggleMenu} className="ml-2 text-slate-900 focus:outline-none">
                                {menuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>

                    {/* --- Mobile Menu Dropdown --- */}
                    {menuOpen && (
                         <div className="md:hidden absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
                            <div className="flex flex-col gap-5">
                                {isAuthenticated ? (
                                    <>
                                        <a href="/dashboard" className={navLinkClass} onClick={toggleMenu}>Dashboard</a>
                                        <a href="/template-picker" className={navLinkClass} onClick={toggleMenu}>Template</a>
                                        {user?.role === 'admin' && (
                                            <a href="/ox-admin" className={`${navLinkClass} text-purple-600`} onClick={toggleMenu}>Admin Panel</a>
                                        )}
                                        <hr className="border-t border-slate-200 my-2" />
                                        <button
                                            onClick={handleLogout}
                                            className={`${navLinkClass} text-left text-red-600`}
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <a href="/login" className={`${navLinkClass} sm:hidden`} onClick={toggleMenu}>Login</a>
                                        <a href="/register" className="block sm:hidden w-full text-center px-5 py-3 rounded-full font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-300" onClick={toggleMenu}>Daftar</a>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;