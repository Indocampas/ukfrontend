// src/pages/Courses/shared/EnrollmentPrompt.jsx
// Category-scoped "Enrollment" page: shows the standard course plans for the
// given category and hands off into the full Enroll Now -> Payment ->
// Confirmation journey (src/pages/Enrollment/EnrollmentFlow.jsx) with the
// chosen plan pre-filled. Reused by every category's Enrollment.jsx.
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CENTERS } from "../../../data/centers";
import { buildCoursePlans } from "../../../data/coursePlans";
import { inr } from "../../../data/leafDetail";
import { useFormModal } from "../../../context/FormModalContext";

export default function EnrollmentPrompt({ category }) {
  const navigate = useNavigate();
  const { openForm } = useFormModal();
  const plans = buildCoursePlans(category, CENTERS[0]);

  const handleEnroll = (plan) => {
    navigate("/enroll", {
      state: {
        course: {
          title: `${category.title} — ${plan.name} Plan`,
          mode: "Classroom",
          duration: plan.duration,
          fee: plan.fee,
          color: category.color,
        },
      },
    });
  };

  return (
    <div className="course-explorer-page">
      <div className="course-explorer-container">
        <section className="course-detail2-section">
          <h1 className="course-detail2-section-title">Enroll in {category.title}</h1>
          <p className="course-detail2-text">
            Pick a plan below to continue to the enrollment form, or reach out to our team for personal guidance.
          </p>

          <div className="course-plans-grid">
            {plans.map((plan) => (
              <div className="course-plan-card" key={plan.key}>
                <h3 className="course-plan-name">{plan.name}</h3>
                <p className="course-plan-tagline">{plan.tagline}</p>
                <p className="course-plan-price" style={{ color: category.color }}>
                  {inr(plan.fee)}
                  <span> / {plan.duration}</span>
                </p>
                <ul className="course-plan-includes">
                  {plan.includes.map((inc) => (
                    <li key={inc}>
                      <FiCheckCircle style={{ color: category.color }} /> {inc}
                    </li>
                  ))}
                </ul>
                <button className="course-plan-cta" style={{ background: category.color }} onClick={() => handleEnroll(plan)}>
                  Enroll — {plan.name} <FiArrowRight />
                </button>
              </div>
            ))}
          </div>

          <button
            className="course-detail2-enroll-secondary"
            onClick={() => openForm("Enquire Now", { course: category.title })}
          >
            Talk to Us Instead
          </button>
        </section>
      </div>
    </div>
  );
}
