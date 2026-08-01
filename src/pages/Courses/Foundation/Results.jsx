// src/pages/Courses/Foundation/Results.jsx
import { useParams } from "react-router-dom";
import CategoryFeaturePage from "../shared/CategoryFeaturePage";

// `branch` can be passed in directly (e.g. <Results branch="jee-advanced" />)
// or comes from the :branch route param when used as a route element -
// falling back to "ntse" when neither is given.
export default function Results({ branch }) {
  const params = useParams();
  const resolvedBranch = branch || params.branch || "ntse";
  return <CategoryFeaturePage categorySlug="foundation" slugPath={[resolvedBranch, "results"]} />;
}
