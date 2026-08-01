// src/pages/Courses/shared/ClassCourseCatalog.jsx
// Generic "class-wise" course catalog used by the 3 new top-level Courses
// categories (NEET & JEE Foundation — Individual / Schools, and Foundation
// NTSE / Olympiad). Shows Classroom Courses and Online Courses (Recorded /
// Live) as per-class fee cards, per the site's existing visual language.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBookOpen,
  FiMonitor,
  FiVideo,
  FiRadio,
  FiCheckCircle,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import "./ClassCourseCatalog.css";

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function ClassCourseCatalog({ title, tagline, target, color, classroom, online, modules, feeLabels }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("classroom"); // classroom | online
  const [onlineType, setOnlineType] = useState("Recorded"); // Recorded | Live
  // Some catalogs (e.g. the NEET & JEE Foundation - Schools tie-up program)
  // are delivered as two selectable modules rather than one flat class list.
  const [activeModuleKey, setActiveModuleKey] = useState(modules ? modules[0].key : null);
  const activeModule = modules ? modules.find((m) => m.key === activeModuleKey) || modules[0] : null;

  const effectiveClassroom = activeModule ? activeModule.classroom : classroom;
  const effectiveOnline = activeModule ? activeModule.online : online;

  const visibleOnline = effectiveOnline.filter((c) => c.courseType === onlineType);

  const handleEnroll = (course) => {
    navigate("/enroll", {
      state: {
        course: {
          title: course.courseName,
          mode: mode === "classroom" ? "Classroom" : `Online (${course.courseType})`,
          className: course.className,
          fee: course.totalFee,
          color,
        },
      },
    });
  };

  return (
    <div className="ccc-page" style={{ "--ccc-accent": color }}>
      <div className="ccc-container">
        <button type="button" className="ccc-back" onClick={() => navigate("/")}>
          <FiArrowLeft /> Back to Home
        </button>

        <div className="ccc-header">
          <span className="ccc-tag">{target}</span>
          <h1 className="ccc-title">{title}</h1>
          <p className="ccc-tagline">{tagline}</p>
        </div>

        {modules && (
          <div className="ccc-mode-switch" style={{ marginBottom: 14 }}>
            {modules.map((m) => (
              <button
                key={m.key}
                type="button"
                className={`ccc-mode-btn ${activeModuleKey === m.key ? "is-active" : ""}`}
                onClick={() => setActiveModuleKey(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
        {modules && activeModule?.description && (
          <p className="ccc-tagline" style={{ marginTop: -6 }}>
            {activeModule.description}
          </p>
        )}

        <div className="ccc-mode-switch">
          <button
            type="button"
            className={`ccc-mode-btn ${mode === "classroom" ? "is-active" : ""}`}
            onClick={() => setMode("classroom")}
          >
            <FiBookOpen /> Classroom Courses
          </button>
          <button
            type="button"
            className={`ccc-mode-btn ${mode === "online" ? "is-active" : ""}`}
            onClick={() => setMode("online")}
          >
            <FiMonitor /> Online Courses
          </button>
        </div>

        {mode === "online" && (
          <div className="ccc-online-switch">
            <button
              type="button"
              className={`ccc-online-btn ${onlineType === "Recorded" ? "is-active" : ""}`}
              onClick={() => setOnlineType("Recorded")}
            >
              <FiVideo /> Recorded Classes
            </button>
            <button
              type="button"
              className={`ccc-online-btn ${onlineType === "Live" ? "is-active" : ""}`}
              onClick={() => setOnlineType("Live")}
            >
              <FiRadio /> Live Classes
            </button>
          </div>
        )}

        <div className="ccc-grid">
          {mode === "classroom"
            ? effectiveClassroom.map((c) => (
                <div className="ccc-card" key={c.id}>
                  <div className="ccc-card-top">
                    <span className="ccc-class-badge">{c.className}</span>
                    <span className="ccc-mode-badge">Classroom</span>
                  </div>
                  <h3 className="ccc-card-title">{c.courseName}</h3>
                  <p className="ccc-card-desc">{c.description}</p>

                  <div className="ccc-fee-table">
                    {feeLabels ? (
                      <>
                        <div className="ccc-fee-row ccc-fee-row-label-only">
                          <span>{feeLabels.tuition}</span>
                        </div>
                        <div className="ccc-fee-row ccc-fee-row-label-only">
                          <span>{feeLabels.books}</span>
                        </div>
                        {feeLabels.test && (
                          <div className="ccc-fee-row ccc-fee-row-label-only">
                            <span>{feeLabels.test}</span>
                          </div>
                        )}
                        <div className="ccc-fee-row ccc-fee-total">
                          <span>Total Amount</span>
                          <strong>
                            <FaRupeeSign /> {c.totalFee.toLocaleString("en-IN")}
                          </strong>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="ccc-fee-row">
                          <span>Tuition Fees</span>
                          <strong>{inr(c.tuitionFee)}</strong>
                        </div>
                        <div className="ccc-fee-row">
                          <span>Books Fees</span>
                          <strong>{inr(c.booksFee)}</strong>
                        </div>
                        <div className="ccc-fee-row">
                          <span>Test Materials Fees</span>
                          <strong>{inr(c.testMaterialsFee)}</strong>
                        </div>
                        <div className="ccc-fee-row ccc-fee-total">
                          <span>Total Fees</span>
                          <strong>
                            <FaRupeeSign /> {c.totalFee.toLocaleString("en-IN")}
                          </strong>
                        </div>
                      </>
                    )}
                  </div>

                  <button type="button" className="ccc-enroll-btn" onClick={() => handleEnroll(c)}>
                    Enroll Now <FiArrowRight />
                  </button>
                </div>
              ))
            : visibleOnline.map((c) => (
                <div className="ccc-card" key={c.id}>
                  <div className="ccc-card-top">
                    <span className="ccc-class-badge">{c.className}</span>
                    <span className="ccc-mode-badge ccc-mode-badge-online">
                      {c.courseType === "Live" ? <FiRadio /> : <FiVideo />} {c.courseType}
                    </span>
                  </div>
                  <h3 className="ccc-card-title">{c.courseName}</h3>
                  <p className="ccc-card-desc">{c.description}</p>

                  <div className="ccc-fee-table">
                    {feeLabels ? (
                      <>
                        <div className="ccc-fee-row ccc-fee-row-label-only">
                          <span>{feeLabels.tuition}</span>
                        </div>
                        <div className="ccc-fee-row ccc-fee-row-label-only">
                          <span>{feeLabels.books}</span>
                        </div>
                        <div className="ccc-fee-row ccc-fee-total">
                          <span>Total Amount</span>
                          <strong>
                            <FaRupeeSign /> {c.totalFee.toLocaleString("en-IN")}
                          </strong>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="ccc-fee-row">
                          <span>Tuition Fees</span>
                          <strong>{inr(c.tuitionFee)}</strong>
                        </div>
                        <div className="ccc-fee-row">
                          <span>Books Fees</span>
                          <strong>{inr(c.booksFee)}</strong>
                        </div>
                        <div className="ccc-fee-row ccc-fee-total">
                          <span>Total Fees</span>
                          <strong>
                            <FaRupeeSign /> {c.totalFee.toLocaleString("en-IN")}
                          </strong>
                        </div>
                      </>
                    )}
                  </div>

                  <button type="button" className="ccc-enroll-btn" onClick={() => handleEnroll(c)}>
                    Enroll Now <FiArrowRight />
                  </button>
                </div>
              ))}
        </div>

        <div className="ccc-note">
          <FiCheckCircle />{" "}
          {feeLabels
            ? `Total Amount includes ${feeLabels.tuition} + ${feeLabels.books}${feeLabels.test && mode === "classroom" ? ` + ${feeLabels.test}` : ""}.`
            : `Total Fees = Tuition Fees + Books Fees${mode === "classroom" ? " + Test Materials Fees" : ""}`}
        </div>
      </div>
    </div>
  );
}
