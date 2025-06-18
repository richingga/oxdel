import React from "react";
export default function AdminSidebar({ section, setSection }) {
  return (
    <aside className="w-60 bg-white shadow-lg flex flex-col py-8">
      <h2 className="text-2xl font-bold px-8 pb-6">Oxdel Admin</h2>
      <nav className="flex flex-col gap-2 px-8">
        <button className={section === "dashboard" ? "font-bold text-blue-700" : ""}
                onClick={() => setSection("dashboard")}>Dashboard</button>
        <button className={section === "templates" ? "font-bold text-blue-700" : ""}
                onClick={() => setSection("templates")}>Template</button>
        <button className={section === "users" ? "font-bold text-blue-700" : ""}
                onClick={() => setSection("users")}>User</button>
        <button className={section === "affiliates" ? "font-bold text-blue-700" : ""}
                onClick={() => setSection("affiliates")}>Affiliasi</button>
        <button className={section === "logs" ? "font-bold text-blue-700" : ""}
                onClick={() => setSection("logs")}>Log User</button>
        <button className="mt-8 text-red-600 text-left"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}>Logout</button>
      </nav>
    </aside>
  );
}
