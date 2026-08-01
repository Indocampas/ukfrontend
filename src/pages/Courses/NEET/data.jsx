// src/pages/Courses/NEET/data.js
// The full NEET course tree: Classroom Courses, Online Courses (Live /
// Recorded / Test Series / Study Materials), Scholarship, Results, exam-info
// tools (PYQs, Syllabus, Exam Date, Answer Key, Eligibility, Exam Pattern,
// Rank Predictor) and more. Everything NEET-specific lives in this folder.
import { FaUniversity } from "react-icons/fa";
import {
  hub,
  infoLeaf,
  classroomCoursesLeaf,
  onlineCourses,
  examResourceLeaves,
} from "../../../data/treeBuilders";

export const NEET_MATERIALS = [
  "Biology Notes",
  "Physics Notes",
  "Chemistry Notes",
  "NCERT Solutions",
  "Formula Book",
  "Assignments",
  "Question Bank",
];

export const NEET_TEST_SERIES = ["Chapter Tests", "Subject Tests", "Grand Tests", "Full Syllabus", "Previous Year Papers"];

export const NEET_TREE = hub(
  "NEET",
  [
    classroomCoursesLeaf(),
    onlineCourses({
      live: ["Class 11", "Class 12", "2 Year Program", "Repeaters", "Crash Course"],
      recorded: ["Class 11", "Class 12", "Repeaters", "Crash Course"],
      test: NEET_TEST_SERIES,
      materials: NEET_MATERIALS,
    }),
    
  
    ...examResourceLeaves(),
  ],
  { slug: "neet", color: "#4CAF50", icon: <FaUniversity />, target: "Class 11th to 12th + Dropper" }
);
