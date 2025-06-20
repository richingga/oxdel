import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminTemplates from "../components/admin/AdminTemplates";
import AdminUsers from "../components/admin/AdminUsers";
import AdminAffiliates from "../components/admin/AdminAffiliates";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import AdminUserLogs from "../components/admin/AdminUserLogs";

export default function AdminPage() {
  const [section, setSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("/api/auth/me", {
          headers: { Authorization: "Bearer " + token }
        });

        if (!response.ok) {
          navigate("/login");
          return;
        }

        const user = await response.json();
        if (!user.role || user.role !== "admin") {
          navigate("/");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking admin access:', error);
        navigate("/login");
      }
    };

    checkAdminAccess();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (section) {
      case "dashboard":
        return <AdminDashboard />;
      case "templates":
        return <AdminTemplates />;
      case "users":
        return <AdminUsers />;
      case "affiliates":
        return <AdminAffiliates />;
      case "analytics":
        return <AdminAnalytics />;
      case "logs":
        return <AdminUserLogs />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar section={section} setSection={setSection} />
      <div className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}