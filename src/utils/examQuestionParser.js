// src/utils/examQuestionParser.js
//
// Turns the raw text pulled out of an uploaded exam-template PDF into a
// structured, editable list of online-exam questions. This is a heuristic
// parser (question papers aren't standardized), so the Admin Dashboard always
// lets the admin review/edit the result afterwards in the template editor.

const QUESTION_START_RE = /^\s*(?:Q(?:uestion)?\.?\s*)?(\d{1,3})\s*[.):]\s+(.*)$/i;
const OPTION_START_RE = /^\s*[([]?([A-Da-d])[.)\]:]\s+(.*)$/;

function makeId(prefix, n) {
  return `${prefix}-${n}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * @param {string} rawText - full extracted text from the PDF
 * @returns {Array} list of { id, number, text, type: 'mcq'|'text', options: [{key,text}], correctOptionKey }
 */
export function parseQuestionsFromText(rawText) {
  const lines = (rawText || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const questions = [];
  let current = null;
  let currentOption = null;

  const pushCurrent = () => {
    if (current) {
      current.text = current.text.trim();
      current.options = current.options.map((o) => ({ ...o, text: o.text.trim() }));
      questions.push(current);
    }
  };

  lines.forEach((line) => {
    const qMatch = line.match(QUESTION_START_RE);
    const oMatch = line.match(OPTION_START_RE);

    if (qMatch) {
      pushCurrent();
      current = {
        id: makeId("q", questions.length + 1),
        number: Number(qMatch[1]),
        text: qMatch[2] || "",
        type: "text",
        options: [],
        correctOptionKey: null,
      };
      currentOption = null;
      return;
    }

    if (oMatch && current) {
      currentOption = {
        key: oMatch[1].toUpperCase(),
        text: oMatch[2] || "",
      };
      current.options.push(currentOption);
      current.type = "mcq";
      return;
    }

    // Continuation line: belongs to the last option if we're inside one,
    // otherwise to the question stem.
    if (current) {
      if (currentOption) {
        currentOption.text += ` ${line}`;
      } else {
        current.text += ` ${line}`;
      }
    }
  });

  pushCurrent();

  // Fallback: nothing matched the numbered-question pattern at all (unusual
  // template layout). Treat each non-empty paragraph as its own question so
  // the admin still has something to edit rather than a blank exam.
  if (questions.length === 0 && lines.length > 0) {
    const paragraphs = (rawText || "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    paragraphs.forEach((p, idx) => {
      questions.push({
        id: makeId("q", idx + 1),
        number: idx + 1,
        text: p,
        type: "text",
        options: [],
        correctOptionKey: null,
      });
    });
  }

  // Renumber sequentially for display, keep stable ids.
  return questions.map((q, idx) => ({ ...q, number: idx + 1 }));
}

export function createBlankQuestion(number) {
  return {
    id: makeId("q", number),
    number,
    text: "",
    type: "text",
    options: [],
    correctOptionKey: null,
  };
}

export function createBlankOption(existingOptions) {
  const usedKeys = existingOptions.map((o) => o.key);
  const nextKey = ["A", "B", "C", "D", "E", "F"].find((k) => !usedKeys.includes(k)) || "X";
  return { key: nextKey, text: "" };
}
