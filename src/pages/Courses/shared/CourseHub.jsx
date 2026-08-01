// src/pages/Courses/shared/CourseHub.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCircle, FiFile, FiFileText, FiCalendar, FiKey, FiLoader } from "react-icons/fi";
import { usePYQ } from "../../../context/PYQContext";
import { useSyllabus } from "../../../context/SyllabusContext";
import { useExamDate } from "../../../context/ExamDateContext";
import { useAnswerKey } from "../../../context/AnswerKeyContext";

import "./CourseHub.css";

// Helper function to get resource counts (no hooks!)
function getResourceCounts(categorySlug, pyqs, syllabus, examDates, answerKeys) {
  const counts = { pyq: 0, syllabus: 0, examdate: 0, answerkey: 0 };
  
  const publishedPyqs = pyqs.filter(p => p.isPublished !== false);
  const publishedSyllabus = syllabus.filter(s => s.isPublished !== false);
  const publishedExamDates = examDates.filter(e => e.isPublished !== false);
  const publishedAnswerKeys = answerKeys.filter(k => k.isPublished !== false);

  const categoryMap = {
    'neet': 'NEET',
    'jee': 'JEE Main',
    'foundation': 'Foundation'
  };

  const examKey = categoryMap[categorySlug] || categorySlug;

  counts.pyq = publishedPyqs.filter(p => {
    if (categorySlug === 'jee') {
      return p.category === 'JEE Main' || p.category === 'JEE Advanced';
    }
    return p.category === examKey || p.category === categorySlug;
  }).length;

  counts.syllabus = publishedSyllabus.filter(s => {
    if (categorySlug === 'jee') {
      return s.category === 'JEE Main' || s.category === 'JEE Advanced';
    }
    return s.category === examKey || s.category === categorySlug;
  }).length;

  counts.examdate = publishedExamDates.filter(e => {
    if (categorySlug === 'jee') {
      return e.category === 'JEE Main' || e.category === 'JEE Advanced';
    }
    return e.category === examKey || e.category === categorySlug;
  }).length;

  counts.answerkey = publishedAnswerKeys.filter(k => {
    if (categorySlug === 'jee') {
      return k.examName === 'JEE Main' || k.examName === 'JEE Advanced';
    }
    return k.examName === examKey || k.examName === categorySlug;
  }).length;

  return counts;
}

export default function CourseHub({ trail, node }) {
  const category = trail[0];
  const [activeSlug, setActiveSlug] = useState(node.children[0]?.slug);
  const [resourceCounts, setResourceCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // ===== ALL HOOKS AT TOP LEVEL =====
  const { pyqs, loading: pyqLoading } = usePYQ();
  const { syllabus, loading: syllabusLoading } = useSyllabus();
  const { examDates, loading: examDateLoading } = useExamDate();
  const { answerKeys, loading: answerKeyLoading } = useAnswerKey();

  useEffect(() => {
    setActiveSlug(node.children[0]?.slug);
  }, [node]);

  useEffect(() => {
    if (!pyqLoading && !syllabusLoading && !examDateLoading && !answerKeyLoading) {
      const counts = getResourceCounts(category.slug, pyqs, syllabus, examDates, answerKeys);
      setResourceCounts(counts);
      setIsLoading(false);
    }
  }, [pyqs, syllabus, examDates, answerKeys, pyqLoading, syllabusLoading, examDateLoading, answerKeyLoading, category.slug]);

  const activeTab = node.children.find((c) => c.slug === activeSlug) || node.children[0];
  const basePath = `/courses/${trail.map((n) => n.slug).join("/")}`;

  const gridItems = activeTab?.children;

  const isResourceTab = (slug) => {
    const resourceTypes = ['pyq', 'syllabus', 'examdate', 'answerkey'];
    return resourceTypes.includes(slug);
  };

  const getResourceCount = (slug) => {
    return resourceCounts[slug] || 0;
  };

  const getResourceIcon = (slug) => {
    if (slug === 'pyq') return <FiFile />;
    if (slug === 'syllabus') return <FiFileText />;
    if (slug === 'examdate') return <FiCalendar />;
    if (slug === 'answerkey') return <FiKey />;
    return <FiCircle />;
  };

  if (isLoading) {
    return (
      <div className="course-hub">
        <div className="course-hub-loading">
          <FiLoader className="course-hub-spinner" />
          <span>Loading resources...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="course-hub">
      <aside className="course-hub-sidebar">
        <div className="course-hub-sidebar-title">Course Categories</div>
        <nav className="course-hub-sidebar-nav">
          {node.children.map((child) => {
            const isActive = activeSlug === child.slug;
            const hasChildren = !!child.children;
            const isResource = isResourceTab(child.slug);
            const count = isResource ? getResourceCount(child.slug) : 0;
            
            const content = (
              <>
                <span className="course-hub-icon-wrapper">
                  {isResource ? getResourceIcon(child.slug) : (
                    <FiCircle
                      className="course-hub-dot"
                      style={isActive ? { color: category.color, fill: category.color } : undefined}
                    />
                  )}
                </span>
                <span className="course-hub-item-label">{child.title}</span>
                {isResource && count > 0 && (
                  <span className="course-hub-badge" style={{ background: category.color }}>
                    {count}
                  </span>
                )}
              </>
            );
            
            return hasChildren ? (
              <button
                key={child.slug}
                className={`course-hub-sidebar-item ${isActive ? "is-active" : ""}`}
                style={isActive ? { borderColor: category.color, color: category.color } : undefined}
                onClick={() => setActiveSlug(child.slug)}
              >
                {content}
              </button>
            ) : (
              <Link
                key={child.slug}
                to={`${basePath}/${child.slug}`}
                className={`course-hub-sidebar-item ${isActive ? "is-active" : ""}`}
                style={isActive ? { borderColor: category.color, color: category.color } : undefined}
                onMouseEnter={() => setActiveSlug(child.slug)}
              >
                {content}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="course-hub-main">
        <div className="course-hub-main-header">
          <span className="course-hub-eyebrow">{activeTab?.title}</span>
          <h2 className="course-hub-heading">Select an option to continue</h2>
          {isResourceTab(activeTab?.slug) && (
            <p className="course-hub-resource-info">
              {getResourceCount(activeTab?.slug)} item{getResourceCount(activeTab?.slug) !== 1 ? 's' : ''} available
            </p>
          )}
        </div>

        {gridItems ? (
          <div className="course-hub-grid">
            {gridItems.map((item) => {
              const isResource = isResourceTab(item.slug);
              const count = isResource ? getResourceCount(item.slug) : 0;
              
              return (
                <Link
                  key={item.slug}
                  to={`${basePath}/${activeTab.slug}/${item.slug}`}
                  className="course-hub-card"
                  style={{ "--accent": category.color }}
                >
                  <span className="course-hub-card-title">{item.title}</span>
                  {isResource && count > 0 && (
                    <span className="course-hub-card-count" style={{ background: category.color }}>
                      {count} available
                    </span>
                  )}
                  {isResource && count === 0 && (
                    <span className="course-hub-card-empty">No items yet</span>
                  )}
                  <span className="course-hub-card-cta">
                    {item.children ? "Explore" : "View Details"} <FiArrowRight />
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="course-hub-grid">
            <Link to={`${basePath}/${activeTab.slug}`} className="course-hub-card" style={{ "--accent": category.color }}>
              <span className="course-hub-card-title">{activeTab.title}</span>
              <span className="course-hub-card-cta">
                View Details <FiArrowRight />
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}