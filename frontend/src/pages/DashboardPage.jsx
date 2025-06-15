import React, { useState, useEffect } from 'react';

// --- ICONS (Sebaiknya diletakkan di file terpisah) ---
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
const ArrowLeftIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const SearchIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

// ====================================================================
// START: DashboardPage.jsx LOGIC
// ====================================================================

const DashboardContent = ({ onNewProjectClick }) => (
    <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 capitalize">Dasbor</h1>
                <p className="text-gray-600 mt-1">Selamat datang kembali, Budi!</p>
            </div>
            <button onClick={onNewProjectClick} className="mt-4 md:mt-0 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg hover:shadow-blue-300 transform hover:-translate-y-0.5">
                <FilePlusIcon />
                Buat Proyek Baru
            </button>
        </div>
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
        { title: "Jasa Fotografi", type: "Layanan", status: "Published", visitors: "1.8K" },
        { title: "Profil Perusahaan Tech", type: "Bisnis", status: "Draft", visitors: "0" },
    ];
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md mt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allProjects.map((project, index) => <ProjectCard key={index} {...project} />)}
            </div>
        </div>
    );
};

const HelpCenter = () => (
    <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Pusat Bantuan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HelpCard icon={<HelpCircleIcon />} title="FAQ" description="Temukan jawaban." colorClass="bg-indigo-100" />
            <HelpCard icon={<BookOpenIcon />} title="Tutorial" description="Pelajari cara penggunaan." colorClass="bg-yellow-100" />
            <HelpCard icon={<MessageSquareIcon />} title="Hubungi Dukungan" description="Terhubung dengan tim kami." colorClass="bg-teal-100" />
        </div>
    </div>
);

// ====================================================================
// END: DashboardPage.jsx LOGIC
// ====================================================================


// ====================================================================
// START: TemplatePicker.jsx LOGIC
// ====================================================================

const TemplatePicker = ({ onBack }) => {
  const allTemplates = [
    { category: 'Jasa & Layanan', title: 'Jasa Perbaikan AC', description: 'Butuh jasa cepat? Template ini menonjolkan nomor WhatsApp dan lokasi Anda agar pelanggan mudah menghubungi.', imageUrl: 'https://images.unsplash.com/photo-1542973449-b3a5d896472d?q=80&w=2070&auto=format&fit=crop', tags: ['Layanan Cepat', 'Servis'] },
    { category: 'Jasa & Layanan', title: 'Jasa Laundry Kiloan', description: 'Tampilkan daftar layanan dan testimoni pelanggan untuk membangun kepercayaan bisnis laundry Anda.', imageUrl: 'https://images.unsplash.com/photo-1593113646773-ae18c83a87f2?q=80&w=2070&auto=format&fit=crop', tags: ['Kebersihan', 'Jasa'] },
    { category: 'Undangan Digital', title: 'Undangan Pernikahan Elegan', description: 'Bagikan momen bahagia Anda dengan undangan online yang elegan, lengkap dengan fitur RSVP dan galeri foto.', imageUrl: 'https://images.unsplash.com/photo-1593259037198-c720f0223f1f?q=80&w=2070&auto=format&fit=crop', tags: ['Pernikahan', 'Formal'] },
    { category: 'Undangan Digital', title: 'Undangan Ulang Tahun Anak', description: 'Sempurna untuk merayakan momen spesial anak dengan desain ceria, informatif, dan mudah dibagikan.', imageUrl: 'https://images.unsplash.com/photo-1510418355604-433e555776a3?q=80&w=2070&auto=format&fit=crop', tags: ['Anak', 'Perayaan'] },
    { category: 'Portofolio Pribadi', title: 'Portofolio Fotografer', description: 'Biarkan karya visual Anda yang berbicara. Desain galeri besar untuk menampilkan hasil foto atau video terbaik.', imageUrl: 'https://images.unsplash.com/photo-1621361242318-450b73c49439?q=80&w=2070&auto=format&fit=crop', tags: ['Fotografi', 'Kreatif'] },
    { category: 'Portofolio Pribadi', title: 'Portofolio Desainer', description: 'Desain minimalis untuk menonjolkan setiap detail karya seni atau proyek desain Anda.', imageUrl: 'https://images.unsplash.com/photo-1611117775531-502d9396f0c9?q=80&w=2070&auto=format&fit=crop', tags: ['Desain', 'Seni'] },
    { category: 'Bisnis & UMKM', title: 'Toko Makanan & Minuman', description: 'Buat pelanggan lapar mata dengan foto produk yang menggugah selera dan tombol pesan yang mudah ditemukan.', imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop', tags: ['Kuliner', 'Toko Online'] },
    { category: 'Bisnis & UMKM', title: 'Katalog Produk Fashion', description: 'Tampilkan koleksi fashion Anda dengan gaya. Mudah untuk menampilkan produk, detail, dan harga.', imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop', tags: ['Fashion', 'UMKM'] },
    { category: 'Kursus & Edukasi', title: 'Kursus Online', description: 'Jelaskan manfaat kursus Anda, tampilkan kurikulum, dan mudahkan pendaftaran dengan formulir yang simpel.', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop', tags: ['Edukasi', 'Online'] },
    { category: 'Kursus & Edukasi', title: 'Bimbingan Belajar', description: 'Bangun kredibilitas dengan menampilkan profil pengajar ahli dan jadwal kelas yang jelas.', imageUrl: 'https://images.unsplash.com/photo-1588695955629-9e17c4918f67?q=80&w=2070&auto=format&fit=crop', tags: ['Mentoring', 'Pendidikan'] },
  ];
  
  const categories = ['Semua', ...new Set(allTemplates.map(t => t.category))];
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = allTemplates
    .filter(template => activeCategory === 'Semua' || template.category === activeCategory)
    .filter(template => 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="w-full animate-fade-in">
        <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Pilih Template</h1>
                        <p className="text-gray-600 mt-1">Pilih desain awal untuk memulai proyek baru Anda.</p>
                    </div>
                </div>
                 <div className="relative w-full md:w-72">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari template..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

             <div className="mt-8 flex flex-wrap gap-2">
                {categories.map(category => (
                    <FilterButton 
                        key={category} 
                        label={category} 
                        active={activeCategory === category}
                        onClick={() => setActiveCategory(category)}
                    />
                ))}
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTemplates.length > 0 ? (
                 filteredTemplates.map(template => (
                    <TemplateCard key={template.title} {...template} />
                ))
            ) : (
                <p className="text-gray-500 col-span-full text-center py-10">Template tidak ditemukan. Coba kata kunci lain.</p>
            )}
        </div>
    </div>
  );
};

// ====================================================================
// END: TemplatePicker.jsx LOGIC
// ====================================================================


// --- REUSABLE COMPONENTS ---
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
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{status}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{visitors} pengunjung</p>
        </div>
        <div className="mt-6 flex space-x-2">
            <button className="w-full py-2 px-4 text-sm font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">Edit</button>
            <button className="py-2 px-4 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Lihat</button>
        </div>
    </div>
);

const FilterButton = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
        {label}
    </button>
);

const TemplateCard = ({ title, description, imageUrl, tags }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 relative">
    <div className="w-full h-48 bg-gray-200">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/e2e8f0/475569?text=Preview'; }}/>
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 h-10">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
        Pilih Template
      </button>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #1e293b; } .animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
    document.head.appendChild(style);
    const fonts = document.createElement('link');
    fonts.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    fonts.rel = "stylesheet";
    document.head.appendChild(fonts);
  }, []);
  
  const renderContent = () => {
      switch(activeView) {
          case 'dashboard':
              return <DashboardContent onNewProjectClick={() => setActiveView('templates')} />;
          case 'projects':
              return <ProjectList />;
          case 'settings':
              return <AccountSettings />;
          case 'templates':
              return <TemplatePicker onBack={() => setActiveView('dashboard')} />;
          default:
              return <DashboardContent onNewProjectClick={() => setActiveView('templates')} />;
      }
  };
  
  const SidebarContent = () => (
    <>
      <div className="flex-grow pt-32">
          <nav className="space-y-2">
              <SidebarLink icon={<LayoutGridIcon />} label="Dasbor" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
              <SidebarLink icon={<FolderKanbanIcon />} label="Proyek Saya" active={activeView === 'projects'} onClick={() => setActiveView('projects')} />
              <SidebarLink icon={<SettingsIcon />} label="Pengaturan" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
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
        <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className={`fixed top-1/2 -translate-y-1/2 z-30 bg-white p-2 rounded-full shadow-md border hover:bg-gray-100 transition-all duration-300 ${isSidebarOpen ? 'left-[12rem] md:left-[16rem]' : 'left-4'}`}
            title={isSidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
        >
            {isSidebarOpen ? <PanelLeftCloseIcon className="w-5 h-5 text-gray-600"/> : <PanelRightCloseIcon className="w-5 h-5 text-gray-600"/>}
        </button>
        
        <aside className={`fixed top-0 left-0 h-full z-20 bg-white shadow-lg flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-48 md:w-64 p-6' : 'w-0 p-0 overflow-hidden'}`}>
            <SidebarContent />
        </aside>

        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-48 md:ml-64' : 'ml-0'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
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
