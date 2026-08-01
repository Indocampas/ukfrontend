// src/pages/Scholarship/ScholarshipExam.jsx
//
// The actual online examination interface a registered student uses once
// their exam is live: exam instructions, one question at a time with
// multiple-choice options (or a short-answer box), a question navigator,
// a countdown timer, and Submit Exam. Runs entirely against the local
// ScholarshipContext — no backend calls.
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiClock, FiArrowLeft, FiArrowRight, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { useStudentAuth } from "../../context/StudentAuthContext";
import { useScholarship } from "../../context/ScholarshipContext";
import "./ScholarshipExam.css";

function getExamWindow(exam) {
  if (!exam?.examDate || !exam?.examTime) return null;
  const start = new Date(`${exam.examDate}T${exam.examTime}`);
  const end = new Date(start.getTime() + (exam.durationMinutes || 60) * 60000);
  return { start, end };
}

function getExamStatus(exam) {
  const win = getExamWindow(exam);
  if (!win) return "upcoming";
  const now = new Date();
  if (now < win.start) return "upcoming";
  if (now >= win.start && now <= win.end) return "live";
  return "ended";
}

function formatClock(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function ScholarshipExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCheckingAuth, student } = useStudentAuth();
  const { exams, getRegistration, saveExamProgress, submitExamAnswers } = useScholarship();

  const exam = exams.find((e) => e.id === examId) || null;
  const registration = student ? getRegistration(examId, student.id) : null;

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Seeded once from the (synchronous, local) registration record so a
  // refresh mid-exam picks up where the student left off.
  const [answers, setAnswers] = useState(() => registration?.answers || {});
  const [remainingMs, setRemainingMs] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(() => !!registration?.submitted);
  const autosaveTimer = useRef(null);

  const questions = useMemo(() => exam?.template?.questions || [], [exam]);
  const status = exam ? getExamStatus(exam) : null;

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      navigate("/scholarship/register", { replace: true });
    }
  }, [isCheckingAuth, isAuthenticated, navigate]);

  // Countdown ticks against the exam's scheduled end time.
  useEffect(() => {
    if (!exam || !started || submitted) return undefined;
    const win = getExamWindow(exam);
    if (!win) return undefined;
    const tick = () => setRemainingMs(win.end.getTime() - Date.now());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [exam, started, submitted]);

  const doSubmit = async (finalAnswers) => {
    if (!exam || !student || submitting || submitted) return;
    setSubmitting(true);
    try {
      await submitExamAnswers(exam.id, student.id, finalAnswers);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-submit the moment the countdown hits zero. This is a genuine
  // "synchronize with an external system" effect (the countdown interval
  // above), so triggering the submission here — rather than from a user
  // event — is the correct pattern.
  useEffect(() => {
    if (started && !submitted && remainingMs !== null && remainingMs <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      doSubmit(answers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs, started, submitted]);

  const persistAnswers = (next) => {
    setAnswers(next);
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      if (exam && student) saveExamProgress(exam.id, student.id, next);
    }, 400);
  };

  const currentQuestion = questions[currentIndex];

  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== "").length,
    [questions, answers]
  );

  const handleAnswerChange = (value) => {
    if (!currentQuestion) return;
    persistAnswers({ ...answers, [currentQuestion.id]: value });
  };

  if (isCheckingAuth || !isAuthenticated) return null;

  if (!exam) {
    return (
      <div className="uka-schexam-page">
        <p className="uka-schexam-error">
          <FiAlertTriangle /> This exam could not be found.
        </p>
        <button className="uka-schexam-btn uka-schexam-btn-ghost" onClick={() => navigate("/scholarship/portal")}>
          <FiArrowLeft /> Back to My Exams
        </button>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="uka-schexam-page">
        <p className="uka-schexam-error">
          <FiAlertTriangle /> You aren't registered for this exam yet.
        </p>
        <button className="uka-schexam-btn uka-schexam-btn-ghost" onClick={() => navigate("/scholarship/register")}>
          <FiArrowLeft /> Register for Scholarship Exams
        </button>
      </div>
    );
  }

  if (status === "upcoming") {
    return (
      <div className="uka-schexam-page">
        <p className="uka-schexam-note">
          This exam hasn't started yet. Come back at {exam.examDate} {exam.examTime}.
        </p>
        <button className="uka-schexam-btn uka-schexam-btn-ghost" onClick={() => navigate("/scholarship/portal")}>
          <FiArrowLeft /> Back to My Exams
        </button>
      </div>
    );
  }

  if (status === "ended" && !submitted) {
    return (
      <div className="uka-schexam-page">
        <p className="uka-schexam-error">
          <FiAlertTriangle /> The exam window has closed{registration.submitted ? "." : " and no submission was recorded."}
        </p>
        <button className="uka-schexam-btn uka-schexam-btn-ghost" onClick={() => navigate("/scholarship/portal")}>
          <FiArrowLeft /> Back to My Exams
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="uka-schexam-page">
        <div className="uka-schexam-submitted-card">
          <FiCheckCircle className="uka-schexam-submitted-icon" />
          <h2>Answers Submitted</h2>
          <p>Your exam has been submitted. Results will appear in your portal once they're published.</p>
          <button className="uka-schexam-btn" onClick={() => navigate("/scholarship/portal")}>
            Back to My Exams
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="uka-schexam-page">
        <p className="uka-schexam-note">The exam questions haven't been uploaded yet. Please check back later.</p>
        <button className="uka-schexam-btn uka-schexam-btn-ghost" onClick={() => navigate("/scholarship/portal")}>
          <FiArrowLeft /> Back to My Exams
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="uka-schexam-page">
        <div className="uka-schexam-instructions-card">
          <h1>{exam.title}</h1>
          <p className="uka-schexam-instructions-meta">
            <FiClock /> {exam.durationMinutes} minutes · {questions.length} question{questions.length === 1 ? "" : "s"}
          </p>
          <h3>Instructions</h3>
          <ul>
            <li>The timer starts as soon as you click "Start Exam" and cannot be paused.</li>
            <li>Use Next / Previous or the question navigator to move between questions.</li>
            <li>Your answers are saved automatically as you go.</li>
            <li>The exam auto-submits when the timer runs out, or you can submit earlier.</li>
            {exam.description && <li>{exam.description}</li>}
          </ul>
          <button className="uka-schexam-btn" onClick={() => setStarted(true)}>
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="uka-schexam-page uka-schexam-active">
      <div className="uka-schexam-topbar">
        <h1>{exam.title}</h1>
        <div className="uka-schexam-timer">
          <FiClock /> {remainingMs !== null ? formatClock(remainingMs) : "--:--:--"}
        </div>
      </div>

      <div className="uka-schexam-layout">
        <div className="uka-schexam-main">
          <div className="uka-schexam-question-card">
            <div className="uka-schexam-question-head">
              <span>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="uka-schexam-answered-count">{answeredCount} answered</span>
            </div>
            <p className="uka-schexam-question-text">{currentQuestion.text}</p>

            {currentQuestion.type === "mcq" ? (
              <div className="uka-schexam-options">
                {currentQuestion.options.map((opt) => (
                  <label
                    key={opt.key}
                    className={
                      "uka-schexam-option" + (answers[currentQuestion.id] === opt.key ? " uka-schexam-option-selected" : "")
                    }
                  >
                    <input
                      type="radio"
                      name={`q-${currentQuestion.id}`}
                      checked={answers[currentQuestion.id] === opt.key}
                      onChange={() => handleAnswerChange(opt.key)}
                    />
                    <span className="uka-schexam-option-key">{opt.key}</span>
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="uka-schexam-text-answer"
                rows={5}
                placeholder="Type your answer here..."
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
              />
            )}

            <div className="uka-schexam-nav-buttons">
              <button
                className="uka-schexam-btn uka-schexam-btn-ghost"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              >
                <FiArrowLeft /> Previous
              </button>
              {currentIndex < questions.length - 1 ? (
                <button
                  className="uka-schexam-btn"
                  onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                >
                  Next <FiArrowRight />
                </button>
              ) : (
                <button
                  className="uka-schexam-btn uka-schexam-btn-submit"
                  disabled={submitting}
                  onClick={() => {
                    if (window.confirm("Submit your exam? You won't be able to change your answers after this.")) {
                      doSubmit(answers);
                    }
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Exam"}
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="uka-schexam-sidebar">
          <h4>Question Navigator</h4>
          <div className="uka-schexam-nav-grid">
            {questions.map((q, idx) => {
              const answered = answers[q.id] !== undefined && answers[q.id] !== "";
              return (
                <button
                  key={q.id}
                  className={
                    "uka-schexam-nav-cell" +
                    (idx === currentIndex ? " uka-schexam-nav-current" : "") +
                    (answered ? " uka-schexam-nav-answered" : "")
                  }
                  onClick={() => setCurrentIndex(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <button
            className="uka-schexam-btn uka-schexam-btn-submit uka-schexam-sidebar-submit"
            disabled={submitting}
            onClick={() => {
              if (window.confirm("Submit your exam? You won't be able to change your answers after this.")) {
                doSubmit(answers);
              }
            }}
          >
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
        </aside>
      </div>
    </div>
  );
}
