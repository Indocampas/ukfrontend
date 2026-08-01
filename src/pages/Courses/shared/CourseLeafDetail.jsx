// src/pages/Courses/CourseLeafDetail.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiChevronDown,
  FiShield,
  FiPlayCircle,
  FiClock,
  FiUsers,
  FiLayers,
} from "react-icons/fi";
import { buildLeafDetail, buildInfoDetail, inr } from "../../../data/leafDetail";
import { useFormModal } from "../../../context/FormModalContext";
import DataIcon from "../../../utils/iconMap";
import { INFO_TOOL_COMPONENTS } from "./CourseInfoTools";
import ClassroomCoursesTool from "./ClassroomCoursesTool";
import BatchSelector from "./BatchSelector";
import AdminCoursesSection from "./AdminCoursesSection";

// Section anchors used by the in-page quick-nav — keep these in sync with
// the `id` attributes on the <section> elements below.
function buildQuickNav({ isLive }) {
  const nav = [
    { id: "overview", label: "Overview" },
    { id: "eligibility", label: "Eligibility" },
    { id: "syllabus", label: "Syllabus" },
    { id: "features", label: "Features" },
  ];
  if (isLive) nav.push({ id: "batches", label: "Batches" });
  nav.push(
    { id: "plans", label: "Plans" },
    { id: "course-info", label: "Course Info" },
    { id: "payment", label: "Payment" },
    { id: "faqs", label: "FAQs" }
  );
  return nav;
}

export default function CourseLeafDetail({ trail, node }) {
  const navigate = useNavigate();
  const { openForm } = useFormModal();
  const [openFaq, setOpenFaq] = useState(null);

  const ToolComponent = INFO_TOOL_COMPONENTS[node.kind];
  if (ToolComponent) {
    return <ToolComponent trail={trail} category={trail[0]} />;
  }

  if (node.kind === "classroom") {
    return <ClassroomCoursesTool category={trail[0]} />;
  }

  if (node.kind === "info") {
    const info = buildInfoDetail(trail);
    return (
      <div className="course-info-page" style={{ borderTopColor: info.color }}>
        <span className="course-info-page-icon" style={{ background: info.color }}>
          {info.icon}
        </span>
        <h1>{info.title}</h1>
        <p className="course-info-page-sub">{info.subtitle}</p>
        <p className="course-info-page-text">
          Full {info.title.toLowerCase()} details for {info.category.title} are shared during counselling and on
          enrollment. Reach out to our team and we'll send you the complete, up-to-date information.
        </p>
        <button className="course-detail2-enroll-primary" style={{ background: info.color }} onClick={() => openForm("Enquire Now", { course: `${info.category.title} — ${info.title}` })}>
          Talk to Us <FiArrowRight />
        </button>
      </div>
    );
  }

  const leaf = buildLeafDetail(trail);
  const pathKey = trail.map((n) => n.slug).join("/");
  const isLive = pathKey.includes("/live-classes");
  const isRecorded = pathKey.includes("/recorded-classes");
  const isTestSeries = pathKey.includes("/test-series");
  const isStudyMaterials = pathKey.includes("/study-materials");
  // Maps this leaf's position in the tree to the admin's courseType values
  // (see src/data/courseCategories.js) so real, admin-added courses show up
  // on the matching public page.
  const dbCourseType = isLive
    ? "online"
    : isRecorded
    ? "recorded"
    : isTestSeries
    ? "test-series"
    : isStudyMaterials
    ? "study-materials"
    : null;
  const quickNav = buildQuickNav({ isLive });

  const handleEnroll = (planKey) => {
    const plan = planKey ? leaf.plans[planKey] : leaf.plans.advanced;
    navigate("/enroll", {
      state: {
        course: {
          title: `${leaf.title}${plan ? ` — ${plan.label} Plan` : ""}`,
          mode: isLive ? "Live Classes" : isRecorded ? "Recorded Classes" : leaf.breadcrumbLabel,
          duration: leaf.durationLabel,
          fee: plan ? plan.price : leaf.basePrice,
          color: leaf.color,
        },
      },
    });
  };

  return (
    <>
      <div className="course-detail2-main">
        {/* ===== Hero: media panel + info panel ===== */}
        <div className="course-hero-grid">
          <div className="course-hero-media" style={{ background: `linear-gradient(135deg, ${leaf.color}, ${leaf.color}99)` }}>
            <span className="course-hero-media-icon">{leaf.icon}</span>
            <button className="course-hero-play" aria-label="Play course introduction">
              <FiPlayCircle />
            </button>
            <p className="course-hero-media-caption">Discover Our {leaf.title} Program</p>
            {isLive && <span className="course-mode-badge is-live course-hero-media-badge">● LIVE</span>}
            {isRecorded && <span className="course-mode-badge is-recorded course-hero-media-badge">RECORDED</span>}
          </div>

          <div className="course-hero-info">
            <span className="course-detail2-breadcrumb is-dark">Courses / {leaf.breadcrumbLabel}</span>
            <h1 className="course-hero-title">{leaf.title}</h1>
            <p className="course-detail2-subtitle is-dark">{leaf.subtitle}</p>

            <div className="course-hero-meta">
              <div className="course-hero-meta-item">
                <FiUsers style={{ color: leaf.color }} />
                <div>
                  <span>For Students</span>
                  <strong>{leaf.target}</strong>
                </div>
              </div>
              <div className="course-hero-meta-item">
                <FiClock style={{ color: leaf.color }} />
                <div>
                  <span>Duration</span>
                  <strong>{leaf.durationLabel}</strong>
                </div>
              </div>
              <div className="course-hero-meta-item">
                <FiLayers style={{ color: leaf.color }} />
                <div>
                  <span>Mode</span>
                  <strong>{isLive ? "Live Online" : isRecorded ? "Recorded" : "Classroom / Online"}</strong>
                </div>
              </div>
            </div>

            <div className="course-hero-fee-row">
              <span>Starting from</span>
              <strong style={{ color: leaf.color }}>{inr(leaf.startingPrice)}</strong>
            </div>

            <button className="course-detail2-enroll-primary course-hero-enroll" style={{ background: leaf.color }} onClick={() => handleEnroll()}>
              Enroll Now <FiArrowRight />
            </button>
          </div>
        </div>

        {/* ===== Live / Recorded highlight banner ===== */}
        {(isLive || isRecorded) && (
          <div className={`course-mode-banner ${isLive ? "is-live" : "is-recorded"}`} style={{ borderColor: leaf.color }}>
            <div className="course-mode-banner-head">
              <span className="course-mode-banner-tag" style={{ background: leaf.color }}>
                {isLive ? "🔴 LIVE INTERACTIVE CLASSES" : "🎥 RECORDED VIDEO CLASSES"}
              </span>
            </div>
            <div className="course-mode-banner-list">
              {(isLive
                ? ["Expert Faculty", "Multiple Batches", "Live Doubt Clearing", "Study Materials", "Test Series", "Mock Tests"]
                : ["Learn at Your Own Pace", "Unlimited Video Access", "Study Materials", "Test Series", "Doubt Clearing", "Mock Tests"]
              ).map((item) => (
                <span className="course-mode-banner-item" key={item}>
                  <FiCheckCircle style={{ color: leaf.color }} /> {item}
                </span>
              ))}
            </div>
            <button className="course-detail2-enroll-primary" style={{ background: leaf.color }} onClick={() => handleEnroll()}>
              Enroll Now <FiArrowRight />
            </button>
          </div>
        )}

        {/* Real, admin-added courses for this category/type - shown first
            when the admin has actually added matching courses. */}
        {dbCourseType && (
          <AdminCoursesSection
            categorySlug={leaf.category.slug}
            courseType={dbCourseType}
            color={leaf.color}
            title="Courses Added by UK Academy"
          />
        )}

        {/* ===== In-page quick navigation ===== */}
        <nav className="course-quicknav" aria-label="Jump to section">
          {quickNav.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="course-quicknav-item" style={{ "--accent": leaf.color }}>
              {item.label}
            </a>
          ))}
        </nav>

        <section className="course-detail2-section" id="overview">
          <h2 className="course-detail2-section-title">Course Overview</h2>
          <p className="course-detail2-text">{leaf.overview}</p>
        </section>

        <section className="course-detail2-section" id="eligibility">
          <h2 className="course-detail2-section-title">Eligibility</h2>
          <p className="course-detail2-text">{leaf.eligibility}</p>
        </section>

        <section className="course-detail2-section" id="syllabus">
          <h2 className="course-detail2-section-title">Course Curriculum / Syllabus</h2>
          <ul className="course-detail2-list">
            {leaf.syllabus.map((item, i) => (
              <li key={i}>
                <FiCheckCircle style={{ color: leaf.color }} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="course-detail2-section" id="features">
          <h2 className="course-detail2-section-title">Course Features</h2>
          <div className="course-feature-grid">
            {leaf.features.map((f) => (
              <div className="course-feature-card" key={f.label}>
                <span className="course-feature-icon" style={{ background: `${leaf.color}1a`, color: leaf.color }}>
                  <DataIcon name={f.icon} />
                </span>
                <span className="course-feature-label">{f.label}</span>
              </div>
            ))}
          </div>
        </section>

        {isLive && (
          <div id="batches">
            <BatchSelector pathKey={pathKey} color={leaf.color} courseLabel={leaf.title} />
          </div>
        )}

        <section className="course-detail2-section" id="plans">
          <h2 className="course-detail2-section-title">Course Plans</h2>
          <div className="course-plans-grid">
            {["basic", "intermediate", "advanced"].map((planKey) => {
              const plan = leaf.plans[planKey];
              return (
                <div className={`course-plan-card ${plan.highlighted ? "is-highlighted" : ""}`} key={planKey} style={plan.highlighted ? { borderColor: leaf.color } : undefined}>
                  {plan.highlighted && (
                    <span className="course-plan-badge" style={{ background: leaf.color }}>
                      Most Popular
                    </span>
                  )}
                  <h3 className="course-plan-name">{plan.label}</h3>
                  <p className="course-plan-tagline">{plan.tagline}</p>
                  <p className="course-plan-price" style={{ color: leaf.color }}>
                    {inr(plan.price)}
                    <span>/ {leaf.durationLabel}</span>
                  </p>
                  <ul className="course-plan-includes">
                    {plan.includes.map((inc) => (
                      <li key={inc}>
                        <FiCheckCircle style={{ color: leaf.color }} /> {inc}
                      </li>
                    ))}
                  </ul>
                  <button className="course-plan-cta" style={{ background: leaf.color }} onClick={() => handleEnroll(planKey)}>
                    Choose {plan.label} <FiArrowRight />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="course-detail2-section" id="course-info">
          <h2 className="course-detail2-section-title">Course Information</h2>
          <div className="course-info-grid">
            {leaf.courseInfo.map((info) => (
              <div className="course-info-item" key={info.label}>
                <DataIcon name={info.icon} className="course-info-icon" style={{ color: leaf.color }} />
                <div>
                  <span className="course-info-label">{info.label}</span>
                  <span className="course-info-value">{info.value}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="course-detail2-section" id="payment">
          <h2 className="course-detail2-section-title">Payment Options</h2>
          <div className="payment-options-grid">
            {leaf.paymentOptions.map((p) => (
              <div className="payment-option-card" key={p.key}>
                <DataIcon name={p.icon} className="payment-option-icon" style={{ color: leaf.color }} />
                <div>
                  <span className="payment-option-label">{p.label}</span>
                  <span className="payment-option-note">{p.note}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="course-detail2-enroll-primary" style={{ background: leaf.color }} onClick={() => handleEnroll()}>
            Enroll Now <FiArrowRight />
          </button>
        </section>

        {leaf.showRefundPolicy && (
          <section className="course-detail2-section">
            <h2 className="course-detail2-section-title">
              <FiShield style={{ marginRight: 8, color: leaf.color }} />
              Refund Policy
            </h2>
            <div className="refund-policy-box" style={{ borderColor: leaf.color }}>
              <p>
                If a student enrolls in a 2-year course and does not qualify for the examination after completing the
                course, the student will be eligible for a 100% fee refund, subject to the academy's terms and
                conditions.
              </p>
            </div>
          </section>
        )}

        <section className="course-detail2-section" id="faqs">
          <h2 className="course-detail2-section-title">FAQs</h2>
          <div className="course-faq-list">
            {leaf.faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div className={`course-faq-item ${isOpen ? "is-open" : ""}`} key={i}>
                  <button className="course-faq-question" onClick={() => setOpenFaq(isOpen ? null : i)}>
                    {faq.q}
                    <FiChevronDown className="course-faq-chevron" />
                  </button>
                  {isOpen && <p className="course-faq-answer">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <div className="course-detail2-cta">
          <button className="course-detail2-enroll-primary" style={{ background: leaf.color }} onClick={() => handleEnroll()}>
            Enroll Now <FiArrowRight />
          </button>
          <button className="course-detail2-enroll-secondary" onClick={() => navigate("/")}>
            Explore More Courses
          </button>
        </div>
      </div>

      {/* Mobile-only sticky Enroll CTA (spec section 8) */}
      <div className="course-mobile-sticky-cta">
        <div className="course-mobile-sticky-info">
          <span>{leaf.title}</span>
          <strong style={{ color: leaf.color }}>{inr(leaf.startingPrice)}</strong>
        </div>
        <button className="course-detail2-enroll-primary" style={{ background: leaf.color }} onClick={() => handleEnroll()}>
          Enroll Now
        </button>
      </div>
    </>
  );
}
