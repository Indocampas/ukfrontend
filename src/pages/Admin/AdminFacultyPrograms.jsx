// F:\uk-academy-app\src\pages\Admin\AdminFacultyPrograms.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiEye, FiEyeOff,
    FiUpload, FiBookOpen, FiLogOut, FiSearch, FiAlertCircle
} from "react-icons/fi";
import { useFacultyPrograms } from "../../context/FacultyProgramContext";
import { useAuth } from "../../context/AuthContext";
import AdminNav from "./AdminNav";
import "./AdminFacultyPrograms.css";

const CATEGORIES = [
    { value: "financial-literacy", label: "Financial Literacy" },
    { value: "spellbee", label: "SpellBee" },
    { value: "vedic-maths", label: "Vedic Maths" },
    { value: "biology-foundation", label: "Foundation Biology" },
    { value: "chemistry-foundation", label: "Foundation Chemistry" },
    { value: "math-foundation", label: "Foundation Mathematics" },
    { value: "physics-foundation", label: "Foundation Physics" },
    { value: "pgdptt", label: "PG Diploma in Pre-Primary Teacher Training" },
    { value: "montessori", label: "PG Diploma in Montessori" },
    { value: "ntt", label: "Nursery Teacher Training" },
    { value: "pttp", label: "Primary Teacher Training" },
    { value: "steam", label: "STEAM Trainer" },
    { value: "abacus", label: "Abacus Teacher Training" },
    { value: "ai-ready-teacher", label: "AI-Ready Teacher Course" },
];

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Professional", "Diploma"];

const EMPTY_FORM = {
    title: "",
    slug: "",
    category: CATEGORIES[0].value,
    description: "",
    target: "",
    duration: "3 Months",
    level: "Professional",
    color: "#e8b430",
    features: [],
    fee: 30000,
    icon: "FiBookOpen",
    image: null,
    isPublished: true,
};

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function AdminFacultyPrograms() {
    const { programs, addProgram, updateProgram, deleteProgram, togglePublish, loading } = useFacultyPrograms();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [imagePreview, setImagePreview] = useState(null);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setImagePreview(null);
        setEditingId(null);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const openAddForm = () => {
        resetForm();
        setShowForm(true);
    };

    const openEditForm = (program) => {
        setForm({
            title: program.title || "",
            slug: program.slug || "",
            category: program.category || CATEGORIES[0].value,
            description: program.description || "",
            target: program.target || "",
            duration: program.duration || "3 Months",
            level: program.level || "Professional",
            color: program.color || "#e8b430",
            features: program.features || [],
            fee: program.fee || 30000,
            icon: program.icon || "FiBookOpen",
            image: program.image || null,
            isPublished: program.isPublished !== false,
        });
        setImagePreview(program.image || null);
        setEditingId(program.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const dataUrl = await fileToDataUrl(file);
            setForm((f) => ({ ...f, image: dataUrl }));
            setImagePreview(dataUrl);
        } catch (err) {
            setError("Failed to process image");
        }
    };

    const handleFeaturesChange = (value) => {
        const features = value.split(",").map(f => f.trim()).filter(Boolean);
        setForm((f) => ({ ...f, features }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!form.title.trim()) {
            setError("Title is required");
            return;
        }
        if (!form.category) {
            setError("Category is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...form,
                title: form.title.trim(),
                slug: form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                features: form.features || [],
            };

            if (editingId) {
                await updateProgram(editingId, payload);
            } else {
                await addProgram(payload);
            }
            resetForm();
            setShowForm(false);
        } catch (err) {
            setError(err.message || "Failed to save program");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (program) => {
        if (window.confirm(`Delete "${program.title}"? This cannot be undone.`)) {
            deleteProgram(program.id).catch(err => setError(err.message));
        }
    };

    const filteredPrograms = programs.filter(p => {
        if (filterCategory !== "All" && p.category !== filterCategory) return false;
        if (filterStatus === "Published" && p.isPublished === false) return false;
        if (filterStatus === "Draft" && p.isPublished !== false) return false;
        if (search.trim()) {
            const q = search.toLowerCase();
            if (!p.title.toLowerCase().includes(q) && 
                !(p.description || "").toLowerCase().includes(q)) return false;
        }
        return true;
    });

    const getCategoryLabel = (value) => {
        return CATEGORIES.find(c => c.value === value)?.label || value;
    };

    if (loading) {
        return (
            <div className="uka-admin-page">
                <AdminNav />
                <div className="uka-admin-loading">Loading faculty programs...</div>
            </div>
        );
    }

    return (
        <div className="uka-admin-page">
            <AdminNav />
            <header className="uka-admin-header">
                <div>
                    <h1>Faculty Programs Management</h1>
                    <p>Manage teacher training and certification programs</p>
                </div>
                <div className="uka-admin-header-actions">
                    <button className="uka-admin-btn uka-admin-btn-gold" onClick={openAddForm}>
                        <FiPlus /> Add Program
                    </button>
                    <button className="uka-admin-btn uka-admin-btn-ghost" onClick={() => { logout(); navigate("/"); }}>
                        <FiLogOut /> Logout
                    </button>
                </div>
            </header>

            {error && (
                <div className="uka-admin-error-banner">
                    <FiAlertCircle /> {error}
                </div>
            )}

            {showForm && (
                <form className="uka-admin-form-card" onSubmit={handleSubmit}>
                    <div className="uka-admin-form-header">
                        <h2>
                            <FiBookOpen /> {editingId ? "Edit Program" : "Add New Program"}
                        </h2>
                        <button type="button" className="uka-admin-icon-btn" onClick={() => { resetForm(); setShowForm(false); }}>
                            <FiX />
                        </button>
                    </div>

                    <div className="uka-admin-form-grid">
                        <div className="uka-admin-image-col">
                            <div className="uka-admin-image-preview">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Program preview" />
                                ) : (
                                    <div className="uka-admin-image-placeholder">
                                        <FiUpload size={40} />
                                        <span>No image</span>
                                    </div>
                                )}
                            </div>
                            <button type="button" className="uka-admin-btn uka-admin-btn-small" onClick={() => fileInputRef.current?.click()}>
                                <FiUpload /> Upload Image
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                        </div>

                        <div className="uka-admin-fields-col">
                            <label className="uka-admin-field">
                                Title *
                                <input type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
                            </label>

                            <div className="uka-admin-field-row two">
                                <label className="uka-admin-field">
                                    Slug
                                    <input type="text" value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} />
                                </label>
                                <label className="uka-admin-field">
                                    Category *
                                    <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
                                        {CATEGORIES.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <div className="uka-admin-field-row three">
                                <label className="uka-admin-field">
                                    Duration
                                    <input type="text" value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} />
                                </label>
                                <label className="uka-admin-field">
                                    Level
                                    <select value={form.level} onChange={(e) => setForm(f => ({ ...f, level: e.target.value }))}>
                                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </label>
                                <label className="uka-admin-field">
                                    Fee (₹)
                                    <input type="number" value={form.fee} onChange={(e) => setForm(f => ({ ...f, fee: Number(e.target.value) }))} />
                                </label>
                            </div>

                            <div className="uka-admin-field-row two">
                                <label className="uka-admin-field">
                                    Icon Name (react-icons)
                                    <input type="text" value={form.icon} onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="FiBookOpen" />
                                </label>
                                <label className="uka-admin-field">
                                    Color
                                    <input type="color" value={form.color} onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))} />
                                </label>
                            </div>

                            <label className="uka-admin-field">
                                Target Audience
                                <input type="text" value={form.target} onChange={(e) => setForm(f => ({ ...f, target: e.target.value }))} />
                            </label>

                            <label className="uka-admin-field">
                                Description
                                <textarea rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
                            </label>

                            <label className="uka-admin-field">
                                Features (comma separated)
                                <input type="text" value={form.features.join(", ")} onChange={(e) => handleFeaturesChange(e.target.value)} />
                            </label>

                            <label className="uka-admin-checkbox">
                                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm(f => ({ ...f, isPublished: e.target.checked }))} />
                                Published (visible on public site)
                            </label>
                        </div>
                    </div>

                    <div className="uka-admin-form-actions">
                        <button type="submit" className="uka-admin-btn uka-admin-btn-gold" disabled={isSubmitting}>
                            <FiSave /> {isSubmitting ? "Saving..." : (editingId ? "Save Changes" : "Add Program")}
                        </button>
                        <button type="button" className="uka-admin-btn uka-admin-btn-ghost" onClick={() => { resetForm(); setShowForm(false); }}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="uka-admin-toolbar">
                <h2>All Programs ({filteredPrograms.length})</h2>
                <div className="uka-admin-toolbar-actions">
                    <div className="uka-admin-search">
                        <FiSearch />
                        <input type="text" placeholder="Search programs..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                    </select>
                </div>
            </div>

            <div className="uka-admin-grid">
                {filteredPrograms.map((program) => (
                    <div className="uka-admin-faculty-card" key={program.id}>
                        <div className="uka-admin-faculty-image">
                            {program.image ? (
                                <img src={program.image} alt={program.title} />
                            ) : (
                                <div className="uka-admin-faculty-placeholder" style={{ background: program.color || "#0a1330" }}>
                                    <span>{program.title.charAt(0)}</span>
                                </div>
                            )}
                            <span className={`uka-admin-status-badge ${program.isPublished !== false ? "published" : "draft"}`}>
                                {program.isPublished !== false ? "Published" : "Draft"}
                            </span>
                        </div>
                        <div className="uka-admin-faculty-info">
                            <h3>{program.title}</h3>
                            <p className="uka-admin-faculty-designation">{getCategoryLabel(program.category)}</p>
                            <p className="uka-admin-faculty-subject">
                                <span>Level: {program.level}</span>
                                <span>Duration: {program.duration}</span>
                            </p>
                            {program.fee && <p className="uka-admin-faculty-qualification">₹{program.fee.toLocaleString()}</p>}
                            <div className="uka-admin-faculty-actions">
                                <button className="uka-admin-icon-btn" onClick={() => openEditForm(program)} title="Edit">
                                    <FiEdit2 />
                                </button>
                                <button className="uka-admin-icon-btn" onClick={() => togglePublish(program.id)} title={program.isPublished !== false ? "Unpublish" : "Publish"}>
                                    {program.isPublished !== false ? <FiEyeOff /> : <FiEye />}
                                </button>
                                <button className="uka-admin-icon-btn danger" onClick={() => handleDelete(program)} title="Delete">
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredPrograms.length === 0 && (
                    <p className="uka-admin-empty">No faculty programs found. Click "Add Program" to get started.</p>
                )}
            </div>
        </div>
    );
}