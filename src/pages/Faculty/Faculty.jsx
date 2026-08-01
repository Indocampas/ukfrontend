// src/pages/Faculty/Faculty.jsx
import { useEffect, useRef, useState } from "react";
import { FaGraduationCap, FaChalkboardTeacher, FaUserGraduate, FaAward } from "react-icons/fa";
import { FiUsers, FiStar, FiBriefcase } from "react-icons/fi";
import { useFaculty } from "../../context/FacultyContext";
import "./Faculty.css";

// Fallback local images, used for any faculty member the admin hasn't
// uploaded a photo for yet (cycled by position in the list).
import faculty1 from "../../assets/faculty/faculty1.jpeg";
import faculty2 from "../../assets/faculty/faculty2.png";
import faculty3 from "../../assets/faculty/faculty3.png";
import faculty4 from "../../assets/faculty/faculty4.png";
import faculty5 from "../../assets/faculty/faculty5.png";
import faculty6 from "../../assets/faculty/faculty6.jpg";

const FACULTY_IMAGES = [
  faculty1,
  faculty2,
  faculty3,
  faculty4,
  faculty5,
  faculty6,
];

export default function Faculty() {
  // Faculty content (name, subject, qualification, bio, photo...) is
  // managed from the Admin Dashboard (/admin/faculty) via FacultyContext.
  // This section always reflects whatever the admin currently has saved,
  // in the order they set.
  const { faculty } = useFaculty();
  const FACULTY_DATA = [...faculty].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
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
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    cardRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [FACULTY_DATA.length]);

  if (FACULTY_DATA.length === 0) return null;

  return (
    <section className="faculty-uka-section" id="faculty">
      <div className="faculty-uka-container">
        <div className="faculty-uka-header">
          <span className="faculty-uka-tag">
            <FaChalkboardTeacher /> OUR FACULTY
          </span>
          <h2>Learn From The Best Minds</h2>
          <p>IITians &amp; Doctors dedicated to shaping your future</p>
        </div>

        <div className="faculty-uka-grid">
          {FACULTY_DATA.map((member, index) => (
            <div
              ref={(el) => (cardRefs.current[index] = el)}
              data-index={index}
              className={`faculty-uka-card ${
                visibleCards.includes(index) ? "animate-in" : ""
              }`}
              key={member.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="faculty-uka-image-wrapper">
                <img
                  className="faculty-uka-photo"
                  src={member.image || FACULTY_IMAGES[index % FACULTY_IMAGES.length]}
                  alt={member.name}
                  loading="lazy"
                />
              </div>
              
              <h3>{member.name}</h3>
              
              {member.subject && (
                <span className="faculty-uka-subject">
                  <FaGraduationCap /> {member.subject}
                </span>
              )}
              
              <div className="faculty-uka-details">
                {member.qualification && (
                  <p className="faculty-uka-qualification">
                    <FiBriefcase className="detail-icon" /> {member.qualification}
                  </p>
                )}
                {member.experience && (
                  <p className="faculty-uka-experience">
                    <FiStar className="detail-icon" /> {member.experience}
                  </p>
                )}
                {member.designation && (
                  <p className="faculty-uka-expertise">
                    <FaUserGraduate className="detail-icon" /> {member.designation}
                  </p>
                )}
                {member.bio && (
                  <div className="faculty-uka-award">
                    <FaAward className="award-icon" />
                    <span>{member.bio}</span>
                  </div>
                )}
              </div>

              <div className="faculty-uka-social">
                <span className="social-dot"></span>
                <span className="social-dot"></span>
                <span className="social-dot"></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}