// src/pages/Courses/Foundation/Eligibility.jsx
import { useParams } from "react-router-dom";
import CategoryFeaturePage from "../shared/CategoryFeaturePage";

// `branch` can be passed in directly (e.g. <Eligibility branch="jee-advanced" />)
// or comes from the :branch route param when used as a route element -
// falling back to "ntse" when neither is given.
export default function Eligibility({ branch }) {
  const params = useParams();
  const resolvedBranch = branch || params.branch || "ntse";
  return <CategoryFeaturePage categorySlug="foundation" slugPath={[resolvedBranch, "eligibility"]} />;
}
