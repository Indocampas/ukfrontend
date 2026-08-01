// src/pages/Courses/Foundation/data.jsx
// The full Foundation course tree. Foundation has two branches - "NTSE" and
// "Olympiad" (IMO / NSO / IEO / NSTSE) - each with Classroom Courses, Live /
// Recorded Classes, Test Series, Study Materials and exam-info tools.
// Everything Foundation-specific lives in this folder.
import { FiAward } from "react-icons/fi";
import {
  hub,
  leaf,
  infoLeaf,
  classroomCoursesLeaf,
  syllabusLeaf,
  eligibilityLeaf,
  examPatternLeaf,
} from "../../../data/treeBuilders";

export const FOUNDATION_BRANCHES = [
  { slug: "ntse", label: "NTSE" },
  { slug: "olympiad", label: "Olympiad" },
];

export const NTSE_TREE = hub("NTSE", [
  classroomCoursesLeaf(),
  leaf("Live Classes"),
  leaf("Recorded Classes"),
  leaf("Test Series"),
  leaf("Study Materials"),
  syllabusLeaf(),
  eligibilityLeaf(),
  examPatternLeaf(),
]);

export const OLYMPIAD_TREE = hub("Olympiad", [
  leaf("IMO"),
  leaf("NSO"),
  leaf("IEO"),
  leaf("NSTSE"),
  classroomCoursesLeaf(),
  leaf("Live Classes"),
  leaf("Recorded Classes"),
  leaf("Test Series"),
  leaf("Study Materials"),
  infoLeaf("Results"),
  syllabusLeaf(),
  eligibilityLeaf(),
  examPatternLeaf(),
  infoLeaf("FAQs"),
]);

export const FOUNDATION_TREE = hub("Foundation", [NTSE_TREE, OLYMPIAD_TREE], {
  slug: "foundation",
  color: "#2196F3",
  icon: <FiAward />,
  target: "Class 6th to 10th",
});
