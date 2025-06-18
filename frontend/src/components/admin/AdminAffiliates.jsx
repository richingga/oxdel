import React, { useEffect, useState } from "react";

export default function AdminAffiliates() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("/api/users", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    }).then(r => r.json()).then(all => {
      setUsers(all.filter(u => u.role === "affiliate"));
    });
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manajemen Affiliasi/Reseller</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th>Username</th><th>Email</th><th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Tambahkan statistik referral dsb jika backend sudah support */}
    </div>
  );
}
