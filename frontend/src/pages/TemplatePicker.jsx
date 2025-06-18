import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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

const EyeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const FilterButton = ({ label, active, onClick, count }) => (
  <button onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${active
      ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
    {label}
    {count !== undefined && (
      <span className={`text-xs px-2 py-1 rounded-full ${active ? 'bg-blue-500' : 'bg-gray-300'}`}>
        {count}
      </span>
    )}
  </button>
);

const TemplateCard = ({ template, onSelect, onPreview }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition duration-300 relative">
    <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
      <img
        src={template.thumbnail_url || template.preview_url || "https://placehold.co/600x400/e2e8f0/475569?text=Preview"}
        alt={template.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = 'https://placehold.co/600x400/e2e8f0/475569?text=Preview'; 
        }}
      />
      {template.is_premium && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Premium
        </div>
      )}
      {template.featured && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Featured
        </div>
      )}
    </div>
    
    <div className="p-5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{template.name}</h3>
        {template.rating > 0 && (
          <div className="flex items-center text-yellow-500 text-sm">
            <span>★</span>
            <span className="ml-1">{template.rating}</span>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {template.description || `Template ${template.category} yang modern dan responsif`}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
          {template.category}
        </span>
        <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
          {template.type}
        </span>
        {template.downloads > 0 && (
          <span className="text-xs font-semibold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full">
            {template.downloads} downloads
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onPreview(template)}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <EyeIcon className="w-4 h-4" />
          Preview
        </button>
        <button
          onClick={() => onSelect(template)}
          className="flex-1 py-2 px-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Pilih Template
        </button>
      </div>
    </div>
  </div>
);

const PreviewModal = ({ template, isOpen, onClose }) => {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.category} • {template.type}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <iframe
            src={`/api/templates/${template.id}/preview`}
            className="w-full h-96 border rounded-lg"
            title={`Preview ${template.name}`}
          />
        </div>
        
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              // Trigger select template
              window.location.href = `/builder/template/${template.id}`;
            }}
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Gunakan Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TemplatePicker() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch templates dan categories secara parallel
        const [templatesRes, categoriesRes] = await Promise.all([
          fetch("/api/templates"),
          fetch("/api/templates/categories")
        ]);

        if (!templatesRes.ok || !categoriesRes.ok) {
          throw new Error('Gagal memuat data template');
        }

        const templatesData = await templatesRes.json();
        const categoriesData = await categoriesRes.json();
        
        setTemplates(templatesData.data || []);
        setCategories(['Semua', ...(categoriesData.data || [])]);
        
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Gagal memuat template. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter templates berdasarkan kategori & pencarian
  const filteredTemplates = templates
    .filter(t => activeCategory === 'Semua' || t.category === activeCategory)
    .filter(t =>
      (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Hitung jumlah template per kategori
  const getCategoryCount = (category) => {
    if (category === 'Semua') return templates.length;
    return templates.filter(t => t.category === category).length;
  };

  const handleSelectTemplate = (template) => {
    // Navigate to builder with template
    navigate(`/builder/template/${template.id}`);
  };

  const handlePreviewTemplate = (template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  if (loading) {
    return (
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-500">Memuat template...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pilih Template</h1>
            <p className="text-gray-600 mt-1">
              Pilih desain awal untuk memulai proyek baru Anda. Total {templates.length} template tersedia.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari template (nama, kategori, deskripsi...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <FilterButton 
                key={category} 
                label={category} 
                active={activeCategory === category} 
                onClick={() => setActiveCategory(category)}
                count={getCategoryCount(category)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleSelectTemplate}
              onPreview={handlePreviewTemplate}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Template tidak ditemukan</h3>
            <p className="text-gray-500 mb-4">
              Coba ubah kata kunci pencarian atau pilih kategori lain.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('Semua');
              }}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        template={previewTemplate}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
}