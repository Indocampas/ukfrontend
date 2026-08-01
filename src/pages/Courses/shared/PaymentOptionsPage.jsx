// src/pages/Courses/shared/PaymentOptionsPage.jsx
// Category-scoped "Payment" page: lists the standard payment methods
// (src/data/leafDetail.js -> PAYMENT_OPTIONS) and hands off to enrollment.
// Reused by every category's Payment.jsx.
import { useNavigate } from "react-router-dom";
import { PAYMENT_OPTIONS } from "../../../data/leafDetail";
import DataIcon from "../../../utils/iconMap";

export default function PaymentOptionsPage({ category }) {
  const navigate = useNavigate();

  return (
    <div className="course-explorer-page">
      <div className="course-explorer-container">
        <section className="course-detail2-section">
          <h1 className="course-detail2-section-title">{category.title} — Payment Options</h1>
          <p className="course-detail2-text">
            Choose whichever payment method works best for you when you enroll in a {category.title} course.
          </p>

          <div className="payment-options-grid">
            {PAYMENT_OPTIONS.map((p) => (
              <div className="payment-option-card" key={p.key}>
                <DataIcon name={p.icon} className="payment-option-icon" style={{ color: category.color }} />
                <div>
                  <span className="payment-option-label">{p.label}</span>
                  <span className="payment-option-note">{p.note}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="course-detail2-enroll-primary"
            style={{ background: category.color }}
            onClick={() => navigate(`/${category.slug}/enrollment`)}
          >
            Continue to Enrollment
          </button>
        </section>
      </div>
    </div>
  );
}
