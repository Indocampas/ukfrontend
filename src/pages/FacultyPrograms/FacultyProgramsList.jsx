// src/pages/FacultyPrograms/FacultyProgramsList.jsx
// Full listing of all 14 Faculty Courses (the 13 existing, backend-managed
// Faculty Courses + the new AI-Ready Teacher Course). Reached by clicking
// the "Faculty Programs" card on the homepage Courses carousel, or the
// "Explore All Programs" button in the Faculty Programs hero section.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft, FiArrowRight, FiClock, FiUsers,
  FiBookOpen, FiAward, FiDollarSign, FiEdit, FiHash, FiActivity,
  FiHexagon, FiBox, FiZap, FiCommand, FiGrid, FiHeart,
} from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useFacultyPrograms } from "../../context/FacultyProgramContext";
import "./FacultyProgramsList.css";

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

export default function FacultyProgramsList() {
  const navigate = useNavigate();
  const { programs, loading } = useFacultyPrograms();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const publishedPrograms = programs.filter((p) => p.isPublished !== false);

  const slugFor = (program) =>
    program.slug || program.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const handleLearnMore = (program) => {
    navigate(`/faculty-programs/${slugFor(program)}`);
  };

  const handleEnrollNow = (program, e) => {
    e.stopPropagation();
    // Same Enroll Now -> Payment journey used by every other course page
    // on the site (src/pages/Enrollment/EnrollmentFlow.jsx via /enroll).
    navigate("/enroll", {
      state: {
        course: {
          title: program.title,
          mode: "Faculty Program",
          duration: program.duration,
          fee: program.fee,
          color: program.color || "#e8b430",
        },
      },
    });
  };

  return (
    <div className="faculty-list-page">
      <div className="faculty-list-container">
        <button className="faculty-list-back" onClick={() => navigate("/")}>
          <FiArrowLeft /> Back to Home
        </button>

        <div className="faculty-list-header">
          <span className="faculty-list-tag">
            <FaChalkboardTeacher /> FACULTY PROGRAMS
          </span>
          <h1>Faculty Courses</h1>
          <p>
            Certification and training programs for teachers and aspiring educators - our 13 established Faculty
            Courses, plus the new AI-Ready Teacher Course.
          </p>
        </div>

        {loading && publishedPrograms.length === 0 ? (
          <div className="faculty-list-loading">Loading faculty programs…</div>
        ) : (
          <div className="faculty-list-grid">
            {publishedPrograms.map((program) => {
              const color = program.color || "#e8b430";
              return (
                <div
                  className="faculty-list-card"
                  key={program.id || slugFor(program)}
                  style={{ borderTop: `4px solid ${color}` }}
                  onClick={() => handleLearnMore(program)}
                >
                  <div className="faculty-list-card-icon" style={{ background: color }}>
                    {ICON_MAP[program.icon] || <FaChalkboardTeacher />}
                  </div>
                  <h3>{program.title}</h3>
                  <p className="faculty-list-card-desc">{program.description}</p>
                  <div className="faculty-list-card-meta">
                    <span>
                      <FiClock /> {program.duration || "3 Months"}
                    </span>
                    <span>
                      <FiUsers /> {program.target || "Teachers & Educators"}
                    </span>
                  </div>
                  <div className="faculty-list-card-actions">
                    <button
                      type="button"
                      className="faculty-list-learn-more"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLearnMore(program);
                      }}
                    >
                      Learn More <FiArrowRight />
                    </button>
                    <button
                      type="button"
                      className="faculty-list-enroll"
                      style={{ background: color }}
                      onClick={(e) => handleEnrollNow(program, e)}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
