import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Icons
const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
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

const SaveIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17,21 17,13 7,13 7,21" />
    <polyline points="7,3 7,8 15,8" />
  </svg>
);

const FormField = ({ slot, value, onChange, error }) => {
  const { key, label, type, placeholder, required } = slot;

  const baseInputClass = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
    error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
  }`;

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Sesi berakhir, silakan login kembali');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal upload gambar');
      }
      onChange(key, data.data.url);
      toast.success('Gambar berhasil diupload');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={4}
            className={baseInputClass}
          />
        );
      
      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder="Masukkan URL gambar (https://...)"
              className={baseInputClass}
            />
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="text-sm"
              />
              {uploading && (
                <span className="text-sm text-gray-500">Mengupload...</span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Masukkan URL gambar atau pilih file untuk diupload ke server.
            </p>
            {value && (
              <div className="mt-2">
                <img
                  src={value}
                  alt="Preview"
                  className="max-w-xs max-h-32 object-cover rounded border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder={placeholder}
            required={required}
            className={baseInputClass}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

const TemplateBuilder = () => {
  const { templateId, pageId } = useParams();
  const navigate = useNavigate();
  
  const [template, setTemplate] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [pageTitle, setPageTitle] = useState('');

  // Load template dan page data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        if (pageId) {
          // Edit mode - load existing page
          const pageResponse = await fetch(`/api/pages/${pageId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!pageResponse.ok) {
            throw new Error('Gagal memuat data halaman');
          }
          
          const page = await pageResponse.json();
          setPageData(page.data);
          setPageTitle(page.data.title);
          setFormData(page.data.content || {});
          
          // Load template data
          const templateResponse = await fetch(`/api/templates/${page.data.template_id}/builder`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!templateResponse.ok) {
            throw new Error('Gagal memuat template');
          }
          
          const templateData = await templateResponse.json();
          setTemplate(templateData.data);
          
        } else if (templateId) {
          // Create mode - load template only
          const templateResponse = await fetch(`/api/templates/${templateId}/builder`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!templateResponse.ok) {
            throw new Error('Gagal memuat template');
          }
          
          const templateData = await templateResponse.json();
          setTemplate(templateData.data);
          setPageTitle(`Proyek ${templateData.data.name}`);
          
          // Initialize form data dengan default values
          const initialData = {};
          templateData.data.parsedSlots?.forEach(slot => {
            initialData[slot.key] = '';
          });
          setFormData(initialData);
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error(error.message);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [templateId, pageId, navigate]);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    template.parsedSlots?.forEach(slot => {
      if (slot.required && !formData[slot.key]?.trim()) {
        newErrors[slot.key] = `${slot.label} wajib diisi`;
      }
      
      // Validate email
      if (slot.type === 'email' && formData[slot.key]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[slot.key])) {
          newErrors[slot.key] = 'Format email tidak valid';
        }
      }
      
      // Validate URL
      if (slot.type === 'url' && formData[slot.key]) {
        try {
          new URL(formData[slot.key]);
        } catch {
          newErrors[slot.key] = 'Format URL tidak valid';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status = 'draft') => {
    if (!validateForm()) {
      toast.error('Mohon periksa kembali form Anda');
      return;
    }

    try {
      setSaving(true);
      
      const saveData = {
        title: pageTitle,
        content: formData,
        status: status,
        visibility: 'public'
      };

      let response;
      
      if (pageId) {
        // Update existing page
        response = await fetch(`/api/pages/${pageId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(saveData)
        });
      } else {
        // Create new page
        response = await fetch('/api/pages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...saveData,
            template_id: templateId
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan halaman');
      }

      const result = await response.json();
      
      toast.success(
        status === 'published' 
          ? 'Halaman berhasil dipublikasi!' 
          : 'Halaman berhasil disimpan!'
      );
      
      // Redirect to dashboard after successful save
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (!validateForm()) {
      toast.error('Mohon lengkapi form terlebih dahulu');
      return;
    }
    setPreviewMode(true);
  };

  const renderPreview = () => {
    if (!template || !template.code) return null;
    
    let previewHtml = template.code;
    
    // Replace placeholders dengan data form
    Object.entries(formData).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'gi');
      previewHtml = previewHtml.replace(regex, value || `[${key}]`);
    });

    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Preview</span>
          <button
            onClick={() => setPreviewMode(false)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Kembali Edit
          </button>
        </div>
        <div 
          className="p-6 min-h-96"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat template...</p>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Template tidak ditemukan</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {pageId ? 'Edit Halaman' : 'Buat Halaman Baru'}
                </h1>
                <p className="text-sm text-gray-600">Template: {template.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handlePreview}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <EyeIcon className="w-4 h-4" />
                Preview
              </button>
              
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <SaveIcon className="w-4 h-4" />
                {saving ? 'Menyimpan...' : 'Simpan Draft'}
              </button>
              
              <button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Mempublikasi...' : 'Publikasi'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {previewMode ? (
          renderPreview()
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Isi Konten Halaman</h2>
              
              <div className="space-y-6">
                {/* Page Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Judul Halaman <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="Masukkan judul halaman"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Dynamic Form Fields */}
                {template.parsedSlots?.map((slot) => (
                  <FormField
                    key={slot.key}
                    slot={slot}
                    value={formData[slot.key]}
                    onChange={handleInputChange}
                    error={errors[slot.key]}
                  />
                ))}
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Preview Real-time</h2>
              
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 min-h-96">
                {template.code ? (
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: template.code.replace(
                        /{(\w+)}/g, 
                        (match, key) => formData[key] || `<span class="text-gray-400 italic">[${key}]</span>`
                      )
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Preview akan muncul di sini</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateBuilder;