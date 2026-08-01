import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiFile, FiCheckCircle, FiEyeOff, FiUpload, FiLoader } from "react-icons/fi";
import { usePYQ } from "../../context/PYQContext";
import { getToken } from "../../context/AuthContext";
import AdminNav from "./AdminNav";
import "./AdminGallery.css";
import "./AdminPYQ.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";

const EMPTY_FORM = {
  title: "",
  subject: "",
  category: "",
  year: "",
  description: "",
  fileUrl: "",
  isPublished: true,
};

const SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology", "English", "General"];
const CATEGORIES = ["NEET", "JEE Main", "JEE Advanced", "Olympiad", "Foundation"];

export default function AdminPYQ() {
  const { pyqs, addPYQ, updatePYQ, deletePYQ, togglePublish } = usePYQ();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setUploadProgress(0);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setForm({
      title: item.title || "",
      subject: item.subject || "",
      category: item.category || "",
      year: item.year || "",
      description: item.description || "",
      fileUrl: item.fileUrl || "",
      isPublished: item.isPublished !== false,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  // File upload handler
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Upload failed");
      }

      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, fileUrl: data.url }));
        setUploadProgress(100);
      } else {
        throw new Error("No URL returned from server");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const payload = { ...form, title: form.title.trim() };

    if (editingId) {
      await updatePYQ(editingId, payload);
    } else {
      await addPYQ(payload);
    }
    resetForm();
    setShowForm(false);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Delete "${item.title}"?`)) {
      deletePYQ(item.id);
    }
  };

  return (
    <div className="uka-admin-page">
      <AdminNav />
      <header className="uka-admin-header">
        <div>
          <h1>Previous Year Questions (PYQ)</h1>
          <p>Manage PYQ materials for students to download and practice.</p>
        </div>
        <button className="uka-admin-btn uka-admin-btn-gold" onClick={openAddForm}>
          <FiPlus /> Add PYQ
        </button>
      </header>

      {showForm && (
        <form className="uka-admin-form-card" onSubmit={handleSubmit}>
          <div className="uka-admin-form-header">
            <h2>
              <FiFile /> {editingId ? "Edit PYQ" : "Add New PYQ"}
            </h2>
            <button type="button" className="uka-admin-icon-btn" onClick={() => { resetForm(); setShowForm(false); }}>
              <FiX />
            </button>
          </div>

          <div className="uka-admin-form-grid">
            <div className="uka-admin-fields-col">
              <label className="uka-admin-field">
                Title *
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
              </label>

              <div className="uka-admin-field-row two">
                <label className="uka-admin-field">
                  Subject
                  <select value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}>
                    <option value="">Select Subject</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="uka-admin-field">
                  Category
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="uka-admin-field-row two">
                <label className="uka-admin-field">
                  Year
                  <input type="text" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} placeholder="e.g. 2024" />
                </label>
                <label className="uka-admin-field">
                  File URL (Google Drive / PDF)
                  {/* --- File upload UI --- */}
                  <div className="uka-admin-file-upload-wrapper">
                    <input
                      type="text"
                      value={form.fileUrl}
                      onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                      placeholder="https://... or upload below"
                      className={uploading ? "uploading" : ""}
                    />
                    <div className="uka-admin-file-upload-actions">
                      <label className={`uka-admin-upload-label ${uploading ? "disabled" : ""}`}>
                        <FiUpload />
                        <span>Upload</span>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          disabled={uploading}
                          style={{ display: "none" }}
                        />
                      </label>
                      {form.fileUrl && (
                        <button
                          type="button"
                          className="uka-admin-icon-btn small"
                          onClick={() => setForm((f) => ({ ...f, fileUrl: "" }))}
                          title="Clear URL"
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                  </div>
                  {uploading && (
                    <div className="uka-admin-upload-progress">
                      <FiLoader className="spinning" />
                      <span>Uploading... {uploadProgress}%</span>
                      <progress value={uploadProgress} max="100" />
                    </div>
                  )}
                  {form.fileUrl && !uploading && (
                    <div className="uka-admin-upload-success">
                      <FiCheckCircle /> File uploaded successfully
                    </div>
                  )}
                </label>
              </div>

              <label className="uka-admin-field">
                Description
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </label>

              <label className="uka-admin-checkbox">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
                Published (visible to students)
              </label>
            </div>
          </div>

          <div className="uka-admin-form-actions">
            <button type="submit" className="uka-admin-btn uka-admin-btn-gold">
              <FiSave /> {editingId ? "Save Changes" : "Add PYQ"}
            </button>
            <button type="button" className="uka-admin-btn uka-admin-btn-ghost" onClick={() => { resetForm(); setShowForm(false); }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="uka-admin-grid">
        {pyqs.map((item) => (
          <div className="uka-admin-pyq-card" key={item.id}>
            <div className="uka-admin-pyq-header">
              <h3>{item.title}</h3>
              <span className={`uka-admin-status-badge ${item.isPublished ? "published" : "draft"}`}>
                {item.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <div className="uka-admin-pyq-meta">
              {item.subject && <span className="uka-admin-pyq-tag">{item.subject}</span>}
              {item.category && <span className="uka-admin-pyq-tag">{item.category}</span>}
              {item.year && <span className="uka-admin-pyq-tag">{item.year}</span>}
            </div>
            {item.description && <p className="uka-admin-pyq-desc">{item.description}</p>}
            {item.fileUrl && (
              <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="uka-admin-pyq-link">
                <FiFile /> View Material
              </a>
            )}
            <div className="uka-admin-pyq-actions">
              <button className="uka-admin-icon-btn" onClick={() => openEditForm(item)}>
                <FiEdit2 />
              </button>
              <button className="uka-admin-icon-btn" onClick={() => togglePublish(item.id)} title={item.isPublished ? "Unpublish" : "Publish"}>
                {item.isPublished ? <FiEyeOff /> : <FiCheckCircle />}
              </button>
              <button className="uka-admin-icon-btn danger" onClick={() => handleDelete(item)}>
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
        {pyqs.length === 0 && <p className="uka-admin-empty">No PYQ materials added yet.</p>}
      </div>
    </div>
  );
}