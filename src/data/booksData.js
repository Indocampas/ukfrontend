// src/data/booksData.js
// Static configuration for the Books section: categories, subjects per
// category, standards/classes per category, icon/color mapping, a cover
// image generator (SVG data-URI so the site never depends on external
// image hosts), and a small seed catalog so the grids aren't empty before
// the admin adds real books.

export const BOOK_CATEGORIES = [
  {
    id: "ncert",
    name: "NCERT Books",
    tagline: "Official NCERT textbooks for Class 6–12",
    icon: "FiBookOpen",
    gradient: ["#0a1330", "#233069"],
  },
  {
    id: "jee",
    name: "JEE Books",
    tagline: "Physics, Chemistry & Maths for JEE Main/Advanced",
    icon: "FiTarget",
    gradient: ["#7a2e0e", "#c2571a"],
  },
  {
    id: "neet",
    name: "NEET Books",
    tagline: "Biology, Physics & Chemistry for NEET aspirants",
    icon: "FiActivity",
    gradient: ["#0f5132", "#1a8f5a"],
  },
  {
    id: "olympiad",
    name: "Olympiad Books",
    tagline: "Prep material for Maths, Science & English Olympiads",
    icon: "FiAward",
    gradient: ["#5b2a86", "#9146c9"],
  },
  {
    id: "nstse",
    name: "NSTSE Books",
    tagline: "National Level Science Talent Search Exam guides",
    icon: "FiStar",
    gradient: ["#8a4b06", "#e8b430"],
  },
];

export const CATEGORY_MAP = BOOK_CATEGORIES.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

// Subjects offered under each category (student-facing subject grid).
export const CATEGORY_SUBJECTS = {
  ncert: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
  jee: ["Physics", "Chemistry", "Mathematics"],
  neet: ["Physics", "Chemistry", "Biology"],
  olympiad: ["Mathematics", "Science", "English", "Mental Ability"],
  nstse: ["Mathematics", "Science"],
};

// Standards/classes available per category (drives the class grid + the
// admin "Standard/Class" dropdown options for that category).
export const CATEGORY_STANDARDS = {
  ncert: [6, 7, 8, 9, 10, 11, 12],
  jee: [11, 12],
  neet: [11, 12],
  olympiad: [6, 7, 8, 9, 10],
  nstse: [6, 7, 8, 9, 10],
};

export const SUBJECT_ICONS = {
  Mathematics: "FiPieChart",
  Physics: "FiZap",
  Chemistry: "FiDroplet",
  Biology: "FiFeather",
  English: "FiBookOpen",
  Science: "FiCompass",
  "Mental Ability": "FiCpu",
};

export const SUBJECT_COLORS = {
  Mathematics: "#2563eb",
  Physics: "#e8b430",
  Chemistry: "#16a34a",
  Biology: "#dc2626",
  English: "#7c3aed",
  Science: "#0891b2",
  "Mental Ability": "#c2410c",
};

export const BOOK_TYPES = ["Printed Book", "eBook (PDF)", "Printed + eBook"];
export const ACTION_TYPES = ["Buy Now", "Download", "Buy Now + Download"];

export function slugifySubject(subject) {
  return subject.toLowerCase().replace(/\s+/g, "-");
}

export function unslugifySubject(slug, categoryId) {
  const subjects = CATEGORY_SUBJECTS[categoryId] || [];
  return subjects.find((s) => slugifySubject(s) === slug) || null;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Deterministic-ish pastel-on-dark gradient book cover as an SVG data URI.
// Keeps every book visually "covered" without depending on any external
// image host or copyrighted artwork; admins can replace it any time by
// uploading a real cover in the Admin dashboard.
export function generateCoverImage(title = "", subject = "", categoryId = "ncert") {
  const category = CATEGORY_MAP[categoryId];
  const [c1, c2] = category?.gradient || ["#0a1330", "#233069"];
  const accent = SUBJECT_COLORS[subject] || "#e8b430";
  const safeTitle = String(title).slice(0, 40);
  const words = safeTitle.split(" ");
  const lines = [];
  let current = "";
  words.forEach((w) => {
    if ((current + " " + w).trim().length > 16) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
  });
  if (current) lines.push(current);
  const shownLines = lines.slice(0, 4);

  const textSvg = shownLines
    .map(
      (line, i) =>
        `<text x="50%" y="${52 + i * 20}%" text-anchor="middle" font-family="Roboto, Arial, sans-serif" font-size="15" font-weight="700" fill="#ffffff">${escapeXml(
          line
        )}</text>`
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="300" height="420" fill="url(#g)"/>
    <rect x="0" y="0" width="300" height="10" fill="${accent}"/>
    <rect x="20" y="30" width="260" height="2" fill="${accent}" opacity="0.6"/>
    <text x="50%" y="16%" text-anchor="middle" font-family="Roboto, Arial, sans-serif" font-size="12" letter-spacing="2" fill="${accent}" font-weight="700">${escapeXml(
    (subject || "").toUpperCase()
  )}</text>
    ${textSvg}
    <rect x="20" y="370" width="260" height="2" fill="${accent}" opacity="0.6"/>
    <text x="50%" y="94%" text-anchor="middle" font-family="Roboto, Arial, sans-serif" font-size="11" fill="#ffffffaa">UK ACADEMY</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function seedBook(partial) {
  return {
    author: "",
    publisher: "",
    edition: "",
    price: "",
    description: "",
    bookType: "Printed Book",
    actionType: "Buy Now",
    buyLink: "",
    downloadUrl: "",
    isPublished: true,
    coverImage: null,
    ...partial,
  };
}

// A modest starter catalog so the grid isn't empty on first load. The
// admin can edit/delete/add to this freely from /admin/books.
export const DEFAULT_BOOKS = [
  seedBook({
    id: "seed_ncert_math_10",
    title: "NCERT Mathematics",
    category: "ncert",
    subject: "Mathematics",
    standard: 10,
    author: "NCERT",
    publisher: "NCERT Publications",
    edition: "2025-26",
    price: "₹95",
    description: "Official NCERT textbook covering the full Class 10 Mathematics syllabus.",
    bookType: "Printed + eBook",
    actionType: "Buy Now + Download",
  }),
  seedBook({
    id: "seed_ncert_phy_12",
    title: "NCERT Physics Part I",
    category: "ncert",
    subject: "Physics",
    standard: 12,
    author: "NCERT",
    publisher: "NCERT Publications",
    edition: "2025-26",
    price: "₹120",
    description: "Class 12 Physics textbook, Part I — Electrostatics to Current Electricity.",
  }),
  seedBook({
    id: "seed_jee_phy_11",
    title: "JEE Physics Foundation",
    category: "jee",
    subject: "Physics",
    standard: 11,
    author: "H.C. Verma",
    publisher: "UK Academy Study Material",
    edition: "2025",
    price: "₹350",
    description: "Concept-first Physics book aligned with the JEE Main & Advanced syllabus.",
    bookType: "eBook (PDF)",
    actionType: "Download",
  }),
  seedBook({
    id: "seed_jee_math_12",
    title: "JEE Mathematics Mastery",
    category: "jee",
    subject: "Mathematics",
    standard: 12,
    author: "UK Academy Faculty",
    publisher: "UK Academy Study Material",
    edition: "2025",
    price: "₹380",
    description: "Advanced problem sets with previous years' JEE questions, chapter-wise.",
  }),
  seedBook({
    id: "seed_neet_bio_11",
    title: "NEET Biology Complete",
    category: "neet",
    subject: "Biology",
    standard: 11,
    author: "UK Academy Faculty",
    publisher: "UK Academy Study Material",
    edition: "2025",
    price: "₹420",
    description: "Comprehensive Biology guide covering NCERT-aligned NEET topics with diagrams.",
    bookType: "Printed + eBook",
    actionType: "Buy Now + Download",
  }),
  seedBook({
    id: "seed_neet_chem_12",
    title: "NEET Chemistry Quick Revision",
    category: "neet",
    subject: "Chemistry",
    standard: 12,
    author: "UK Academy Faculty",
    publisher: "UK Academy Study Material",
    edition: "2025",
    price: "₹300",
    description: "Fast-track revision notes and MCQs for Class 12 Chemistry, NEET pattern.",
  }),
  seedBook({
    id: "seed_oly_math_8",
    title: "Maths Olympiad Champion",
    category: "olympiad",
    subject: "Mathematics",
    standard: 8,
    author: "UK Academy Faculty",
    publisher: "UK Academy Study Material",
    edition: "2025",
    price: "₹250",
    description: "Olympiad-style problems and puzzles to sharpen mathematical reasoning.",
    bookType: "eBook (PDF)",
    actionType: "Download",
  }),
  seedBook({
    id: "seed_nstse_sci_7",
    title: "NSTSE Science Practice Book",
    category: "nstse",
    subject: "Science",
    standard: 7,
    author: "UK Academy Faculty",
    publisher: "UK Academy Study Material",
    edition: "2025",
    price: "₹220",
    description: "Practice questions modeled on the NSTSE exam pattern for Class 7 Science.",
  }),
];
