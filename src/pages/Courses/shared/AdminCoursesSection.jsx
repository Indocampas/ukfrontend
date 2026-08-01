// src/pages/Courses/shared/AdminCoursesSection.jsx
// Renders the *real* courses that an admin has added through the Course
// Management dashboard (backed by MongoDB via /api/courses). This is the
// bridge between the admin-editable catalog (CourseContext) and the public
// marketing pages, which otherwise only show generated/static content.
//
// Usage: <AdminCoursesSection categorySlug="jee" courseType="classroom" color="#e8b430" />
// Renders nothing (returns null) if there are no matching published courses,
// so it's always safe to drop in without affecting pages that don't have
// any admin-added courses yet.
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiClock, FiPlayCircle, FiFileText } from "react-icons/fi";
import { useCourses } from "../../../context/CourseContext";
import "./AdminCoursesSection.css";

const inr = (n) => (n || n === 0 ? `₹${Number(n).toLocaleString("en-IN")}` : "Contact for pricing");

export default function AdminCoursesSection({ categorySlug, courseType, color = "#e8b430", title = "Available Courses" }) {
  const { courses, isLoading } = useCourses();
  const navigate = useNavigate();

  const matches = (courses || []).filter(
    (c) =>
      c.categorySlug === categorySlug &&
      (!courseType || c.courseType === courseType) &&
      c.status !== "Inactive"
  );

  if (isLoading || matches.length === 0) return null;

  const handleEnroll = (course) => {
    navigate("/enroll", {
      state: {
        course: {
          title: course.name,
          mode: course.courseType,
          duration: course.duration,
          fee: course.price,
          color,
        },
      },
    });
  };

  return (
    <section className="admin-courses-section" id="available-courses">
      <h2 className="course-detail2-section-title">{title}</h2>
      <div className="admin-courses-grid">
        {matches.map((course) => (
          <div className="admin-course-card" key={course.id} style={{ borderTopColor: color }}>
            {course.image ? (
              <div className="admin-course-media" style={{ backgroundImage: `url(${course.image})` }} />
            ) : (
              <div className="admin-course-media admin-course-media-placeholder" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                <FiPlayCircle />
              </div>
            )}
            <div className="admin-course-body">
              <h3 className="admin-course-title">{course.name}</h3>
              {course.classGrade && <p className="admin-course-grade">{course.classGrade}</p>}
              {course.description && <p className="admin-course-desc">{course.description}</p>}

              {Array.isArray(course.features) && course.features.length > 0 && (
                <ul className="admin-course-features">
                  {course.features.slice(0, 4).map((f) => (
                    <li key={f}>
                      <FiCheckCircle style={{ color }} /> {f}
                    </li>
                  ))}
                </ul>
              )}

              <div className="admin-course-footer">
                <span className="admin-course-price" style={{ color }}>{inr(course.price)}</span>
                {course.duration && (
                  <span className="admin-course-duration">
                    <FiClock /> {course.duration}
                  </span>
                )}
              </div>

              <div className="admin-course-actions">
                {course.pdf && (
                  <a className="admin-course-link" href={course.pdf} target="_blank" rel="noreferrer">
                    <FiFileText /> View PDF
                  </a>
                )}
                {course.video && (
                  <a className="admin-course-link" href={course.video} target="_blank" rel="noreferrer">
                    <FiPlayCircle /> Watch Video
                  </a>
                )}
                <button className="admin-course-enroll" style={{ background: color }} onClick={() => handleEnroll(course)}>
                  Enroll Now <FiArrowRight />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
