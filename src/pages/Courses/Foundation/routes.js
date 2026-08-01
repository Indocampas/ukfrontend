// src/pages/Courses/Foundation/routes.js
// Direct, human-readable routes for every Foundation page - registered
// in src/App.jsx alongside the generic /courses/* explorer route.
import FoundationIndex from "./index";
import ClassroomCourses from "./ClassroomCourses";
import LiveClasses from "./LiveClasses";
import RecordedClasses from "./RecordedClasses";
import TestSeries from "./TestSeries";
import StudyMaterials from "./StudyMaterials";
import Syllabus from "./Syllabus";
import Eligibility from "./Eligibility";
import ExamPattern from "./ExamPattern";
import Olympiad from "./Olympiad";
import NSTSE from "./NSTSE";
import CourseDetails from "./CourseDetails";
import Enrollment from "./Enrollment";
import Payment from "./Payment";

const routes = [
  { path: "/foundation", Component: FoundationIndex },
  { path: "/foundation/classroom-courses", Component: ClassroomCourses },
  { path: "/foundation/:branch/classroom-courses", Component: ClassroomCourses },
  { path: "/foundation/live-classes", Component: LiveClasses },
  { path: "/foundation/:branch/live-classes", Component: LiveClasses },
  { path: "/foundation/recorded-classes", Component: RecordedClasses },
  { path: "/foundation/:branch/recorded-classes", Component: RecordedClasses },
  { path: "/foundation/test-series", Component: TestSeries },
  { path: "/foundation/:branch/test-series", Component: TestSeries },
  { path: "/foundation/study-materials", Component: StudyMaterials },
  { path: "/foundation/:branch/study-materials", Component: StudyMaterials },
  { path: "/foundation/syllabus", Component: Syllabus },
  { path: "/foundation/:branch/syllabus", Component: Syllabus },
  { path: "/foundation/eligibility", Component: Eligibility },
  { path: "/foundation/:branch/eligibility", Component: Eligibility },
  { path: "/foundation/exam-pattern", Component: ExamPattern },
  { path: "/foundation/:branch/exam-pattern", Component: ExamPattern },
  { path: "/foundation/olympiad", Component: Olympiad },
  { path: "/foundation/olympiad/nstse", Component: NSTSE },
  { path: "/foundation/course-details", Component: CourseDetails },
  { path: "/foundation/enrollment", Component: Enrollment },
  { path: "/foundation/payment", Component: Payment },
];

export default routes;
