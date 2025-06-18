import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "undangan",
    category: "",
    description: "",
    code: "",
    slots: "",
    preview_url: "",
    thumbnail_url: "",
    is_premium: false,
    price: 0,
    featured: false
  });
  const [editingId, setEditingId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      const data = await response.json();
      setTemplates(data.data || []);
    } catch (error) {
      toast.error('Gagal memuat template');
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ 
      ...f, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  }

  function handleEdit(tpl) {
    setEditingId(tpl.id);
    setForm({
      name: tpl.name || "",
      type: tpl.type || "undangan",
      category: tpl.category || "",
      description: tpl.description || "",
      code: tpl.code || "",
      slots: tpl.slots || "",
      preview_url: tpl.preview_url || "",
      thumbnail_url: tpl.thumbnail_url || "",
      is_premium: Boolean(tpl.is_premium),
      price: tpl.price || 0,
      featured: Boolean(tpl.featured)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/templates/${editingId}` : "/api/templates";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          ...form,
          is_premium: form.is_premium ? 1 : 0,
          featured: form.featured ? 1 : 0
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menyimpan template');
      }

      toast.success(editingId ? 'Template berhasil diupdate' : 'Template berhasil dibuat');
      
      // Reset form
      setForm({
        name: "",
        type: "undangan",
        category: "",
        description: "",
        code: "",
        slots: "",
        preview_url: "",
        thumbnail_url: "",
        is_premium: false,
        price: 0,
        featured: false
      });
      setEditingId(null);
      fetchTemplates();
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin hapus template ini?")) return;
    
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menghapus template');
      }

      toast.success('Template berhasil dihapus');
      fetchTemplates();
      
    } catch (error) {
      toast.error(error.message);
    }
  }

  function handlePreview(tpl) {
    setPreviewTemplate(tpl);
    setShowPreview(true);
  }

  function closePreview() {
    setShowPreview(false);
    setPreviewTemplate(null);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manajemen Template</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Template' : 'Tambah Template Baru'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Template</label>
            <input 
              name="name" 
              placeholder="Nama Template" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <input 
              name="category" 
              placeholder="Kategori" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={form.category} 
              onChange={handleChange} 
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
            <select 
              name="type" 
              value={form.type} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="undangan">Undangan</option>
              <option value="jasa">Jasa</option>
              <option value="portofolio">Portofolio</option>
              <option value="bisnis">Bisnis</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga (jika premium)</label>
            <input 
              name="price" 
              type="number" 
              min={0} 
              step={1000} 
              placeholder="0" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={form.price} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea 
            name="description" 
            placeholder="Deskripsi template..." 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={form.description} 
            onChange={handleChange} 
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preview URL</label>
            <input 
              name="preview_url" 
              placeholder="https://..." 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={form.preview_url} 
              onChange={handleChange} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
            <input 
              name="thumbnail_url" 
              placeholder="https://..." 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={form.thumbnail_url} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Kode Template (HTML)</label>
          <textarea 
            name="code" 
            placeholder="<div>Template HTML dengan placeholder {NAMA}, {EMAIL}, dll...</div>" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" 
            value={form.code} 
            onChange={handleChange} 
            rows={8} 
            required 
          />
          <p className="text-xs text-gray-500 mt-1">
            Gunakan placeholder seperti {`{NAMA}`}, {`{EMAIL}`}, {`{ALAMAT}`} yang akan diganti dengan data user
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Slots (pisah dengan koma)</label>
          <input 
            name="slots" 
            placeholder="NAMA,EMAIL,ALAMAT,TANGGAL,WAKTU" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={form.slots} 
            onChange={handleChange} 
            required 
          />
          <p className="text-xs text-gray-500 mt-1">
            Daftar field yang bisa diisi user, pisahkan dengan koma
          </p>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              name="is_premium" 
              checked={form.is_premium} 
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Template Premium</span>
          </label>
          
          <label className="flex items-center">
            <input 
              type="checkbox" 
              name="featured" 
              checked={form.featured} 
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Template Unggulan</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : (editingId ? "Update Template" : "Tambah Template")}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400" 
              onClick={() => { 
                setEditingId(null); 
                setForm({
                  name: "",
                  type: "undangan",
                  category: "",
                  description: "",
                  code: "",
                  slots: "",
                  preview_url: "",
                  thumbnail_url: "",
                  is_premium: false,
                  price: 0,
                  featured: false
                }); 
              }}
            >
              Batal Edit
            </button>
          )}
        </div>
      </form>

      {/* Templates Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {templates.map(tpl => (
              <tr key={tpl.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <img 
                        className="h-12 w-12 rounded-lg object-cover" 
                        src={tpl.thumbnail_url || 'https://placehold.co/100x100/e2e8f0/475569?text=T'} 
                        alt={tpl.name}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100x100/e2e8f0/475569?text=T';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{tpl.name}</div>
                      <div className="text-sm text-gray-500">{tpl.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {tpl.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col gap-1">
                    {tpl.is_premium && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Premium
                      </span>
                    )}
                    {tpl.featured && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button 
                      className="text-blue-600 hover:text-blue-900" 
                      onClick={() => handlePreview(tpl)}
                    >
                      Preview
                    </button>
                    <button 
                      className="text-indigo-600 hover:text-indigo-900" 
                      onClick={() => handleEdit(tpl)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900" 
                      onClick={() => handleDelete(tpl.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada template. Tambahkan template pertama Anda!</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Preview: {previewTemplate.name}</h3>
              <button 
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold" 
                onClick={closePreview}
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <iframe
                src={`/api/templates/${previewTemplate.id}/preview`}
                className="w-full h-96 border rounded"
                title={`Preview ${previewTemplate.name}`}
              />
              
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h4 className="font-semibold mb-2">Informasi Template:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Kategori:</strong> {previewTemplate.category}</div>
                  <div><strong>Tipe:</strong> {previewTemplate.type}</div>
                  <div><strong>Slots:</strong> {previewTemplate.slots}</div>
                  <div><strong>Premium:</strong> {previewTemplate.is_premium ? 'Ya' : 'Tidak'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}