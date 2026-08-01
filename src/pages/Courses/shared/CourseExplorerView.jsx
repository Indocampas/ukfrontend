// src/pages/Courses/shared/CourseExplorerView.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiChevronRight, FiLoader } from "react-icons/fi";
import { CATEGORIES } from "../../../data/courseTree";
import CourseHub from "./CourseHub";
import CourseLeafDetail from "./CourseLeafDetail";
import { usePYQ } from "../../../context/PYQContext";
import { useSyllabus } from "../../../context/SyllabusContext";
import { useExamDate } from "../../../context/ExamDateContext";
import { useAnswerKey } from "../../../context/AnswerKeyContext";

// Import CSS files
import "./CourseExplorer.css";
import "./CourseHub.css";
import "./CourseLeafDetail.css";
import "./CourseInfoTools.css";
import "./ClassroomCoursesTool.css";

// Helper function to calculate resource counts (no hooks here!)
function getResourceCounts(trail, pyqs, syllabus, examDates, answerKeys) {
  const counts = { pyq: 0, syllabus: 0, examdate: 0, answerkey: 0 };
  if (!trail || !trail.length) return counts;
  
  const category = trail[0];
  if (!category) return counts;
  
  const publishedPyqs = pyqs.filter(p => p.isPublished !== false);
  const publishedSyllabus = syllabus.filter(s => s.isPublished !== false);
  const publishedExamDates = examDates.filter(e => e.isPublished !== false);
  const publishedAnswerKeys = answerKeys.filter(k => k.isPublished !== false);

  const categoryMap = {
    'neet': 'NEET',
    'jee': 'JEE Main',
    'foundation': 'Foundation'
  };

  const examKey = categoryMap[category.slug] || category.slug;

  counts.pyq = publishedPyqs.filter(p => {
    if (category.slug === 'jee') {
      return p.category === 'JEE Main' || p.category === 'JEE Advanced';
    }
    return p.category === examKey || p.category === category.slug;
  }).length;

  counts.syllabus = publishedSyllabus.filter(s => {
    if (category.slug === 'jee') {
      return s.category === 'JEE Main' || s.category === 'JEE Advanced';
    }
    return s.category === examKey || s.category === category.slug;
  }).length;

  counts.examdate = publishedExamDates.filter(e => {
    if (category.slug === 'jee') {
      return e.category === 'JEE Main' || e.category === 'JEE Advanced';
    }
    return e.category === examKey || e.category === category.slug;
  }).length;

  counts.answerkey = publishedAnswerKeys.filter(k => {
    if (category.slug === 'jee') {
      return k.examName === 'JEE Main' || k.examName === 'JEE Advanced';
    }
    return k.examName === examKey || k.examName === category.slug;
  }).length;

  return counts;
}

export function CourseNotFound() {
  const navigate = useNavigate();
  return (
    <div className="course-explorer-page">
      <div className="course-explorer-container">
        <div className="course-not-found">
          <h2>We couldn't find that course</h2>
          <p>It may have moved. Browse all courses instead.</p>
          <button type="button" onClick={() => navigate("/")}>
            Back to Courses
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CourseExplorerView({ trail, scrollKey }) {
  const navigate = useNavigate();
  
  // ===== ALL HOOKS CALLED AT TOP LEVEL - NO CONDITIONAL RETURNS BEFORE THIS =====
  const { pyqs, loading: pyqLoading } = usePYQ();
  const { syllabus, loading: syllabusLoading } = useSyllabus();
  const { examDates, loading: examDateLoading } = useExamDate();
  const { answerKeys, loading: answerKeyLoading } = useAnswerKey();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [scrollKey]);

  useEffect(() => {
    if (!pyqLoading && !syllabusLoading && !examDateLoading && !answerKeyLoading) {
      setIsLoading(false);
    }
  }, [pyqLoading, syllabusLoading, examDateLoading, answerKeyLoading]);

  // ===== NOW WE CAN DO CONDITIONAL CHECKS =====
  if (!trail) return <CourseNotFound />;

  const current = trail[trail.length - 1];
  const category = trail[0];

  const handleBack = () => {
    if (trail.length > 1) {
      const parentPath = `/courses/${trail
        .slice(0, -1)
        .map((n) => n.slug)
        .join("/")}`;
      navigate(parentPath);
    } else {
      navigate("/");
    }
  };

  const isResourceNode = (node) => {
    const resourceTypes = ['pyq', 'syllabus', 'examdate', 'answerkey'];
    return resourceTypes.includes(node?.slug);
  };

  // Calculate resource counts using the helper function
  const resourceCounts = getResourceCounts(trail, pyqs, syllabus, examDates, answerKeys);

  const hasResources = (node) => {
    if (!isResourceNode(node)) return true;
    const count = resourceCounts[node.slug] || 0;
    return count > 0;
  };

  if (isLoading) {
    return (
      <div className="course-explorer-page">
        <div className="course-explorer-container">
          <div className="course-explorer-loading">
            <FiLoader className="course-explorer-spinner" />
            <span>Loading course data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-explorer-page">
      <div className="course-explorer-container">
        <div className="course-explorer-topbar">
          <button type="button" className="course-explorer-back" onClick={handleBack}>
            <FiArrowLeft /> Back
          </button>

          <div className="course-category-tabs">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/courses/${cat.slug}`}
                className={`course-category-tab ${trail[0].slug === cat.slug ? "is-active" : ""}`}
                style={trail[0].slug === cat.slug ? { borderColor: cat.color, color: cat.color } : undefined}
              >
                <span className="course-category-tab-icon" style={{ background: cat.color }}>
                  {cat.icon}
                </span>
                {cat.title}
              </Link>
            ))}
          </div>
        </div>

        <nav className="course-breadcrumb">
          <Link to="/">Courses</Link>
          {trail.map((node, i) => {
            const href = `/courses/${trail.slice(0, i + 1).map((n) => n.slug).join("/")}`;
            const isLast = i === trail.length - 1;
            const isResource = isResourceNode(node);
            const hasItems = isResource ? hasResources(node) : true;
            const count = resourceCounts[node.slug] || 0;
            
            return (
              <span key={node.id} className="course-breadcrumb-segment">
                <FiChevronRight className="course-breadcrumb-sep" />
                {isLast ? (
                  <span className={`is-current ${isResource && !hasItems ? 'is-empty' : ''}`}>
                    {node.title}
                    {isResource && !hasItems && (
                      <span className="breadcrumb-empty-badge">No items</span>
                    )}
                    {isResource && hasItems && (
                      <span className="breadcrumb-count-badge" style={{ background: trail[0].color }}>
                        {count}
                      </span>
                    )}
                  </span>
                ) : (
                  <Link to={href}>{node.title}</Link>
                )}
              </span>
            );
          })}
        </nav>

        {current.children ? (
          <CourseHub trail={trail} node={current} />
        ) : (
          <CourseLeafDetail trail={trail} node={current} />
        )}
      </div>
    </div>
  );
}