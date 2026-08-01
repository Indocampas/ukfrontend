// src/pages/Courses/JEE/Enrollment.jsx
import EnrollmentPrompt from "../shared/EnrollmentPrompt";
import { JEE_TREE } from "./data";

export default function Enrollment() {
  return <EnrollmentPrompt category={JEE_TREE} />;
}
