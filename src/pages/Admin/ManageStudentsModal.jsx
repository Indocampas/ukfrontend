// src/pages/Admin/ManageStudentsModal.jsx
import { FiX } from "react-icons/fi";
import { useScholarship } from "../../context/ScholarshipContext";

export default function ManageStudentsModal({ exam, onClose }) {
  const { getRegisteredStudents, setStudentScore, setWinner } = useScholarship();
  const students = getRegisteredStudents(exam.id);

  return (
    <div className="uka-modal-overlay" onClick={onClose}>
      <div className="uka-modal" onClick={(e) => e.stopPropagation()}>
        <div className="uka-modal-header">
          <div>
            <h2>Registered Students — {exam.title}</h2>
            <p className="uka-modal-subtitle">{students.length} registered</p>
          </div>
          <button className="uka-modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="uka-modal-body">
          {students.length === 0 && <p className="uka-admin-empty">No students registered yet.</p>}
          {students.length > 0 && (
            <table className="uka-scholarship-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Auto Score</th>
                  <th>Final Score</th>
                  <th>Winner</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.studentName}</td>
                    <td>{s.studentEmail || s.studentPhone}</td>
                    <td>{s.submitted ? "Submitted" : "Registered"}</td>
                    <td>{s.maxScore != null ? `${s.autoScore} / ${s.maxScore}` : "—"}</td>
                    <td>
                      <input
                        type="number"
                        className="uka-scholarship-score-input"
                        value={s.score ?? ""}
                        onChange={(e) => setStudentScore(exam.id, s.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!s.isWinner}
                        onChange={(e) => setWinner(exam.id, s.id, e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="uka-modal-footer">
          <button className="uka-admin-btn uka-admin-btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
