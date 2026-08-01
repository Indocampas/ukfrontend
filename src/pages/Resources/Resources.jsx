// src/pages/Resources/Resources.jsx
// Public page that displays the study resources managed by the admin from
// the Admin Dashboard: Previous Year Questions, Syllabus, Exam Dates and
// Answer Keys. Content here always mirrors what the admin has published.
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  FiFile, 
  FiFileText, 
  FiCalendar, 
  FiKey, 
  FiClock, 
  FiExternalLink, 
  FiLoader,
  FiArrowLeft,
  FiBookOpen,
  FiGrid,
  FiList,
  FiSearch
} from "react-icons/fi";
import { usePYQ } from "../../context/PYQContext";
import { useSyllabus } from "../../context/SyllabusContext";
import { useExamDate } from "../../context/ExamDateContext";
import { useAnswerKey } from "../../context/AnswerKeyContext";
import "./Resources.css";

const TABS = [
  { id: "pyq", label: "Previous Year Questions", icon: <FiFile />, description: "Practice with past exam papers" },
  { id: "syllabus", label: "Syllabus", icon: <FiFileText />, description: "Complete course syllabus" },
  { id: "examdate", label: "Exam Dates", icon: <FiCalendar />, description: "Upcoming exam schedule" },
  { id: "answerkey", label: "Answer Keys", icon: <FiKey />, description: "Official answer keys" },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getCategoryColor(category) {
  const colors = {
    'NEET': '#4CAF50',
    'JEE Main': '#e8b430',
    'JEE Advanced': '#e8b430',
    'Foundation': '#2196F3',
    'Olympiad': '#9C27B0',
    'Class 11': '#FF5722',
    'Class 12': '#FF9800'
  };
  return colors[category] || '#6b7280';
}

export default function Resources() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = TABS.some((t) => t.id === searchParams.get("tab")) ? searchParams.get("tab") : "pyq";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const { pyqs, loading: pyqLoading } = usePYQ();
  const { syllabus, loading: syllabusLoading } = useSyllabus();
  const { examDates, loading: examDateLoading } = useExamDate();
  const { answerKeys, loading: answerKeyLoading } = useAnswerKey();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setActiveFilter("All");
    setSearchQuery("");
    setSearchParams(activeTab === "pyq" ? {} : { tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  // Determine which data to show based on active tab
  const getDataForTab = () => {
    switch (activeTab) {
      case "pyq":
        return { data: pyqs, loading: pyqLoading, label: "PYQs" };
      case "syllabus":
        return { data: syllabus, loading: syllabusLoading, label: "Syllabus" };
      case "examdate":
        return { data: examDates, loading: examDateLoading, label: "Exam Dates" };
      case "answerkey":
        return { data: answerKeys, loading: answerKeyLoading, label: "Answer Keys" };
      default:
        return { data: [], loading: false, label: "" };
    }
  };

  const { data: dataForTab, loading: isLoading, label: dataLabel } = getDataForTab();

  // Filter to only show published items
  const published = useMemo(
    () => dataForTab.filter((item) => item.isPublished !== false),
    [dataForTab]
  );

  // Determine the category field based on tab
  const categoryField = activeTab === "pyq" ? "category" : 
                        activeTab === "answerkey" ? "examName" : 
                        "category";

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const set = new Set(published.map((item) => item[categoryField]).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [published, categoryField]);

  // Filter by category and search
  const filtered = useMemo(() => {
    let list = activeFilter === "All" ? published : published.filter((item) => item[categoryField] === activeFilter);
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(item => {
        const titleMatch = item.title?.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const subjectMatch = item.subject?.toLowerCase().includes(query);
        const yearMatch = item.year?.toLowerCase().includes(query);
        return titleMatch || descMatch || subjectMatch || yearMatch;
      });
    }
    
    if (activeTab === "examdate") {
      list = [...list].sort((a, b) => (a.examDate || "").localeCompare(b.examDate || ""));
    }
    return list;
  }, [published, activeFilter, categoryField, activeTab, searchQuery]);

  // Get stats
  const stats = useMemo(() => {
    const total = published.length;
    const byCategory = {};
    published.forEach(item => {
      const cat = item[categoryField] || 'Uncategorized';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    });
    return { total, byCategory };
  }, [published, categoryField]);

  // Get counts for each category
  const getCategoryCount = (category) => {
    if (category === "All") return stats.total;
    return stats.byCategory[category] || 0;
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="uka-res-page">
        <div className="uka-res-container">
          <div className="uka-res-loading">
            <FiLoader className="uka-res-spinner" />
            <p>Loading {dataLabel}...</p>
          </div>
        </div>
      </section>
    );
  }

  // Count total resources across all tabs
  const totalResources = {
    pyq: pyqs.filter(p => p.isPublished !== false).length,
    syllabus: syllabus.filter(s => s.isPublished !== false).length,
    examdate: examDates.filter(e => e.isPublished !== false).length,
    answerkey: answerKeys.filter(k => k.isPublished !== false).length,
  };

  return (
    <section className="uka-res-page">
      <div className="uka-res-container">
        {/* Header with back button */}
        <div className="uka-res-header-top">
          <Link to="/" className="uka-res-back">
            <FiArrowLeft /> Back to Home
          </Link>
          <div className="uka-res-stats-summary">
            <span className="uka-res-stat-item">
              <FiFile /> {totalResources.pyq} PYQs
            </span>
            <span className="uka-res-stat-item">
              <FiFileText /> {totalResources.syllabus} Syllabus
            </span>
            <span className="uka-res-stat-item">
              <FiCalendar /> {totalResources.examdate} Exam Dates
            </span>
            <span className="uka-res-stat-item">
              <FiKey /> {totalResources.answerkey} Answer Keys
            </span>
          </div>
        </div>

        <div className="uka-res-header">
          <span className="uka-res-eyebrow">STUDY RESOURCES</span>
          <h1>Exam Resources &amp; Materials</h1>
          <p>
            Previous year questions, syllabus, exam dates and answer keys — kept up to
            date by UK Academy so you always have what you need to prepare.
          </p>
        </div>

        {/* Tabs */}
        <div className="uka-res-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`uka-res-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span className="uka-res-tab-label">{tab.label}</span>
              <span className="uka-res-tab-count" style={{ 
                background: activeTab === tab.id ? '#e8b430' : '#e5e7eb',
                color: activeTab === tab.id ? 'white' : '#6b7280'
              }}>
                {totalResources[tab.id] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="uka-res-controls">
          <div className="uka-res-filters">
            {categories.map((c) => (
              <button
                key={c}
                className={`uka-res-filter-chip ${activeFilter === c ? "active" : ""}`}
                onClick={() => setActiveFilter(c)}
              >
                {c} ({getCategoryCount(c)})
              </button>
            ))}
          </div>
          <div className="uka-res-controls-right">
            <div className="uka-res-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="uka-res-view-toggle">
              <button 
                className={`uka-res-view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <FiGrid />
              </button>
              <button 
                className={`uka-res-view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="uka-res-results-count">
          Showing {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        </div>

        {/* Grid/List View */}
        <div className={`uka-res-grid ${viewMode === "list" ? "uka-res-grid-list" : ""}`}>
          {filtered.length === 0 && (
            <div className="uka-res-empty">
              <FiBookOpen size={48} style={{ opacity: 0.3 }} />
              <h3>No {activeTab === "pyq" ? "PYQs" : activeTab === "syllabus" ? "syllabus" : activeTab === "examdate" ? "exam dates" : "answer keys"} found</h3>
              <p>Try adjusting your filters or search query.</p>
            </div>
          )}

          {activeTab === "pyq" &&
            filtered.map((item) => (
              <div className="uka-res-card" key={item.id}>
                <div className="uka-res-card-top">
                  <h3>{item.title}</h3>
                  <span className="uka-res-card-type">PYQ</span>
                </div>
                <div className="uka-res-card-meta">
                  {item.subject && <span className="uka-res-tag">{item.subject}</span>}
                  {item.category && (
                    <span 
                      className="uka-res-tag uka-res-tag-category"
                      style={{ background: getCategoryColor(item.category) + '20', color: getCategoryColor(item.category) }}
                    >
                      {item.category}
                    </span>
                  )}
                  {item.year && <span className="uka-res-tag">{item.year}</span>}
                </div>
                {item.description && <p className="uka-res-desc">{item.description}</p>}
                {item.fileUrl && (
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="uka-res-link">
                    <FiExternalLink /> View / Download
                  </a>
                )}
              </div>
            ))}

          {activeTab === "syllabus" &&
            filtered.map((item) => (
              <div className="uka-res-card" key={item.id}>
                <div className="uka-res-card-top">
                  <h3>{item.title}</h3>
                  <span className="uka-res-card-type">Syllabus</span>
                </div>
                <div className="uka-res-card-meta">
                  {item.category && (
                    <span 
                      className="uka-res-tag uka-res-tag-category"
                      style={{ background: getCategoryColor(item.category) + '20', color: getCategoryColor(item.category) }}
                    >
                      {item.category}
                    </span>
                  )}
                </div>
                {item.description && <p className="uka-res-desc">{item.description}</p>}
                {item.fileUrl && (
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="uka-res-link">
                    <FiExternalLink /> View Syllabus
                  </a>
                )}
              </div>
            ))}

          {activeTab === "examdate" &&
            filtered.map((item) => (
              <div className="uka-res-card" key={item.id}>
                <div className="uka-res-card-top">
                  <h3>{item.title}</h3>
                  <span className="uka-res-card-type">Exam Date</span>
                </div>
                <div className="uka-res-card-meta">
                  {item.category && (
                    <span 
                      className="uka-res-tag uka-res-tag-category"
                      style={{ background: getCategoryColor(item.category) + '20', color: getCategoryColor(item.category) }}
                    >
                      {item.category}
                    </span>
                  )}
                  {item.examDate && (
                    <span className="uka-res-when">
                      <FiClock /> {formatDate(item.examDate)}{item.examTime ? ` · ${item.examTime}` : ""}
                    </span>
                  )}
                </div>
                {item.description && <p className="uka-res-desc">{item.description}</p>}
              </div>
            ))}

          {activeTab === "answerkey" &&
            filtered.map((item) => (
              <div className="uka-res-card" key={item.id}>
                <div className="uka-res-card-top">
                  <h3>{item.title}</h3>
                  <span className="uka-res-card-type">Answer Key</span>
                </div>
                <div className="uka-res-card-meta">
                  {item.examName && (
                    <span 
                      className="uka-res-tag uka-res-tag-category"
                      style={{ background: getCategoryColor(item.examName) + '20', color: getCategoryColor(item.examName) }}
                    >
                      {item.examName}
                    </span>
                  )}
                  {item.year && <span className="uka-res-tag">{item.year}</span>}
                </div>
                {item.description && <p className="uka-res-desc">{item.description}</p>}
                {item.fileUrl && (
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="uka-res-link">
                    <FiExternalLink /> View Answer Key
                  </a>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}