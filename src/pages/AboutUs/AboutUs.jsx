// src/pages/AboutUs/AboutUs.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiArrowRight,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiMapPin,
} from "react-icons/fi";
import { FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import "./AboutUs.css";

// Quick-glance facts about the institution
const ABOUT_FEATURES = [
  { id: 1, text: "15+ Years of Excellence", color: "#e8b430" },
  { id: 2, text: "5000+ Successful Students", color: "#4CAF50" },
  { id: 3, text: "100+ Expert Faculty Members", color: "#2196F3" },
  { id: 4, text: "95% Success Rate", color: "#9C27B0" },
];

// What sets our journey and approach apart
const ABOUT_HIGHLIGHTS = [
  {
    id: 1,
    icon: <FaGraduationCap />,
    title: "Founded on a Simple Idea",
    description:
      "UK Academy was founded  with one goal: Empower people through education.",
    color: "#e8b430",
  },
  {
    id: 2,
    icon: <FaChalkboardTeacher />,
    title: "Faculty Who've Been There",
    description:
      "Our teaching team is made up of IITians, doctors, and subject specialists who bring real exam experience into the classroom, not just textbook knowledge.",
    color: "#4CAF50",
  },
  {
    id: 3,
    icon: <FiTrendingUp />,
    title: "Growing Through Results",
    description:
      "From a single classroom to a full-fledged campus with hostel and transport facilities, our growth has been driven entirely by the results our students achieve year after year.",
    color: "#2196F3",
  },
  {
    id: 4,
    icon: <FiMapPin />,
    title: "Rooted in the Community",
    description:
      "We remain deeply connected to the local community we started in, running scholarship exams and fee concessions so that talented students are never turned away for financial reasons.",
    color: "#9C27B0",
  },
];

export default function AboutUs() {
  const navigate = useNavigate();
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleCards((prev) => (prev.includes(index) ? prev : [...prev, index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );
    cardRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="aboutus-uka-section" id="about">
      <div className="aboutus-uka-container">
        <div className="aboutus-uka-header">
          <span className="aboutus-uka-tag">
            <FiUsers /> ABOUT US
          </span>
          <h2>Who We Are</h2>
          <p>
            UK ACADEMY is committed to providing quality education through experienced faculty members, innovative teaching methodologies, and student-centered learning practices. Our objective is to bridge the gap between school education and competitive exam preparation
          </p>
        </div>

        <div className="aboutus-uka-features">
          {ABOUT_FEATURES.map((feature) => (
            <div className="aboutus-uka-feature-item" key={feature.id}>
              <FiCheckCircle className="aboutus-uka-feature-icon" style={{ color: feature.color }} />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="aboutus-uka-grid">
          {ABOUT_HIGHLIGHTS.map((item, index) => (
            <div
              ref={(el) => (cardRefs.current[index] = el)}
              data-index={index}
              className={`aboutus-uka-card ${visibleCards.includes(index) ? "animate-in" : ""}`}
              key={item.id}
              style={{ borderTop: `4px solid ${item.color}`, animationDelay: `${index * 0.1}s` }}
            >
              <div className="aboutus-uka-icon" style={{ background: item.color }}>
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

       
      </div>
    </section>
  );
}
