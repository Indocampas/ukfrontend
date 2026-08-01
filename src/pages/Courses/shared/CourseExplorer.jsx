// src/pages/Courses/shared/CourseExplorer.jsx
// Generic catch-all route: /courses/* -> resolves the splat into a trail via
// the course tree and renders it with CourseExplorerView. This is what
// backs every URL under /courses/, including the ones the per-category
// pages (e.g. src/pages/Courses/NEET/ClassroomCourses.jsx) link to.
import { useParams } from "react-router-dom";
import { resolvePath } from "../../../data/courseTree";
import CourseExplorerView from "./CourseExplorerView";

export default function CourseExplorer() {
  const params = useParams();
  const splat = params["*"] || "";
  const pathSlugs = splat.split("/").filter(Boolean);
  const trail = resolvePath(pathSlugs);

  return <CourseExplorerView trail={trail} scrollKey={splat} />;
}
