// src/pages/Courses/JEE/data.jsx
// The full JEE course tree. JEE has two branches - "JEE Main" and "JEE
// Advanced" - each with its own Classroom Courses, Online Courses, Results,
// Faculty, Fee Structure and exam-info tools. Everything JEE-specific lives
// in this folder.
import { FaGraduationCap } from "react-icons/fa";
import {
  hub,
  infoLeaf,
  classroomCoursesLeaf,
  onlineCourses,
  examResourceLeaves,
} from "../../../data/treeBuilders";

export const JEE_BRANCHES = [
  { slug: "jee-main", label: "JEE Main" },
  { slug: "jee-advanced", label: "JEE Advanced" },
];

const jeeSubTree = (label) =>
  hub(label, [
    classroomCoursesLeaf(),
    onlineCourses({
      live: ["Class 11", "Class 12", "Repeaters", "Crash Course"],
      recorded: ["Class 11", "Class 12", "Repeaters", "Crash Course"],
      test: ["Chapter Tests", "Mock Tests", "Full Syllabus", "Previous Year Papers"],
      materials: ["Physics", "Chemistry", "Mathematics", "Formula Book", "NCERT", "Assignments"],
    }),
   
    ...examResourceLeaves(),
    
  ]);

export const JEE_TREE = hub("JEE", [jeeSubTree("JEE Main"), jeeSubTree("JEE Advanced")], {
  slug: "jee",
  color: "#e8b430",
  icon: <FaGraduationCap />,
  target: "Class 11th to 12th + Dropper",
});
