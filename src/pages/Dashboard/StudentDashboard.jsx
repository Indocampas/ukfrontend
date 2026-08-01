// src/pages/Dashboard/StudentDashboard.jsx
// Landing page after a successful enrollment (spec section 10). Since this
// site has no backend/auth for students yet, the tiles here route to the
// closest existing pages, or show a friendly "coming soon" note.
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiVideo,
  FiFileText,
  FiEdit3,
  FiPlayCircle,
  FiHelpCircle,
  FiTrendingUp,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";
import "./StudentDashboard.css";

const TILES = [
  { key: "courses", label: "My Courses", icon: <FiBookOpen />, to: "/" },
  { key: "live", label: "Live Classes", icon: <FiVideo /> },
  { key: "materials", label: "Study Materials", icon: <FiFileText /> },
  { key: "tests", label: "Test Series", icon: <FiEdit3 /> },
  { key: "recorded", label: "Recorded Classes", icon: <FiPlayCircle /> },
  { key: "doubts", label: "Doubt Clearing", icon: <FiHelpCircle /> },
  { key: "performance", label: "Performance Reports", icon: <FiTrendingUp /> },
  { key: "payments", label: "Payments & Invoice", icon: <FiCreditCard /> },
];

export default function StudentDashboard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const studentName = state?.studentName;
  const course = state?.course;
  const transactionId = state?.transactionId;
  const color = course?.color || "#e8b430";

  const handleTileClick = (tile) => {
    if (tile.to) navigate(tile.to);
  };

  return (
    <div className="dash-page">
      <div className="dash-container">
        {course && (
          <div className="dash-confirm-banner" style={{ borderColor: color }}>
            <span className="dash-confirm-icon" style={{ background: color }}>
              <FiCheckCircle />
            </span>
            <div>
              <strong>
                {studentName ? `Welcome, ${studentName}!` : "You're enrolled!"} Your seat in{" "}
                <span style={{ color }}>{course.title}</span> is confirmed.
              </strong>
              {transactionId && <p>Transaction ID: {transactionId}</p>}
            </div>
          </div>
        )}

        <h1 className="dash-title">Student Dashboard</h1>
        <p className="dash-sub">Everything you need for your course, in one place.</p>

        <div className="dash-grid">
          {TILES.map((tile) => (
            <button className="dash-tile" key={tile.key} onClick={() => handleTileClick(tile)}>
              <span className="dash-tile-icon" style={{ color }}>
                {tile.icon}
              </span>
              <span className="dash-tile-label">{tile.label}</span>
              {!tile.to && <span className="dash-tile-note">Coming soon</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
