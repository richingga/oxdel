import React, { useState, useEffect } from 'react';

const CreatePageModal = ({ isOpen, onClose, onPageCreated }) => {
  const [templates, setTemplates] = useState([]);
  const [title, setTitle] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ambil daftar template saat modal pertama kali dibuka
  useEffect(() => {
    if (isOpen) {
      const fetchTemplates = async () => {
        try {
          const response = await fetch('/api/templates');
          if (!response.ok) {
            throw new Error('Gagal memuat template.');
          }
          const data = await response.json();
          setTemplates(data);
          // Otomatis pilih template pertama jika ada
          if (data.length > 0) {
            setTemplateId(data[0].id);
          }
        } catch (err) {
          setError(err.message);
        }
      };
      fetchTemplates();
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
            body: JSON.stringify({ title: title, template_id: templateId })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Gagal membuat halaman.');
        }

        alert('Halaman berhasil dibuat!');
        onPageCreated(); // Panggil fungsi dari parent untuk refresh data & tutup modal
        
    } catch (err) {
        setError(err.message);
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
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Buat Halaman Baru</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul Halaman</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Undangan Pernikahan Budi & Citra"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">Pilih Template</label>
            <select
              id="template"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {templates.length > 0 ? (
                templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.type})
                  </option>
                ))
              ) : (
                <option disabled>Memuat template...</option>
              )}
            </select>
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-semibold text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Membuat...' : 'Buat Halaman'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePageModal;