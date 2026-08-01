import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiKey, FiCheckCircle, FiEyeOff, FiUpload, FiLoader } from "react-icons/fi";
import { useAnswerKey } from "../../context/AnswerKeyContext";
import { getToken } from "../../context/AuthContext";
import AdminNav from "./AdminNav";
import "./AdminGallery.css";
import "./AdminAnswerKey.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";

const EMPTY_FORM = {
  title: "",
  examName: "",
  year: "",
  description: "",
  fileUrl: "",
  isPublished: true,
};

const EXAMS = ["NEET", "JEE Main", "JEE Advanced", "Olympiad", "Foundation Scholarship Test"];

export default function AdminAnswerKey() {
  const { answerKeys, addAnswerKey, updateAnswerKey, deleteAnswerKey, togglePublish } = useAnswerKey();
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
      examName: item.examName || "",
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

    // Optional: validate file type/size
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
      await updateAnswerKey(editingId, payload);
    } else {
      await addAnswerKey(payload);
    }
    resetForm();
    setShowForm(false);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Delete "${item.title}"?`)) {
      deleteAnswerKey(item.id);
    }
  };

  return (
    <div className="uka-admin-page">
      <AdminNav />
      <header className="uka-admin-header">
        <div>
          <h1>Answer Key Management</h1>
          <p>Manage official and provisional answer keys published for students.</p>
        </div>
        <button className="uka-admin-btn uka-admin-btn-gold" onClick={openAddForm}>
          <FiPlus /> Add Answer Key
        </button>
      </header>

      {showForm && (
        <form className="uka-admin-form-card" onSubmit={handleSubmit}>
          <div className="uka-admin-form-header">
            <h2>
              <FiKey /> {editingId ? "Edit Answer Key" : "Add New Answer Key"}
            </h2>
            <button type="button" className="uka-admin-icon-btn" onClick={() => { resetForm(); setShowForm(false); }}>
              <FiX />
            </button>
          </div>

          <div className="uka-admin-form-grid">
            <div className="uka-admin-fields-col">
              <label className="uka-admin-field">
                Title *
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required placeholder="e.g. NEET 2026 Provisional Answer Key" />
              </label>

              <div className="uka-admin-field-row two">
                <label className="uka-admin-field">
                  Exam
                  <select value={form.examName} onChange={(e) => setForm((f) => ({ ...f, examName: e.target.value }))}>
                    <option value="">Select Exam</option>
                    {EXAMS.map((ex) => (
                      <option key={ex} value={ex}>{ex}</option>
                    ))}
                  </select>
                </label>
                <label className="uka-admin-field">
                  Year
                  <input type="text" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} placeholder="e.g. 2026" />
                </label>
              </div>

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

              <label className="uka-admin-field">
                Description
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="e.g. Objection window open till..." />
              </label>

              <label className="uka-admin-checkbox">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
                Published (visible to students)
              </label>
            </div>
          </div>

          <div className="uka-admin-form-actions">
            <button type="submit" className="uka-admin-btn uka-admin-btn-gold">
              <FiSave /> {editingId ? "Save Changes" : "Add Answer Key"}
            </button>
            <button type="button" className="uka-admin-btn uka-admin-btn-ghost" onClick={() => { resetForm(); setShowForm(false); }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="uka-admin-grid">
        {answerKeys.map((item) => (
          <div className="uka-admin-answerkey-card" key={item.id}>
            <div className="uka-admin-answerkey-header">
              <h3>{item.title}</h3>
              <span className={`uka-admin-status-badge ${item.isPublished ? "published" : "draft"}`}>
                {item.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <div className="uka-admin-answerkey-meta">
              {item.examName && <span className="uka-admin-answerkey-tag">{item.examName}</span>}
              {item.year && <span className="uka-admin-answerkey-tag">{item.year}</span>}
            </div>
            {item.description && <p className="uka-admin-answerkey-desc">{item.description}</p>}
            {item.fileUrl && (
              <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="uka-admin-answerkey-link">
                <FiKey /> View Answer Key
              </a>
            )}
            <div className="uka-admin-answerkey-actions">
              <button className="uka-admin-icon-btn" onClick={() => openEditForm(item)} title="Edit">
                <FiEdit2 />
              </button>
              <button className="uka-admin-icon-btn" onClick={() => togglePublish(item.id)} title={item.isPublished ? "Unpublish" : "Publish"}>
                {item.isPublished ? <FiEyeOff /> : <FiCheckCircle />}
              </button>
              <button className="uka-admin-icon-btn danger" onClick={() => handleDelete(item)} title="Delete">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
        {answerKeys.length === 0 && <p className="uka-admin-empty">No answer keys added yet. Click "Add Answer Key" to get started.</p>}
      </div>
    </div>
  );
}