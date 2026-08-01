// F:\uk-academy-app\src\pages\Admin\AdminNav.jsx
import { NavLink } from "react-router-dom";
import { FiImage, FiBookOpen, FiAward, FiBook, FiUsers, FiFile, FiFileText, FiCalendar, FiKey } from "react-icons/fi";
import "./AdminNav.css";

const SECTIONS = [
  { to: "/admin/courses", label: "Courses", icon: <FiBookOpen /> },
  { to: "/admin/books", label: "Books", icon: <FiBook /> },
  { to: "/admin/faculty-programs", label: "Faculty Programs", icon: <FiUsers /> },
  { to: "/admin/gallery", label: "Gallery", icon: <FiImage /> },
  { to: "/admin/faculty", label: "Faculty", icon: <FiUsers /> },
  { to: "/admin/pyq", label: "PYQs", icon: <FiFile /> },
  { to: "/admin/syllabus", label: "Syllabus", icon: <FiFileText /> },
  { to: "/admin/exam-date", label: "Exam Date", icon: <FiCalendar /> },
  { to: "/admin/answer-key", label: "Answer Key", icon: <FiKey /> },
];

export default function AdminNav() {
  return (
    <nav className="uka-admin-nav">
      {SECTIONS.map((s) => (
        <NavLink
          key={s.to}
          to={s.to}
          className={({ isActive }) =>
            "uka-admin-nav-link" + (isActive ? " uka-admin-nav-link-active" : "")
          }
        >
          {s.icon}
          {s.label}
        </NavLink>
      ))}
    </nav>
  );
}