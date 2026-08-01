// src/pages/Courses/NEET/routes.js
// Direct, human-readable routes for every NEET page - registered
// in src/App.jsx alongside the generic /courses/* explorer route.
import NEETIndex from "./index";
import ClassroomCourses from "./ClassroomCourses";
import OnlineCourses from "./OnlineCourses";
import TestSeries from "./TestSeries";
import StudyMaterials from "./StudyMaterials";
import Results from "./Results";
import Scholarship from "./Scholarship";
import PYQs from "./PYQs";
import Syllabus from "./Syllabus";
import ExamDate from "./ExamDate";
import AnswerKey from "./AnswerKey";
import Eligibility from "./Eligibility";
import ExamPattern from "./ExamPattern";
import RankPredictor from "./RankPredictor";
import CourseDetails from "./CourseDetails";
import Enrollment from "./Enrollment";
import Payment from "./Payment";

const routes = [
  { path: "/neet", Component: NEETIndex },
  { path: "/neet/classroom-courses", Component: ClassroomCourses },
  { path: "/neet/online-courses", Component: OnlineCourses },
  { path: "/neet/test-series", Component: TestSeries },
  { path: "/neet/study-materials", Component: StudyMaterials },
  { path: "/neet/results", Component: Results },
  { path: "/neet/scholarship", Component: Scholarship },
  { path: "/neet/pyqs", Component: PYQs },
  { path: "/neet/syllabus", Component: Syllabus },
  { path: "/neet/exam-date", Component: ExamDate },
  { path: "/neet/answer-key", Component: AnswerKey },
  { path: "/neet/eligibility", Component: Eligibility },
  { path: "/neet/exam-pattern", Component: ExamPattern },
  { path: "/neet/rank-predictor", Component: RankPredictor },
  { path: "/neet/course-details", Component: CourseDetails },
  { path: "/neet/enrollment", Component: Enrollment },
  { path: "/neet/payment", Component: Payment },
];

export default routes;
