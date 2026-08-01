// src/pages/Courses/JEE/routes.js
// Direct, human-readable routes for every JEE page - registered
// in src/App.jsx alongside the generic /courses/* explorer route.
import JEEIndex from "./index";
import ClassroomCourses from "./ClassroomCourses";
import OnlineCourses from "./OnlineCourses";
import TestSeries from "./TestSeries";
import StudyMaterials from "./StudyMaterials";
import Results from "./Results";
import Faculty from "./Faculty";
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
  { path: "/jee", Component: JEEIndex },
  { path: "/jee/classroom-courses", Component: ClassroomCourses },
  { path: "/jee/:branch/classroom-courses", Component: ClassroomCourses },
  { path: "/jee/online-courses", Component: OnlineCourses },
  { path: "/jee/:branch/online-courses", Component: OnlineCourses },
  { path: "/jee/test-series", Component: TestSeries },
  { path: "/jee/:branch/test-series", Component: TestSeries },
  { path: "/jee/study-materials", Component: StudyMaterials },
  { path: "/jee/:branch/study-materials", Component: StudyMaterials },
  { path: "/jee/results", Component: Results },
  { path: "/jee/:branch/results", Component: Results },
  { path: "/jee/faculty", Component: Faculty },
  { path: "/jee/:branch/faculty", Component: Faculty },

  { path: "/jee/p-y-qs", Component: PYQs },
  { path: "/jee/:branch/p-y-qs", Component: PYQs },
  { path: "/jee/syllabus", Component: Syllabus },
  { path: "/jee/:branch/syllabus", Component: Syllabus },
  { path: "/jee/exam-date", Component: ExamDate },
  { path: "/jee/:branch/exam-date", Component: ExamDate },
  { path: "/jee/answer-key", Component: AnswerKey },
  { path: "/jee/:branch/answer-key", Component: AnswerKey },
  { path: "/jee/eligibility", Component: Eligibility },
  { path: "/jee/:branch/eligibility", Component: Eligibility },
  { path: "/jee/exam-pattern", Component: ExamPattern },
  { path: "/jee/:branch/exam-pattern", Component: ExamPattern },
  { path: "/jee/rank-predictor", Component: RankPredictor },
  { path: "/jee/:branch/rank-predictor", Component: RankPredictor },
  { path: "/jee/course-details", Component: CourseDetails },
  { path: "/jee/enrollment", Component: Enrollment },
  { path: "/jee/payment", Component: Payment },
];

export default routes;
