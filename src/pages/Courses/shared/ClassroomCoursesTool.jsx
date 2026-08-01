// src/pages/Courses/ClassroomCoursesTool.jsx
// Implements spec section 5: Select Category -> Classroom Courses ->
// Select UK Academy Center -> View Available Course Plans -> Select Plan ->
// View Course Details -> Enroll Now.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiMapPin, FiClock, FiCheckCircle, FiUsers, FiPlayCircle } from "react-icons/fi";
import { CENTERS } from "../../../data/centers";
import { buildCoursePlans } from "../../../data/coursePlans";
import { inr } from "../../../data/leafDetail";
import AdminCoursesSection from "./AdminCoursesSection";

export default function ClassroomCoursesTool({ category }) {
  const [step, setStep] = useState("centers"); // centers -> plans -> detail
  const [center, setCenter] = useState(null);
  const [plan, setPlan] = useState(null);
  const navigate = useNavigate();

  const handleSelectCenter = (c) => {
    setCenter(c);
    setStep("plans");
  };

  const handleSelectPlan = (p) => {
    setPlan(p);
    setStep("detail");
  };

  const handleEnroll = () => {
    navigate("/enroll", {
      state: {
        course: {
          title: `${category.title} — ${plan?.name} Plan`,
          mode: "Classroom",
          center: center?.name,
          duration: plan?.duration,
          fee: plan?.fee,
          color: category.color,
        },
      },
    });
  };

  return (
    <div className="exam-tool-page classroom-tool" style={{ borderTopColor: category.color }}>
      <div className="exam-tool-header">
        <span className="exam-tool-header-icon" style={{ background: category.color }}>
          <FiMapPin />
        </span>
        <div>
          <h1>Classroom Courses</h1>
          <p>{category.title} · Select a UK Academy Center to get started</p>
        </div>
      </div>

      {/* Real, admin-added classroom courses from the Course Management
          dashboard - shown first when any exist for this category. */}
      <AdminCoursesSection categorySlug={category.slug} courseType="classroom" color={category.color} title="Courses Added by UK Academy" />

      {/* mini step trail */}
      <div className="classroom-steps">
        <span className={step === "centers" ? "is-active" : center ? "is-done" : ""}>1. Center</span>
        <span className={step === "plans" ? "is-active" : plan ? "is-done" : ""}>2. Course Plan</span>
        <span className={step === "detail" ? "is-active" : ""}>3. Details & Enroll</span>
      </div>

      {step === "centers" && (
        <div className="classroom-centers-list">
          {CENTERS.map((c) => (
            <div className="classroom-list-row" key={c.slug}>
              <div className="classroom-list-row-icon" style={{ background: `linear-gradient(135deg, ${category.color}dd, ${category.color}99)` }}>
                <FiMapPin />
              </div>
              <div className="classroom-list-row-body">
                <h3>{c.name}</h3>
                <p className="classroom-center-timing">
                  <FiClock /> {c.timing}
                </p>
              </div>
              <button
                className="exam-tool-btn-solid classroom-list-row-cta"
                style={{ background: category.color }}
                onClick={() => handleSelectCenter(c)}
              >
                View Courses <FiArrowRight />
              </button>
            </div>
          ))}
        </div>
      )}

      {step === "plans" && center && (
        <>
          <button type="button" className="classroom-back-link" onClick={() => setStep("centers")}>
            <FiArrowLeft /> Change Center ({center.name})
          </button>
          <div className="classroom-plans-list">
            {buildCoursePlans(category, center).map((p) => (
              <div className="classroom-list-row classroom-plan-row" key={p.key}>
                <div className="classroom-list-row-icon" style={{ background: `linear-gradient(135deg, ${category.color}dd, ${category.color}99)` }}>
                  <FiPlayCircle />
                </div>
                <div className="classroom-list-row-body">
                  <h3>{p.name}</h3>
                  <p className="classroom-plan-tagline">{p.tagline}</p>
                  <p className="classroom-plan-duration" style={{ color: category.color }}>
                    <FiClock /> {p.duration}
                  </p>
                  <ul className="classroom-plan-includes">
                    {p.includes.slice(0, 3).map((inc) => (
                      <li key={inc}>
                        <FiCheckCircle style={{ color: category.color }} /> {inc}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="exam-tool-btn-solid classroom-list-row-cta"
                  style={{ background: category.color }}
                  onClick={() => handleSelectPlan(p)}
                >
                  View Details <FiArrowRight />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {step === "detail" && center && plan && (
        <>
          <button type="button" className="classroom-back-link" onClick={() => setStep("plans")}>
            <FiArrowLeft /> Back to Course Plans
          </button>

          <div className="classroom-detail-hero" style={{ background: `linear-gradient(135deg, ${category.color}dd, ${category.color}99)` }}>
            <span className="classroom-detail-hero-icon">
              <FiPlayCircle />
            </span>
            <div>
              <h2>{category.title} — {plan.name}</h2>
              <p>{plan.tagline}</p>
            </div>
          </div>

          <div className="classroom-detail-grid">
            <div className="classroom-detail-item"><span>Target Students</span><strong>{plan.target}</strong></div>
            <div className="classroom-detail-item"><span>Duration</span><strong>{plan.duration}</strong></div>
            <div className="classroom-detail-item"><span>Mode</span><strong>{plan.mode}</strong></div>
            <div className="classroom-detail-item"><span>Center</span><strong>{center.name}</strong></div>
            <div className="classroom-detail-item"><span>Fee</span><strong style={{ color: category.color }}>{inr(plan.fee)}</strong></div>
          </div>

          <h3 className="exam-tool-subheading">What's Included</h3>
          <div className="course-detail2-chips">
            {plan.includes.map((inc) => (
              <span className="course-detail2-chip" key={inc}>
                <FiCheckCircle style={{ color: category.color }} /> {inc}
              </span>
            ))}
          </div>

          <h3 className="exam-tool-subheading">Faculty</h3>
          <div className="course-detail2-chips">
            {plan.faculty.map((f) => (
              <span className="course-detail2-chip" key={f}>
                <FiUsers style={{ color: category.color }} /> {f}
              </span>
            ))}
          </div>

          <h3 className="exam-tool-subheading">Course Outcomes</h3>
          <ul className="course-detail2-list">
            {plan.outcomes.map((o) => (
              <li key={o}>
                <FiCheckCircle style={{ color: category.color }} /> {o}
              </li>
            ))}
          </ul>

          <button className="course-detail2-enroll-primary" style={{ background: category.color, marginTop: 20 }} onClick={handleEnroll}>
            Enroll Now <FiArrowRight />
          </button>
        </>
      )}
    </div>
  );
}
