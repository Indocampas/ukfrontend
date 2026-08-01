// src/pages/Courses/JEE/Eligibility.jsx
import { useParams } from "react-router-dom";
import CategoryFeaturePage from "../shared/CategoryFeaturePage";

// `branch` can be passed in directly (e.g. <Eligibility branch="jee-advanced" />)
// or comes from the :branch route param when used as a route element -
// falling back to "jee-main" when neither is given.
export default function Eligibility({ branch }) {
  const params = useParams();
  const resolvedBranch = branch || params.branch || "jee-main";
  return <CategoryFeaturePage categorySlug="jee" slugPath={[resolvedBranch, "eligibility"]} />;
}
