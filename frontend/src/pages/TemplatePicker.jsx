import React, { useState } from 'react';

// --- ICONS (You might need to move these to a shared file later) ---
const ArrowLeftIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const SearchIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

// --- REUSABLE COMPONENTS (Specific to this page) ---
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

// --- MAIN TEMPLATE PICKER COMPONENT ---
export default function TemplatePicker({ onBack }) {
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
}

