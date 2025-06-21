import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePageModal from '../components/CreatePageModal';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// --- ICONS (Inline SVG) ---
const LayoutGridIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
const FolderKanbanIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M8 10v4"/><path d="M12 10v2"/><path d="M16 10v6"/></svg>;
const SettingsIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const LogOutIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const FilePlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const PanelLeftCloseIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>;
const PanelRightCloseIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 9-3 3 3 3"/></svg>;

// --- PAGE COMPONENTS ---

const DashboardOverview = ({ stats, recentPages }) => (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard icon={<FolderIcon />} label="Total Proyek" value={stats.totalPages || 0} colorClass="bg-blue-100" />
            <StatCard icon={<UsersIcon />} label="Total Views" value={stats.totalViews || 0} colorClass="bg-green-100" />
            <StatCard icon={<FolderIcon />} label="Published" value={stats.publishedPages || 0} colorClass="bg-purple-100" />
        </div>
        <ProjectList title="Proyek Terbaru" pages={recentPages} showFilters={false} />
    </div>
);

const ProjectList = ({ title = "Semua Proyek", pages = [], showFilters = true, onEdit, onDelete, onView }) => {
    const [filter, setFilter] = useState('Semua');
    const [loading, setLoading] = useState(false);

    const filteredPages = pages.filter(p => {
        if (filter === 'Semua') return true;
        if (filter === 'Published') return p.status === 'published';
        if (filter === 'Draft') return p.status === 'draft';
        return true;
    });

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 md:mb-0">{title}</h2>
                {showFilters && (
                    <div className="flex flex-wrap gap-2">
                        <FilterButton label="Semua" active={filter === 'Semua'} onClick={() => setFilter('Semua')} />
                        <FilterButton label="Published" active={filter === 'Published'} onClick={() => setFilter('Published')} />
                        <FilterButton label="Draft" active={filter === 'Draft'} onClick={() => setFilter('Draft')} />
                    </div>
                )}
            </div>
            
            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredPages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPages.map((page) => (
                        <ProjectCard 
                            key={page.id} 
                            page={page} 
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onView={onView}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <FolderIcon />
                    <h3 className="text-lg font-semibold text-gray-600 mt-4 mb-2">Belum ada proyek</h3>
                    <p className="text-gray-500 mb-4">Mulai dengan membuat proyek pertama Anda</p>
                </div>
            )}
        </div>
    );
};

const AccountSettings = ({ user, onUpdateProfile }) => {
    const { logout } = useAuth();
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            toast.error('Password baru tidak cocok');
            return;
        }

        setLoading(true);
        try {
            const updateData = {
                username: formData.username,
                email: formData.email
            };

            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Gagal update profil');
            }

            toast.success('Profil berhasil diupdate');
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            
            if (onUpdateProfile) onUpdateProfile();
            
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Pengaturan Akun</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            value={formData.username}
                            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Ubah Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                            <input 
                                type="password" 
                                value={formData.currentPassword}
                                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Kosongkan jika tidak ingin ubah password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                            <input 
                                type="password" 
                                value={formData.newPassword}
                                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Minimal 8 karakter"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                            <input 
                                type="password" 
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ulangi password baru"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="px-6 py-2 text-red-600 hover:text-red-800 font-semibold"
                    >
                        Logout
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-300 disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const StatCard = ({ icon, label, value, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
        <div>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const ProjectCard = ({ page, onEdit, onDelete, onView }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700';
            case 'draft': return 'bg-yellow-100 text-yellow-700';
            case 'archived': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
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
        <div className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(page.status)}`}>
                    {page.status}
                </span>
                <span className="text-xs text-gray-500">{formatDate(page.created_at)}</span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{page.title}</h3>
            
            <div className="mb-3">
                <p className="text-sm text-gray-600">Template: {page.template_name}</p>
                <p className="text-sm text-gray-500">{page.view_count || 0} views</p>
            </div>

            <div className="flex gap-2">
                {page.status === 'published' && (
                    <button 
                        onClick={() => onView && onView(page)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 px-3 text-sm font-semibold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <EyeIcon />
                        Lihat
                    </button>
                )}
                <button 
                    onClick={() => onEdit && onEdit(page)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-3 text-sm font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <EditIcon />
                    Edit
                </button>
                <button 
                    onClick={() => onDelete && onDelete(page)}
                    className="py-2 px-3 text-sm font-semibold bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

const FilterButton = ({ label, active, onClick }) => (
    <button 
        onClick={onClick} 
        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
    >
        {label}
    </button>
);

// --- MAIN DASHBOARD COMPONENT ---
export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('dasbor');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [stats, setStats] = useState({});
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const navigate = useNavigate();
    const { user, logout, checkAuthStatus } = useAuth();

    // Fetch dashboard stats
    const fetchStats = async () => {
        try {
            const response = await fetch('/api/pages/mine?limit=100', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }
            
            const data = await response.json();
            const allPages = data.data || [];
            
            setStats({
                totalPages: allPages.length,
                publishedPages: allPages.filter(p => p.status === 'published').length,
                totalViews: allPages.reduce((sum, p) => sum + (p.view_count || 0), 0)
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Fetch user pages
    const fetchPages = async () => {
        try {
            const response = await fetch('/api/pages/mine', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch pages');
            }
            
            const data = await response.json();
            setPages(data.data || []);
        } catch (error) {
            console.error('Error fetching pages:', error);
            toast.error('Gagal memuat data proyek');
        }
    };

    // Load all data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchStats(),
                fetchPages()
            ]);
            setLoading(false);
        };

        loadData();
    }, []);

    // Handle page actions
    const handleEditPage = (page) => {
        navigate(`/builder/page/${page.id}`);
    };

    const handleViewPage = (page) => {
        if (page.status === 'published') {
            window.open(`/${page.slug}`, '_blank');
        }
    };

    const handleDeletePage = async (page) => {
        if (!window.confirm(`Yakin ingin menghapus "${page.title}"?`)) return;

        try {
            const response = await fetch(`/api/pages/${page.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Gagal menghapus halaman');
            }

            toast.success('Halaman berhasil dihapus');
            fetchPages(); // Refresh data
            fetchStats(); // Update stats
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleCreatePageSuccess = () => {
        setShowCreateModal(false);
        fetchPages();
        fetchStats();
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        switch(activeTab) {
            case 'dasbor':
                return (
                    <DashboardOverview 
                        stats={stats} 
                        recentPages={pages.slice(0, 6)} 
                    />
                );
            case 'proyek':
                return (
                    <ProjectList 
                        pages={pages}
                        onEdit={handleEditPage}
                        onDelete={handleDeletePage}
                        onView={handleViewPage}
                    />
                );
            case 'pengaturan':
                return (
                    <AccountSettings 
                        user={user} 
                        onUpdateProfile={checkAuthStatus}
                    />
                );
            default:
                return <DashboardOverview stats={stats} recentPages={pages.slice(0, 6)} />;
        }
    };
    
    const SidebarContent = () => (
        <>
            <div className="flex-grow pt-32">
                <nav className="space-y-2">
                    <SidebarLink 
                        icon={<LayoutGridIcon />} 
                        label="Dashboard" 
                        active={activeTab === 'dasbor'} 
                        onClick={() => setActiveTab('dasbor')} 
                    />
                    <SidebarLink 
                        icon={<FolderKanbanIcon />} 
                        label="Proyek Saya" 
                        active={activeTab === 'proyek'} 
                        onClick={() => setActiveTab('proyek')} 
                    />
                    <SidebarLink 
                        icon={<SettingsIcon />} 
                        label="Pengaturan" 
                        active={activeTab === 'pengaturan'} 
                        onClick={() => setActiveTab('pengaturan')} 
                    />
                </nav>
            </div>
            <div>
                <SidebarLink 
                    icon={<LogOutIcon />} 
                    label="Keluar" 
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                />
            </div>
        </>
    );

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="relative flex">
                {/* Toggle Sidebar Button */}
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className={`fixed top-1/2 -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow-md border hover:bg-gray-100 transition-all duration-300 ${
                        isSidebarOpen ? 'left-[12rem] md:left-[16rem]' : 'left-4'
                    }`}
                    title={isSidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
                >
                    {isSidebarOpen ? 
                        <PanelLeftCloseIcon className="w-5 h-5 text-gray-600"/> : 
                        <PanelRightCloseIcon className="w-5 h-5 text-gray-600"/>
                    }
                </button>
                
                {/* Sidebar */}
                <aside className={`fixed top-0 left-0 h-full z-20 bg-white shadow-lg flex flex-col transition-all duration-300 ${
                    isSidebarOpen ? 'w-48 md:w-64 p-6' : 'w-0 p-0 overflow-hidden'
                }`}>
                    <SidebarContent />
                </aside>

                {/* Main Content */}
                <main className={`flex-1 transition-all duration-300 ${
                    isSidebarOpen ? 'ml-48 md:ml-64' : 'ml-0'
                }`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 capitalize">{activeTab}</h1>
                                <p className="text-gray-600 mt-1">
                                    Selamat datang kembali, {user?.username || 'User'}!
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="mt-4 md:mt-0 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-300 transform hover:-translate-y-0.5"
                            >
                                <FilePlusIcon />
                                Buat Proyek Baru
                            </button>
                        </div>
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* Create Page Modal */}
            <CreatePageModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onPageCreated={handleCreatePageSuccess}
            />
        </div>
    );
}

const SidebarLink = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick} 
        className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
            active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
        }`}
    >
        {React.cloneElement(icon, { className: `w-5 h-5 mr-3` })}
        <span>{label}</span>
    </button>
);