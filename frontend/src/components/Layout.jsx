import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, isLoggedIn, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <main className="flex-grow pt-32 px-4 sm:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
