// src/pages/Scholarship/ScholarshipPortal.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiPlayCircle, FiCheckCircle, FiAward, FiLogOut } from "react-icons/fi";
import { useStudentAuth } from "../../context/StudentAuthContext";
import { useScholarship } from "../../context/ScholarshipContext";
import "./ScholarshipPortal.css";

function getExamStatus(exam) {
  if (!exam?.examDate || !exam?.examTime) return "upcoming";
  const start = new Date(`${exam.examDate}T${exam.examTime}`);
  const end = new Date(start.getTime() + (exam.durationMinutes || 60) * 60000);
  const now = new Date();
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "live";
  return "ended";
}

function RegistrationCard({ registration }) {
  const navigate = useNavigate();
  const exam = registration.exam || {};
  const status = getExamStatus(exam);
  const hasTemplate = !!exam.template && exam.template.questions?.length > 0;
  const resultPublished = exam.resultsPublished;

  return (
    <div className="uka-schport-card">
      <div className="uka-schport-card-top">
        <h3>{exam.title}</h3>
        <span className={`uka-schport-status uka-schport-status-${status}`}>
          {status === "live" ? "Live Now" : status === "ended" ? "Ended" : "Upcoming"}
        </span>
      </div>
      <p className="uka-schport-meta">
        <FiClock /> {exam.examDate ? `${exam.examDate} at ${exam.examTime}` : "Date to be announced"} ·{" "}
        {exam.durationMinutes || 60} min
      </p>

      {status === "upcoming" && <p className="uka-schport-note">Come back at the scheduled time to attend this exam.</p>}

      {status === "live" && (
        <div className="uka-schport-live-section">
          {registration.submitted ? (
            <p className="uka-schport-submitted">
              <FiCheckCircle /> Answer sheet submitted
            </p>
          ) : hasTemplate ? (
            <button className="uka-schport-btn" onClick={() => navigate(`/scholarship/exam/${exam.id}`)}>
              <FiPlayCircle /> Open Exam
            </button>
          ) : (
            <p className="uka-schport-note">The exam questions haven't been uploaded yet. Please check back shortly.</p>
          )}
        </div>
      )}

      {status === "ended" && (
        <div className="uka-schport-result-section">
          {!registration.submitted && <p className="uka-schport-note">No submission was recorded for this exam.</p>}
          {registration.submitted && !resultPublished && (
            <p className="uka-schport-note">Results haven't been published yet. Check back soon.</p>
          )}
          {registration.submitted && resultPublished && (
            <>
              <p className="uka-schport-score">
                Your Score: {registration.score ?? "—"}
                {registration.maxScore != null ? ` / ${registration.maxScore}` : ""}
              </p>
              {registration.isWinner && (
                <p className="uka-schport-winner">
                  <FiAward /> Congratulations — you're a Scholarship Winner!
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ScholarshipPortal() {
  const { isAuthenticated, isCheckingAuth, student, logout } = useStudentAuth();
  const { getMyRegistrations } = useScholarship();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      navigate("/scholarship/register", { replace: true });
    }
  }, [isCheckingAuth, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/scholarship/register", { replace: true });
  };

  if (isCheckingAuth || !isAuthenticated) return null;

  const registrations = getMyRegistrations(student.id);

  return (
    <div className="uka-schport-page">
      <button className="uka-schport-back" onClick={() => navigate("/")}>
        <FiArrowLeft /> Back to Home
      </button>

      <div className="uka-schport-header">
        <div>
          <h1>My Scholarship Exams</h1>
          <p>Signed in as {student?.email || student?.phone || student?.name}</p>
        </div>
        <button className="uka-schport-btn uka-schport-btn-ghost" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>

      <div className="uka-schport-grid">
        {registrations.map((reg) => (
          <RegistrationCard key={reg.id} registration={reg} />
        ))}
        {registrations.length === 0 && (
          <p className="uka-schport-note">
            You haven't registered for any Scholarship Exam yet.{" "}
            <a href="/scholarship/register">Browse open exams →</a>
          </p>
        )}
      </div>
    </div>
  );
}
