// src/pages/Courses/shared/CourseInfoTools.jsx - COMPLETE FIXED VERSION
import { useEffect, useState } from "react";
import {
  FiFileText,
  FiDownload,
  FiChevronDown,
  FiChevronRight,
  FiCalendar,
  FiKey,
  FiUserCheck,
  FiGrid,
  FiTarget,
  FiAlertTriangle,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";
import {
  examKeyFor,
  SYLLABUS,
  EXAM_PATTERN,
  ELIGIBILITY,
  EXAM_TIMELINE,
  PYQ_YEARS,
  ANSWER_KEY_YEARS,
  SUBJECTS_FOR,
  PAPER_SETS,
  predictRank,
} from "../../../data/examInfo";
import { useFormModal } from "../../../context/FormModalContext";
import { usePYQ } from "../../../context/PYQContext";
import { useSyllabus } from "../../../context/SyllabusContext";
import { useExamDate } from "../../../context/ExamDateContext";
import { useAnswerKey } from "../../../context/AnswerKeyContext";

import "./CourseInfoTools.css";

function ToolHeader({ color, icon, title, subtitle }) {
  return (
    <div className="exam-tool-header">
      <span className="exam-tool-header-icon" style={{ background: color }}>
        {icon}
      </span>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

// ============================================================================
// PYQ TOOL - FIXED
// ============================================================================
export function PyqTool({ trail, category }) {
  // ALL HOOKS FIRST - NO CONDITIONAL RETURNS BEFORE THIS
  const examKey = examKeyFor(trail);
  const { pyqs, loading } = usePYQ();
  const { openForm } = useFormModal();
  const [filteredPyqs, setFilteredPyqs] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const subjects = SUBJECTS_FOR(examKey);
  const years = PYQ_YEARS(examKey);

  // Effects after hooks
  useEffect(() => {
    const publishedPyqs = pyqs.filter(p => p.isPublished !== false);
    
    let filtered = publishedPyqs.filter(p => {
      if (examKey === "neet") return p.category === "NEET";
      if (examKey === "jee-main") return p.category === "JEE Main";
      if (examKey === "jee-advanced") return p.category === "JEE Advanced";
      if (examKey === "olympiad") return p.category === "Olympiad";
      if (examKey === "ntse") return p.category === "Foundation";
      return false;
    });

    if (selectedSubject !== "All") {
      filtered = filtered.filter(p => p.subject === selectedSubject);
    }

    if (selectedYear) {
      filtered = filtered.filter(p => p.year === selectedYear);
    }

    setFilteredPyqs(filtered);
  }, [pyqs, examKey, selectedSubject, selectedYear]);

  const handleGet = (pyq) => {
    openForm("Enquire Now", { 
      course: `${category.title} PYQ ${pyq.year || ''} — ${pyq.subject || ''}`
    });
  };

  // CONDITIONAL RETURNS AFTER ALL HOOKS
  if (loading) {
    return (
      <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
        <div className="exam-tool-loading">
          <FiLoader /> Loading PYQs...
        </div>
      </div>
    );
  }

  return (
    <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
      <ToolHeader 
        color={category.color} 
        icon={<FiFileText />} 
        title="Previous Year Questions" 
        subtitle={`${category.title} · ${filteredPyqs.length} available`} 
      />

      <div className="exam-tool-filters">
        <div className="exam-tool-filter-group">
          <span>Subject</span>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="All">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="exam-tool-filter-group">
          <span>Year</span>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredPyqs.length === 0 ? (
        <div className="exam-tool-empty">
          <p>No PYQs available for this selection.</p>
          <p className="exam-tool-empty-sub">Check back soon for updates.</p>
        </div>
      ) : (
        <div className="pyq-list">
          {filteredPyqs.map((pyq) => (
            <div className="pyq-paper-card" key={pyq.id}>
              <div className="pyq-paper-card-info">
                <span className="pyq-paper-card-title">{pyq.title}</span>
                <span className="pyq-paper-card-sub">
                  {pyq.subject} · {pyq.year || 'N/A'} · {pyq.category}
                </span>
                {pyq.description && (
                  <p className="pyq-paper-card-desc">{pyq.description}</p>
                )}
              </div>
              <div className="pyq-paper-card-actions">
                {pyq.fileUrl && (
                  <a 
                    href={pyq.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="exam-tool-btn-solid"
                    style={{ background: category.color }}
                  >
                    <FiDownload /> Download PDF
                  </a>
                )}
                <button 
                  className="exam-tool-btn-outline" 
                  style={{ borderColor: category.color, color: category.color }}
                  onClick={() => handleGet(pyq)}
                >
                  Get Solutions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SYLLABUS TOOL - FIXED
// ============================================================================
export function SyllabusTool({ trail, category }) {
  // ALL HOOKS FIRST
  const examKey = examKeyFor(trail);
  const { syllabus, loading } = useSyllabus();
  const [filteredSyllabus, setFilteredSyllabus] = useState([]);
  const [openSubject, setOpenSubject] = useState(null);

  // Effects after hooks
  useEffect(() => {
    const published = syllabus.filter(s => s.isPublished !== false);
    
    let filtered = published.filter(s => {
      if (examKey === "neet") return s.category === "NEET";
      if (examKey === "jee-main") return s.category === "JEE Main";
      if (examKey === "jee-advanced") return s.category === "JEE Advanced";
      if (examKey === "olympiad") return s.category === "Olympiad";
      if (examKey === "ntse") return s.category === "Foundation";
      return false;
    });

    setFilteredSyllabus(filtered);
    
    // Set default open subject only when data loads
    if (filtered.length === 0) {
      const data = SYLLABUS[examKey] || SYLLABUS.neet;
      if (data.subjects && data.subjects.length > 0) {
        setOpenSubject(data.subjects[0]?.subject || null);
      }
    }
  }, [syllabus, examKey]);

  // CONDITIONAL RETURNS AFTER ALL HOOKS
  if (loading) {
    return (
      <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
        <div className="exam-tool-loading">
          <FiLoader /> Loading Syllabus...
        </div>
      </div>
    );
  }

  // If there's syllabus data from API, display it
  if (filteredSyllabus.length > 0) {
    return (
      <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
        <ToolHeader 
          color={category.color} 
          icon={<FiGrid />} 
          title="Syllabus" 
          subtitle={`${category.title} · ${filteredSyllabus.length} documents`} 
        />

        <div className="syllabus-list">
          {filteredSyllabus.map((item) => (
            <div className="syllabus-card" key={item.id}>
              <h3>{item.title}</h3>
              {item.category && (
                <span className="syllabus-category-tag">{item.category}</span>
              )}
              {item.description && (
                <p className="syllabus-desc">{item.description}</p>
              )}
              {item.fileUrl && (
                <a 
                  href={item.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="exam-tool-btn-solid"
                  style={{ background: category.color }}
                >
                  <FiDownload /> View Syllabus
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback to static data if no API data
  const data = SYLLABUS[examKey] || SYLLABUS.neet;

  return (
    <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
      <ToolHeader color={category.color} icon={<FiGrid />} title="Syllabus" subtitle={`${data.examLabel} · Subject → Unit → Topic`} />

      <div className="syllabus-tree">
        {data.subjects.map((s) => {
          const isOpen = openSubject === s.subject;
          return (
            <div className={`syllabus-subject ${isOpen ? "is-open" : ""}`} key={s.subject}>
              <button 
                className="syllabus-subject-toggle" 
                onClick={() => setOpenSubject(isOpen ? null : s.subject)}
                type="button"
              >
                <span>{s.subject}</span>
                <FiChevronDown className="syllabus-chevron" />
              </button>
              {isOpen && (
                <div className="syllabus-units">
                  {s.units.map((u) => (
                    <div className="syllabus-unit" key={u.unit}>
                      <div className="syllabus-unit-title" style={{ color: category.color }}>
                        <FiChevronRight /> {u.unit}
                      </div>
                      <div className="syllabus-topics">
                        {u.topics.map((t) => (
                          <span className="syllabus-topic-chip" key={t}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// EXAM DATE TOOL - FIXED
// ============================================================================
export function ExamDateTool({ trail, category }) {
  // ALL HOOKS FIRST
  const examKey = examKeyFor(trail);
  const { examDates, loading } = useExamDate();
  const [filteredDates, setFilteredDates] = useState([]);

  // Effects after hooks
  useEffect(() => {
    const published = examDates.filter(e => e.isPublished !== false);
    
    let filtered = published.filter(e => {
      if (examKey === "neet") return e.category === "NEET";
      if (examKey === "jee-main") return e.category === "JEE Main";
      if (examKey === "jee-advanced") return e.category === "JEE Advanced";
      if (examKey === "olympiad") return e.category === "Olympiad";
      if (examKey === "ntse") return e.category === "Foundation";
      return false;
    });

    filtered.sort((a, b) => (a.examDate || "").localeCompare(b.examDate || ""));
    setFilteredDates(filtered);
  }, [examDates, examKey]);

  // CONDITIONAL RETURNS AFTER ALL HOOKS
  if (loading) {
    return (
      <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
        <div className="exam-tool-loading">
          <FiLoader /> Loading Exam Dates...
        </div>
      </div>
    );
  }

  // If there's exam date data from API, display it
  if (filteredDates.length > 0) {
    return (
      <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
        <ToolHeader 
          color={category.color} 
          icon={<FiCalendar />} 
          title="Exam Date" 
          subtitle={`${category.title} · ${filteredDates.length} upcoming dates`} 
        />

        <div className="examdate-timeline">
          {filteredDates.map((item, i) => {
            const dateObj = item.examDate ? new Date(item.examDate) : null;
            const formattedDate = dateObj ? dateObj.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : 'TBD';
            
            return (
              <div className="examdate-item" key={item.id}>
                <div className="examdate-item-dot" style={{ background: category.color }}>{i + 1}</div>
                <div className="examdate-item-body">
                  <span className="examdate-item-label">{item.title}</span>
                  <span className="examdate-item-date">
                    {formattedDate}
                    {item.examTime ? ` at ${item.examTime}` : ''}
                  </span>
                  {item.description && (
                    <p className="examdate-item-desc">{item.description}</p>
                  )}
                  {item.category && (
                    <span className="examdate-item-category">{item.category}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback to static data if no API data
  const milestones = EXAM_TIMELINE[examKey] || EXAM_TIMELINE.neet;

  return (
    <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
      <ToolHeader color={category.color} icon={<FiCalendar />} title="Exam Date" subtitle={`${category.title} · Key milestones`} />

      <div className="examdate-timeline">
        {milestones.map((m, i) => (
          <div className="examdate-item" key={m.label}>
            <div className="examdate-item-dot" style={{ background: category.color }}>{i + 1}</div>
            <div className="examdate-item-body">
              <span className="examdate-item-label">{m.label}</span>
              <span className="examdate-item-date">{m.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="exam-tool-note">
        <FiAlertTriangle style={{ color: category.color }} />
        Dates shown are tentative and for planning purposes. Official dates are announced by the exam
        conducting body — our academy shares confirmed dates and guidelines the moment they're released.
      </div>
    </div>
  );
}

// ============================================================================
// ANSWER KEY TOOL - COMPLETELY FIXED
// ============================================================================
export function AnswerKeyTool({ trail, category }) {
  // ===== ALL HOOKS MUST BE CALLED AT THE TOP LEVEL =====
  const examKey = examKeyFor(trail);
  const { answerKeys, loading } = useAnswerKey();
  const { openForm } = useFormModal();
  
  // State declarations - ALL at the top level
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  
  // Static data for fallback - computed here, not in hooks
  const yearsStatic = ANSWER_KEY_YEARS(examKey);
  const PAPER_SETS_OPTIONS = ["Set A", "Set B", "Set C", "Set D"];
  
  // These useState hooks MUST be at the top level, not inside conditionals
  const [year, setYear] = useState(yearsStatic[0] || "");
  const [paperSet, setPaperSet] = useState(PAPER_SETS_OPTIONS[0]);

  // Effects after all hooks
  useEffect(() => {
    const published = answerKeys.filter(k => k.isPublished !== false);
    
    let filtered = published.filter(k => {
      if (examKey === "neet") return k.examName === "NEET";
      if (examKey === "jee-main") return k.examName === "JEE Main";
      if (examKey === "jee-advanced") return k.examName === "JEE Advanced";
      if (examKey === "olympiad") return k.examName === "Olympiad";
      if (examKey === "ntse") return k.examName === "Foundation";
      return false;
    });

    if (selectedYear) {
      filtered = filtered.filter(k => k.year === selectedYear);
    }

    setFilteredKeys(filtered);
  }, [answerKeys, examKey, selectedYear]);

  const handleGet = (item) => {
    openForm("Enquire Now", { 
      course: `${category.title} Answer Key ${item.year || ''}`
    });
  };

  // ===== CONDITIONAL RETURNS AFTER ALL HOOKS =====
  if (loading) {
    return (
      <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
        <div className="exam-tool-loading">
          <FiLoader /> Loading Answer Keys...
        </div>
      </div>
    );
  }

  // If there's answer key data from API, display it
  if (filteredKeys.length > 0) {
    return (
      <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
        <ToolHeader 
          color={category.color} 
          icon={<FiKey />} 
          title="Answer Key" 
          subtitle={`${category.title} · ${filteredKeys.length} keys available`} 
        />

        <div className="exam-tool-filters">
          <div className="exam-tool-filter-group">
            <span>Year</span>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {yearsStatic.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="answerkey-list">
          {filteredKeys.map((item) => (
            <div className="pyq-paper-card" key={item.id}>
              <div className="pyq-paper-card-info">
                <span className="pyq-paper-card-title">{item.title}</span>
                <span className="pyq-paper-card-sub">
                  {item.examName} · {item.year || 'N/A'}
                </span>
                {item.description && (
                  <p className="pyq-paper-card-desc">{item.description}</p>
                )}
              </div>
              <div className="pyq-paper-card-actions">
                {item.fileUrl && (
                  <a 
                    href={item.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="exam-tool-btn-solid"
                    style={{ background: category.color }}
                  >
                    <FiDownload /> Download
                  </a>
                )}
                <button 
                  className="exam-tool-btn-outline" 
                  style={{ borderColor: category.color, color: category.color }}
                  onClick={() => handleGet(item)}
                >
                  View Solutions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== FALLBACK: static data (no API data) =====
  return (
    <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
      <ToolHeader color={category.color} icon={<FiKey />} title="Answer Key" subtitle={`${category.title} · Last ${yearsStatic.length} years`} />

      <div className="pyq-year-grid">
        {yearsStatic.map((y) => (
          <button
            key={y}
            className={`pyq-year-btn ${y === year ? "is-active" : ""}`}
            style={y === year ? { background: category.color, borderColor: category.color } : undefined}
            onClick={() => setYear(y)}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="exam-tool-filters">
        <div className="exam-tool-filter-group">
          <span>Paper / Set</span>
          <select value={paperSet} onChange={(e) => setPaperSet(e.target.value)}>
            {PAPER_SETS_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pyq-paper-card">
        <div className="pyq-paper-card-info">
          <span className="pyq-paper-card-title">{category.title} {year} Answer Key — {paperSet}</span>
          <span className="pyq-paper-card-sub">Official-pattern answer key with full solutions</span>
        </div>
        <div className="pyq-paper-card-actions">
          <button 
            className="exam-tool-btn-outline" 
            style={{ borderColor: category.color, color: category.color }} 
            onClick={() => handleGet({year})}
          >
            View Solutions
          </button>
          <button 
            className="exam-tool-btn-solid" 
            style={{ background: category.color }} 
            onClick={() => handleGet({year})}
          >
            <FiDownload /> Download
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ELIGIBILITY TOOL - FIXED (no hooks issue, but kept consistent)
// ============================================================================
export function EligibilityTool({ trail, category }) {
  const examKey = examKeyFor(trail);
  const e = ELIGIBILITY[examKey] || ELIGIBILITY.neet;

  const rows = [
    { label: "Educational Qualification", value: e.qualification, icon: <FiUserCheck /> },
    { label: "Age Limit", value: e.ageLimit, icon: <FiCalendar /> },
    { label: "Minimum Marks", value: e.minMarks, icon: <FiTarget /> },
    { label: "Subject Requirements", value: e.subjects, icon: <FiFileText /> },
    { label: "Number of Attempts", value: e.attempts, icon: <FiCheckCircle /> },
    { label: "Nationality", value: e.nationality, icon: <FiGrid /> },
  ];

  return (
    <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
      <ToolHeader color={category.color} icon={<FiUserCheck />} title="Eligibility" subtitle={`${category.title} · Who can apply`} />

      <div className="eligibility-grid">
        {rows.map((r) => (
          <div className="eligibility-item" key={r.label}>
            <span className="eligibility-item-icon" style={{ color: category.color }}>{r.icon}</span>
            <div>
              <span className="eligibility-item-label">{r.label}</span>
              <span className="eligibility-item-value">{r.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// EXAM PATTERN TOOL - FIXED (no hooks issue, but kept consistent)
// ============================================================================
export function ExamPatternTool({ trail, category }) {
  const examKey = examKeyFor(trail);
  const p = EXAM_PATTERN[examKey] || EXAM_PATTERN.neet;

  const rows = [
    ["Total Questions", p.questions],
    ["Total Marks", p.totalMarks],
    ["Duration", p.duration],
    ["Mode", p.mode],
    ["Negative Marking", p.negativeMarking],
    ["Question Type", p.questionType],
  ];

  return (
    <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
      <ToolHeader color={category.color} icon={<FiGrid />} title="Exam Pattern" subtitle={`${category.title} · Structure & marking scheme`} />

      <table className="exampattern-table">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="exam-tool-subheading">Subject-wise Distribution</h3>
      <table className="exampattern-table exampattern-table-subjects">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Questions</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {p.subjectWise.map((s) => (
            <tr key={s.subject}>
              <td>{s.subject}</td>
              <td>{s.questions}</td>
              <td>{s.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// RANK PREDICTOR TOOL - FIXED (no hooks issue, but kept consistent)
// ============================================================================
export function RankPredictorTool({ trail, category }) {
  const examKey = examKeyFor(trail);
  const [marks, setMarks] = useState("");
  const [rankCategory, setRankCategory] = useState("General");
  const [result, setResult] = useState(null);

  const handlePredict = () => {
    const m = Number(marks);
    if (!marks || Number.isNaN(m)) return;
    setResult(predictRank(examKey, m, rankCategory));
  };

  return (
    <div className="exam-tool-page" style={{ borderTopColor: category.color }}>
      <ToolHeader color={category.color} icon={<FiTarget />} title="Rank Predictor" subtitle={`${category.title} · Based on last 5 years' data`} />

      <div className="rank-predictor-form">
        <label>
          <span>Your Expected Score</span>
          <input
            type="number"
            placeholder="e.g. 650"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
          />
        </label>
        <label>
          <span>Category</span>
          <select value={rankCategory} onChange={(e) => setRankCategory(e.target.value)}>
            {["General", "OBC", "SC", "ST", "EWS"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <button className="exam-tool-btn-solid rank-predictor-submit" style={{ background: category.color }} onClick={handlePredict}>
          Predict Rank
        </button>
      </div>

      {result && (
        <div className="rank-predictor-result">
          <span className="rank-predictor-result-label">Estimated Rank</span>
          <span className="rank-predictor-result-value" style={{ color: category.color }}>
            {result.low.toLocaleString("en-IN")} – {result.high.toLocaleString("en-IN")}
          </span>
          <span className="rank-predictor-result-note">
            Based on historical {result.label} data from the previous 5 years (out of ~{result.totalMarks} marks,
            ~{result.totalCandidates.toLocaleString("en-IN")} candidates).
          </span>
          <div className="exam-tool-note">
            <FiAlertTriangle style={{ color: category.color }} />
            This is only an estimated prediction and does not represent the actual final rank.
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXPORT
// ============================================================================
export const INFO_TOOL_COMPONENTS = {
  pyq: PyqTool,
  syllabus: SyllabusTool,
  examdate: ExamDateTool,
  answerkey: AnswerKeyTool,
  eligibility: EligibilityTool,
  exampattern: ExamPatternTool,
  rankpredictor: RankPredictorTool,
};