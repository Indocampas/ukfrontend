// src/pages/Admin/ExamTemplateEditor.jsx
//
// Lets the admin review and fix up the questions that were auto-parsed from
// an uploaded exam-template PDF, add/remove questions or options by hand,
// and optionally mark the correct option for a multiple-choice question so
// it can be auto-graded when a student submits.
import { useState } from "react";
import { FiX, FiPlus, FiTrash2, FiCheckCircle } from "react-icons/fi";
import { createBlankQuestion, createBlankOption } from "../../utils/examQuestionParser";

export default function ExamTemplateEditor({ exam, onSave, onClose }) {
  const [questions, setQuestions] = useState(exam.template?.questions || []);

  const updateQuestion = (qId, updates) => {
    setQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, ...updates } : q)));
  };

  const removeQuestion = (qId) => {
    setQuestions((prev) => prev.filter((q) => q.id !== qId).map((q, idx) => ({ ...q, number: idx + 1 })));
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createBlankQuestion(prev.length + 1)]);
  };

  const addOption = (qId) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, type: "mcq", options: [...q.options, createBlankOption(q.options)] } : q))
    );
  };

  const updateOption = (qId, key, text) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, options: q.options.map((o) => (o.key === key ? { ...o, text } : o)) } : q
      )
    );
  };

  const removeOption = (qId, key) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const options = q.options.filter((o) => o.key !== key);
        return {
          ...q,
          options,
          correctOptionKey: q.correctOptionKey === key ? null : q.correctOptionKey,
          type: options.length > 0 ? "mcq" : "text",
        };
      })
    );
  };

  const setCorrectOption = (qId, key) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, correctOptionKey: q.correctOptionKey === key ? null : key } : q))
    );
  };

  const gradedCount = questions.filter((q) => q.type === "mcq" && q.correctOptionKey).length;

  return (
    <div className="uka-modal-overlay" onClick={onClose}>
      <div className="uka-modal uka-template-modal" onClick={(e) => e.stopPropagation()}>
        <div className="uka-modal-header">
          <div>
            <h2>Exam Template — {exam.title}</h2>
            <p className="uka-modal-subtitle">
              {questions.length} question{questions.length === 1 ? "" : "s"} · {gradedCount} marked for auto-grading
              {exam.template?.fileName ? ` · from ${exam.template.fileName}` : ""}
            </p>
          </div>
          <button className="uka-modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="uka-modal-body">
          {questions.length === 0 && (
            <p className="uka-admin-empty">No questions yet. Upload a template PDF, or add questions manually below.</p>
          )}

          {questions.map((q) => (
            <div className="uka-tpl-question" key={q.id}>
              <div className="uka-tpl-question-head">
                <span className="uka-tpl-question-number">Q{q.number}</span>
                <select
                  value={q.type}
                  onChange={(e) =>
                    updateQuestion(q.id, {
                      type: e.target.value,
                      options: e.target.value === "text" ? [] : q.options,
                    })
                  }
                >
                  <option value="text">Short Answer</option>
                  <option value="mcq">Multiple Choice</option>
                </select>
                <button className="uka-tpl-icon-btn uka-tpl-danger" onClick={() => removeQuestion(q.id)} title="Delete question">
                  <FiTrash2 />
                </button>
              </div>

              <textarea
                className="uka-tpl-question-text"
                rows={2}
                placeholder="Question text"
                value={q.text}
                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
              />

              {q.type === "mcq" && (
                <div className="uka-tpl-options">
                  {q.options.map((o) => (
                    <div className="uka-tpl-option-row" key={o.key}>
                      <button
                        type="button"
                        className={"uka-tpl-correct-toggle" + (q.correctOptionKey === o.key ? " uka-tpl-correct-active" : "")}
                        onClick={() => setCorrectOption(q.id, o.key)}
                        title="Mark as correct answer"
                      >
                        <FiCheckCircle />
                      </button>
                      <span className="uka-tpl-option-key">{o.key}</span>
                      <input
                        type="text"
                        value={o.text}
                        placeholder="Option text"
                        onChange={(e) => updateOption(q.id, o.key, e.target.value)}
                      />
                      <button className="uka-tpl-icon-btn uka-tpl-danger" onClick={() => removeOption(q.id, o.key)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                  <button className="uka-tpl-add-option" onClick={() => addOption(q.id)}>
                    <FiPlus /> Add Option
                  </button>
                </div>
              )}
            </div>
          ))}

          <button className="uka-admin-btn uka-admin-btn-small" onClick={addQuestion}>
            <FiPlus /> Add Question
          </button>
        </div>

        <div className="uka-modal-footer">
          <button className="uka-admin-btn uka-admin-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="uka-admin-btn uka-admin-btn-gold"
            onClick={() => onSave(questions)}
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
