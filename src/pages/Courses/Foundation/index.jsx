// src/pages/Courses/Foundation/index.jsx
// Landing page for the Foundation category - shows its top-level
// sections (Classroom Courses, Online Courses, exam-info tools, etc.) via
// the shared course-hub UI.
import CategoryFeaturePage from "../shared/CategoryFeaturePage";

export default function FoundationIndex() {
  return <CategoryFeaturePage categorySlug="foundation" slugPath={[]} />;
}
