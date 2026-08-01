// src/pages/Courses/Foundation/Enrollment.jsx
import EnrollmentPrompt from "../shared/EnrollmentPrompt";
import { FOUNDATION_TREE } from "./data";

export default function Enrollment() {
  return <EnrollmentPrompt category={FOUNDATION_TREE} />;
}
