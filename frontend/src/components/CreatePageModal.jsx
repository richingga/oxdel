import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CreatePageModal = ({ isOpen, onClose, onPageCreated }) => {
  const [templates, setTemplates] = useState([]);
  const [title, setTitle] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch templates when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchTemplates = async () => {
        try {
          setTemplatesLoading(true);
          const response = await fetch('/api/templates');
          if (!response.ok) {
            throw new Error('Gagal memuat template.');
          }
          const data = await response.json();
          setTemplates(data.data || []);
          
          // Auto-select first template if available
          if (data.data && data.data.length > 0) {
            setTemplateId(data.data[0].id);
          }
        } catch (err) {
          setError(err.message);
          toast.error('Gagal memuat template');
        } finally {
          setTemplatesLoading(false);
        }
      };
      fetchTemplates();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setTemplateId('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
        setLoading(false);
        return;
    }

    try {
        const response = await fetch('/api/pages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                title: title.trim(), 
                template_id: parseInt(templateId),
                status: 'draft',
                visibility: 'public'
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Gagal membuat halaman.');
        }

        toast.success('Halaman berhasil dibuat!');
        onPageCreated(data.data); // Pass the created page data
        
    } catch (err) {
        setError(err.message);
        toast.error(err.message);
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg m-4 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Buat Proyek Baru</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Judul Proyek <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Undangan Pernikahan Budi & Citra"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Template <span className="text-red-500">*</span>
            </label>
            
            {templatesLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : templates.length > 0 ? (
              <select
                id="template"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              >
                <option value="">Pilih template...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.category} - {template.type})
                    {template.is_premium ? ' - Premium' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>Tidak ada template tersedia.</p>
                <p className="text-sm">Hubungi admin untuk menambahkan template.</p>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 rounded-lg font-semibold text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !templateId || !title.trim() || templates.length === 0}
              className="px-6 py-3 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Membuat...
                </div>
              ) : (
                'Buat Proyek'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePageModal;