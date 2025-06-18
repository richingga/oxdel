import React, { useEffect, useState } from "react";

export default function AdminUserLogs() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    fetch("/api/user-logs", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(r => r.json())
      .then(setLogs);
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Log Aktivitas User</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th>User</th><th>Aksi</th><th>Waktu</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.username}</td>
              <td>{log.action}</td>
              <td>{log.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
