import { useState, useRef } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiUpload, FiUser, FiMail, FiBookOpen } from "react-icons/fi";
import { useFaculty } from "../../context/FacultyContext";
import AdminNav from "./AdminNav";
import "./AdminGallery.css";
import "./AdminFaculty.css";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const EMPTY_FORM = {
  name: "",
  designation: "",
  qualification: "",
  experience: "",
  bio: "",
  subject: "",
  image: null,
};

export default function AdminFaculty() {
  const { faculty, addFaculty, updateFaculty, deleteFaculty } = useFaculty();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImagePreview(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (member) => {
    setForm({
      name: member.name || "",
      designation: member.designation || "",
      qualification: member.qualification || "",
      experience: member.experience || "",
      bio: member.bio || "",
      subject: member.subject || "",
      image: member.image || null,
    });
    setImagePreview(member.image || null);
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((f) => ({ ...f, image: dataUrl }));
    setImagePreview(dataUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = { ...form, name: form.name.trim() };

    if (editingId) {
      await updateFaculty(editingId, payload);
    } else {
      await addFaculty(payload);
    }
    resetForm();
    setShowForm(false);
  };

  const handleDelete = (member) => {
    if (window.confirm(`Delete "${member.name}" from faculty?`)) {
      deleteFaculty(member.id);
    }
  };

  return (
    <div className="uka-admin-page">
      <AdminNav />
      <header className="uka-admin-header">
        <div>
          <h1>Faculty Management</h1>
          <p>Add, edit and manage faculty members displayed on the website.</p>
        </div>
        <button className="uka-admin-btn uka-admin-btn-gold" onClick={openAddForm}>
          <FiPlus /> Add Faculty Member
        </button>
      </header>

      {showForm && (
        <form className="uka-admin-form-card" onSubmit={handleSubmit}>
          <div className="uka-admin-form-header">
            <h2>
              <FiUser /> {editingId ? "Edit Faculty" : "Add New Faculty"}
            </h2>
            <button type="button" className="uka-admin-icon-btn" onClick={() => { resetForm(); setShowForm(false); }}>
              <FiX />
            </button>
          </div>

          <div className="uka-admin-form-grid">
            <div className="uka-admin-image-col">
              <div className="uka-admin-image-preview">
                {imagePreview ? (
                  <img src={imagePreview} alt="Faculty preview" />
                ) : (
                  <div className="uka-admin-image-placeholder">
                    <FiUser size={40} />
                    <span>No image</span>
                  </div>
                )}
              </div>
              <button type="button" className="uka-admin-btn uka-admin-btn-small" onClick={() => fileInputRef.current?.click()}>
                <FiUpload /> Upload Photo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </div>

            <div className="uka-admin-fields-col">
              <div className="uka-admin-field-row">
                <label className="uka-admin-field">
                  Full Name *
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                </label>
              </div>

              <div className="uka-admin-field-row two">
                <label className="uka-admin-field">
                  Designation
                  <input type="text" value={form.designation} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} placeholder="e.g. Senior Faculty" />
                </label>
                <label className="uka-admin-field">
                  Subject / Specialization
                  <input type="text" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="e.g. Mathematics" />
                </label>
              </div>

              <div className="uka-admin-field-row two">
                <label className="uka-admin-field">
                  Qualification
                  <input type="text" value={form.qualification} onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))} placeholder="e.g. Ph.D. in Physics" />
                </label>
                <label className="uka-admin-field">
                  Experience
                  <input type="text" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} placeholder="e.g. 10+ years" />
                </label>
              </div>

              <label className="uka-admin-field">
                Bio / Description
                <textarea rows={4} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} placeholder="Short biography..." />
              </label>
            </div>
          </div>

          <div className="uka-admin-form-actions">
            <button type="submit" className="uka-admin-btn uka-admin-btn-gold">
              <FiSave /> {editingId ? "Save Changes" : "Add Faculty"}
            </button>
            <button type="button" className="uka-admin-btn uka-admin-btn-ghost" onClick={() => { resetForm(); setShowForm(false); }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="uka-admin-grid">
        {faculty.map((member) => (
          <div className="uka-admin-faculty-card" key={member.id}>
            <div className="uka-admin-faculty-image">
              {member.image ? (
                <img src={member.image} alt={member.name} />
              ) : (
                <div className="uka-admin-faculty-placeholder">
                  <FiUser size={32} />
                </div>
              )}
            </div>
            <div className="uka-admin-faculty-info">
              <h3>{member.name}</h3>
              <p className="uka-admin-faculty-designation">{member.designation}</p>
              {member.subject && (
                <p className="uka-admin-faculty-subject">
                  <FiBookOpen /> {member.subject}
                </p>
              )}
              {member.qualification && <p className="uka-admin-faculty-qualification">{member.qualification}</p>}
              {member.experience && <p className="uka-admin-faculty-experience">{member.experience} experience</p>}
            </div>
            <div className="uka-admin-faculty-actions">
              <button className="uka-admin-icon-btn" onClick={() => openEditForm(member)} title="Edit">
                <FiEdit2 />
              </button>
              <button className="uka-admin-icon-btn danger" onClick={() => handleDelete(member)} title="Delete">
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
        {faculty.length === 0 && (
          <p className="uka-admin-empty">No faculty members added yet. Click "Add Faculty Member" to get started.</p>
        )}
      </div>
    </div>
  );
}