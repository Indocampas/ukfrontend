// src/pages/FacultyPrograms/FacultyProgramDetail.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiArrowLeft, FiCheckCircle, FiClock, FiUsers, 
  FiBookOpen, FiAward, FiCalendar, FiArrowRight,
  FiDollarSign, FiEdit, FiHash, FiActivity, FiHexagon,
  FiBox, FiZap, FiCommand, FiGrid, FiHeart
} from "react-icons/fi";
import { FaWhatsapp, FaRupeeSign } from "react-icons/fa";
import { useFacultyPrograms } from "../../context/FacultyProgramContext";
import "./FacultyProgramDetail.css";

// Icon mapping
const ICON_MAP = {
  FiBookOpen: <FiBookOpen />,
  FiAward: <FiAward />,
  FiUsers: <FiUsers />,
  FiDollarSign: <FiDollarSign />,
  FiEdit: <FiEdit />,
  FiHash: <FiHash />,
  FiActivity: <FiActivity />,
  FiHexagon: <FiHexagon />,
  FiBox: <FiBox />,
  FiZap: <FiZap />,
  FiCommand: <FiCommand />,
  FiGrid: <FiGrid />,
  FiHeart: <FiHeart />,
};

// Category color mapping
const CATEGORY_COLORS = {
  "financial-literacy": "#00B4D8",
  "spellbee": "#FF6B6B",
  "vedic-maths": "#F77F00",
  "biology-foundation": "#2D6A4F",
  "chemistry-foundation": "#7400B8",
  "math-foundation": "#6930C3",
  "physics-foundation": "#0077B6",
  "pgdptt": "#F15BB5",
  "montessori": "#9B5DE5",
  "ntt": "#FEE440",
  "pttp": "#00BBF9",
  "steam": "#00F5D4",
  "abacus": "#FF006E",
  "ai-ready-teacher": "#00C2A8",
};

const CATEGORY_LABELS = {
  "financial-literacy": "Financial Literacy",
  "spellbee": "SpellBee",
  "vedic-maths": "Vedic Maths",
  "biology-foundation": "Foundation Biology",
  "chemistry-foundation": "Foundation Chemistry",
  "math-foundation": "Foundation Mathematics",
  "physics-foundation": "Foundation Physics",
  "pgdptt": "PG Diploma in Pre-Primary Teacher Training",
  "montessori": "PG Diploma in Montessori",
  "ntt": "Nursery Teacher Training",
  "pttp": "Primary Teacher Training",
  "steam": "STEAM Trainer",
  "abacus": "Abacus Teacher Training",
};

export default function FacultyProgramDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { programs, loading } = useFacultyPrograms();
  const [program, setProgram] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading && programs.length > 0) {
      // Find program by slug
      const found = programs.find(p => 
        p.slug === slug || 
        p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
      );
      setProgram(found || null);
    }
  }, [programs, loading, slug]);

  // If no program found, try to get fallback data
  const getFallbackProgram = () => {
    const fallback = {
      title: CATEGORY_LABELS[slug] || slug.replace(/-/g, " "),
      category: slug,
      description: `Comprehensive ${CATEGORY_LABELS[slug] || slug} program designed for educators and aspiring teachers.`,
      target: "Teachers & Educators",
      duration: "3 Months",
      level: "Professional",
      features: ["Expert Faculty", "Study Material", "Practical Training", "Certificate"],
      fee: 30000,
      color: CATEGORY_COLORS[slug] || "#e8b430",
      icon: "FiBookOpen",
      isPublished: true,
    };
    return fallback;
  };

  const displayProgram = program || getFallbackProgram();

  const handleBack = () => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById('FacultyPrograms');
      if (section) {
        const navbarHeight = 78;
        const y = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 150);
  };

  const handleEnroll = () => {
    // Same Enroll Now -> Payment journey used by every other course page
    // on the site (src/pages/Enrollment/EnrollmentFlow.jsx via /enroll).
    navigate("/enroll", {
      state: {
        course: {
          title: displayProgram.title,
          mode: "Faculty Program",
          duration: displayProgram.duration,
          fee: displayProgram.fee,
          color: displayProgram.color || "#e8b430",
        },
      },
    });
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi UK Academy, I'm interested in the ${displayProgram.title} program. Can you provide more details?`
    );
    window.open(`https://wa.me/919361949355?text=${message}`, "_blank");
  };

  if (loading && programs.length === 0) {
    return (
      <div className="faculty-program-detail-page">
        <div className="faculty-program-detail-container">
          <div className="faculty-program-loading">Loading program details...</div>
        </div>
      </div>
    );
  }

  const color = displayProgram.color || "#e8b430";
  const icon = ICON_MAP[displayProgram.icon] || <FiBookOpen />;

  return (
    <div className="faculty-program-detail-page">
      <div className="faculty-program-detail-container">
        <button className="faculty-detail-back" onClick={handleBack}>
          <FiArrowLeft /> Back to Programs
        </button>

        <div className={`faculty-detail-hero ${isVisible ? "animate-in" : ""}`} style={{ background: color }}>
          <div className="faculty-detail-hero-content">
            <div className="faculty-detail-icon">{icon}</div>
            <h1 className="faculty-detail-title">{displayProgram.title}</h1>
            <p className="faculty-detail-subtitle">
              {displayProgram.category ? CATEGORY_LABELS[displayProgram.category] || displayProgram.category : ""}
            </p>
          </div>
        </div>

        <div className="faculty-detail-content">
          <div className="faculty-detail-main">
            <section className="faculty-detail-section">
              <h2>Program Overview</h2>
              <p>{displayProgram.description}</p>
            </section>

            <section className="faculty-detail-section">
              <h2>Program Highlights</h2>
              <div className="faculty-detail-features">
                {displayProgram.features && displayProgram.features.map((feature, index) => (
                  <div className="faculty-detail-feature-item" key={index}>
                    <FiCheckCircle style={{ color }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="faculty-detail-section">
              <h2>Program Details</h2>
              <div className="faculty-detail-info-grid">
                <div className="faculty-detail-info-item">
                  <span className="faculty-detail-info-label">Duration</span>
                  <span className="faculty-detail-info-value" style={{ color }}>
                    <FiClock /> {displayProgram.duration || "3 Months"}
                  </span>
                </div>
                <div className="faculty-detail-info-item">
                  <span className="faculty-detail-info-label">Level</span>
                  <span className="faculty-detail-info-value" style={{ color }}>
                    <FiAward /> {displayProgram.level || "Professional"}
                  </span>
                </div>
                <div className="faculty-detail-info-item">
                  <span className="faculty-detail-info-label">Target Audience</span>
                  <span className="faculty-detail-info-value" style={{ color }}>
                    <FiUsers /> {displayProgram.target || "Teachers & Educators"}
                  </span>
                </div>
                <div className="faculty-detail-info-item">
                  <span className="faculty-detail-info-label">Course Fee</span>
                  <span className="faculty-detail-info-value" style={{ color }}>
                    <FaRupeeSign /> ₹{displayProgram.fee ? displayProgram.fee.toLocaleString() : "30,000"}
                  </span>
                </div>
              </div>
            </section>
          </div>

          <div className="faculty-detail-sidebar">
            <div className="faculty-detail-sidebar-card" style={{ borderColor: color }}>
              <h3>Ready to Get Started?</h3>
              <p>Join this program and become a certified educator.</p>
              <div className="faculty-detail-sidebar-actions">
                <button className="faculty-detail-enroll-btn" style={{ background: color }} onClick={handleEnroll}>
                  Enroll Now <FiArrowRight />
                </button>
                <button className="faculty-detail-whatsapp-btn" onClick={handleWhatsApp}>
                  <FaWhatsapp /> Enquire on WhatsApp
                </button>
              </div>
              <div className="faculty-detail-sidebar-features">
                <div className="faculty-detail-sidebar-feature">
                  <FiCheckCircle style={{ color }} /> Expert Faculty
                </div>
                <div className="faculty-detail-sidebar-feature">
                  <FiCheckCircle style={{ color }} /> Practical Training
                </div>
                <div className="faculty-detail-sidebar-feature">
                  <FiCheckCircle style={{ color }} /> Certification
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}