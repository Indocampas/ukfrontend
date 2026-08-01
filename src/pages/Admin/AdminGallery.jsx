// src/pages/Admin/AdminGallery.jsx
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUpload,
  FiTrash2,
  FiSave,
  FiLogOut,
  FiImage,
  FiPlus,
  FiRefreshCw,
  FiCheckCircle,
  FiExternalLink,
} from "react-icons/fi";
import { useGallery } from "../../context/GalleryContext";
import { useAuth } from "../../context/AuthContext";
import { CATEGORIES } from "../../data/galleryData.jsx";
import AdminNav from "./AdminNav";
import "./AdminGallery.css";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminGallery() {
  const { images, addImage, replaceImage, updateImage, deleteImage, saveGallery, lastSaved } =
    useGallery();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [newFile, setNewFile] = useState(null);
  const [newPreview, setNewPreview] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");

  const newFileInputRef = useRef(null);
  const replaceInputRefs = useRef({});

  const handleNewFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFile(file);
    const dataUrl = await fileToDataUrl(file);
    setNewPreview(dataUrl);
  };

  const handleAddImage = async () => {
    if (!newFile || !newTitle.trim()) return;
    addImage({
      title: newTitle.trim(),
      category: newCategory,
      image: newPreview,
      description: newTitle.trim(),
    });
    setNewTitle("");
    setNewFile(null);
    setNewPreview(null);
    if (newFileInputRef.current) newFileInputRef.current.value = "";
  };

  const handleReplace = async (id, file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    replaceImage(id, dataUrl);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}" from the gallery?`)) {
      deleteImage(id);
    }
  };

  const handleSave = () => {
    saveGallery();
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2200);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const visibleImages =
    filterCategory === "All"
      ? images
      : images.filter((img) => img.category === filterCategory);

  return (
    <div className="uka-admin-page">
      <AdminNav />
      <header className="uka-admin-header">
        <div className="uka-admin-header-left">
          <h1>Gallery Management</h1>
          <p>Upload, replace, delete and manage the images shown on the public gallery.</p>
        </div>
        <div className="uka-admin-header-actions">
          <button
            className="uka-admin-btn uka-admin-btn-ghost"
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                const el = document.getElementById("gallery");
                if (el) {
                  const top = el.getBoundingClientRect().top + window.pageYOffset - 78 + 1;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }, 150);
            }}
          >
            <FiExternalLink /> View Public Gallery
          </button>
          <button className="uka-admin-btn uka-admin-btn-ghost" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <section className="uka-admin-upload-card">
        <h2>
          <FiPlus /> Add New Image
        </h2>
        <div className="uka-admin-upload-grid">
          <div className="uka-admin-upload-preview">
            {newPreview ? (
              <img src={newPreview} alt="New upload preview" />
            ) : (
              <div className="uka-admin-upload-placeholder">
                <FiImage />
                <span>No image selected</span>
              </div>
            )}
          </div>
          <div className="uka-admin-upload-fields">
            <label className="uka-admin-field">
              <span>Title</span>
              <input
                type="text"
                placeholder="e.g. Annual Sports Meet"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </label>
            <label className="uka-admin-field">
              <span>Category</span>
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            <label className="uka-admin-field">
              <span>Image File</span>
              <input
                type="file"
                accept="image/*"
                ref={newFileInputRef}
                onChange={handleNewFileChange}
              />
            </label>
            <button
              className="uka-admin-btn uka-admin-btn-gold"
              onClick={handleAddImage}
              disabled={!newFile || !newTitle.trim()}
            >
              <FiUpload /> Add to Gallery
            </button>
          </div>
        </div>
      </section>

      <section className="uka-admin-gallery-section">
        <div className="uka-admin-toolbar">
          <h2>Current Gallery ({images.length} images)</h2>
          <div className="uka-admin-toolbar-actions">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button className="uka-admin-btn uka-admin-btn-gold" onClick={handleSave}>
              {savedFlash ? <FiCheckCircle /> : <FiSave />}
              {savedFlash ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="uka-admin-grid">
          {visibleImages.map((img) => (
            <div className="uka-admin-card" key={img.id}>
              <div className="uka-admin-card-image-wrap">
                <img src={img.image} alt={img.title} />
                {img.isMain && <span className="uka-admin-main-badge">Main</span>}
              </div>
              <div className="uka-admin-card-body">
                <input
                  className="uka-admin-card-title"
                  value={img.title}
                  onChange={(e) => updateImage(img.id, { title: e.target.value })}
                />
                <select
                  className="uka-admin-card-category"
                  value={img.category}
                  onChange={(e) => updateImage(img.id, { category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <div className="uka-admin-card-actions">
                  <label className="uka-admin-btn uka-admin-btn-small">
                    <FiRefreshCw /> Replace
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      ref={(el) => (replaceInputRefs.current[img.id] = el)}
                      onChange={(e) => handleReplace(img.id, e.target.files?.[0])}
                    />
                  </label>
                  <button
                    className="uka-admin-btn uka-admin-btn-small uka-admin-btn-danger"
                    onClick={() => handleDelete(img.id, img.title)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {visibleImages.length === 0 && (
            <p className="uka-admin-empty">No images in this category yet.</p>
          )}
        </div>
      </section>

      {lastSaved && (
        <p className="uka-admin-last-saved">
          Last saved: {lastSaved.toLocaleString()}
        </p>
      )}
    </div>
  );
}
