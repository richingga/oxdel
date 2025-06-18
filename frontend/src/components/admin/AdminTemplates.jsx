import React, { useEffect, useState } from "react";

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "undangan",
    category: "",
    code: "",
    slots: "",
    preview_url: "",
    thumbnail_url: "",
    is_premium: 0,
    price: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const fetchTemplates = () => {
    fetch("/api/templates")
      .then(r => r.json())
      .then(setTemplates);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleEdit(tpl) {
    setEditingId(tpl.id);
    setForm({
      name: tpl.name,
      type: tpl.type,
      category: tpl.category,
      code: tpl.code || "",
      slots: tpl.slots || "",
      preview_url: tpl.preview_url || "",
      thumbnail_url: tpl.thumbnail_url || "",
      is_premium: tpl.is_premium || 0,
      price: tpl.price || 0
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/templates/${editingId}` : "/api/templates";
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(form)
    });
    setForm({
      name: "",
      type: "undangan",
      category: "",
      code: "",
      slots: "",
      preview_url: "",
      thumbnail_url: "",
      is_premium: 0,
      price: 0
    });
    setEditingId(null);
    fetchTemplates();
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin hapus template?")) return;
    await fetch(`/api/templates/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });
    fetchTemplates();
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
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <input name="name" placeholder="Nama Template" className="input flex-1" value={form.name} onChange={handleChange} required />
          <select name="type" value={form.type} onChange={handleChange} className="input">
            <option value="undangan">Undangan</option>
            <option value="jasa">Jasa</option>
            <option value="portofolio">Portofolio</option>
            <option value="bisnis">Bisnis</option>
          </select>
          <input name="category" placeholder="Kategori" className="input flex-1" value={form.category} onChange={handleChange} />
        </div>
        <div className="flex gap-3">
          <input name="preview_url" placeholder="Preview URL (opsional)" className="input flex-1" value={form.preview_url} onChange={handleChange} />
          <input name="thumbnail_url" placeholder="Thumbnail URL (opsional)" className="input flex-1" value={form.thumbnail_url} onChange={handleChange} />
        </div>
        <textarea name="code" placeholder="Kode Template Builder (HTML/JSX, pakai {SLOT})" className="input" value={form.code} onChange={handleChange} rows={4} required />
        <input name="slots" placeholder="Slot Builder (pisah koma, ex: NAMA,FOTO,ALAMAT)" className="input" value={form.slots} onChange={handleChange} required />
        <div className="flex gap-3">
          <label className="flex items-center gap-2">
            <span>Premium</span>
            <input type="checkbox" name="is_premium" checked={!!form.is_premium} onChange={e => setForm(f => ({ ...f, is_premium: e.target.checked ? 1 : 0 }))} />
          </label>
          <input name="price" type="number" min={0} step={1000} placeholder="Harga (jika premium)" className="input flex-1" value={form.price} onChange={handleChange} />
        </div>
        <button className="btn bg-blue-600 text-white" type="submit">{editingId ? "Update" : "Tambah"} Template</button>
        {editingId && (
          <button type="button" className="btn bg-gray-300 mt-1" onClick={() => { setEditingId(null); setForm({ name: "", type: "undangan", category: "", code: "", slots: "", preview_url: "", thumbnail_url: "", is_premium: 0, price: 0 }); }}>Batal Edit</button>
        )}
      </form>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead>
          <tr>
            <th>Nama</th><th>Tipe</th><th>Kategori</th><th>Slot</th><th>Preview</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(tpl => (
            <tr key={tpl.id}>
              <td>{tpl.name}</td>
              <td>{tpl.type}</td>
              <td>{tpl.category}</td>
              <td>{tpl.slots}</td>
              <td>
                {tpl.preview_url && <a href={tpl.preview_url} target="_blank" rel="noopener noreferrer" className="text-blue-600">Preview</a>}
                {" "}
                <button className="text-blue-600 underline" onClick={() => handlePreview(tpl)}>Demo</button>
              </td>
              <td>
                <button className="text-blue-600" onClick={() => handleEdit(tpl)}>Edit</button> |{" "}
                <button className="text-red-600" onClick={() => handleDelete(tpl.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal preview demo */}
      {showPreview && previewTemplate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white rounded shadow p-6 max-w-xl w-full relative">
            <button className="absolute top-2 right-3 text-xl" onClick={closePreview}>&times;</button>
            <h3 className="font-bold mb-2">Preview: {previewTemplate.name}</h3>
            <pre className="bg-gray-100 p-2 rounded mb-2 overflow-auto" style={{ maxHeight: 200 }}>{previewTemplate.code}</pre>
            <div className="border-t pt-2 mt-2">
              <b>Slot:</b> {previewTemplate.slots}
              {previewTemplate.preview_url && (
                <div className="mt-2">
                  <img src={previewTemplate.preview_url} alt="preview" className="rounded max-h-40" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
