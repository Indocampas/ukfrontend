// src/pages/WhyUKAcademy/WhyUKAcademy.jsx
import { useEffect, useRef, useState } from "react";
import { FiUsers, FiCpu, FiEdit3, FiUserCheck, FiTrendingUp, FiHome } from "react-icons/fi";
import "./WhyUKAcademy.css";

const WHY_DATA = [
  {
    id: 1,
    icon: <FiUsers />,
    title: "Expert Faculty",
    description: "IITians & Doctors with years of teaching excellence",
  },
  {
    id: 2,
    icon: <FiCpu />,
    title: "AI Powered Learning",
    description: "Smart analytics & AI driven performance improvement",
  },
  {
    id: 3,
    icon: <FiEdit3 />,
    title: "Daily Tests & Practice",
    description: "Regular tests with detailed analysis & doubt clearing",
  },
  {
    id: 4,
    icon: <FiUserCheck />,
    title: "Personal Mentorship",
    description: "One to one mentorship for every student",
  },
  {
    id: 5,
    icon: <FiTrendingUp />,
    title: "Parent Dashboard",
    description: "Real-time performance tracking for parents",
  },
  {
    id: 6,
    icon: <FiHome />,
    title: "Hostel & Transport",
    description: "Safe & comfortable hostel with transportation facility",
  },
];

export default function WhyUKAcademy() {
  const [visibleCards, setVisibleCards] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const cardRefs = useRef([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            headingObserver.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    if (sectionRef.current) headingObserver.observe(sectionRef.current);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleCards((prev) => 
              prev.includes(index) ? prev : [...prev, index]
            );
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    cardRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => {
      observer.disconnect();
      headingObserver.disconnect();
    };
  }, []);

  return (
    <section className="why-uka-section" id="why" ref={sectionRef}>
      <div className="why-uka-container">
        <div className={`why-uka-heading ${isVisible ? "animate-in" : ""}`}>
          <span className="why-uka-badge">Why Choose Us</span>
          <h2>Why UK Academy</h2>
          <p className="why-uka-subtitle">Empowering students with excellence in education</p>
        </div>

        <div className="why-uka-grid">
          {WHY_DATA.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (cardRefs.current[index] = el)}
              data-index={index}
              className={`why-uka-card ${
                visibleCards.includes(index) ? "animate-in" : ""
              }`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="why-uka-card-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="why-uka-icon-wrapper">
                <div className="why-uka-icon">{item.icon}</div>
              </div>
              <h3 className="why-uka-title">{item.title}</h3>
              <p className="why-uka-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}