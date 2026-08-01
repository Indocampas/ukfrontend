// src/data/examInfo.js
// Structured reference data that powers the interactive exam-info tools
// (Syllabus, Exam Date, Eligibility, Exam Pattern, PYQs, Answer Key, Rank
// Predictor). Keyed by an "exam key" derived from the leaf's trail so NEET,
// JEE Main, JEE Advanced, Olympiad and NTSE each get their own content.

const CURRENT_YEAR = new Date().getFullYear();

export const lastNYears = (n, endYear = CURRENT_YEAR) =>
  Array.from({ length: n }, (_, i) => endYear - i);

// ---------------------------------------------------------------------------
// Resolve which "exam key" a leaf trail belongs to
// ---------------------------------------------------------------------------
export function examKeyFor(trail) {
  const path = trail.map((n) => n.slug).join("/");
  if (path.startsWith("jee/jee-main")) return "jee-main";
  if (path.startsWith("jee/jee-advanced")) return "jee-advanced";
  if (path.startsWith("neet")) return "neet";
  if (path.startsWith("foundation/olympiad")) return "olympiad";
  if (path.startsWith("foundation/ntse")) return "ntse";
  return "neet";
}

// ---------------------------------------------------------------------------
// Syllabus (Exam -> Subject -> Unit -> Topics)
// ---------------------------------------------------------------------------
export const SYLLABUS = {
  neet: {
    examLabel: "NEET",
    subjects: [
      {
        subject: "Physics",
        units: [
          { unit: "Mechanics", topics: ["Kinematics", "Laws of Motion", "Work, Energy & Power", "Rotational Motion", "Gravitation"] },
          { unit: "Thermodynamics", topics: ["Kinetic Theory of Gases", "Thermal Properties of Matter", "Laws of Thermodynamics"] },
          { unit: "Optics", topics: ["Ray Optics", "Wave Optics", "Optical Instruments"] },
          { unit: "Electrodynamics", topics: ["Electrostatics", "Current Electricity", "Magnetic Effects of Current"] },
        ],
      },
      {
        subject: "Chemistry",
        units: [
          { unit: "Physical Chemistry", topics: ["Mole Concept", "States of Matter", "Chemical Equilibrium", "Electrochemistry"] },
          { unit: "Organic Chemistry", topics: ["General Organic Chemistry", "Hydrocarbons", "Biomolecules", "Polymers"] },
          { unit: "Inorganic Chemistry", topics: ["Periodic Table", "Chemical Bonding", "Coordination Compounds", "p-Block Elements"] },
        ],
      },
      {
        subject: "Biology",
        units: [
          { unit: "Botany", topics: ["Plant Physiology", "Morphology of Flowering Plants", "Plant Kingdom"] },
          { unit: "Zoology", topics: ["Human Physiology", "Animal Kingdom", "Structural Organisation in Animals"] },
          { unit: "Genetics & Evolution", topics: ["Principles of Inheritance", "Molecular Basis of Inheritance", "Evolution"] },
          { unit: "Ecology", topics: ["Organisms & Populations", "Ecosystem", "Biodiversity & Conservation"] },
        ],
      },
    ],
  },
  "jee-main": {
    examLabel: "JEE Main",
    subjects: [
      {
        subject: "Physics",
        units: [
          { unit: "Mechanics", topics: ["Kinematics", "Laws of Motion", "Rotational Dynamics", "Gravitation"] },
          { unit: "Electrodynamics", topics: ["Electrostatics", "Current Electricity", "Electromagnetic Induction"] },
          { unit: "Modern Physics", topics: ["Atoms & Nuclei", "Dual Nature of Matter", "Semiconductors"] },
        ],
      },
      {
        subject: "Chemistry",
        units: [
          { unit: "Physical Chemistry", topics: ["Mole Concept", "Chemical Kinetics", "Electrochemistry", "Thermodynamics"] },
          { unit: "Organic Chemistry", topics: ["GOC", "Hydrocarbons", "Aldehydes, Ketones & Carboxylic Acids"] },
          { unit: "Inorganic Chemistry", topics: ["Periodic Table", "Chemical Bonding", "d & f Block Elements"] },
        ],
      },
      {
        subject: "Mathematics",
        units: [
          { unit: "Algebra", topics: ["Quadratic Equations", "Sequences & Series", "Matrices & Determinants", "Permutations & Combinations"] },
          { unit: "Calculus", topics: ["Limits, Continuity & Differentiability", "Application of Derivatives", "Integral Calculus"] },
          { unit: "Coordinate Geometry", topics: ["Straight Lines", "Circles", "Conic Sections"] },
          { unit: "Trigonometry", topics: ["Trigonometric Ratios", "Inverse Trigonometric Functions", "Trigonometric Equations"] },
        ],
      },
    ],
  },
  "jee-advanced": {
    examLabel: "JEE Advanced",
    subjects: [
      {
        subject: "Physics",
        units: [
          { unit: "Mechanics", topics: ["Advanced Rotational Dynamics", "Simple Harmonic Motion", "Fluid Mechanics"] },
          { unit: "Electrodynamics", topics: ["Capacitance", "Magnetism", "AC Circuits"] },
          { unit: "Modern Physics", topics: ["Nuclear Physics", "Photoelectric Effect", "Semiconductor Devices"] },
        ],
      },
      {
        subject: "Chemistry",
        units: [
          { unit: "Physical Chemistry", topics: ["Electrochemistry", "Chemical & Ionic Equilibrium", "Surface Chemistry"] },
          { unit: "Organic Chemistry", topics: ["Reaction Mechanisms", "Named Reactions", "Biomolecules & Polymers"] },
          { unit: "Inorganic Chemistry", topics: ["Coordination Chemistry", "Qualitative Analysis", "Metallurgy"] },
        ],
      },
      {
        subject: "Mathematics",
        units: [
          { unit: "Algebra", topics: ["Complex Numbers", "Probability", "Vectors & 3D Geometry"] },
          { unit: "Calculus", topics: ["Differential Equations", "Definite Integrals & Areas", "Applications of Calculus"] },
        ],
      },
    ],
  },
  olympiad: {
    examLabel: "Olympiad",
    subjects: [
      { subject: "Mathematics", units: [{ unit: "Foundational Maths", topics: ["Number Systems", "Geometry", "Mensuration"] }, { unit: "Logical Reasoning", topics: ["Pattern Recognition", "Puzzles", "Analytical Reasoning"] }] },
      { subject: "Science", units: [{ unit: "Physics Basics", topics: ["Motion & Force", "Light & Sound"] }, { unit: "Chemistry Basics", topics: ["Matter & Materials", "Elements & Compounds"] }, { unit: "Biology Basics", topics: ["Living World", "Human Body"] }] },
    ],
  },
  ntse: {
    examLabel: "NTSE",
    subjects: [
      { subject: "MAT (Mental Ability)", units: [{ unit: "Reasoning", topics: ["Verbal Reasoning", "Non-Verbal Reasoning", "Analogies & Series"] }] },
      { subject: "SAT (Scholastic Aptitude)", units: [{ unit: "Science", topics: ["Physics", "Chemistry", "Biology"] }, { unit: "Mathematics", topics: ["Arithmetic", "Algebra", "Geometry"] }, { unit: "Social Science", topics: ["History", "Geography", "Civics"] }] },
    ],
  },
};

// ---------------------------------------------------------------------------
// Exam Pattern
// ---------------------------------------------------------------------------
export const EXAM_PATTERN = {
  neet: {
    questions: 180, totalMarks: 720, duration: "3 Hours 20 Minutes", mode: "Offline (Pen & Paper)",
    negativeMarking: "-1 for each wrong answer", questionType: "MCQ (Single Correct)",
    subjectWise: [
      { subject: "Physics", questions: 45, marks: 180 },
      { subject: "Chemistry", questions: 45, marks: 180 },
      { subject: "Biology (Botany + Zoology)", questions: 90, marks: 360 },
    ],
  },
  "jee-main": {
    questions: 90, totalMarks: 300, duration: "3 Hours", mode: "Online (CBT)",
    negativeMarking: "-1 for wrong MCQ, 0 for numerical", questionType: "MCQ + Numerical Value",
    subjectWise: [
      { subject: "Physics", questions: 30, marks: 100 },
      { subject: "Chemistry", questions: 30, marks: 100 },
      { subject: "Mathematics", questions: 30, marks: 100 },
    ],
  },
  "jee-advanced": {
    questions: 54, totalMarks: 198, duration: "3 Hours (2 Papers x 3 Hours)", mode: "Online (CBT)",
    negativeMarking: "Varies by question type (partial marking applicable)", questionType: "MCQ, Multi-Correct & Numerical",
    subjectWise: [
      { subject: "Physics", questions: 18, marks: 66 },
      { subject: "Chemistry", questions: 18, marks: 66 },
      { subject: "Mathematics", questions: 18, marks: 66 },
    ],
  },
  olympiad: {
    questions: 50, totalMarks: 50, duration: "1 Hour", mode: "Offline / Online",
    negativeMarking: "No negative marking", questionType: "MCQ",
    subjectWise: [
      { subject: "Mathematics", questions: 25, marks: 25 },
      { subject: "Science", questions: 25, marks: 25 },
    ],
  },
  ntse: {
    questions: 200, totalMarks: 200, duration: "4 Hours 30 Minutes (MAT + SAT)", mode: "Offline (Pen & Paper)",
    negativeMarking: "No negative marking", questionType: "MCQ",
    subjectWise: [
      { subject: "MAT", questions: 100, marks: 100 },
      { subject: "SAT", questions: 100, marks: 100 },
    ],
  },
};

// ---------------------------------------------------------------------------
// Eligibility
// ---------------------------------------------------------------------------
export const ELIGIBILITY = {
  neet: {
    qualification: "Passed / appearing Class 12 with Physics, Chemistry, Biology & English",
    ageLimit: "No upper age limit as per current NTA guidelines",
    minMarks: "Min. 50% aggregate in PCB (40% for reserved categories)",
    subjects: "Physics, Chemistry, Biology (PCB) mandatory",
    attempts: "No official attempt limit",
    nationality: "Indian citizens, OCIs, NRIs & foreign nationals (as per NTA norms)",
  },
  "jee-main": {
    qualification: "Passed / appearing Class 12 with Physics, Chemistry & Mathematics",
    ageLimit: "No age limit; must have passed Class 12 in current or previous year",
    minMarks: "Top 75 percentile in Class 12 boards (or top 20 percentile-ile category rank)",
    subjects: "Physics, Chemistry, Mathematics (PCM) mandatory",
    attempts: "Maximum 3 consecutive years from Class 12 passing",
    nationality: "Indian citizens, OCIs, PIOs & foreign nationals",
  },
  "jee-advanced": {
    qualification: "Must rank among the top ~2,50,000 in JEE Main (category-wise)",
    ageLimit: "Born on or after specified NTA cut-off date",
    minMarks: "As qualified in JEE Main; Class 12 aggregate criteria apply",
    subjects: "Physics, Chemistry, Mathematics (PCM) mandatory",
    attempts: "Maximum 2 attempts in 2 consecutive years",
    nationality: "Indian citizens, OCIs & limited foreign-national seats",
  },
  olympiad: {
    qualification: "Studying in Class 1 to 12 in a recognised school",
    ageLimit: "As per class / grade enrolled",
    minMarks: "No minimum marks required to appear",
    subjects: "Mathematics & Science (as per class syllabus)",
    attempts: "One attempt per academic year, per level",
    nationality: "Open to Indian & select international schools",
  },
  ntse: {
    qualification: "Studying in Class 10 in a recognised school",
    ageLimit: "As per Class 10 enrolment",
    minMarks: "Minimum qualifying marks in Stage 1 to advance to Stage 2 (state-specific)",
    subjects: "MAT (Mental Ability) & SAT (Science, Maths, Social Science)",
    attempts: "One attempt per academic year (Class 10 only)",
    nationality: "Indian citizens studying in India",
  },
};

// ---------------------------------------------------------------------------
// Exam Date Timeline (illustrative milestones - academy shares official dates
// closer to the exam via counselling / notices)
// ---------------------------------------------------------------------------
export const EXAM_TIMELINE = {
  neet: [
    { label: "Application Start", date: "Feb 2027 (tentative)" },
    { label: "Application Last Date", date: "Mar 2027 (tentative)" },
    { label: "Admit Card Release", date: "Apr 2027 (tentative)" },
    { label: "NEET Exam Date", date: "May 2027 (tentative)" },
    { label: "Answer Key Release", date: "Jun 2027 (tentative)" },
    { label: "Result Date", date: "Jun 2027 (tentative)" },
    { label: "Counselling Begins", date: "Jul 2027 (tentative)" },
  ],
  "jee-main": [
    { label: "Application Start (Session 1)", date: "Nov 2026 (tentative)" },
    { label: "Application Last Date", date: "Dec 2026 (tentative)" },
    { label: "Admit Card Release", date: "Jan 2027 (tentative)" },
    { label: "JEE Main Exam Date", date: "Jan 2027 (tentative)" },
    { label: "Answer Key Release", date: "Jan 2027 (tentative)" },
    { label: "Result Date", date: "Feb 2027 (tentative)" },
    { label: "Session 2 Window", date: "Apr 2027 (tentative)" },
  ],
  "jee-advanced": [
    { label: "Registration Start", date: "Apr 2027 (tentative)" },
    { label: "Registration Last Date", date: "May 2027 (tentative)" },
    { label: "Admit Card Release", date: "May 2027 (tentative)" },
    { label: "JEE Advanced Exam Date", date: "May 2027 (tentative)" },
    { label: "Answer Key Release", date: "Jun 2027 (tentative)" },
    { label: "Result Date", date: "Jun 2027 (tentative)" },
    { label: "Counselling / JoSAA", date: "Jun 2027 (tentative)" },
  ],
  olympiad: [
    { label: "Registration Start", date: "Aug 2026 (tentative)" },
    { label: "Registration Last Date", date: "Oct 2026 (tentative)" },
    { label: "Level 1 Exam Date", date: "Nov 2026 (tentative)" },
    { label: "Level 1 Result", date: "Dec 2026 (tentative)" },
    { label: "Level 2 Exam Date", date: "Jan 2027 (tentative)" },
    { label: "Final Result & Awards", date: "Feb 2027 (tentative)" },
  ],
  ntse: [
    { label: "Application Start", date: "Jul 2026 (tentative)" },
    { label: "Application Last Date", date: "Sep 2026 (tentative)" },
    { label: "Stage 1 Exam Date", date: "Nov 2026 (tentative)" },
    { label: "Stage 1 Result", date: "Jan 2027 (tentative)" },
    { label: "Stage 2 Exam Date", date: "May 2027 (tentative)" },
    { label: "Stage 2 Result", date: "Aug 2027 (tentative)" },
  ],
};

// ---------------------------------------------------------------------------
// PYQs (up to 15 years) & Answer Key (last 5 years)
// ---------------------------------------------------------------------------
export const PYQ_YEARS = (examKey) => lastNYears(15);
export const ANSWER_KEY_YEARS = (examKey) => lastNYears(5);

export const SUBJECTS_FOR = (examKey) => (SYLLABUS[examKey]?.subjects || []).map((s) => s.subject);

export const PAPER_SETS = ["Set A", "Set B", "Set C", "Set D"];

// ---------------------------------------------------------------------------
// Rank Predictor
// ---------------------------------------------------------------------------
export const RANK_PREDICTOR_CONFIG = {
  neet: { totalMarks: 720, totalCandidates: 2200000, label: "NEET" },
  "jee-main": { totalMarks: 300, totalCandidates: 1200000, label: "JEE Main" },
  "jee-advanced": { totalMarks: 198, totalCandidates: 180000, label: "JEE Advanced" },
  olympiad: { totalMarks: 50, totalCandidates: 400000, label: "Olympiad" },
  ntse: { totalMarks: 200, totalCandidates: 300000, label: "NTSE" },
};

const CATEGORY_FACTOR = {
  General: 1,
  OBC: 0.78,
  SC: 0.55,
  ST: 0.48,
  EWS: 0.85,
};

/**
 * Rough, clearly-labelled ESTIMATE only - not an official prediction.
 * Uses a smooth percentile curve so higher marks give tighter, better ranks.
 */
export function predictRank(examKey, marks, category = "General") {
  const cfg = RANK_PREDICTOR_CONFIG[examKey] || RANK_PREDICTOR_CONFIG.neet;
  const pct = Math.min(Math.max(marks / cfg.totalMarks, 0), 1);
  // Skewed curve: top marks compress toward rank 1, low marks spread out.
  const percentileFromTop = Math.pow(1 - pct, 1.8);
  const factor = CATEGORY_FACTOR[category] ?? 1;
  const midRank = Math.max(1, Math.round(percentileFromTop * cfg.totalCandidates * factor));
  const spread = Math.max(50, Math.round(midRank * 0.18));
  const low = Math.max(1, midRank - spread);
  const high = midRank + spread;
  return { low, high, totalCandidates: cfg.totalCandidates, totalMarks: cfg.totalMarks, label: cfg.label };
}
