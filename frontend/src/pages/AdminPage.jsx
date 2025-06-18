import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminTemplates from "../components/admin/AdminTemplates";
import AdminUsers from "../components/admin/AdminUsers";
import AdminAffiliates from "../components/admin/AdminAffiliates";
import AdminUserLogs from "../components/admin/AdminUserLogs";

export default function AdminPage() {
  const [section, setSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/auth/me", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(res => res.json())
      .then(user => {
        if (!user.role || user.role !== "admin") {
          navigate("/login");
        } else {
          setLoading(false);
        }
      });
  }, [navigate]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar section={section} setSection={setSection} />
      <div className="flex-1 p-8">
        {section === "dashboard" && <AdminDashboard />}
        {section === "templates" && <AdminTemplates />}
        {section === "users" && <AdminUsers />}
        {section === "affiliates" && <AdminAffiliates />}
        {section === "logs" && <AdminUserLogs />}
      </div>
    </div>
  );
}
