export const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

let AUTO_ID = 0;

export const leaf = (title, opts = {}) => ({
  id: `n${AUTO_ID++}`,
  slug: slugify(title),
  title,
  kind: opts.kind || "course",
  ...opts,
});

export const hub = (title, children, opts = {}) => ({
  id: `n${AUTO_ID++}`,
  slug: opts.slug || slugify(title),
  title,
  children,
  ...opts,
});

export const infoLeaf = (title) => leaf(title, { kind: "info" });

// Exam-info tool leaves - these render dedicated interactive pages (see
// shared/CourseInfoTools.jsx) instead of the generic "talk to us" info page.
export const pyqLeaf = () => leaf("Previous Year Questions", { kind: "pyq" });
export const syllabusLeaf = () => leaf("Syllabus", { kind: "syllabus" });
export const examDateLeaf = () => leaf("Exam Date", { kind: "examdate" });
export const answerKeyLeaf = () => leaf("Answer Key", { kind: "answerkey" });
export const eligibilityLeaf = () => leaf("Eligibility", { kind: "eligibility" });
export const examPatternLeaf = () => leaf("Exam Pattern", { kind: "exampattern" });
export const rankPredictorLeaf = () => leaf("Rank Predictor", { kind: "rankpredictor" });

export const examResourceLeaves = () => [
  pyqLeaf(),
  syllabusLeaf(),
  examDateLeaf(),
  answerKeyLeaf(),
  eligibilityLeaf(),
  examPatternLeaf(),
  rankPredictorLeaf(),
];

// ---------------------------------------------------------------------------
// Reusable sub-tree builders
// ---------------------------------------------------------------------------
export const classroomCoursesLeaf = () => leaf("Classroom Courses", { kind: "classroom" });

export const liveClasses = (programs) => hub("Live Classes", programs.map((p) => leaf(p)));
export const recordedClasses = (programs) => hub("Recorded Classes", programs.map((p) => leaf(p)));
export const testSeries = (items) => hub("Online Test Series", items.map((i) => leaf(i)));
export const studyMaterials = (items) => hub("Study Materials", items.map((i) => leaf(i)));
export const doubtClearingSessions = (items) => hub("Doubt-Clearing Sessions", items.map((i) => leaf(i)));
export const otherOnlineFeatures = (items) => hub("Other Features", items.map((i) => leaf(i)));

// `doubt` and `other` are optional - when omitted, sensible defaults are
// used so every category's Online Courses section carries the same
// baseline set of features (Live, Recorded, Test Series, Study Materials,
// Doubt-Clearing Sessions, plus any other existing online course features).
const DEFAULT_DOUBT_SESSIONS = ["Physics", "Chemistry", "Biology / Mathematics"];
const DEFAULT_OTHER_FEATURES = [
  "Recorded Class Downloads",
  "Mobile App Access",
  "Performance Analytics",
  "Parent Progress Updates",
];

export const onlineCourses = ({ live, recorded, test, materials, doubt, other }) =>
  hub("Online Courses", [
    liveClasses(live),
    recordedClasses(recorded),
    testSeries(test),
    studyMaterials(materials),
    doubtClearingSessions(doubt || DEFAULT_DOUBT_SESSIONS),
    otherOnlineFeatures(other || DEFAULT_OTHER_FEATURES),
  ]);
