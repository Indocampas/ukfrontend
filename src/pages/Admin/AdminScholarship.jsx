// src/pages/Admin/AdminScholarship.jsx
//
// LOCAL DEVELOPMENT MODE — see ScholarshipContext.jsx. Nothing here calls
// the Spring Boot backend; scheduling, template uploads/parsing, and student
// management all read/write localStorage through useScholarship().
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiTrash2,
  FiLogOut,
  FiExternalLink,
  FiUpload,
  FiEdit3,
  FiUsers,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiUnlock,
  FiCalendar,
} from "react-icons/fi";
import { useScholarship } from "../../context/ScholarshipContext";
import { useAuth } from "../../context/AuthContext";
import { COURSE_CATEGORIES, getCategoryLabel } from "../../data/courseCategories";
import { extractTextFromPdf } from "../../utils/pdfTextExtract";
import { parseQuestionsFromText } from "../../utils/examQuestionParser";
import ExamTemplateEditor from "./ExamTemplateEditor";
import ManageStudentsModal from "./ManageStudentsModal";
import AdminNav from "./AdminNav";
import "./AdminGallery.css";
import "./AdminScholarship.css";

const EMPTY_FORM = {
  title: "",
  categorySlug: COURSE_CATEGORIES[0].slug,
  examDate: "",
  examTime: "",
  durationMinutes: 60,
  description: "",
  registrationOpenDate: "",
  registrationCloseDate: "",
};

function formatWindow(exam) {
  if (!exam.examDate || !exam.examTime) return "Not scheduled yet";
  return `${exam.examDate} at ${exam.examTime} · ${exam.durationMinutes || 60} min`;
}

function formatRegistrationPeriod(exam) {
  if (!exam.registrationOpenDate && !exam.registrationCloseDate) return "Always open (manual control)";
  
  const parts = [];
  if (exam.registrationOpenDate) {
    const date = new Date(exam.registrationOpenDate);
    parts.push(`Opens: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
  }
  if (exam.registrationCloseDate) {
    const date = new Date(exam.registrationCloseDate);
    parts.push(`Closes: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
  }
  return parts.join(" · ");
}

export default function AdminScholarship() {
  const { exams, createExam, updateExam, deleteExam, uploadExamTemplate, updateExamTemplateQuestions, publishResults } =
    useScholarship();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [templateExamId, setTemplateExamId] = useState(null);
  const [studentsExamId, setStudentsExamId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [processingError, setProcessingError] = useState("");

  const templateFileRefs = useRef({});

  const handleFormChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleCreateExam = async () => {
    if (!form.title.trim()) return;
    await createExam({
      title: form.title.trim(),
      categorySlug: form.categorySlug,
      examDate: form.examDate,
      examTime: form.examTime,
      durationMinutes: Number(form.durationMinutes) || 60,
      description: form.description.trim(),
      registrationOpen: true,
      registrationOpenDate: form.registrationOpenDate || null,
      registrationCloseDate: form.registrationCloseDate || null,
    });
    setForm(EMPTY_FORM);
  };

  const handleUploadTemplate = async (examId, file) => {
    if (!file) return;
    setProcessingError("");
    setProcessingId(examId);
    try {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        throw new Error("Please upload the exam template as a PDF file.");
      }
      const { fullText } = await extractTextFromPdf(file);
      const questions = parseQuestionsFromText(fullText);
      await uploadExamTemplate(examId, { fileName: file.name, rawText: fullText, questions });
      setTemplateExamId(examId);
    } catch (err) {
      console.error(err);
      setProcessingError(err.message || "Could not read that PDF. Please try another file.");
    } finally {
      setProcessingId(null);
      if (templateFileRefs.current[examId]) templateFileRefs.current[examId].value = "";
    }
  };

  const toggleRegistration = (exam) => {
    updateExam(exam.id, { registrationOpen: !exam.registrationOpen });
  };

  const handlePublish = (examId) => {
    if (window.confirm("Publish results for this exam? Registered students will be able to see their scores.")) {
      publishResults(examId);
    }
  };

  const handleDelete = (examId, title) => {
    if (window.confirm(`Delete "${title}"? This removes the exam, its template and its registrations.`)) {
      deleteExam(examId);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const activeTemplateExam = exams.find((e) => e.id === templateExamId) || null;
  const activeStudentsExam = exams.find((e) => e.id === studentsExamId) || null;

  return (
    <div className="uka-admin-page">
      <AdminNav />
      <header className="uka-admin-header">
        <div className="uka-admin-header-left">
          <h1>Scholarship Management</h1>
          <p>Schedule Scholarship Exams, upload exam templates, manage students and publish results.</p>
          <p className="uka-admin-local-note">
            <FiLock /> Running in local development mode — all data is stored in this browser only (no backend yet).
          </p>
        </div>
        <div className="uka-admin-header-actions">
          <button className="uka-admin-btn uka-admin-btn-ghost" onClick={() => navigate("/scholarship/register")}>
            <FiExternalLink /> View Student Registration Page
          </button>
          <button className="uka-admin-btn uka-admin-btn-ghost" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      {/* ---------------- Section 1: Schedule New Scholarship Exam ---------------- */}
      <section className="uka-admin-upload-card">
        <h2>
          <FiPlus /> Schedule New Scholarship Exam
        </h2>
        <div className="uka-course-form-grid">
          <label className="uka-admin-field">
            <span>Exam Title</span>
            <input
              type="text"
              placeholder="e.g. NEET Scholarship Test 2026"
              value={form.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
            />
          </label>
          <label className="uka-admin-field">
            <span>Course Category</span>
            <select value={form.categorySlug} onChange={(e) => handleFormChange("categorySlug", e.target.value)}>
              {COURSE_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.label}
                </option>
              ))}
            </select>
          </label>
          <label className="uka-admin-field uka-exam-field">
            <span>Exam Duration (minutes)</span>
            <div className="uka-exam-input-wrap">
              <input
                type="number"
                min="1"
                placeholder="e.g. 60"
                value={form.durationMinutes}
                onChange={(e) =>
                  handleFormChange("durationMinutes", e.target.value)
                }
              />
              <span className="uka-input-suffix">min</span>
            </div>
          </label>

          <label className="uka-admin-field uka-exam-field">
            <span>Exam Date</span>
            <input
              type="date"
              value={form.examDate}
              onChange={(e) =>
                handleFormChange("examDate", e.target.value)
              }
            />
          </label>

          <label className="uka-admin-field uka-exam-field">
            <span>Exam Time</span>
            <input
              type="time"
              value={form.examTime}
              onChange={(e) =>
                handleFormChange("examTime", e.target.value)
              }
            />
          </label>

          {/* Registration Date Fields */}
          <label className="uka-admin-field uka-exam-field">
            <span>Registration Opens</span>
            <input
              type="datetime-local"
              value={form.registrationOpenDate}
              onChange={(e) => handleFormChange("registrationOpenDate", e.target.value)}
            />
            <small>Leave empty to open immediately</small>
          </label>

          <label className="uka-admin-field uka-exam-field">
            <span>Registration Closes</span>
            <input
              type="datetime-local"
              value={form.registrationCloseDate}
              onChange={(e) => handleFormChange("registrationCloseDate", e.target.value)}
            />
            <small>Leave empty for no closing date</small>
          </label>

          <label className="uka-admin-field uka-course-field-wide">
            <span>Exam Description</span>
            <textarea
              rows={2}
              placeholder="Eligibility, syllabus, scholarship tiers..."
              value={form.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
            />
          </label>
          <button
            className="uka-admin-btn uka-admin-btn-gold uka-course-add-btn"
            onClick={handleCreateExam}
            disabled={!form.title.trim()}
          >
            <FiUpload /> Schedule Exam
          </button>
        </div>
      </section>

      {/* ---------------- Section 2: Scheduled Scholarship Exams ---------------- */}
      <section className="uka-admin-gallery-section">
        <div className="uka-admin-toolbar">
          <h2>Scheduled Scholarship Exams ({exams.length})</h2>
        </div>

        {processingError && <p className="uka-schreg-error">{processingError}</p>}

        <div className="uka-scholarship-list">
          {exams.map((exam) => {
            const hasTemplate = !!exam.template && exam.template.questions?.length > 0;
            const isProcessing = processingId === exam.id;
            return (
              <div className="uka-scholarship-card" key={exam.id}>
                <div className="uka-scholarship-card-header">
                  <div>
                    <h3>{exam.title}</h3>
                    <p className="uka-scholarship-meta">
                      <FiClock /> {formatWindow(exam)}
                      <span className="uka-scholarship-category-tag">{getCategoryLabel(exam.categorySlug)}</span>
                      <button
                        className={
                          "uka-scholarship-reg-toggle" +
                          (exam.registrationOpen ? " uka-scholarship-reg-open" : " uka-scholarship-reg-closed")
                        }
                        onClick={() => toggleRegistration(exam)}
                        title="Click to toggle registration status"
                      >
                        {exam.registrationOpen ? <FiUnlock /> : <FiLock />}
                        {exam.registrationOpen ? "Registration Open" : "Registration Closed"}
                      </button>
                      {exam.resultsPublished && (
                        <span className="uka-scholarship-published-tag">
                          <FiCheckCircle /> Results Published
                        </span>
                      )}
                    </p>
                    {/* Display Registration Period */}
                    {(exam.registrationOpenDate || exam.registrationCloseDate) && (
                      <p className="uka-scholarship-reg-period">
                        <FiCalendar /> {formatRegistrationPeriod(exam)}
                      </p>
                    )}
                    {exam.description && <p className="uka-scholarship-desc">{exam.description}</p>}
                  </div>
                  <div className="uka-scholarship-card-actions">
                    <button
                      className="uka-admin-btn uka-admin-btn-small uka-admin-btn-danger"
                      onClick={() => handleDelete(exam.id, exam.title)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>

                <div className="uka-scholarship-details">
                  <div className="uka-scholarship-files-row">
                    <label className="uka-admin-btn uka-admin-btn-small uka-course-media-btn">
                      <FiUpload /> {isProcessing ? "Processing..." : hasTemplate ? "Replace Exam Template" : "Upload Exam Template"}
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        hidden
                        disabled={isProcessing}
                        ref={(el) => (templateFileRefs.current[exam.id] = el)}
                        onChange={(e) => handleUploadTemplate(exam.id, e.target.files?.[0])}
                      />
                    </label>
                    <button
                      className="uka-admin-btn uka-admin-btn-small"
                      onClick={() => setTemplateExamId(exam.id)}
                      disabled={!hasTemplate}
                    >
                      <FiEdit3 /> View / Edit Template
                    </button>
                    <button className="uka-admin-btn uka-admin-btn-small" onClick={() => setStudentsExamId(exam.id)}>
                      <FiUsers /> Manage Registered Students
                    </button>
                    <button
                      className="uka-admin-btn uka-admin-btn-small uka-admin-btn-gold"
                      onClick={() => handlePublish(exam.id)}
                      disabled={exam.resultsPublished || !hasTemplate}
                    >
                      <FiAward /> {exam.resultsPublished ? "Results Published" : "Publish Results"}
                    </button>
                  </div>
                  {!hasTemplate && (
                    <p className="uka-admin-empty">
                      No exam template uploaded yet. Upload a PDF above — its text is extracted right in your browser
                      and turned into online exam questions.
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {exams.length === 0 && <p className="uka-admin-empty">No Scholarship Exams scheduled yet.</p>}
        </div>
      </section>

      {activeTemplateExam && (
        <ExamTemplateEditor
          exam={activeTemplateExam}
          onClose={() => setTemplateExamId(null)}
          onSave={async (questions) => {
            await updateExamTemplateQuestions(activeTemplateExam.id, questions);
            setTemplateExamId(null);
          }}
        />
      )}

      {activeStudentsExam && <ManageStudentsModal exam={activeStudentsExam} onClose={() => setStudentsExamId(null)} />}
    </div>
  );
}