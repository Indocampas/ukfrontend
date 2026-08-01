// src/pages/Courses/NEET/index.jsx
// Landing page for the NEET category - shows its top-level
// sections (Classroom Courses, Online Courses, exam-info tools, etc.) via
// the shared course-hub UI.
import CategoryFeaturePage from "../shared/CategoryFeaturePage";

export default function NEETIndex() {
  return <CategoryFeaturePage categorySlug="neet" slugPath={[]} />;
}
