// src/pages/Courses/JEE/index.jsx
// Landing page for the JEE category - shows its top-level
// sections (Classroom Courses, Online Courses, exam-info tools, etc.) via
// the shared course-hub UI.
import CategoryFeaturePage from "../shared/CategoryFeaturePage";

export default function JEEIndex() {
  return <CategoryFeaturePage categorySlug="jee" slugPath={[]} />;
}
