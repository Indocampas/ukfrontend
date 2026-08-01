// src/pages/Admin/AdminCourses.jsx
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUpload,
  FiTrash2,
  FiSave,
  FiLogOut,
  FiImage,
  FiFilm,
  FiPlus,
  FiRefreshCw,
  FiCheckCircle,
  FiExternalLink,
  FiChevronDown,
  FiChevronUp,
  FiFile,
  FiFileText,
} from "react-icons/fi";
import { useCourses } from "../../context/CourseContext";
import { useAuth } from "../../context/AuthContext";
import {
  COURSE_CATEGORIES,
  COURSE_TYPES,
  COURSE_STATUSES,
  getCourseType,
} from "../../data/courseCategories";
import AdminNav from "./AdminNav";
import "./AdminGallery.css";
import "./AdminCourses.css";

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
  categorySlug: COURSE_CATEGORIES[0].slug,
  courseType: COURSE_TYPES[0].key,
  classGrade: "",
  description: "",
  price: "",
  duration: "",
  features: "",
  status: "Active",
  videoUrl: "",
  pdfUrl: "",
};

export default function AdminCourses() {
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    replaceCourseImage,
    uploadCourseVideo,
    setCourseVideoUrl,
    uploadCoursePdf,
    setCoursePdfUrl,
    saveCourses,
    lastSaved,
  } = useCourses();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [newPdfFile, setNewPdfFile] = useState(null);
  const [newPdfName, setNewPdfName] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  // --- New state for custom category ---
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  const newImageInputRef = useRef(null);
  const replaceImageInputRefs = useRef({});
  const replaceVideoInputRefs = useRef({});
  const replacePdfInputRefs = useRef({});
  const newPdfInputRef = useRef(null);

  const selectedType = getCourseType(form.courseType);

  const handleFormChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // --- Handle category select change ---
  const handleCategoryChange = (value) => {
    if (value === "other") {
      setIsCustomCategory(true);
      setCustomCategoryInput("");
      setForm((prev) => ({ ...prev, categorySlug: "" })); // temporarily empty
    } else {
      setIsCustomCategory(false);
      setCustomCategoryInput("");
      setForm((prev) => ({ ...prev, categorySlug: value }));
    }
  };

  // --- Handle custom category input ---
  const handleCustomCategoryInput = (value) => {
    setCustomCategoryInput(value);
    setForm((prev) => ({ ...prev, categorySlug: value.trim() || "" }));
  };

  const handleNewImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    setNewImagePreview(await fileToDataUrl(file));
  };

  const handleNewPdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setNewPdfFile(null);
      setNewPdfName("");
      return;
    }
    if (file.type !== "application/pdf") {
      alert("Please select a PDF file");
      e.target.value = "";
      return;
    }
    setNewPdfFile(file);
    setNewPdfName(file.name);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setNewImageFile(null);
    setNewImagePreview(null);
    setNewPdfFile(null);
    setNewPdfName("");
    setIsCustomCategory(false);
    setCustomCategoryInput("");
    if (newImageInputRef.current) newImageInputRef.current.value = "";
    if (newPdfInputRef.current) newPdfInputRef.current.value = "";
  };

  const handleAddCourse = async () => {
    if (!form.name.trim()) return;
    // Ensure categorySlug is not empty if custom category is selected but nothing typed
    if (isCustomCategory && !form.categorySlug.trim()) {
      alert("Please enter a custom category name.");
      return;
    }
    const courseData = {
      name: form.name.trim(),
      categorySlug: form.categorySlug.trim(),
      courseType: form.courseType,
      classGrade: form.classGrade.trim(),
      description: form.description.trim(),
      price: form.price ? Number(form.price) : 0,
      duration: form.duration.trim(),
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      status: form.status,
      image: selectedType.mediaKind === "image" ? newImagePreview : null,
      video: selectedType.mediaKind === "video" ? form.videoUrl.trim() || null : null,
      pdf: selectedType.mediaKind === "pdf" ? form.pdfUrl.trim() || null : null,
    };
    
    const created = await addCourse(courseData);
    resetForm();
    if (created?.id) {
      if (selectedType.mediaKind === "pdf" && newPdfFile && created.id) {
        try {
          await uploadCoursePdf(created.id, newPdfFile);
        } catch (error) {
          console.error("Failed to upload PDF:", error);
          alert("Course created but PDF upload failed. You can upload it later.");
        }
      }
      setExpandedId(created.id);
    }
  };

  const handleReplaceImage = async (id, file) => {
    if (!file) return;
    replaceCourseImage(id, await fileToDataUrl(file));
  };

  const handleUploadVideo = (id, file) => {
    if (!file) return;
    uploadCourseVideo(id, file);
  };

  const handleUploadPdf = (id, file) => {
    if (!file) return;
    uploadCoursePdf(id, file);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}" from the course catalog?`)) {
      deleteCourse(id);
    }
  };

  const handleSave = () => {
    saveCourses();
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2200);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleFeaturesEdit = (id, value) => {
    updateCourse(id, {
      features: value
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    });
  };

  // --- Build filter category options dynamically ---
  const getFilterCategories = () => {
    const staticSlugs = COURSE_CATEGORIES.map(c => c.slug);
    const customSlugs = courses
      .map(c => c.categorySlug)
      .filter(slug => slug && !staticSlugs.includes(slug));
    const allSlugs = [...staticSlugs, ...customSlugs];
    // Remove duplicates
    return [...new Set(allSlugs)];
  };

  const visibleCourses = courses.filter(
    (c) =>
      (filterCategory === "All" || c.categorySlug === filterCategory) &&
      (filterType === "All" || c.courseType === filterType)
  );

  // Helper to get media icon for course cards
  const getMediaIcon = (type) => {
    if (type.mediaKind === "video") return <FiFilm />;
    if (type.mediaKind === "pdf") return <FiFileText />;
    return <FiImage />;
  };

  // Helper to render media preview
  const renderMediaPreview = (course, type) => {
    if (type.mediaKind === "video") {
      return course.video ? (
        <video src={course.video} controls preload="metadata" />
      ) : (
        <div className="uka-admin-upload-placeholder">
          <FiFilm />
          <span>No video yet</span>
        </div>
      );
    } else if (type.mediaKind === "pdf") {
      return course.pdf ? (
        <div className="uka-course-pdf-preview">
          <FiFileText size={40} />
          <a href={course.pdf} target="_blank" rel="noopener noreferrer" className="uka-course-pdf-link">
            View PDF
          </a>
        </div>
      ) : (
        <div className="uka-admin-upload-placeholder">
          <FiFileText />
          <span>No PDF yet</span>
        </div>
      );
    } else {
      return course.image ? (
        <img src={course.image} alt={course.name} />
      ) : (
        <div className="uka-admin-upload-placeholder">
          <FiImage />
          <span>No image yet</span>
        </div>
      );
    }
  };

  // Helper to render media upload options in expanded details
  const renderMediaUploadOptions = (course, type) => {
    if (type.mediaKind === "image") {
      return (
        <label className="uka-admin-btn uka-admin-btn-small uka-course-media-btn">
          <FiRefreshCw /> Replace Image
          <input
            type="file"
            accept="image/*"
            hidden
            ref={(el) => (replaceImageInputRefs.current[course.id] = el)}
            onChange={(e) => handleReplaceImage(course.id, e.target.files?.[0])}
          />
        </label>
      );
    } else if (type.mediaKind === "video") {
      return (
        <>
          <label className="uka-admin-btn uka-admin-btn-small uka-course-media-btn">
            <FiUpload /> Upload Video File
            <input
              type="file"
              accept="video/*"
              hidden
              ref={(el) => (replaceVideoInputRefs.current[course.id] = el)}
              onChange={(e) => handleUploadVideo(course.id, e.target.files?.[0])}
            />
          </label>
          <label className="uka-admin-field">
            <span>...or Video URL</span>
            <input
              type="text"
              defaultValue={course.video || ""}
              placeholder="Paste hosted/CDN or YouTube link"
              onBlur={(e) => setCourseVideoUrl(course.id, e.target.value.trim())}
            />
          </label>
        </>
      );
    } else if (type.mediaKind === "pdf") {
      return (
        <>
          <label className="uka-admin-btn uka-admin-btn-small uka-course-media-btn">
            <FiUpload /> Upload PDF
            <input
              type="file"
              accept="application/pdf"
              hidden
              ref={(el) => (replacePdfInputRefs.current[course.id] = el)}
              onChange={(e) => handleUploadPdf(course.id, e.target.files?.[0])}
            />
          </label>
          <label className="uka-admin-field">
            <span>...or PDF URL</span>
            <input
              type="text"
              defaultValue={course.pdf || ""}
              placeholder="Paste hosted PDF URL"
              onBlur={(e) => setCoursePdfUrl(course.id, e.target.value.trim())}
            />
          </label>
          {course.pdf && (
            <a 
              href={course.pdf} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="uka-admin-btn uka-admin-btn-small uka-course-pdf-view-btn"
            >
              <FiExternalLink /> View Current PDF
            </a>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div className="uka-admin-page">
      <AdminNav />
      <header className="uka-admin-header">
        <div className="uka-admin-header-left">
          <h1>Course Management</h1>
          <p>
            Create, edit and delete courses across NEET, JEE, Foundation and NEET & JEE Foundation (Individual) —
            Classroom, Online, Recorded, Test Series and Study Materials.
          </p>
        </div>
        <div className="uka-admin-header-actions">
          <button className="uka-admin-btn uka-admin-btn-ghost" onClick={() => navigate("/")}>
            <FiExternalLink /> View Public Courses
          </button>
          <button className="uka-admin-btn uka-admin-btn-ghost" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <section className="uka-admin-upload-card">
        <h2>
          <FiPlus /> Add New Course
        </h2>
        <div className="uka-course-form-grid">
          <label className="uka-admin-field">
            <span>Course Name</span>
            <input
              type="text"
              placeholder="e.g. NEET 2-Year Classroom Program"
              value={form.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
          </label>
          <label className="uka-admin-field">
            <span>Course Category</span>
            <select
              value={isCustomCategory ? "other" : form.categorySlug}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {COURSE_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
              <option value="other">+ Others (custom)</option>
            </select>
            {isCustomCategory && (
              <input
                type="text"
                placeholder="Enter custom category name"
                value={customCategoryInput}
                onChange={(e) => handleCustomCategoryInput(e.target.value)}
                style={{ marginTop: "6px", width: "100%" }}
              />
            )}
          </label>
          <label className="uka-admin-field">
            <span>Course Type</span>
            <select value={form.courseType} onChange={(e) => handleFormChange("courseType", e.target.value)}>
              {COURSE_TYPES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="uka-admin-field">
            <span>Class / Grade</span>
            <input
              type="text"
              placeholder="e.g. Class 11–12 or Classes 6–10"
              value={form.classGrade}
              onChange={(e) => handleFormChange("classGrade", e.target.value)}
            />
          </label>
          <label className="uka-admin-field uka-price-field">
            <span>Course Price (₹)</span>
            <div className="uka-price-input-wrap">
              <span className="uka-rupee-symbol">₹</span>
              <input
                type="number"
                min="0"
                placeholder="e.g. 45000"
                value={form.price}
                onChange={(e) => handleFormChange("price", e.target.value)}
              />
            </div>
          </label>
          <label className="uka-admin-field">
            <span>Course Duration</span>
            <input
              type="text"
              placeholder="e.g. 2 Years / 6 Months"
              value={form.duration}
              onChange={(e) => handleFormChange("duration", e.target.value)}
            />
          </label>
          <label className="uka-admin-field uka-course-field-wide">
            <span>Course Description</span>
            <textarea
              rows={3}
              placeholder="What this course covers, who it's for, teaching format..."
              value={form.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
            />
          </label>
          <label className="uka-admin-field uka-course-field-wide">
            <span>Course Features (comma-separated)</span>
            <input
              type="text"
              placeholder="e.g. Live Doubt Solving, Weekly Tests, Study Material Included"
              value={form.features}
              onChange={(e) => handleFormChange("features", e.target.value)}
            />
          </label>
          <label className="uka-admin-field">
            <span>Course Status</span>
            <select value={form.status} onChange={(e) => handleFormChange("status", e.target.value)}>
              {COURSE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          {selectedType.mediaKind === "image" ? (
            <label className="uka-admin-field">
              <span>Course Image</span>
              <input type="file" accept="image/*" ref={newImageInputRef} onChange={handleNewImageChange} />
            </label>
          ) : selectedType.mediaKind === "video" ? (
            <label className="uka-admin-field">
              <span>Intro Video URL</span>
              <input
                type="text"
                placeholder="Paste hosted/CDN or YouTube link (upload the file after creating)"
                value={form.videoUrl}
                onChange={(e) => handleFormChange("videoUrl", e.target.value)}
              />
            </label>
          ) : selectedType.mediaKind === "pdf" ? (
            <>
              <label className="uka-admin-field">
                <span>PDF File</span>
                <div className="uka-pdf-upload-wrapper">
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    ref={newPdfInputRef} 
                    onChange={handleNewPdfChange}
                    className="uka-pdf-file-input"
                  />
                  {newPdfName && (
                    <span className="uka-pdf-file-name">
                      <FiFile /> {newPdfName}
                    </span>
                  )}
                </div>
              </label>
              <label className="uka-admin-field">
                <span>...or PDF URL</span>
                <input
                  type="text"
                  placeholder="Paste hosted PDF URL"
                  value={form.pdfUrl}
                  onChange={(e) => handleFormChange("pdfUrl", e.target.value)}
                />
              </label>
            </>
          ) : null}

          {selectedType.mediaKind === "image" && newImagePreview && (
            <div className="uka-admin-upload-preview uka-course-form-preview">
              <img src={newImagePreview} alt="New course preview" />
            </div>
          )}

          <button
            className="uka-admin-btn uka-admin-btn-gold uka-course-add-btn"
            onClick={handleAddCourse}
            disabled={!form.name.trim()}
          >
            <FiUpload /> Add Course
          </button>
        </div>
      </section>

      <section className="uka-admin-gallery-section">
        <div className="uka-admin-toolbar">
          <h2>Current Courses ({visibleCourses.length})</h2>
          <div className="uka-admin-toolbar-actions">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {getFilterCategories().map((slug) => {
                const cat = COURSE_CATEGORIES.find(c => c.slug === slug);
                const label = cat ? cat.label : slug;
                return (
                  <option key={slug} value={slug}>
                    {label}
                  </option>
                );
              })}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All Course Types</option>
              {COURSE_TYPES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
            <button className="uka-admin-btn uka-admin-btn-gold" onClick={handleSave}>
              {savedFlash ? <FiCheckCircle /> : <FiSave />}
              {savedFlash ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="uka-course-grid">
          {visibleCourses.map((course) => {
            const type = getCourseType(course.courseType) || COURSE_TYPES[0];
            const expanded = expandedId === course.id;
            return (
              <div className="uka-admin-card uka-course-card" key={course.id}>
                <div className="uka-admin-card-image-wrap uka-course-media-wrap">
                  {renderMediaPreview(course, type)}
                  <span className={`uka-course-status-badge uka-course-status-${course.status?.toLowerCase()}`}>
                    {course.status}
                  </span>
                </div>

                <div className="uka-admin-card-body">
                  <input
                    className="uka-admin-card-title"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                  />
                  <div className="uka-course-badges">
                    <span className="uka-course-badge">
                      {COURSE_CATEGORIES.find((c) => c.slug === course.categorySlug)?.label || course.categorySlug}
                    </span>
                    <span className="uka-course-badge uka-course-badge-alt">{type.label}</span>
                  </div>

                  <div className="uka-course-quick-row">
                    <label className="uka-course-quick-field">
                      <span>Price ₹</span>
                      <input
                        type="number"
                        min="0"
                        value={course.price ?? 0}
                        onChange={(e) => updateCourse(course.id, { price: Number(e.target.value) })}
                      />
                    </label>
                    <label className="uka-course-quick-field">
                      <span>Status</span>
                      <select value={course.status} onChange={(e) => updateCourse(course.id, { status: e.target.value })}>
                        {COURSE_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <button
                    className="uka-admin-btn uka-admin-btn-small uka-course-expand-btn"
                    onClick={() => setExpandedId(expanded ? null : course.id)}
                  >
                    {expanded ? <FiChevronUp /> : <FiChevronDown />}
                    {expanded ? "Hide details" : "Edit details"}
                  </button>

                  {expanded && (
                    <div className="uka-course-details">
                      <label className="uka-admin-field">
                        <span>Class / Grade</span>
                        <input
                          type="text"
                          value={course.classGrade || ""}
                          onChange={(e) => updateCourse(course.id, { classGrade: e.target.value })}
                        />
                      </label>
                      <label className="uka-admin-field">
                        <span>Duration</span>
                        <input
                          type="text"
                          value={course.duration || ""}
                          onChange={(e) => updateCourse(course.id, { duration: e.target.value })}
                        />
                      </label>
                      <label className="uka-admin-field">
                        <span>Description</span>
                        <textarea
                          rows={3}
                          value={course.description || ""}
                          onChange={(e) => updateCourse(course.id, { description: e.target.value })}
                        />
                      </label>
                      <label className="uka-admin-field">
                        <span>Features (comma-separated)</span>
                        <input
                          type="text"
                          defaultValue={(course.features || []).join(", ")}
                          onBlur={(e) => handleFeaturesEdit(course.id, e.target.value)}
                        />
                      </label>

                      {renderMediaUploadOptions(course, type)}
                    </div>
                  )}

                  <div className="uka-admin-card-actions">
                    <button
                      className="uka-admin-btn uka-admin-btn-small uka-admin-btn-danger"
                      onClick={() => handleDelete(course.id, course.name)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {visibleCourses.length === 0 && (
            <p className="uka-admin-empty">No courses match this filter yet.</p>
          )}
        </div>
      </section>

      {lastSaved && <p className="uka-admin-last-saved">Last saved: {lastSaved.toLocaleString()}</p>}
    </div>
  );
}