// src/pages/Courses/Foundation/StudyMaterials.jsx
import { useParams } from "react-router-dom";
import CategoryFeaturePage from "../shared/CategoryFeaturePage";

// `branch` can be passed in directly (e.g. <StudyMaterials branch="jee-advanced" />)
// or comes from the :branch route param when used as a route element -
// falling back to "ntse" when neither is given.
export default function StudyMaterials({ branch }) {
  const params = useParams();
  const resolvedBranch = branch || params.branch || "ntse";
  return <CategoryFeaturePage categorySlug="foundation" slugPath={[resolvedBranch, "study-materials"]} />;
}
