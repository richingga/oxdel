import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, templates: 0, pages: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/users", { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then(r => r.json()),
      fetch("/api/templates").then(r => r.json()),
      fetch("/api/pages/mine", { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then(r => r.json())
    ]).then(([users, templates, pages]) => {
      setStats({
        users: users.length,
        templates: templates.length,
        pages: pages.length
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      <div className="flex gap-8">
        <StatCard title="Total User" value={stats.users} />
        <StatCard title="Total Template" value={stats.templates} />
        <StatCard title="Total Undangan" value={stats.pages} />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="p-8 bg-white rounded-lg shadow w-48 text-center">
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-gray-500">{title}</div>
    </div>
  );
}
