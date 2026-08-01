import { PRICE_RANGES, hashInRange, round100, FACULTY_BY_CATEGORY } from "./leafDetail";

const CATEGORY_KEY = (categorySlug) => (categorySlug === "jee" ? "jee" : categorySlug === "neet" ? "neet" : categorySlug);

const PLAN_TEMPLATES = [
  {
    key: "nurture",
    name: "Nurture",
    tagline: "Class X → XI · Early Starter Track",
    duration: "2 Years",
    priceFactor: 0.65,
    includes: ["Study Materials", "Test Series", "Doubt-Clearing Sessions", "Foundation Building"],
  },
  {
    key: "enthusiast",
    name: "Enthusiast",
    tagline: "Class XI → XII · Core Program",
    duration: "1–2 Years",
    priceFactor: 0.85,
    includes: ["Study Materials", "Test Series", "Doubt-Clearing Sessions", "Regular Mock Tests"],
  },
  {
    key: "crash",
    name: "Crash Course",
    tagline: "4–6 Months · Intensive Revision",
    duration: "4–6 Months",
    priceFactor: 0.55,
    includes: ["Study Materials", "Test Series", "Doubt-Clearing Sessions", "Rapid Revision Modules"],
  },
  {
    key: "leaders",
    name: "Leaders",
    tagline: "Droppers / Repeaters",
    duration: "1 Year",
    priceFactor: 1,
    includes: ["Study Materials", "Test Series", "Doubt-Clearing Sessions", "Personal Mentorship"],
  },
];

export function buildCoursePlans(category, center) {
  const priceKey = CATEGORY_KEY(category.slug);
  const [min, max] = PRICE_RANGES[priceKey] || PRICE_RANGES["foundation"];

  return PLAN_TEMPLATES.map((tpl) => {
    const seedKey = `${category.slug}/${center?.slug || "any"}/${tpl.key}`;
    const basePrice = round100(hashInRange(seedKey, [min, max]) * tpl.priceFactor);
    return {
      ...tpl,
      target: category.target,
      mode: "Classroom",
      fee: basePrice,
      faculty: FACULTY_BY_CATEGORY[priceKey] || FACULTY_BY_CATEGORY["foundation"],
      outcomes: [
        `Structured, faculty-led preparation for ${category.title}`,
        "Regular tests with detailed performance analysis",
        "Small batch sizes for personal attention",
      ],
    };
  });
}
