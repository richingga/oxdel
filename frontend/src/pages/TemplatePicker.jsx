import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ICONS ---
const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterButton = ({ label, active, onClick }) => (
  <button onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${active
      ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
    {label}
  </button>
);

const TemplateCard = ({ title, description, preview_url, thumbnail_url, tags }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition duration-300 relative">
    <div className="w-full h-48 bg-gray-200">
      <img
        src={preview_url || thumbnail_url || "https://placehold.co/600x400/e2e8f0/475569?text=Preview"}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/e2e8f0/475569?text=Preview'; }}
      />
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 h-10">{description}</p>
      <div className="flex flex-wrap gap-2">
        {(tags || []).map(tag => (
          <span key={tag}
            className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
            {tag}
          </span>
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

export default function TemplatePicker() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch("/api/templates")
      .then(r => r.json())
      .then(data => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Ambil list kategori unik dari hasil fetch
  const categories = ['Semua', ...Array.from(new Set(templates.map(t => t.category)))];

  // Helper untuk parsing slot jadi tags
  const parseTags = (tpl) => {
    if (tpl.slots) return tpl.slots.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  // Filter berdasarkan kategori & pencarian
  const filteredTemplates = templates
    .filter(t => activeCategory === 'Semua' || t.category === activeCategory)
    .filter(t =>
      (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      parseTags(t).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  if (loading) {
    return <div className="flex justify-center items-center h-40 text-lg text-gray-500">Memuat template...</div>;
  }

  return (
    <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pilih Template</h1>
            <p className="text-gray-600 mt-1">Pilih desain awal untuk memulai proyek baru Anda.</p>
          </div>
        </div>
      </div>
      <div className="mb-8 space-y-4">
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari template (misal: pernikahan, jasa, dll)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <FilterButton key={category} label={category} active={activeCategory === category} onClick={() => setActiveCategory(category)} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              title={template.name}
              description={template.category}
              preview_url={template.preview_url}
              thumbnail_url={template.thumbnail_url}
              tags={parseTags(template)}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">Template tidak ditemukan. Coba kata kunci lain.</p>
        )}
      </div>
    </div>
  );
}
