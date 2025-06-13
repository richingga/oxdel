import React, { useState, useEffect, useCallback } from 'react';
import CreatePageModal from '../components/CreatePageModal';

const StatusBadge = ({ status }) => {
    const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
    if (status === 'published') return <span className={`${baseClasses} text-green-800 bg-green-100`}>Published</span>;
    if (status === 'draft') return <span className={`${baseClasses} text-yellow-800 bg-yellow-100`}>Draft</span>;
    return <span className={`${baseClasses} text-gray-800 bg-gray-100`}>{status}</span>;
};

const DashboardPage = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      onLogout();
      return;
    }
    
    try {
      const [profileRes, pagesRes] = await Promise.all([
          fetch('/api/users/profile', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/pages/mine', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!profileRes.ok || !pagesRes.ok) {
        throw new Error('Gagal memuat data dashboard. Sesi Anda mungkin telah berakhir.');
      }

      const profileData = await profileRes.json();
      const pagesData = await pagesRes.json();
      
      setUser(profileData);
      setPages(pagesData);

    } catch (err) {
      setError(err.message);
      onLogout(); // Logout jika terjadi error
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageCreated = () => {
    setIsModalOpen(false);
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-100">Memuat dashboard...</div>;
  }
  
  return (
    <>
      <CreatePageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPageCreated={handlePageCreated}
      />
      <div className="min-h-screen bg-slate-100">
          <header className="bg-white shadow-sm">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
              <a href="/" className="text-2xl font-bold text-slate-900">
                  <span className="text-blue-600">Ox</span>del
              </a>
              <button 
                  onClick={onLogout} 
                  className="px-5 py-2.5 rounded-full font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                  Keluar
              </button>
            </nav>
          </header>
          <main className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Selamat Datang, {user ? user.username : 'Pengguna'}!
                    </h1>
                    <p className="text-slate-600 mt-1">Kelola semua halaman website dan undangan Anda dari sini.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all transform hover:-translate-y-0.5 self-start md:self-center">
                    + Buat Halaman Baru
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Halaman</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pages.length > 0 ? (
                            pages.map(page => (
                                <tr key={page.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{page.title}</div>
                                        <div className="text-xs text-gray-500">/{page.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="capitalize text-sm text-gray-700">{page.template_type}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={page.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(page.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">Lihat</a>
                                        <a href="#" className="text-blue-600 hover:text-blue-900">Edit</a>
                                        <button className="text-red-600 hover:text-red-900">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500">
                                    Anda belum memiliki halaman. <button onClick={() => setIsModalOpen(true)} className="text-blue-600 font-semibold">Buat yang pertama!</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </main>
      </div>
    </>
  );
};

export default DashboardPage;
