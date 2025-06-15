import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


// --- ICONS (Inline SVG) ---
const LayoutGridIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
const FolderKanbanIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M8 10v4"/><path d="M12 10v2"/><path d="M16 10v6"/></svg>;
const SettingsIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const LogOutIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const FilePlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" x2="12" y1="18" y2="12"/><line x1="9" x2="15" y1="15" y2="15"/></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const RsvpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-pink-500"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>;
const PanelLeftCloseIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>;
const PanelRightCloseIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 9-3 3 3 3"/></svg>;
const HelpCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-indigo-500"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-500"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const MessageSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-teal-500"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;

// --- PAGE COMPONENTS ---

const DashboardOverview = () => (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard icon={<FolderIcon />} label="Total Proyek" value="4" colorClass="bg-blue-100" />
            <StatCard icon={<UsersIcon />} label="Pengunjung Bulan Ini" value="4.2K" colorClass="bg-green-100" />
            <StatCard icon={<RsvpIcon />} label="Total RSVP" value="215" colorClass="bg-pink-100" />
        </div>
        <ProjectList title="Proyek Terbaru" showFilters={false} />
        <HelpCenter />
    </div>
);

const ProjectList = ({ title = "Semua Proyek", showFilters = true }) => {
    const allProjects = [
        { title: "Pernikahan Rani & Budi", type: "Undangan Digital", status: "Published", visitors: "2.4K" },
        { title: "Landing Page Jasa Fotografi", type: "Landing Page", status: "Published", visitors: "1.8K" },
        { title: "Website Company Profile", type: "Website", status: "Draft", visitors: "0" },
        { title: "Undangan Ulang Tahun Anak", type: "Undangan Digital", status: "Published", visitors: "350" },
        { title: "Webinar Teknologi 2025", type: "Landing Page", status: "Draft", visitors: "0" },
        { title: "Portfolio Desainer Grafis", type: "Website", status: "Published", visitors: "890" },
    ];
    const [filter, setFilter] = useState('Semua');

    const filteredProjects = allProjects.filter(p => {
        if (filter === 'Semua') return true;
        if (filter === 'Website') return p.type === 'Website' || p.type === 'Landing Page';
        if (filter === 'Undangan') return p.type === 'Undangan Digital';
        return true;
    });

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4 md:mb-0">{title}</h2>
                {showFilters && (
                    <div className="flex flex-wrap gap-2">
                        <FilterButton label="Semua" active={filter === 'Semua'} onClick={() => setFilter('Semua')} />
                        <FilterButton label="Website" active={filter === 'Website'} onClick={() => setFilter('Website')} />
                        <FilterButton label="Undangan" active={filter === 'Undangan'} onClick={() => setFilter('Undangan')} />
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProjects.map((project, index) => (
                    <ProjectCard key={index} {...project} />
                ))}
            </div>
        </div>
    );
};

const AccountSettings = () => (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Pengaturan Akun</h2>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" defaultValue="Budi Santoso" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Alamat Email</label>
                <input type="email" defaultValue="budi.santoso@example.com" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-slate-800 mt-8 mb-4">Ubah Kata Sandi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Kata Sandi Baru</label>
                        <input type="password" placeholder="••••••••" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Konfirmasi Kata Sandi</label>
                        <input type="password" placeholder="••••••••" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                </div>
            </div>
            <div className="pt-6 text-right">
                <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-300">
                    Simpan Perubahan
                </button>
            </div>
        </div>
    </div>
);

const HelpCenter = () => (
    <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Pusat Bantuan</h2>
        <p className="text-gray-600 mb-6">Tempat bagi Anda untuk mendapatkan bantuan jika mengalami kesulitan.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HelpCard 
                icon={<HelpCircleIcon />}
                title="FAQ"
                description="Temukan jawaban untuk pertanyaan yang sering diajukan."
                colorClass="bg-indigo-100"
            />
            <HelpCard 
                icon={<BookOpenIcon />}
                title="Tutorial"
                description="Pelajari cara menggunakan fitur-fitur kami melalui panduan."
                colorClass="bg-yellow-100"
            />
            <HelpCard 
                icon={<MessageSquareIcon />}
                title="Hubungi Dukungan"
                description="Terhubung dengan tim kami untuk bantuan lebih lanjut."
                colorClass="bg-teal-100"
            />
        </div>
    </div>
);

const HelpCard = ({ icon, title, description, colorClass }) => (
    <a href="#" className="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4 hover:-translate-y-1 transition-transform duration-300">
        <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
        <div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
        </div>
    </a>
);


const StatCard = ({ icon, label, value, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
        <div>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const ProjectCard = ({ title, type, status, visitors }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
        <div>
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{type}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {status}
                </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{visitors} pengunjung bulan ini</p>
        </div>
        <div className="mt-6 flex space-x-2">
            <button className="w-full py-2 px-4 text-sm font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
            <button className="py-2 px-4 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">Lihat</button>
        </div>
    </div>
);

const FilterButton = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
        {label}
    </button>
);


// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dasbor');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #1e293b; }`;
    document.head.appendChild(style);

    const fonts = document.createElement('link');
    fonts.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap";
    fonts.rel = "stylesheet";
    document.head.appendChild(fonts);
  }, []);

  const renderContent = () => {
      switch(activeTab) {
          case 'dasbor':
              return <DashboardOverview />;
          case 'proyek':
              return <ProjectList />;
          case 'pengaturan':
              return <AccountSettings />;
          default:
              return <DashboardOverview />;
      }
  };
  
  const SidebarContent = () => (
    <>
      <div className="flex-grow pt-32">
          <nav className="space-y-2">
              <SidebarLink icon={<LayoutGridIcon />} label="Dasbor" active={activeTab === 'dasbor'} onClick={() => setActiveTab('dasbor')} />
              <SidebarLink icon={<FolderKanbanIcon />} label="Proyek Saya" active={activeTab === 'proyek'} onClick={() => setActiveTab('proyek')} />
              <SidebarLink icon={<SettingsIcon />} label="Pengaturan" active={activeTab === 'pengaturan'} onClick={() => setActiveTab('pengaturan')} />
          </nav>
      </div>
      <div>
          <SidebarLink icon={<LogOutIcon />} label="Keluar" />
      </div>
    </>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="relative flex">
        {/* --- Tombol Toggle Sidebar (Visible on all screens) --- */}
        <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={`fixed top-1/2 -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow-md border hover:bg-gray-100 transition-all duration-300 ${isSidebarOpen ? 'left-[12rem] md:left-[16rem]' : 'left-4'}`}
            title={isSidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
        >
            {isSidebarOpen ? <PanelLeftCloseIcon className="w-5 h-5 text-gray-600"/> : <PanelRightCloseIcon className="w-5 h-5 text-gray-600"/>}
        </button>
        
        {/* --- Sidebar (Visible on all screens) --- */}
        <aside className={`fixed top-0 left-0 h-full z-20 bg-white shadow-lg flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-48 md:w-64 p-6' : 'w-0 p-0 overflow-hidden'}`}>
            <SidebarContent />
        </aside>

        {/* --- Main Content --- */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-48 md:ml-64' : 'ml-0'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 capitalize">{activeTab}</h1>
                        <p className="text-gray-600 mt-1">Selamat datang kembali, Budi!</p>
                    </div>
                    <button
  onClick={() => navigate("/template-picker")}
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
    </div>
  );
}

const SidebarLink = ({ icon, label, active, onClick }) => (
     <a href="#" onClick={onClick} className={`flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}>
        {React.cloneElement(icon, { className: `w-5 h-5 mr-3` })}
        <span>{label}</span>
    </a>
);
