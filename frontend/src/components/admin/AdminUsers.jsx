import React, { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [role, setRole] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = () => {
    fetch("/api/users", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
      .then(r => r.json())
      .then(setUsers);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  function handleEdit(user) {
    setEditUser(user);
    setRole(user.role);
    setShowModal(true);
  }

  async function handleSaveRole() {
    await fetch(`/api/users/${editUser.id}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ role })
    });
    setShowModal(false);
    fetchUsers();
  }

  async function handleDelete(id) {
    if (!window.confirm("Hapus user ini?")) return;
    await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });
    fetchUsers();
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manajemen User</h2>
      <input className="input mb-3" placeholder="Cari user..." value={search} onChange={e => setSearch(e.target.value)} />
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th>Username</th><th>Email</th><th>Role</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="text-blue-600" onClick={() => handleEdit(u)}>Edit Role</button> |{" "}
                <button className="text-red-600" onClick={() => handleDelete(u.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal edit role */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow">
            <h3 className="font-bold mb-3">Edit Role User</h3>
            <select value={role} onChange={e => setRole(e.target.value)} className="input mb-3">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="affiliate">Affiliate</option>
            </select>
            <div className="flex gap-2">
              <button className="btn bg-blue-600 text-white" onClick={handleSaveRole}>Simpan</button>
              <button className="btn bg-gray-300" onClick={() => setShowModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
