// src/pages/Courses/NEET/Enrollment.jsx
import EnrollmentPrompt from "../shared/EnrollmentPrompt";
import { NEET_TREE } from "./data";

export default function Enrollment() {
  return <EnrollmentPrompt category={NEET_TREE} />;
}
