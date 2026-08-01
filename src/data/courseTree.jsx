import { NEET_TREE } from "../pages/Courses/NEET/data.jsx";
import { JEE_TREE } from "../pages/Courses/JEE/data.jsx";
import { FOUNDATION_TREE } from "../pages/Courses/Foundation/data.jsx";

export { slugify } from "./treeBuilders";

export const CATEGORIES = [NEET_TREE, JEE_TREE, FOUNDATION_TREE];


export function resolvePath(pathSlugs) {
  if (!pathSlugs.length) return null;
  const [catSlug, ...rest] = pathSlugs;
  const category = CATEGORIES.find((c) => c.slug === catSlug);
  if (!category) return null;

  const trail = [category];
  let current = category;
  for (const slug of rest) {
    if (!current.children) return null;
    const next = current.children.find((c) => c.slug === slug);
    if (!next) return null;
    trail.push(next);
    current = next;
  }
  return trail;
}

export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
