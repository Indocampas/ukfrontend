// src/pages/About/About.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiArrowRight, 
  FiCheckCircle, 
  FiAward, 
  FiUsers, 
  FiCpu, 
  FiCalendar,
  FiBookOpen,
  FiUser,
  FiHome,
  FiMapPin,
  FiStar,
  FiTrendingUp,
  FiBarChart2,
  FiBriefcase,
  FiGlobe,
  FiTarget,
  FiClock,
  FiMail,
  FiPhone,
  FiMap
} from "react-icons/fi";
import { FaGraduationCap, FaUniversity, FaChalkboardTeacher, FaBus, FaBuilding, FaHistory } from "react-icons/fa";
import "./About.css";

// Why UK Academy Data
const WHY_DATA = [
  {
    id: 1,
    icon: <FaChalkboardTeacher />,
    title: "Expert Faculty",
    description: "IITians & Doctors with years of teaching excellence",
    color: "#e8b430"
  },
  {
    id: 2,
    icon: <FiCpu />,
    title: "AI Powered Learning",
    description: "Smart analytics & AI driven performance improvement",
    color: "#4CAF50"
  },
  {
    id: 3,
    icon: <FiCalendar />,
    title: "Daily Tests & Practice",
    description: "Regular tests with detailed analysis & doubt clearing",
    color: "#2196F3"
  },
  {
    id: 4,
    icon: <FiUsers />,
    title: "Personal Mentorship",
    description: "One to one mentorship for every student",
    color: "#9C27B0"
  },
  {
    id: 5,
    icon: <FiBarChart2 />,
    title: "Parent Dashboard",
    description: "Real-time performance tracking for parents",
    color: "#FF5722"
  },
  {
    id: 6,
    icon: <FaBus />,
    title: "Hostel & Transport",
    description: "Safe & comfortable hostel with transportation facility",
    color: "#009688"
  }
];

// Top Results Data
const RESULTS_DATA = [
  {
    id: 1,
    rank: "45",
    name: "R. Aravind",
    achievement: "AIIMS Delhi",
    exam: "NEET 2024",
    color: "#e8b430"
  },
  {
    id: 2,
    rank: "78",
    name: "S. Keerthana",
    achievement: "AIIMS Jodhpur",
    exam: "NEET 2024",
    color: "#4CAF50"
  },
  {
    id: 3,
    rank: "156",
    name: "M. Vignesh",
    achievement: "IIT Bombay",
    exam: "JEE Advanced 2024",
    color: "#2196F3"
  },
  {
    id: 4,
    rank: "245",
    name: "T. Harini",
    achievement: "IIT Delhi",
    exam: "JEE Advanced 2024",
    color: "#9C27B0"
  },
  {
    id: 5,
    rank: "612",
    name: "P. Karthik",
    achievement: "IIT Madras",
    exam: "JEE Advanced 2024",
    color: "#FF5722"
  }
];

// Vision & Mission Data
const VISION_DATA = [
  {
    id: 1,
    title: "Our Vision",
    description: "To become India's most trusted educational institution, empowering students to achieve their dreams through excellence in education and holistic development.",
    icon: <FiTarget />,
    color: "#e8b430"
  },
  {
    id: 2,
    title: "Our Mission",
    description: "To provide world-class education with personalized attention, innovative teaching methods, and a supportive learning environment that nurtures talent and builds character.",
    icon: <FiGlobe />,
    color: "#4CAF50"
  }
];

export default function About({ onNavigate }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const [visibleResults, setVisibleResults] = useState([]);
  const [visibleVision, setVisibleVision] = useState([]);
  const whyRefs = useRef([]);
  const resultRefs = useRef([]);
  const visionRefs = useRef([]);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);

    // Observer for Why UK Academy items
    const whyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleItems((prev) => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    whyRefs.current.forEach((ref) => {
      if (ref) whyObserver.observe(ref);
    });

    // Observer for Results
    const resultObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleResults((prev) => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    resultRefs.current.forEach((ref) => {
      if (ref) resultObserver.observe(ref);
    });

    // Observer for Vision items
    const visionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleVision((prev) => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    visionRefs.current.forEach((ref) => {
      if (ref) visionObserver.observe(ref);
    });

    return () => {
      whyObserver.disconnect();
      resultObserver.disconnect();
      visionObserver.disconnect();
    };
  }, []);

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('/');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="about-page">
      <div className="about-container">
        <button className="about-back-button" onClick={handleBack}>
          <FiArrowLeft /> Back to Home
        </button>


        <div className="about-hero">
          <div className="about-hero-content">
            <span className="about-hero-tag">ABOUT US</span>
            <h1 className="about-hero-title">Welcome to UK Academy</h1>
            <p className="about-hero-subtitle">
              Empowering students to achieve their dreams through excellence in education since 2010
            </p>
          </div>
        </div>


        <section className="about-description-section">
          <div className="about-description-content">
            <h2 className="about-description-title">Who We Are</h2>
            <p className="about-description-text">
              UK Academy is a premier educational institution dedicated to shaping the future of young minds. 
              Founded in 2010, we have been consistently providing quality education and guidance to students 
              aspiring for competitive exams like JEE, NEET, NTSE, and Olympiads. Our commitment to excellence 
              and student success has made us one of the most trusted names in the education sector.
            </p>
            <div className="about-description-features">
              <div className="about-feature-item">
                <FiCheckCircle className="about-feature-icon" style={{ color: "#e8b430" }} />
                <span>15+ Years of Excellence</span>
              </div>
              <div className="about-feature-item">
                <FiCheckCircle className="about-feature-icon" style={{ color: "#4CAF50" }} />
                <span>5000+ Successful Students</span>
              </div>
              <div className="about-feature-item">
                <FiCheckCircle className="about-feature-icon" style={{ color: "#2196F3" }} />
                <span>100+ Expert Faculty Members</span>
              </div>
              <div className="about-feature-item">
                <FiCheckCircle className="about-feature-icon" style={{ color: "#9C27B0" }} />
                <span>95% Success Rate</span>
              </div>
            </div>
          </div>
        </section>

        <section className="vision-section">
          <h2 className="vision-title">Our Vision & Mission</h2>
          <div className="vision-grid">
            {VISION_DATA.map((item, index) => (
              <div
                ref={(el) => (visionRefs.current[index] = el)}
                data-index={index}
                className={`vision-card ${visibleVision.includes(index) ? "animate-in" : ""}`}
                key={item.id}
                style={{ 
                  borderTop: `4px solid ${item.color}`,
                  animationDelay: `${index * 0.15}s`
                }}
              >
                <div className="vision-icon-wrapper" style={{ background: item.color }}>
                  {item.icon}
                </div>
                <h3 className="vision-card-title">{item.title}</h3>
                <p className="vision-card-description">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="why-section">
          <div className="why-header">
            <span className="why-tag">WHY UK ACADEMY</span>
            <h2 className="why-title">Why Choose Us?</h2>
            <p className="why-subtitle">What makes us different from others</p>
          </div>
          <div className="why-grid">
            {WHY_DATA.map((item, index) => (
              <div
                ref={(el) => (whyRefs.current[index] = el)}
                data-index={index}
                className={`why-card ${visibleItems.includes(index) ? "animate-in" : ""}`}
                key={item.id}
                style={{ 
                  borderTop: `4px solid ${item.color}`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="why-icon-wrapper" style={{ background: item.color }}>
                  <div className="why-icon">{item.icon}</div>
                </div>
                <h3 className="why-card-title">{item.title}</h3>
                <p className="why-card-description">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="results-section">
          <div className="results-header">
            <span className="results-tag">OUR TOP RESULTS</span>
            <h2 className="results-title">Student Achievements</h2>
            <p className="results-subtitle">Celebrating the success of our talented students</p>
          </div>

          <div className="results-grid">
            {RESULTS_DATA.map((result, index) => (
              <div
                ref={(el) => (resultRefs.current[index] = el)}
                data-index={index}
                className={`result-card ${visibleResults.includes(index) ? "animate-in" : ""}`}
                key={result.id}
                style={{ 
                  borderTop: `4px solid ${result.color}`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="result-rank" style={{ color: result.color }}>
                  AIR <span>{result.rank}</span>
                </div>
                <div className="result-details">
                  <h3 className="result-name">{result.name}</h3>
                  <p className="result-achievement">{result.achievement}</p>
                  <span className="result-exam">{result.exam}</span>
                </div>
                <div className="result-icon-wrapper" style={{ background: result.color }}>
                  <FiAward className="result-icon" />
                </div>
              </div>
            ))}
          </div>

          <div className="results-cta">
            <button className="results-view-all" onClick={() => navigate('/')}>
              View More Success Stories <FiArrowRight />
            </button>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#e8b430" }}>500+</div>
              <div className="stat-label">IIT/NIT Selections</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#4CAF50" }}>200+</div>
              <div className="stat-label">AIIMS Selections</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#2196F3" }}>50+</div>
              <div className="stat-label">NTSE Scholars</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: "#9C27B0" }}>95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}