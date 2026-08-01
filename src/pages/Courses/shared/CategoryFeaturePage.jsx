// src/pages/Courses/shared/CategoryFeaturePage.jsx
import { resolvePath } from "../../../data/courseTree";
import CourseExplorerView from "./CourseExplorerView";

export default function CategoryFeaturePage({ categorySlug, slugPath = [] }) {
  const trail = resolvePath([categorySlug, ...slugPath]);
  return <CourseExplorerView trail={trail} scrollKey={[categorySlug, ...slugPath].join("/")} />;
}
