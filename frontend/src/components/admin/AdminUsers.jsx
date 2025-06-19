import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({});

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);

      const response = await fetch(`/api/users?${params}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });

      if (!response.ok) {
        throw new Error('Gagal memuat data users');
      }

      const data = await response.json();
      setUsers(data.data || []);
      setPagination(data.pagination || {});
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const handleEdit = (user) => {
    setEditUser(user);
    setNewRole(user.role);
    setShowModal(true);
  };

  const handleSaveRole = async () => {
    if (!editUser || !newRole) return;

    try {
      const response = await fetch(`/api/users/${editUser.id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal update role');
      }

      toast.success('Role berhasil diupdate');
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Yakin ingin menghapus user "${user.username}"?`)) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Gagal menghapus user');
      }

      toast.success('User berhasil dihapus');
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'affiliate': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Manajemen User</h2>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari User</label>
            <input 
              type="text"
              placeholder="Cari username atau email..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Role</label>
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="affiliate">Affiliate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terdaftar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.is_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex gap-2">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900" 
                            onClick={() => handleEdit(user)}
                          >
                            Edit Role
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900" 
                            onClick={() => handleDelete(user)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Menampilkan {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} dari {pagination.totalItems} user
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchUsers(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                      {pagination.currentPage}
                    </span>
                    <button
                      onClick={() => fetchUsers(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

            {users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada user ditemukan.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Role Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Edit Role User</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">User: <strong>{editUser?.username}</strong></p>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select 
                value={newRole} 
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="affiliate">Affiliate</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" 
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
                onClick={handleSaveRole}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}