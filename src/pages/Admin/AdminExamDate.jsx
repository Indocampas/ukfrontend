import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiCalendar, FiCheckCircle, FiEyeOff, FiClock } from "react-icons/fi";
import { useExamDate } from "../../context/ExamDateContext";
import AdminNav from "./AdminNav";
import "./AdminGallery.css";
import "./AdminExamDate.css";

const EMPTY_FORM = {
  title: "",
  examDate: "",
  examTime: "",
  category: "",
  description: "",
  isPublished: true,
};

const CATEGORIES = ["NEET", "JEE Main", "JEE Advanced", "Olympiad", "Foundation"];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminExamDate() {
  const { examDates, addExamDate, updateExamDate, deleteExamDate, togglePublish } = useExamDate();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setForm({
      title: item.title || "",
      examDate: item.examDate || "",
      examTime: item.examTime || "",
      category: item.category || "",
      description: item.description || "",
      isPublished: item.isPublished !== false,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const payload = { ...form, title: form.title.trim() };

    if (editingId) {
      await updateExamDate(editingId, payload);
    } else {
      await addExamDate(payload);
    }
    resetForm();
    setShowForm(false);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Delete "${item.title}"?`)) {
      deleteExamDate(item.id);
    }
  };

  const sorted = [...examDates].sort((a, b) => (a.examDate || "").localeCompare(b.examDate || ""));

  return (
    <div className="uka-admin-page">
      <AdminNav />
      <header className="uka-admin-header">
        <div>
          <h1>Exam Date Management</h1>
          <p>Manage upcoming exam dates displayed to students.</p>
        </div>
        <button className="uka-admin-btn uka-admin-btn-gold" onClick={openAddForm}>
          <FiPlus /> Add Exam Date
        </button>
      </header>

      {showForm && (
        <form className="uka-admin-form-card" onSubmit={handleSubmit}>
          <div className="uka-admin-form-header">
            <h2>
              <FiCalendar /> {editingId ? "Edit Exam Date" : "Add New Exam Date"}
            </h2>
            <button type="button" className="uka-admin-icon-btn" onClick={() => { resetForm(); setShowForm(false); }}>
              <FiX />
            </button>
          </div>

          <div className="uka-admin-form-grid">
            <div className="uka-admin-fields-col">
              <label className="uka-admin-field">
                Title *
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required placeholder="e.g. NEET 2026 Exam" />
              </label>

              <div className="uka-admin-field-row two">
                <label className="uka-admin-field">
                  Exam Date
                  <input type="date" value={form.examDate} onChange={(e) => setForm((f) => ({ ...f, examDate: e.target.value }))} />
                </label>
                <label className="uka-admin-field">
                  Exam Time
                  <input type="time" value={form.examTime} onChange={(e) => setForm((f) => ({ ...f, examTime: e.target.value }))} />
                </label>
              </div>

              <label className="uka-admin-field">
                Category
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label className="uka-admin-field">
                Description
                <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="e.g. Admit card release, exam centre details..." />
              </label>

              <label className="uka-admin-checkbox">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))} />
                Published (visible to students)
              </label>
            </div>
          </div>

          <div className="uka-admin-form-actions">
            <button type="submit" className="uka-admin-btn uka-admin-btn-gold">
              <FiSave /> {editingId ? "Save Changes" : "Add Exam Date"}
            </button>
            <button type="button" className="uka-admin-btn uka-admin-btn-ghost" onClick={() => { resetForm(); setShowForm(false); }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="uka-admin-grid">
        {sorted.map((item) => (
          <div className="uka-admin-examdate-card" key={item.id}>
            <div className="uka-admin-examdate-header">
              <h3>{item.title}</h3>
              <span className={`uka-admin-status-badge ${item.isPublished ? "published" : "draft"}`}>
                {item.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <div className="uka-admin-examdate-meta">
              {item.category && <span className="uka-admin-examdate-tag">{item.category}</span>}
              {item.examDate && (
                <span className="uka-admin-examdate-when">
                  <FiClock /> {formatDate(item.examDate)}{item.examTime ? ` · ${item.examTime}` : ""}
                </span>
              )}
            </div>
            {item.description && <p className="uka-admin-examdate-desc">{item.description}</p>}
            <div className="uka-admin-examdate-actions">
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
        {sorted.length === 0 && <p className="uka-admin-empty">No exam dates added yet. Click "Add Exam Date" to get started.</p>}
      </div>
    </div>
  );
}
