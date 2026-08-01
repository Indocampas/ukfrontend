// src/pages/Scholarship/Scholarship.jsx
import { useState, useEffect, useRef } from "react";
import { FiAward, FiCheckCircle, FiClock } from "react-icons/fi";
import { useScholarship } from "../../context/ScholarshipContext";
import { useFormModal } from "../../context/FormModalContext"; // <-- import modal context
import "./Scholarship.css";

const SCHOLARSHIP_TIERS = [
  { id: 1, marks: "95% & above", scholarship: "100%", color: "#e8b430" },
  { id: 2, marks: "90% - 94.9%", scholarship: "75%", color: "#4CAF50" },
  { id: 3, marks: "80% - 89.9%", scholarship: "50%", color: "#2196F3" },
  { id: 4, marks: "70% - 79.9%", scholarship: "25%", color: "#9C27B0" },
];

export default function Scholarship() {
  const { getOpenExamsForRegistration } = useScholarship();
  const { openForm } = useFormModal(); // <-- get openForm function
  const [isVisible, setIsVisible] = useState(false);
  const [hasOpenExams, setHasOpenExams] = useState(false);
  const [openExamsCount, setOpenExamsCount] = useState(0);
  const sectionRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOpenExams = async () => {
      try {
        const openExams = await getOpenExamsForRegistration();
        setHasOpenExams(openExams.length > 0);
        setOpenExamsCount(openExams.length);
      } catch (error) {
        console.error("Error fetching open exams:", error);
        setHasOpenExams(false);
        setOpenExamsCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpenExams();
  }, [getOpenExamsForRegistration]);

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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Open the scholarship registration modal
  const handleRegister = () => {
    openForm("Scholarship Test");
  };

  if (isLoading) {
    return (
      <section className="scholarship-uka-section" id="scholarship" ref={sectionRef}>
        <div className="scholarship-uka-container">
          <div className="scholarship-loading">Loading scholarship information...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="scholarship-uka-section" id="scholarship" ref={sectionRef}>
      <div className="scholarship-uka-container">
        <div className={`scholarship-uka-left ${isVisible ? "animate-in" : ""}`}>
          <span className="scholarship-uka-tag">
            <FiAward /> SCHOLARSHIP TEST
          </span>
          <h2>Merit Deserves A Reward</h2>
          <p>
            Every year, UK Academy conducts a scholarship test open to Class 6th–12th
            students. Top performers earn up to 100% tuition fee waiver along with
            free study material and mentorship.
          </p>
          <ul className="scholarship-uka-points">
            <li>
              <FiCheckCircle /> Free of cost, open to all students
            </li>
            <li>
              <FiCheckCircle /> Scholarship valid for the entire course duration
            </li>
            <li>
              <FiCheckCircle /> Instant results with detailed performance report
            </li>
          </ul>
          
          {hasOpenExams ? (
            <div className="scholarship-uka-registration-status open">
              <FiClock className="scholarship-uka-status-icon" />
              <span>Registration is now open! {openExamsCount} exam{openExamsCount > 1 ? 's' : ''} available.</span>
            </div>
          ) : (
            <div className="scholarship-uka-registration-status closed">
              <FiClock className="scholarship-uka-status-icon" />
              <span>Registration is currently closed. Check back soon for upcoming exams.</span>
            </div>
          )}
          
          <button 
            className="scholarship-uka-btn" 
            onClick={handleRegister}
            disabled={!hasOpenExams}
          >
            {hasOpenExams ? "Register For Scholarship Test" : "Registration Closed"}
          </button>
        </div>

        <div className={`scholarship-uka-right ${isVisible ? "animate-in" : ""}`}>
          {SCHOLARSHIP_TIERS.map((tier, index) => (
            <div
              className="scholarship-uka-tier"
              key={tier.id}
              style={{ borderLeftColor: tier.color, animationDelay: `${0.15 + index * 0.1}s` }}
            >
              <span className="scholarship-uka-percent" style={{ color: tier.color }}>
                {tier.scholarship}
              </span>
              <div>
                <p className="scholarship-uka-label">Scholarship</p>
                <p className="scholarship-uka-marks">Score {tier.marks}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}