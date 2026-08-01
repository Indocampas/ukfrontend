// src/data/courseCatalogData.js
// Class-wise (6th–12th) course + fee data that powers the new top-level
// Courses navigation:
//   1. NEET & JEE Foundation (Individual)
//   2. NEET & JEE Foundation (Schools)
//   4. Foundation (NTSE / Olympiad)
// (Faculty Programs — category 3 — continues to use the existing,
// unchanged 13 Faculty Courses in src/pages/FacultyPrograms.)
//
// Fee rule (per the spec):
//   Classroom Courses -> Tuition Fee + Books Fee + Test Materials Fee = Total
//   Online Courses    -> Tuition Fee + Books Fee                      = Total
//   Online courses always carry a courseType of "Recorded" or "Live".

const CLASSES_6_TO_12 = ["6", "7", "8", "9", "10", "11", "12"];
const CLASSES_6_TO_10 = ["6", "7", "8", "9", "10"];

const sum = (...vals) => vals.reduce((a, b) => a + b, 0);

function buildClassroomCourses({
  classes,
  namePrefix,
  descPrefix,
  tuition,
  books,
  test = null,
}) {
  return classes.map((cls, i) => {
    const tuitionFee = tuition[i] ?? 0;
    const booksFee = books[i] ?? 0;
    const testMaterialsFee = test?.[i] ?? 0;

    return {
      id: `${namePrefix}-classroom-${cls}`
        .toLowerCase()
        .replace(/\s+/g, "-"),

      className: `Class ${cls}`,

      courseName: `${namePrefix} — Class ${cls}`,

      description: `${descPrefix} classroom coaching for Class ${cls} students, with regular in-centre tests and personal faculty attention.`,

      tuitionFee,
      booksFee,
      testMaterialsFee,

      totalFee: sum(
        tuitionFee,
        booksFee,
        testMaterialsFee
      ),
    };
  });
}

function buildOnlineCourses({ classes, namePrefix, descPrefix, recordedTuition, liveTuition, books }) {
  const recorded = classes.map((cls, i) => ({
    id: `${namePrefix}-online-recorded-${cls}`.toLowerCase().replace(/\s+/g, "-"),
    className: `Class ${cls}`,
    courseName: `${namePrefix} — Class ${cls}`,
    courseType: "Recorded",
    description: `${descPrefix} self-paced recorded video lectures for Class ${cls}, watch anytime on any device.`,
    tuitionFee: recordedTuition[i],
    booksFee: books[i],
    totalFee: sum(recordedTuition[i], books[i]),
  }));

  const live = classes.map((cls, i) => ({
    id: `${namePrefix}-online-live-${cls}`.toLowerCase().replace(/\s+/g, "-"),
    className: `Class ${cls}`,
    courseName: `${namePrefix} — Class ${cls}`,
    courseType: "Live",
    description: `${descPrefix} real-time interactive live classes for Class ${cls}, with live doubt-solving.`,
    tuitionFee: liveTuition[i],
    booksFee: books[i],
    totalFee: sum(liveTuition[i], books[i]),
  }));

  return [...recorded, ...live];
}

// ---------------------------------------------------------------------------
// 1. NEET & JEE Foundation (Individual)
// ---------------------------------------------------------------------------
export const NEET_JEE_INDIVIDUAL = {
  slug: "neet-jee-individual",
  title: "NEET & JEE Foundation (Individual)",
  tagline: "Direct-admission NEET & JEE foundation program for individual students, Class 6th to 12th",
  target: "Class 6th to 12th",
  color: "#4CAF50",
  // Course description shows only these fee category names (no per-category
  // amounts) - Online: Tuition Fee + Book Fee. Offline (Classroom): Tuition
  // Fee + Book Fee + Test Materials Fee. The combined Total Amount is still
  // shown separately.
  feeLabels: {
    tuition: "Tuition Fee",
    books: "Book Fee",
    test: "Test Materials Fee",
  },
  classroom: buildClassroomCourses({
    classes: CLASSES_6_TO_12,
    namePrefix: "NEET & JEE Foundation",
    descPrefix: "Individual-admission",
    tuition: [12000, 13000, 14000, 16000, 18000, 20000, 22000],
    books: [2000, 2500, 3000, 3000, 3000, 3500, 4000],
    test: [2000, 2500, 3000, 3000, 3000, 3500, 4000],
  }),
  online: buildOnlineCourses({
    classes: CLASSES_6_TO_12,
    namePrefix: "NEET & JEE Foundation",
    descPrefix: "Individual-admission",
    recordedTuition: [5000, 6000, 7000, 8000, 9000, 10000, 11000],
    liveTuition: [5000, 6000, 7000, 8000, 9000, 10000, 11000],
    books: [2200, 2400, 2600, 2800, 3000, 3200, 3400],
  }),
};

// ---------------------------------------------------------------------------
// 2. NEET & JEE Foundation (Schools) — School Tie-Up Program, Class 6th to
//    12th. Delivered as two modules:
//      Module 1 - Foundation Program  (early concept-building, lighter fee)
//      Module 2 - Integrated Program  (full NEET/JEE-integrated school
//                                       curriculum, comprehensive fee)
// ---------------------------------------------------------------------------
export const NEET_JEE_SCHOOLS = {
  slug: "neet-jee-schools",
  title: "NEET & JEE Foundation (Schools)",
  tagline: "School Tie-Up Program for Class 6th to 12th, delivered through partner schools",
  target: "Class 6th to 12th (School Tie-up)",
  color: "#e8b430",
  // Course description shows only these fee category names (no per-category
  // amounts) - Tuition Fee, Material Fee. The combined Total Amount is still
  // shown separately. (test: null hides the Test Materials line from the
  // simplified category list even though it's still included in the total.)
  feeLabels: {
    tuition: "Tuition Fee",
    books: "Material Fee",
    test: null,
  },
  modules: [
    {
      key: "foundation-program",
      label: "Module 1 – Foundation Program",
      description:
        "Early concept-building module that introduces NEET & JEE foundation concepts alongside the regular school curriculum.",
      classroom: buildClassroomCourses({
        classes: CLASSES_6_TO_12,
        namePrefix: "NEET & JEE Foundation Program",
        descPrefix: "School Tie-Up Module 1 (Foundation Program)",
        tuition: [6000, 7000, 8000, 9000, 10000, 11000, 12000],
        books: [4000, 5000, 6000, 7000, 8000, 9000, 10000],
      }),
      online: buildOnlineCourses({
        classes: CLASSES_6_TO_12,
        namePrefix: "NEET & JEE Foundation Program",
        descPrefix: "School Tie-Up Module 1 (Foundation Program)",
        recordedTuition: [5000, 5600, 6800, 8000, 9800, 12800, 14600],
        liveTuition: [6800, 7700, 9200, 11000, 13400, 17100, 19500],
        books: [4000,5000, 6000, 7000, 8000, 9000, 10000],
      }),
    },
    {
      key: "integrated-program",
      label: "Module 2 – Integrated Program",
      description:
        "Comprehensive, fully NEET & JEE-integrated program delivered within the school schedule, with deeper coaching hours and test coverage.",
      classroom: buildClassroomCourses({
        classes: CLASSES_6_TO_12,
        namePrefix: "NEET & JEE Integrated Program",
        descPrefix: "School Tie-Up Module 2 (Integrated Program)",
        tuition: [8000, 10000, 12000, 14000, 16000, 18000, 20000],
        books: [2500, 2500, 3000, 3000, 3500, 4000, 4500],

      }),
      online: buildOnlineCourses({
        classes: CLASSES_6_TO_12,
        namePrefix: "NEET & JEE Integrated Program",
        descPrefix: "School Tie-Up Module 2 (Integrated Program)",
        recordedTuition: [6400, 7200, 8800, 10400, 12800, 16000, 19200],
        liveTuition: [8800, 10000, 12000, 14400, 17600, 22400, 25600],
        books: [2500, 2500, 3000, 3000, 3500, 4000, 4500],
      }),
    },
  ],
};

// ---------------------------------------------------------------------------
// 4. Foundation (NTSE / Olympiad)
// ---------------------------------------------------------------------------
export const NTSE_OLYMPIAD = {
  slug: "ntse-olympiad",
  title: "Foundation (NTSE / Olympiad)",
  tagline: "Build a strong foundation for NTSE & Olympiads (IMO, NSO, IEO, NSTSE), Class 6th to 10th",
  target: "Class 6th to 10th",
  color: "#2196F3",
  classroom: buildClassroomCourses({
    classes: CLASSES_6_TO_10,
    namePrefix: "NTSE / Olympiad Foundation",
    descPrefix: "NTSE & Olympiad",
    tuition: [10000, 11000, 13000, 15000, 17000],
    books: [1800, 1800, 2200, 2200, 2500],
    test: [1200, 1200, 1500, 1500, 1800],
  }),
  online: buildOnlineCourses({
    classes: CLASSES_6_TO_10,
    namePrefix: "NTSE / Olympiad Foundation",
    descPrefix: "NTSE & Olympiad",
    recordedTuition: [5000, 5500, 6500, 7500, 8500],
    liveTuition: [7000, 7700, 9000, 10500, 12000],
    books: [800, 800, 1000, 1000, 1200],
  }),
};

export const COURSE_CATALOGS = [NEET_JEE_INDIVIDUAL, NEET_JEE_SCHOOLS, NTSE_OLYMPIAD];

export const getCatalogBySlug = (slug) => COURSE_CATALOGS.find((c) => c.slug === slug);
