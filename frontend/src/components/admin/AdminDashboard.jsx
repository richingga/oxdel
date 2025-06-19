import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    templates: 0,
    pages: 0,
    totalViews: 0
  });
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch basic counts
        const [usersRes, templatesRes, pagesRes, userStatsRes] = await Promise.all([
          fetch("/api/users", { 
            headers: { Authorization: "Bearer " + localStorage.getItem("token") } 
          }),
          fetch("/api/templates"),
          fetch("/api/pages/mine", { 
            headers: { Authorization: "Bearer " + localStorage.getItem("token") } 
          }),
          fetch("/api/users/stats", { 
            headers: { Authorization: "Bearer " + localStorage.getItem("token") } 
          })
        ]);

        const [users, templates, pages, userStatsData] = await Promise.all([
          usersRes.ok ? usersRes.json() : { data: [] },
          templatesRes.ok ? templatesRes.json() : { data: [] },
          pagesRes.ok ? pagesRes.json() : { data: [] },
          userStatsRes.ok ? userStatsRes.json() : { data: null }
        ]);

        setStats({
          users: users.data?.length || users.pagination?.totalItems || 0,
          templates: templates.data?.length || 0,
          pages: pages.data?.length || pages.pagination?.totalItems || 0,
          totalViews: pages.data?.reduce((sum, page) => sum + (page.view_count || 0), 0) || 0
        });

        if (userStatsData.data) {
          setUserStats(userStatsData.data);
        }

      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Gagal memuat statistik');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total User" value={stats.users} color="blue" />
        <StatCard title="Total Template" value={stats.templates} color="green" />
        <StatCard title="Total Proyek" value={stats.pages} color="purple" />
        <StatCard title="Total Views" value={stats.totalViews} color="orange" />
      </div>

      {/* User Statistics */}
      {userStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Role Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Distribusi Role User</h3>
            <div className="space-y-3">
              {userStats.roleDistribution?.map((role) => (
                <div key={role.role} className="flex justify-between items-center">
                  <span className="capitalize font-medium">{role.role}</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {role.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Verification */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Status Verifikasi</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Verified Users</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  {userStats.verifiedUsers}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Unverified Users</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                  {userStats.totalUsers - userStats.verifiedUsers}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Registrations Chart */}
      {userStats?.recentRegistrations && userStats.recentRegistrations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Registrasi 30 Hari Terakhir</h3>
          <div className="space-y-2">
            {userStats.recentRegistrations.slice(0, 10).map((day) => (
              <div key={day.date} className="flex justify-between items-center text-sm">
                <span>{new Date(day.date).toLocaleDateString('id-ID')}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {day.registrations} registrasi
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800", 
    purple: "bg-purple-100 text-purple-800",
    orange: "bg-orange-100 text-orange-800"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}