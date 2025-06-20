import React from "react";

export default function AdminSidebar({ section, setSection }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'templates', label: 'Template', icon: '🎨' },
    { id: 'users', label: 'User', icon: '👥' },
    { id: 'affiliates', label: 'Affiliasi', icon: '🤝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'logs', label: 'Log User', icon: '📋' }
  ];

  return (
    <aside className="w-60 bg-white shadow-lg flex flex-col py-8">
      <h2 className="text-2xl font-bold px-8 pb-6 text-blue-600">Oxdel Admin</h2>
      <nav className="flex flex-col gap-2 px-8 flex-grow">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              section === item.id 
                ? "bg-blue-600 text-white font-semibold" 
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
            onClick={() => setSection(item.id)}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="px-8 pt-4 border-t border-gray-200">
        <button 
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          <span className="text-lg">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}