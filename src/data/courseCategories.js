// src/data/courseCategories.js
// Shared constants for the Course Management admin feature. Kept separate
// from the existing static courseTree/coursePlans data (which powers the
// public marketing pages today) — this is the admin-editable course catalog
// that the backend persists and that the Admin Dashboard manages.

export const COURSE_CATEGORIES = [
  { slug: "neet", label: "NEET" },
  { slug: "jee", label: "JEE (Mains + Advanced)" },
  { slug: "foundation", label: "Foundation (NTSE / Olympiad)" },
  { slug: "neet-jee-individual", label: "NEET & JEE Foundation (Individual) – Class 6th to 12th" },
];

// mediaKind controls which upload control the admin form shows:
// "image" -> image file upload (like Gallery)
// "video" -> video upload / video URL (Online + Recorded courses only)
export const COURSE_TYPES = [
  { key: "classroom", label: "Classroom Courses", mediaKind: "image" },
  { key: "online", label: "Online Courses", mediaKind: "video" },
  { key: "recorded", label: "Recorded Courses", mediaKind: "video" },
  { key: "test-series", label: "Test Series", mediaKind: "pdf" },
  { key: "study-materials", label: "Study Materials", mediaKind: "pdf" },
];

export const COURSE_STATUSES = ["Active", "Inactive"];

export const getCategoryLabel = (slug) =>
  COURSE_CATEGORIES.find((c) => c.slug === slug)?.label || slug;

export const getCourseType = (key) => COURSE_TYPES.find((t) => t.key === key);

export const getCourseTypeLabel = (key) => getCourseType(key)?.label || key;
