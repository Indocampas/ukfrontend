// src/pages/VisionMission/VisionMission.jsx
import { useEffect, useRef, useState } from "react";
import {
  FiTarget,
  FiFlag,
  FiCpu,
  FiHeart,
  FiGlobe,
  FiUsers,
  FiCheckCircle,
  FiBarChart2,
} from "react-icons/fi";
import { FaChalkboardTeacher, FaBalanceScale } from "react-icons/fa";
import "./VisionMission.css";

// Where we're headed
const VISION_POINTS = [
  {
    id: 1,
    icon: <FaChalkboardTeacher />,
    text: "To empower students to become the best version of themselves.",
  },
  {
    id: 2,
    icon: <FiCpu />,
    text: "To inspire students to dream big and achieve their goals.",
  },
  {
    id: 3,
    icon: <FiGlobe />,
    text: "To build confident, skilled, and responsible individuals.",
  },
  {
    id: 4,
    icon: <FiUsers />,
    text: "To create lifelong learners ready to shape a better future.",
  },
];

// How we act on it, every day
const MISSION_POINTS = [
  {
    id: 1,
    icon: <FiCheckCircle />,
    text: "To provide quality and student-focused education.",
  },
  {
    id: 2,
    icon: <FiBarChart2 />,
    text: "To deliver the best learning through dedicated and skilled faculty.",
  },
  {
    id: 3,
    icon: <FaBalanceScale />,
    text: "To identify and nurture every student's unique potential.",
  },
  {
    id: 4,
    icon: <FiHeart />,
    text: "To create an inspiring environment for academic and personal growth.",
  },
];

export default function VisionMission() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="visionmission-uka-section" id="vision-mission" ref={sectionRef}>
      <div className="visionmission-uka-container">
        <div className="visionmission-uka-header">
          <span className="visionmission-uka-tag">
            <FiTarget /> VISION &amp; MISSION
          </span>
          <h2>What Drives Us Forward</h2>
          <p>The future we're working toward, and the commitments that get us there</p>
        </div>

        <div className={`visionmission-uka-grid ${visible ? "animate-in" : ""}`}>
          <div className="visionmission-uka-card vision">
            <div className="visionmission-uka-card-icon">
              <FiTarget />
            </div>
            <h3>Our Vision</h3>
            <p className="visionmission-uka-statement">
            To empower every student to become the best version of themselves through quality education, strong values, and continuous learning, while building a future where every learner has the confidence and knowledge to achieve their dreams.  
            </p>
            <ul className="visionmission-uka-list">
              {VISION_POINTS.map((point) => (
                <li key={point.id}>
                  <span className="visionmission-uka-list-icon">{point.icon}</span>
                  {point.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="visionmission-uka-card mission">
            <div className="visionmission-uka-card-icon">
              <FiFlag />
            </div>
            <h3>Our Mission</h3>
            <p className="visionmission-uka-statement">
             Our mission is to provide students with high-quality, student-focused education through dedicated and highly skilled faculty. We strive to create an engaging learning environment where our faculty teach with passion, guide students with care, and inspire them to achieve academic excellence and become successful individuals.
            </p>
            <ul className="visionmission-uka-list">
              {MISSION_POINTS.map((point) => (
                <li key={point.id}>
                  <span className="visionmission-uka-list-icon">{point.icon}</span>
                  {point.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
