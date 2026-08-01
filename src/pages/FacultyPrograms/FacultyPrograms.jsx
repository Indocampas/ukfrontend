// src/pages/FacultyPrograms/FacultyPrograms.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaWhatsapp, FaArrowRight, FaGraduationCap, 
  FaChalkboardTeacher, FaUserGraduate, FaAward,
  FaCertificate, FaClock, FaUsers
} from "react-icons/fa";
import { 
  FiCheckCircle, FiDollarSign, 
  FiArrowUpRight, FiStar, FiTrendingUp,
  FiBookOpen, FiAward, FiUsers as FiUsersIcon, FiEdit, 
  FiHash, FiActivity, FiHexagon, FiBox, 
  FiZap, FiCommand, FiGrid, FiHeart
} from "react-icons/fi";
import { useFacultyPrograms } from "../../context/FacultyProgramContext";
import { useFormModal } from "../../context/FormModalContext";
import "./FacultyPrograms.css";
import facultyImage from "../../assets/faculty/Faculty-program.png";

// Icon mapping for dynamic icons
const ICON_MAP = {
  FiBookOpen: <FiBookOpen />,
  FiAward: <FiAward />,
  FiUsers: <FiUsersIcon />,
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

// Default icon fallback
const DEFAULT_ICON = <FaChalkboardTeacher />;

export default function FacultyPrograms({ onNavigate }) {
  const navigate = useNavigate();
  const { programs, loading } = useFacultyPrograms();
  const { openForm } = useFormModal();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [counts, setCounts] = useState({
    certified: 0,
    programs: 0,
    mentors: 0,
    success: 0
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            startCountAnimation();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startCountAnimation = () => {
    const targetCounts = {
      certified: 5000,
      programs: programs.filter(p => p.isPublished !== false).length || 150,
      mentors: 50,
      success: 96
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounts({
        certified: Math.round(progress * targetCounts.certified),
        programs: Math.round(progress * targetCounts.programs),
        mentors: Math.round(progress * targetCounts.mentors),
        success: Math.round(progress * targetCounts.success)
      });

      if (step >= steps) {
        setCounts(targetCounts);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/919361949355?text=Hi%2C%20I%20want%20to%20know%20more%20about%20the%20Faculty%20Certification%20Program", "_blank");
  };

  const handleExplorePrograms = () => {
    const path = "/faculty-programs";
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const handleProgramClick = (program) => {
    const slug = program.slug || program.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    navigate(`/faculty-programs/${slug}`);
  };

  const handleEnrollClick = (program, e) => {
    e.stopPropagation();
    openForm("Apply Now", { 
      course: program.title 
    });
  };

  // Get published programs
  const publishedPrograms = programs.filter(p => p.isPublished !== false);
  
  // Get featured programs (first 4)
  const featuredPrograms = publishedPrograms.slice(0, 4);
  
  // If no programs from API, use fallback
  const displayPrograms = featuredPrograms.length > 0 ? featuredPrograms : [
    {
      id: "fallback-1",
      title: "Nursery Teacher Training",
      category: "ntt",
      description: "Start your rewarding career in early childhood education",
      target: "Aspiring Nursery Teachers",
      duration: "3 Months",
      level: "Professional",
      features: ["Child Psychology", "Activity-Based Learning", "Storytelling", "Creative Activities"],
      fee: 30000,
      icon: "FiHeart",
      color: "#FEE440",
      isPublished: true
    },
    {
      id: "fallback-2",
      title: "Primary Teacher Training",
      category: "pttp",
      description: "Build a rewarding career in primary education",
      target: "Aspiring Primary Teachers",
      duration: "3 Months",
      level: "Professional",
      features: ["Child Development", "Teaching Methodologies", "Lesson Planning", "Assessment"],
      fee: 30000,
      icon: "FiBookOpen",
      color: "#00BBF9",
      isPublished: true
    },
    {
      id: "fallback-3",
      title: "PG Diploma in Montessori",
      category: "montessori",
      description: "Comprehensive Montessori teacher training",
      target: "Aspiring Montessori Educators",
      duration: "3 Months",
      level: "Diploma",
      features: ["Montessori Method", "Child Psychology", "Practical Life", "Language Development"],
      fee: 30000,
      icon: "FiGrid",
      color: "#9B5DE5",
      isPublished: true
    },
    {
      id: "fallback-4",
      title: "STEAM Trainer Program",
      category: "steam",
      description: "Become a certified STEAM trainer",
      target: "Teachers & Graduates",
      duration: "3 Months",
      level: "Professional",
      features: ["Robotics", "Coding", "Design Thinking", "Project-Based"],
      fee: 30000,
      icon: "FiZap",
      color: "#00F5D4",
      isPublished: true
    }
  ];

  // Get icon component
  const getIcon = (iconName) => {
    return ICON_MAP[iconName] || DEFAULT_ICON;
  };

  return (
    <section id="FacultyPrograms" className="faculty-programs-section" ref={sectionRef}>
      {/* Background decoration */}
      <div className="faculty-bg-decoration">
        <div className="faculty-bg-circle faculty-bg-circle-1"></div>
        <div className="faculty-bg-circle faculty-bg-circle-2"></div>
        <div className="faculty-bg-circle faculty-bg-circle-3"></div>
      </div>

      <div className="faculty-programs-container">
        {/* Hero Section */}
        <div className={`faculty-hero ${isVisible ? "animate-in" : ""}`}>
          <div className="faculty-hero-left">
            <div className="faculty-hero-badge">
              <FaGraduationCap className="faculty-hero-badge-icon" />
              <span>FACULTY CERTIFICATION PROGRAM</span>
            </div>
            <h1 className="faculty-hero-title">
              Empower Your Teaching<br />
              <span className="faculty-hero-highlight">Become a Certified Faculty</span>
            </h1>
            <p className="faculty-hero-description">
          Join UK Academy's Faculty Development & Certification Program to enhance your teaching expertise, gain professional certification, and create impactful learning experiences. Get industry-ready training, access placement opportunities, and explore franchise opportunities to build a rewarding and successful career in education.
           </p>
            <div className="faculty-hero-actions">
              <button className="faculty-hero-btn-primary" onClick={handleWhatsAppClick}>
                <FaWhatsapp className="faculty-btn-icon" />
                Become Certified Faculty
              </button>
              <button className="faculty-hero-btn-secondary" onClick={handleExplorePrograms}>
                Explore All Programs
                <FiArrowUpRight className="faculty-btn-icon" />
              </button>
            </div>
          </div>

          <div className="faculty-hero-right">
            <div className="faculty-hero-image-wrapper">
              <img 
                src={facultyImage} 
                alt="Faculty Program" 
                className="faculty-hero-image"
              />
              <div className="faculty-hero-image-glow"></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}

      </div>
    </section>
  );
}