// F:\uk-academy-app\src\App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./pages/Hero/Hero";
import Courses from "./pages/Courses/Courses";
import CourseExplorer from "./pages/Courses/shared/CourseExplorer";
import ClassCourseCatalog from "./pages/Courses/shared/ClassCourseCatalog";
import { NEET_JEE_INDIVIDUAL, NEET_JEE_SCHOOLS, NTSE_OLYMPIAD } from "./data/courseCatalogData";
import neetRoutes from "./pages/Courses/NEET/routes";
import jeeRoutes from "./pages/Courses/JEE/routes";
import foundationRoutes from "./pages/Courses/Foundation/routes";
import WhyUKAcademy from "./pages/WhyUKAcademy/WhyUKAcademy";
import Results from "./pages/Results/Results";
import AllResults from "./pages/Results/AllResults";
import Faculty from "./pages/Faculty/Faculty";
import Gallery from "./pages/Gallery/Gallery";
import GalleryGrid from "./pages/Gallery/GalleryGrid";
import Scholarship from "./pages/Scholarship/Scholarship";
import Contact from "./pages/Contact/Contact";
import About from "./pages/About/About";
import AboutUs from "./pages/AboutUs/AboutUs";
import VisionMission from "./pages/VisionMission/VisionMission";
import Login from "./pages/Login/Login";
import AdminGallery from "./pages/Admin/AdminGallery";
import AdminCourses from "./pages/Admin/AdminCourses";
import AdminScholarship from "./pages/Admin/AdminScholarship";
import AdminBooks from "./pages/Admin/AdminBooks";
import AdminFaculty from "./pages/Admin/AdminFaculty";
import AdminPYQ from "./pages/Admin/AdminPYQ";
import AdminSyllabus from "./pages/Admin/AdminSyllabus";
import AdminAnswerKey from "./pages/Admin/AdminAnswerKey";
import AdminExamDate from "./pages/Admin/AdminExamDate";
import AdminFacultyPrograms from "./pages/Admin/AdminFacultyPrograms";
import BooksHome from "./pages/Books/BooksHome";
import BooksSubjects from "./pages/Books/BooksSubjects";
import BooksStandards from "./pages/Books/BooksStandards";
import BooksGrid from "./pages/Books/BooksGrid";
import ScholarshipRegister from "./pages/Scholarship/ScholarshipRegister";
import ScholarshipPortal from "./pages/Scholarship/ScholarshipPortal";
import ScholarshipExam from "./pages/Scholarship/ScholarshipExam";
import EnrollmentFlow from "./pages/Enrollment/EnrollmentFlow";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PageTransition from "./components/PageTransition/PageTransition";
import { AuthProvider } from "./context/AuthContext";
import { GalleryProvider } from "./context/GalleryContext";
import { CourseProvider } from "./context/CourseContext";
import { ScholarshipProvider } from "./context/ScholarshipContext";
import { StudentAuthProvider } from "./context/StudentAuthContext";
import { FormModalProvider } from "./context/FormModalContext";
import { BooksProvider } from "./context/BooksContext";
import { FacultyProvider } from "./context/FacultyContext";
import { FacultyProgramProvider } from "./context/FacultyProgramContext";
import { PYQProvider } from "./context/PYQContext";
import { SyllabusProvider } from "./context/SyllabusContext";
import { AnswerKeyProvider } from "./context/AnswerKeyContext";
import { ExamDateProvider } from "./context/ExamDateContext";
import LeadFormModal from "./components/LeadFormModal/LeadFormModal";
import AIAssistant from "./components/AIAssistant/AIAssistant";
import AdmissionsPanda from "./components/AdmissionsPanda/AdmissionsPanda";
import FacultyPrograms from "./pages/FacultyPrograms/FacultyPrograms";
import FacultyProgramsList from "./pages/FacultyPrograms/FacultyProgramsList";
import FacultyProgramDetail from "./pages/FacultyPrograms/FacultyProgramDetail";
import "./App.css";

const NAVBAR_OFFSET = 78;

// Direct, human-readable routes for each course category (e.g.
// /neet/classroom-courses, /jee/results, /foundation/olympiad) - defined
// in each category's own src/pages/Courses/<Category>/routes.js file.
// These render the exact same UI as the generic /courses/* explorer route
// below; they just give every category page its own clean, memorable URL.
const CATEGORY_ROUTES = [...neetRoutes, ...jeeRoutes, ...foundationRoutes];

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    const top = el.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET + 1;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

function HomePage() {
  return (
    <>
      <Hero scrollToSection={scrollToSection} />
      <AboutUs />
      <VisionMission />
      <Courses scrollToSection={scrollToSection} />
      <FacultyPrograms />
      <WhyUKAcademy scrollToSection={scrollToSection} />
      <Results scrollToSection={scrollToSection} />
      <Faculty />
      <Gallery />
      <BooksHome />
      <Scholarship />
      <Contact />
      <AdmissionsPanda />
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/faculty-programs"
        element={
          <PageTransition>
            <FacultyProgramsList />
          </PageTransition>
        }
      />
      <Route
        path="/faculty-programs/:slug"
        element={
          <PageTransition>
            <FacultyProgramDetail />
          </PageTransition>
        }
      />
      <Route
        path="/courses/neet-jee-individual"
        element={
          <PageTransition>
            <ClassCourseCatalog {...NEET_JEE_INDIVIDUAL} />
          </PageTransition>
        }
      />
      <Route
        path="/courses/neet-jee-schools"
        element={
          <PageTransition>
            <ClassCourseCatalog {...NEET_JEE_SCHOOLS} />
          </PageTransition>
        }
      />
      <Route
        path="/courses/ntse-olympiad"
        element={
          <PageTransition>
            <ClassCourseCatalog {...NTSE_OLYMPIAD} />
          </PageTransition>
        }
      />
      <Route
        path="/courses/*"
        element={
          <PageTransition>
            <CourseExplorer />
          </PageTransition>
        }
      />
      {CATEGORY_ROUTES.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <PageTransition>
              <Component />
            </PageTransition>
          }
        />
      ))}
      <Route
        path="/gallery"
        element={
          <PageTransition>
            <GalleryGrid />
          </PageTransition>
        }
      />
      <Route
        path="/about"
        element={
          <PageTransition>
            <About />
          </PageTransition>
        }
      />
      <Route
        path="/all-results"
        element={
          <PageTransition>
            <AllResults />
          </PageTransition>
        }
      />
      <Route
        path="/enroll"
        element={
          <PageTransition>
            <EnrollmentFlow />
          </PageTransition>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PageTransition>
            <StudentDashboard />
          </PageTransition>
        }
      />
      <Route
        path="/login"
        element={
          <PageTransition>
            <Login />
          </PageTransition>
        }
      />
      <Route
        path="/admin/gallery"
        element={
          <ProtectedRoute>
            <PageTransition>
              <AdminGallery />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute>
            <PageTransition>
              <AdminCourses />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scholarship"
        element={
          <ProtectedRoute>
            <PageTransition>
              <AdminScholarship />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/books"
        element={
          <ProtectedRoute>
            <PageTransition>
              <AdminBooks />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faculty"
        element={
          <ProtectedRoute>
            <PageTransition>
              <AdminFaculty />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faculty-programs"
        element={
          <ProtectedRoute>
            <PageTransition>
              <AdminFacultyPrograms />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pyq"
        element={
          <ProtectedRoute>
            <PageTransition>
              <AdminPYQ />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/syllabus"
        element={
          <ProtectedRoute>
            <PageTransition>
              <AdminSyllabus />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exam-date"
        element={
          <ProtectedRoute>
            <PageTransition>
              <AdminExamDate />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/answer-key"
        element={
          <ProtectedRoute>
            <PageTransition>
              <AdminAnswerKey />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/books"
        element={
          <PageTransition>
            <BooksHome />
          </PageTransition>
        }
      />
      <Route
        path="/books/:categoryId"
        element={
          <PageTransition>
            <BooksSubjects />
          </PageTransition>
        }
      />
      <Route
        path="/books/:categoryId/:subjectSlug"
        element={
          <PageTransition>
            <BooksStandards />
          </PageTransition>
        }
      />
      <Route
        path="/books/:categoryId/:subjectSlug/:standard"
        element={
          <PageTransition>
            <BooksGrid />
          </PageTransition>
        }
      />
      <Route
        path="/scholarship/register"
        element={
          <PageTransition>
            <ScholarshipRegister />
          </PageTransition>
        }
      />
      <Route
        path="/scholarship/portal"
        element={
          <PageTransition>
            <ScholarshipPortal />
          </PageTransition>
        }
      />
      <Route
        path="/scholarship/exam/:examId"
        element={
          <PageTransition>
            <ScholarshipExam />
          </PageTransition>
        }
      />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <GalleryProvider>
        <CourseProvider>
          <StudentAuthProvider>
            <ScholarshipProvider>
              <BooksProvider>
                <FacultyProvider>
                  <FacultyProgramProvider>
                    <PYQProvider>
                      <SyllabusProvider>
                        <AnswerKeyProvider>
                          <ExamDateProvider>
                            <FormModalProvider>
                              <Router>
                                <div className="App">
                                  <Navbar />
                                  <AnimatedRoutes />
                                  <LeadFormModal />
                                  <AIAssistant />
                                </div>
                              </Router>
                            </FormModalProvider>
                          </ExamDateProvider>
                        </AnswerKeyProvider>
                      </SyllabusProvider>
                    </PYQProvider>
                  </FacultyProgramProvider>
                </FacultyProvider>
              </BooksProvider>
            </ScholarshipProvider>
          </StudentAuthProvider>
        </CourseProvider>
      </GalleryProvider>
    </AuthProvider>
  );
}

export default App;