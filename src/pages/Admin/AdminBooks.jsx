// src/pages/Admin/AdminBooks.jsx
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUpload,
  FiBook,
  FiCheckCircle,
  FiEyeOff,
  FiX,
  FiSave,
  FiSearch,
  FiLogOut,
  FiAlertCircle,
} from "react-icons/fi";
import { useBooks } from "../../context/BooksContext";
import { useAuth } from "../../context/AuthContext";
import {
  BOOK_CATEGORIES,
  CATEGORY_SUBJECTS,
  CATEGORY_STANDARDS,
  BOOK_TYPES,
  ACTION_TYPES,
  generateCoverImage,
} from "../../data/booksData";
import AdminNav from "./AdminNav";
import "./AdminBooks.css";

// Compress image before upload
function compressImage(dataUrl, maxWidth = 300, maxHeight = 420, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to JPEG with quality setting
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const EMPTY_FORM = {
  title: "",
  category: BOOK_CATEGORIES[0].id,
  subject: CATEGORY_SUBJECTS[BOOK_CATEGORIES[0].id][0],
  standard: CATEGORY_STANDARDS[BOOK_CATEGORIES[0].id][0],
  author: "",
  publisher: "",
  description: "",
  edition: "",
  price: "",
  bookType: BOOK_TYPES[0],
  actionType: ACTION_TYPES[0],
  buyLink: "",
  downloadUrl: "",
  isPublished: true,
  coverImage: null,
};

export default function AdminBooks() {
  const { books, addBook, updateBook, deleteBook, togglePublish } = useBooks();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [coverPreview, setCoverPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");

  const subjectOptions = CATEGORY_SUBJECTS[form.category] || [];
  const standardOptions = CATEGORY_STANDARDS[form.category] || [];

  const stats = useMemo(() => {
    const published = books.filter((b) => b.isPublished !== false).length;
    return {
      total: books.length,
      published,
      draft: books.length - published,
      categories: new Set(books.map((b) => b.category)).size,
    };
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      if (filterCategory !== "All" && b.category !== filterCategory) return false;
      if (filterStatus === "Published" && b.isPublished === false) return false;
      if (filterStatus === "Draft" && b.isPublished !== false) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (
          !b.title.toLowerCase().includes(q) &&
          !(b.author || "").toLowerCase().includes(q) &&
          !(b.subject || "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [books, filterCategory, filterStatus, search]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setCoverPreview(null);
    setEditingId(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
    setError(null);
  };

  const openEditForm = (book) => {
    setForm({
      title: book.title || "",
      category: book.category || BOOK_CATEGORIES[0].id,
      subject: book.subject || CATEGORY_SUBJECTS[book.category || BOOK_CATEGORIES[0].id]?.[0] || "",
      standard: book.standard || CATEGORY_STANDARDS[book.category || BOOK_CATEGORIES[0].id]?.[0] || 0,
      author: book.author || "",
      publisher: book.publisher || "",
      description: book.description || "",
      edition: book.edition || "",
      price: book.price || "",
      bookType: book.bookType || BOOK_TYPES[0],
      actionType: book.actionType || ACTION_TYPES[0],
      buyLink: book.buyLink || "",
      downloadUrl: book.downloadUrl || "",
      isPublished: book.isPublished !== false,
      coverImage: book.coverImage || null,
    });
    setCoverPreview(book.coverImage || null);
    setEditingId(book.id);
    setError(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (categoryId) => {
    setForm((f) => ({
      ...f,
      category: categoryId,
      subject: CATEGORY_SUBJECTS[categoryId]?.[0] || "",
      standard: CATEGORY_STANDARDS[categoryId]?.[0] || 0,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsCompressing(true);
    setError(null);
    
    try {
      // Read the file as data URL
      const dataUrl = await fileToDataUrl(file);
      
      // Compress the image
      const compressedDataUrl = await compressImage(dataUrl, 300, 420, 0.7);
      
      // Check the size - if still too large, compress more
      const sizeInKB = compressedDataUrl.length / 1024;
      console.log(`Compressed image size: ${sizeInKB.toFixed(2)} KB`);
      
      if (sizeInKB > 100) {
        // If still over 100KB, compress more aggressively
        console.log("Image still large, compressing more...");
        const furtherCompressed = await compressImage(dataUrl, 200, 280, 0.5);
        setForm((f) => ({ ...f, coverImage: furtherCompressed }));
        setCoverPreview(furtherCompressed);
        console.log(`Final image size: ${(furtherCompressed.length / 1024).toFixed(2)} KB`);
      } else {
        setForm((f) => ({ ...f, coverImage: compressedDataUrl }));
        setCoverPreview(compressedDataUrl);
      }
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process image. Please try a smaller image (under 1MB).");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!form.title.trim()) {
      setError("Book title is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create a clean payload
      const payload = {
        title: form.title.trim(),
        category: form.category,
        subject: form.subject,
        standard: Number(form.standard),
        author: form.author || "",
        publisher: form.publisher || "",
        description: form.description || "",
        edition: form.edition || "",
        price: form.price || "",
        bookType: form.bookType,
        actionType: form.actionType,
        buyLink: form.buyLink || "",
        downloadUrl: form.downloadUrl || "",
        isPublished: form.isPublished,
        coverImage: form.coverImage || null,
      };

      // Remove null/undefined values to keep payload clean
      Object.keys(payload).forEach(key => {
        if (payload[key] === null || payload[key] === undefined) {
          delete payload[key];
        }
      });

      if (editingId) {
        await updateBook(editingId, payload);
      } else {
        await addBook(payload);
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to save book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (book) => {
    if (window.confirm(`Delete "${book.title}"? This can't be undone.`)) {
      deleteBook(book.id).catch(err => {
        console.error("Delete error:", err);
        setError("Failed to delete book. Please try again.");
      });
    }
  };

  const previewCover = coverPreview || generateCoverImage(form.title, form.subject, form.category);

  return (
    <div className="uka-ab-page">
      <div className="uka-ab-header">
        <div>
          <h1>Books Management</h1>
          <p>Add, edit and organize the Books library shown on the public site.</p>
        </div>
        <div className="uka-ab-header-actions">
          <button className="uka-ab-btn uka-ab-btn-gold" onClick={openAddForm}>
            <FiPlus /> Add New Book
          </button>
          <button
            className="uka-ab-btn uka-ab-btn-ghost"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      <AdminNav />

      <div className="uka-ab-stats">
        <div className="uka-ab-stat">
          <span className="uka-ab-stat-value">{stats.total}</span>
          <span className="uka-ab-stat-label">Total Books</span>
        </div>
        <div className="uka-ab-stat">
          <span className="uka-ab-stat-value">{stats.published}</span>
          <span className="uka-ab-stat-label">Published</span>
        </div>
        <div className="uka-ab-stat">
          <span className="uka-ab-stat-value">{stats.draft}</span>
          <span className="uka-ab-stat-label">Draft</span>
        </div>
        <div className="uka-ab-stat">
          <span className="uka-ab-stat-value">{stats.categories}</span>
          <span className="uka-ab-stat-label">Categories in Use</span>
        </div>
      </div>

      {showForm && (
        <form className="uka-ab-form-card" onSubmit={handleSubmit}>
          <div className="uka-ab-form-header">
            <h2>
              <FiBook /> {editingId ? "Edit Book" : "Add New Book"}
            </h2>
            <button
              type="button"
              className="uka-ab-icon-btn"
              onClick={() => {
                resetForm();
                setShowForm(false);
                setError(null);
              }}
            >
              <FiX />
            </button>
          </div>

          {error && (
            <div className="uka-ab-error-banner">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <div className="uka-ab-form-grid">
            <div className="uka-ab-cover-col">
              <div className="uka-ab-cover-preview">
                {isCompressing ? (
                  <div className="uka-ab-compressing">
                    <span>Compressing image...</span>
                  </div>
                ) : (
                  <img src={previewCover} alt="Cover preview" />
                )}
              </div>
              <button
                type="button"
                className="uka-ab-btn uka-ab-btn-small"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
              >
                <FiUpload /> {isCompressing ? "Compressing..." : "Upload Cover"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <p className="uka-ab-hint">
                Images are automatically compressed. Max 1MB recommended.
              </p>
            </div>

            <div className="uka-ab-fields-col">
              <div className="uka-ab-field-row">
                <label className="uka-ab-field">
                  Book Title *
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. NCERT Mathematics"
                    required
                  />
                </label>
              </div>

              <div className="uka-ab-field-row three">
                <label className="uka-ab-field">
                  Category
                  <select
                    value={form.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {BOOK_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="uka-ab-field">
                  Subject
                  <select
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  >
                    {subjectOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="uka-ab-field">
                  Standard / Class
                  <select
                    value={form.standard}
                    onChange={(e) => setForm((f) => ({ ...f, standard: Number(e.target.value) }))}
                  >
                    {standardOptions.map((s) => (
                      <option key={s} value={s}>
                        Class {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="uka-ab-field-row three">
                <label className="uka-ab-field">
                  Author
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  />
                </label>
                <label className="uka-ab-field">
                  Publisher
                  <input
                    type="text"
                    value={form.publisher}
                    onChange={(e) => setForm((f) => ({ ...f, publisher: e.target.value }))}
                  />
                </label>
                <label className="uka-ab-field">
                  Edition / Year
                  <input
                    type="text"
                    value={form.edition}
                    onChange={(e) => setForm((f) => ({ ...f, edition: e.target.value }))}
                    placeholder="2025-26"
                  />
                </label>
              </div>

              <div className="uka-ab-field-row">
                <label className="uka-ab-field">
                  Description
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Short description shown on the book card"
                  />
                </label>
              </div>

              <div className="uka-ab-field-row three">
                <label className="uka-ab-field">
                  Price (if applicable)
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="₹350"
                  />
                </label>
                <label className="uka-ab-field">
                  Book Type
                  <select
                    value={form.bookType}
                    onChange={(e) => setForm((f) => ({ ...f, bookType: e.target.value }))}
                  >
                    {BOOK_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="uka-ab-field">
                  Action Button
                  <select
                    value={form.actionType}
                    onChange={(e) => setForm((f) => ({ ...f, actionType: e.target.value }))}
                  >
                    {ACTION_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="uka-ab-field-row">
                <label className="uka-ab-field">
                  Buy Link (optional)
                  <input
                    type="text"
                    value={form.buyLink}
                    onChange={(e) => setForm((f) => ({ ...f, buyLink: e.target.value }))}
                    placeholder="https://..."
                  />
                </label>
                <label className="uka-ab-field">
                  PDF / Download URL (optional)
                  <input
                    type="text"
                    value={form.downloadUrl}
                    onChange={(e) => setForm((f) => ({ ...f, downloadUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </label>
              </div>

              <label className="uka-ab-checkbox">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                />
                Published (visible on the public Books section)
              </label>
            </div>
          </div>

          <div className="uka-ab-form-actions">
            <button 
              type="submit" 
              className="uka-ab-btn uka-ab-btn-gold"
              disabled={isSubmitting || isCompressing}
            >
              <FiSave /> 
              {isCompressing ? "Compressing..." : 
               isSubmitting ? "Saving..." : 
               (editingId ? "Save Changes" : "Add Book")}
            </button>
            <button
              type="button"
              className="uka-ab-btn uka-ab-btn-ghost"
              onClick={() => {
                resetForm();
                setShowForm(false);
                setError(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="uka-ab-toolbar">
        <h2>All Books ({filteredBooks.length})</h2>
        <div className="uka-ab-toolbar-actions">
          <div className="uka-ab-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search title, author, subject…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="All">All Categories</option>
            {BOOK_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="uka-ab-empty">
          <FiBook size={34} />
          <p>No books match these filters.</p>
        </div>
      ) : (
        <div className="uka-ab-grid">
          {filteredBooks.map((book) => {
            const catName =
              BOOK_CATEGORIES.find((c) => c.id === book.category)?.name || book.category;
            const cover =
              book.coverImage || generateCoverImage(book.title, book.subject, book.category);
            return (
              <div key={book.id} className="uka-ab-card">
                <div className="uka-ab-card-image-wrap">
                  <img src={cover} alt={book.title} />
                  <span
                    className={`uka-ab-status-badge ${
                      book.isPublished === false ? "draft" : "published"
                    }`}
                  >
                    {book.isPublished === false ? "Draft" : "Published"}
                  </span>
                </div>
                <div className="uka-ab-card-body">
                  <h4>{book.title}</h4>
                  <p className="uka-ab-card-meta">
                    {catName} · {book.subject} · Class {book.standard}
                  </p>
                  {book.price && <p className="uka-ab-card-price">{book.price}</p>}
                  <div className="uka-ab-card-actions">
                    <button className="uka-ab-icon-btn" onClick={() => openEditForm(book)} title="Edit">
                      <FiEdit2 />
                    </button>
                    <button
                      className="uka-ab-icon-btn"
                      onClick={() => togglePublish(book.id)}
                      title={book.isPublished === false ? "Publish" : "Unpublish"}
                    >
                      {book.isPublished === false ? <FiCheckCircle /> : <FiEyeOff />}
                    </button>
                    <button
                      className="uka-ab-icon-btn danger"
                      onClick={() => handleDelete(book)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}