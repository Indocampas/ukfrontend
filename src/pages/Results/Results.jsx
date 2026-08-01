// pages/Results/Results.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAward,
  FiStar,
  FiUsers,
  FiTrendingUp,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import { FaGraduationCap, FaUniversity, FaChalkboardTeacher } from "react-icons/fa";
import "./Results.css";

// Student photos (replace with actual image URLs)
const STUDENT_PHOTOS = {
  "R. Aravind": "https://ui-avatars.com/api/?name=R+Aravind&size=100&background=e8b430&color=fff&bold=true",
  "S. Naveena": "https://ui-avatars.com/api/?name=S+Naveena&size=100&background=4CAF50&color=fff&bold=true",
  "M. Ganesh": "https://ui-avatars.com/api/?name=M+Ganesh&size=100&background=2196F3&color=fff&bold=true",
  "T. Sridhar": "https://ui-avatars.com/api/?name=T+Sridhar&size=100&background=9C27B0&color=fff&bold=true",
  "P. Vikash": "https://ui-avatars.com/api/?name=P+Vikash&size=100&background=FF5722&color=fff&bold=true",
};

const TOP_RESULTS = [
  {
    rank: "45",
    name: "R. Aravind",
    college: "AIIMS Delhi",
    exam: "NEET 2024",
    color: "#e8b430",
    bgColor: "#0a1330",
    textColor: "#ffffff",
    emoji: "🥇",
  },
  {
    rank: "78",
    name: "S. Naveena",
    college: "AIIMS Jodhpur",
    exam: "NEET 2024",
    color: "#4CAF50",
    bgColor: "#1a3a2a",
    textColor: "#ffffff",
    emoji: "🥈",
  },
  {
    rank: "156",
    name: "M. Ganesh",
    college: "IIT Bombay",
    exam: "JEE Advanced 2024",
    color: "#2196F3",
    bgColor: "#0a1a3a",
    textColor: "#ffffff",
    emoji: "🥉",
  },
  {
    rank: "245",
    name: "T. Sridhar",
    college: "IIT Delhi",
    exam: "JEE Advanced 2024",
    color: "#9C27B0",
    bgColor: "#2a0a3a",
    textColor: "#ffffff",
    emoji: "⭐",
  },
  {
    rank: "612",
    name: "P. Vikash",
    college: "IIT Madras",
    exam: "JEE Advanced 2024",
    color: "#FF5722",
    bgColor: "#3a1a0a",
    textColor: "#ffffff",
    emoji: "⭐",
  },
];

// Expanded data for all results
const ALL_RESULTS = [
  { rank: "45", name: "R. Aravind", college: "AIIMS Delhi", exam: "NEET 2024", year: 2024 },
  { rank: "78", name: "S. Naveena", college: "AIIMS Jodhpur", exam: "NEET 2024", year: 2024 },
  { rank: "156", name: "M. Ganesh", college: "IIT Bombay", exam: "JEE Advanced 2024", year: 2024 },
  { rank: "245", name: "T. Sridhar", college: "IIT Delhi", exam: "JEE Advanced 2024", year: 2024 },
  { rank: "612", name: "P. Vikash", college: "IIT Madras", exam: "JEE Advanced 2024", year: 2024 },
  { rank: "89", name: "K. Priya", college: "AIIMS Delhi", exam: "NEET 2023", year: 2023 },
  { rank: "134", name: "S. Rahul", college: "IIT Bombay", exam: "JEE Advanced 2023", year: 2023 },
  { rank: "201", name: "M. Sneha", college: "AIIMS Jodhpur", exam: "NEET 2023", year: 2023 },
  { rank: "456", name: "R. Kiran", college: "IIT Delhi", exam: "JEE Advanced 2023", year: 2023 },
  { rank: "89", name: "P. Deepak", college: "IIT Madras", exam: "JEE Advanced 2022", year: 2022 },
  { rank: "156", name: "L. Kavya", college: "AIIMS Delhi", exam: "NEET 2022", year: 2022 },
  { rank: "234", name: "V. Arjun", college: "IIT Bombay", exam: "JEE Advanced 2022", year: 2022 },
  { rank: "312", name: "N. Meera", college: "IIT Madras", exam: "JEE Advanced 2021", year: 2021 },
  { rank: "89", name: "P. Vikram", college: "AIIMS Delhi", exam: "NEET 2021", year: 2021 },
  { rank: "178", name: "S. Divya", college: "IIT Delhi", exam: "JEE Advanced 2021", year: 2021 },
];

// Store ALL_RESULTS in sessionStorage for persistence
const RESULTS_STORAGE_KEY = 'allResultsData';

// Save results to sessionStorage
const saveResultsToStorage = () => {
  try {
    sessionStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(ALL_RESULTS));
  } catch (error) {
    console.error('Error saving results to sessionStorage:', error);
  }
};

// Initialize storage when module loads
saveResultsToStorage();

// CountUp Animation Component
const CountUpNumber = ({ target, duration = 2000, color }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startValue = 0;
    const endValue = parseInt(target);
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, target, duration]);

  return (
    <span ref={elementRef} style={{ color: color || "#e8b430" }}>
      {count}
    </span>
  );
};

export default function Results({ scrollToSection }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isViewAllHovered, setIsViewAllHovered] = useState(false);
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all cards
    const cards = document.querySelectorAll('.results-top-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  // Mouse tilt effect handler
  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
    setHoveredCard(index);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleViewAllResults = () => {
    // Ensure data is saved before navigating
    saveResultsToStorage();
    
    // Navigate to all results page with scroll to top
    navigate('/all-results', { 
      state: { allResults: ALL_RESULTS },
      // This ensures the page scrolls to top
    });
    
    // Force scroll to top immediately
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="results-page" id="results" ref={sectionRef}>
      {/* ===== TOP RESULTS SECTION ===== */}
      <section className="results-top-section">
        {/* Floating golden background glow */}
        <div className="results-glow-bg"></div>
        
        <div className="results-container">
          <div className="results-header">
            <span className="results-tag">🏆 OUR TOP RESULTS</span>
            <div>
              <h2 className="results-title">Our Legacy of Excellence</h2>
            </div>
          </div>

          <div className="results-top-grid">
            {TOP_RESULTS.map((result, index) => {
              const tiltX = mousePosition.x * 20;
              const tiltY = mousePosition.y * -20;
              const isHovered = hoveredCard === index;
              
              return (
                <div 
                  className={`results-top-card ${isVisible ? "animate-in" : ""}`}
                  key={result.rank}
                  style={{ 
                    animationDelay: `${index * 0.12}s`,
                    transitionDelay: `${index * 0.05}s`,
                    transform: isHovered 
                      ? `perspective(800px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) translateY(-12px) scale(1.03)`
                      : 'perspective(800px) rotateY(0deg) rotateX(0deg)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, background-color 0.4s ease, border-color 0.4s ease',
                    boxShadow: isHovered 
                      ? `0 20px 60px rgba(0, 0, 0, 0.2), 0 0 40px ${result.color}33`
                      : '0 4px 20px rgba(0, 0, 0, 0.06)',
                    backgroundColor: isHovered ? result.bgColor : '#ffffff',
                    borderColor: isHovered ? result.color : 'rgba(231, 233, 242, 0.6)',
                    borderWidth: isHovered ? '2px' : '1px',
                    borderStyle: 'solid',
                  }}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="results-top-rank" style={{ 
                    color: isHovered ? result.color : result.color,
                    transition: 'color 0.3s ease',
                  }}>
                    <span className="rank-emoji">{result.emoji}</span> AIR{' '}
                    <CountUpNumber target={result.rank} color={isHovered ? result.color : result.color} />
                  </div>
                  <div 
                    className="results-top-avatar" 
                    style={{ 
                      background: isHovered ? result.color : result.color,
                      backgroundImage: `url(${STUDENT_PHOTOS[result.name]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: isHovered ? `3px solid ${result.color}` : 'none',
                      boxShadow: isHovered ? `0 8px 30px ${result.color}66` : '0 4px 15px rgba(0, 0, 0, 0.1)',
                      transition: 'border 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                      transform: 'scale(1)',
                    }}
                  >
                    {/* Initials will show if image fails to load */}
                    <span className="avatar-initials" style={{ 
                      opacity: 0, 
                      position: 'absolute',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#ffffff',
                    }}>
                      {result.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="results-top-name" style={{ 
                    color: isHovered ? result.textColor : '#0a1330',
                    transition: 'color 0.3s ease',
                  }}>
                    {result.name}
                  </h3>
                  <p className="results-top-college" style={{ 
                    color: isHovered ? result.textColor + 'cc' : '#5a6488',
                    transition: 'color 0.3s ease',
                  }}>
                    {result.college}
                  </p>
                  <span className="results-top-exam" style={{ 
                    backgroundColor: isHovered ? result.color + '33' : '#f0f2f7',
                    color: isHovered ? result.textColor : '#8e97b0',
                    border: isHovered ? `1px solid ${result.color}44` : 'none',
                    transition: 'background-color 0.3s ease, color 0.3s ease, border 0.3s ease',
                  }}>
                    {result.exam}
                  </span>
                  <div 
                    className="results-top-line" 
                    style={{ 
                      background: isHovered ? result.color : result.color,
                      transform: isHovered ? 'scaleX(1.5)' : 'scaleX(1)',
                      transition: 'transform 0.4s ease, width 0.4s ease',
                      width: isHovered ? '60px' : '40px',
                      height: isHovered ? '4px' : '3px',
                      opacity: isHovered ? 1 : 0.7,
                    }}
                  ></div>
                  
                  {/* Premium shine effect */}
                  <div className="card-shine" style={{
                    opacity: isHovered ? 0.15 : 0,
                    transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                  }}></div>

                  {/* Decorative glow circle on hover */}
                  <div className="card-glow" style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-30%',
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle, ${result.color}22, transparent 70%)`,
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}></div>
                </div>
              );
            })}
          </div>

          <div className="results-view-all">
            <button 
              className={`results-view-btn ${isViewAllHovered ? 'hovered' : ''}`}
              onClick={handleViewAllResults}
              onMouseEnter={() => setIsViewAllHovered(true)}
              onMouseLeave={() => setIsViewAllHovered(false)}
            >
              View All Results 
              <FiArrowRight className={`arrow-icon ${isViewAllHovered ? 'animate-arrow' : ''}`} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}