// src/data/aiReadyTeacherCourse.js
// The 14th Faculty Program: "AI-Ready Teacher Course". The other 13 Faculty
// Courses are managed entirely from the backend (via the Faculty Programs
// admin panel, src/pages/Admin/AdminFacultyPrograms.jsx) and fetched over
// the API in src/context/FacultyProgramContext.jsx.
//
// This course is defined here on the frontend and merged into the fetched
// list (see FacultyProgramContext.jsx) so it always shows up as the 14th
// program - even before/without an admin adding it to the database. If an
// admin later adds a program with this same slug from the admin panel, the
// backend version takes priority and this fallback is skipped.
export const AI_READY_TEACHER_COURSE = {
  id: "ai-ready-teacher-course",
  slug: "ai-ready-teacher-course",
  title: "AI-Ready Teacher Course",
  category: "ai-ready-teacher",
  description:
    "A practical certification program that prepares teachers and aspiring educators to confidently use AI tools in the classroom - from AI-assisted lesson planning to personalised student support - while teaching students how to use AI responsibly.",
  target: "Teachers & Educators",
  duration: "2 Months",
  level: "Professional",
  features: [
    "AI-Assisted Lesson Planning",
    "Classroom AI Tools & Apps",
    "Prompt Literacy for Teachers",
    "Responsible & Ethical AI Use",
  ],
  fee: 25000,
  icon: "FiZap",
  color: "#00C2A8",
  isPublished: true,
};

export const AI_READY_TEACHER_CATEGORY = { value: "ai-ready-teacher", label: "AI-Ready Teacher Course" };
