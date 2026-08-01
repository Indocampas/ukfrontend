// src/data/leafDetail.js
// Generates full, presentable course-detail content for ANY leaf node in the
// tree purely from its breadcrumb trail - so ~150 granular pages (batches,
// modes, materials, etc.) stay consistent without being hand-written.

export const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
export const round100 = (n) => Math.round(n / 100) * 100;

export const PAYMENT_OPTIONS = [
  { key: "onetime", label: "One-Time Payment", icon: "FaRupeeSign", note: "Pay the full fee upfront and get an additional 5% early-payment discount." },
  { key: "emi", label: "EMI Plans", icon: "FiRepeat", note: "Split your fee into easy no-cost EMIs via partner banks and cards." },
  { key: "monthly", label: "Monthly Installments", icon: "FiCalendar", note: "Pay month-by-month directly to the academy, no bank paperwork required." },
  { key: "upi", label: "UPI", icon: "FiSmartphone", note: "Instant payment via Google Pay, PhonePe, Paytm or any UPI app." },
  { key: "card", label: "Credit / Debit Cards", icon: "FiCreditCard", note: "All major Visa, Mastercard and RuPay cards accepted." },
  { key: "netbanking", label: "Net Banking", icon: "FiHome", note: "Direct transfer from your bank account with instant confirmation." },
];

export const PRICE_RANGES = {
  neet: [110000, 165000],
  jee: [120000, 170000],
  foundation: [55000, 95000],
};

export function hashInRange(key, [min, max]) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return round100(min + (h % (max - min)));
}

function buildPlans(basePrice) {
  return {
    basic: {
      key: "basic",
      label: "Basic",
      price: round100(basePrice * 0.45),
      tagline: "Self-paced essentials",
      includes: ["Study Materials", "NCERT Books / Support", "Previous Year Questions (PYQs)"],
      highlighted: false,
    },
    intermediate: {
      key: "intermediate",
      label: "Intermediate",
      price: round100(basePrice * 0.72),
      tagline: "Most popular — guided learning",
      includes: [
        "Study Materials",
        "NCERT Books / Support",
        "Previous Year Questions (PYQs)",
        "Recorded Video Lectures",
        "Doubt-Clearing Sessions",
      ],
      highlighted: true,
    },
    advanced: {
      key: "advanced",
      label: "Advanced",
      price: basePrice,
      tagline: "Complete classroom + test-series experience",
      includes: [
        "Study Materials",
        "NCERT Books / Support",
        "Previous Year Questions (PYQs)",
        "Live Classes",
        "Recorded Classes",
        "Online Test Series",
        "Offline Test Series",
        "Doubt-Clearing Sessions",
      ],
      highlighted: false,
    },
  };
}

export const FACULTY_BY_CATEGORY = {
  neet: ["Dr. Meena – Biology", "Prof. Riya – Chemistry", "Dr. Dhiya – Physics"],
  jee: ["Dr. Rajesh Kumar – Physics", "Prof. Suresh Sharma – Chemistry", "Dr. Anita – Mathematics"],
  foundation: ["Prof. Amit – Mathematics", "Dr. Sneha – Science", "Mr. Vikram – Mental Ability"],
};

const SYLLABUS_BY_CATEGORY = {
  neet: ["Biology: Zoology, Botany, Human Physiology & Genetics", "Chemistry: Physical, Organic & Inorganic Chemistry", "Physics: Mechanics, Thermodynamics & Optics", "NCERT line-by-line coverage with diagram-based revision"],
  jee: ["Physics: Mechanics, Electrodynamics, Optics & Modern Physics", "Chemistry: Physical, Organic & Inorganic Chemistry", "Mathematics: Algebra, Calculus, Coordinate Geometry & Trigonometry"],
  foundation: ["Mathematics: Number Systems, Algebra & Geometry", "Science: Physics, Chemistry & Biology basics", "Mental Ability: Logical Reasoning & Analytical Skills"],
};

const ELIGIBILITY_BY_CATEGORY = {
  neet: "Students who have passed / are appearing for Class 12 with Physics, Chemistry, Biology and English, as per NTA's NEET eligibility guidelines.",
  jee: "Students who have passed / are appearing for Class 10 or Class 12 with Physics, Chemistry & Mathematics, meeting NTA / JEE guidelines.",
  foundation: "Open to students of Class 6th to 10th; a placement test helps assign the right batch level.",
};

const MODE_HINT_FEATURES = {
  "live classes": [
    { icon: "FiVideo", label: "Real-time interactive sessions with expert faculty" },
    { icon: "FiMessageCircle", label: "Live doubt-solving during every class" },
    { icon: "FiPlayCircle", label: "Auto-recorded backup of each live session" },
    { icon: "FiCheckCircle", label: "Attendance & participation tracking" },
  ],
  "recorded classes": [
    { icon: "FiPlayCircle", label: "HD recorded lectures, chapter-wise" },
    { icon: "FiSmartphone", label: "Watch anytime, anywhere, on any device" },
    { icon: "FiActivity", label: "Adjustable playback speed" },
    { icon: "FiDownload", label: "Downloadable class notes & PDFs" },
  ],
  "test series": [
    { icon: "FiEdit3", label: "Chapter-wise & full-syllabus mock tests" },
    { icon: "FiTrendingUp", label: "Instant AI-based performance analysis" },
    { icon: "FiAward", label: "All-India ranking after every test" },
    { icon: "FiVideo", label: "Detailed video solutions" },
  ],
  "study materials": [
    { icon: "FiBookOpen", label: "Modular printed books, topic-wise" },
    { icon: "FiFileText", label: "NCERT-aligned theory & notes" },
    { icon: "FiClipboard", label: "Practice sheets with PYQs" },
    { icon: "FiMapPin", label: "Doorstep delivery, pan-India" },
  ],
  "classroom courses": [
    { icon: "FiUsers", label: "Face-to-face classes at the UK Academy centre" },
    { icon: "FiStar", label: "Small batch sizes for personal attention" },
    { icon: "FiEdit3", label: "Regular in-class tests & feedback" },
    { icon: "FiBookOpen", label: "Access to library and practice labs" },
  ],
  default: [
    { icon: "FiUsers", label: "Expert faculty guidance" },
    { icon: "FiLayers", label: "Structured, exam-aligned curriculum" },
    { icon: "FiTrendingUp", label: "Regular tests & performance tracking" },
    { icon: "FiBookOpen", label: "Complete study material included" },
  ],
};

function pickFeatures(title) {
  const key = title.toLowerCase();
  for (const k of Object.keys(MODE_HINT_FEATURES)) {
    if (k !== "default" && key.includes(k.split(" ")[0])) return MODE_HINT_FEATURES[k];
  }
  return MODE_HINT_FEATURES.default;
}

function buildCourseInfo({ durationLabel, schedule, faculty, ncert, certificate, mockTests }) {
  return [
    { label: "Course Duration", value: durationLabel, icon: "FiClock" },
    { label: "Batch Start Date", value: "New batch begins 15th August 2026", icon: "FiCalendar" },
    { label: "Class Schedule", value: schedule, icon: "FiClock" },
    { label: "Faculty Details", value: faculty.join(" • "), icon: "FiUsers" },
    { label: "Study Materials Included", value: "Yes — modular printed books + digital notes", icon: "FiBookOpen" },
    { label: "NCERT Coverage", value: ncert, icon: "FiCheckCircle" },
    { label: "Previous Year Questions (PYQs)", value: "Last 15 years, topic-wise & year-wise, with solutions", icon: "FiFileText" },
    { label: "Mock Tests", value: mockTests, icon: "FiEdit3" },
    { label: "Assignments", value: "Weekly assignments with faculty-reviewed feedback", icon: "FiClipboard" },
    { label: "Performance Analysis", value: "AI-assisted analytics after every test with weak-area mapping", icon: "FiTrendingUp" },
    { label: "Progress Tracking", value: "Personal dashboard tracking attendance, tests and assignment scores", icon: "FiActivity" },
    { label: "Certificate", value: certificate, icon: "FiAward" },
  ];
}

/**
 * trail: array of nodes from the root category down to the resolved leaf node.
 */
export function buildLeafDetail(trail) {
  const category = trail[0];
  const leafNode = trail[trail.length - 1];
  const pathKey = trail.map((n) => n.slug).join("/");
  const isDropperOrCrash = /repeater|crash|dropper/i.test(pathKey);
  const isTwoYear = /2 year/i.test(pathKey);

  const basePrice = hashInRange(pathKey, PRICE_RANGES[category.slug] || [50000, 100000]);
  const plans = buildPlans(basePrice);
  const durationLabel = isTwoYear ? "2 Years" : isDropperOrCrash ? "6–12 Months (Intensive)" : "1 Academic Year";
  const durationYears = isTwoYear ? 2 : 1;

  const breadcrumbLabel = trail.slice(1).map((n) => n.title).join(" / ") || category.title;
  const title = `${category.title}${trail.length > 1 ? " — " + leafNode.title : ""}`;
  const subtitle = trail.length > 2 ? trail.slice(1, -1).map((n) => n.title).join(" / ") : category.title;

  const overview = `The ${leafNode.title} program under ${category.title}${
    trail.length > 2 ? ` (${trail.slice(1, -1).map((n) => n.title).join(" → ")})` : ""
  } is designed to give students structured, faculty-led preparation with regular practice, complete study material and continuous performance tracking.`;

  return {
    key: pathKey,
    trail,
    category,
    color: category.color,
    icon: category.icon,
    breadcrumbLabel,
    title,
    subtitle,
    overview,
    eligibility: ELIGIBILITY_BY_CATEGORY[category.slug],
    syllabus: SYLLABUS_BY_CATEGORY[category.slug],
    features: pickFeatures(leafNode.title),
    faqs: [
      { q: `Who should join ${leafNode.title}?`, a: `Students preparing for ${category.title} who want structured, faculty-led coaching in the ${leafNode.title} format.` },
      { q: "Can I switch to a different mode or batch later?", a: "Yes, you can upgrade or switch batches at the start of any term, subject to seat availability." },
      { q: "Is there a scholarship test?", a: "Yes, all students can appear for our Scholarship Test to avail fee concessions based on their score." },
      { q: "What if I miss a class?", a: "Every live class is auto-recorded and available in your dashboard within a few hours." },
    ],
    basePrice,
    durationLabel,
    durationYears,
    showRefundPolicy: durationYears >= 2,
    plans,
    startingPrice: plans.basic.price,
    target: category.target,
    courseInfo: buildCourseInfo({
      durationLabel,
      schedule: "Mon–Fri: 4:00 PM – 7:00 PM | Sat: 9:00 AM – 1:00 PM",
      faculty: FACULTY_BY_CATEGORY[category.slug],
      ncert: "Full NCERT coverage with additional exam-level enrichment content",
      certificate: "Merit / completion certificate awarded on successful course completion",
      mockTests: "Regular chapter tests + full-syllabus mock tests through the course",
    }),
    paymentOptions: PAYMENT_OPTIONS,
  };
}

export function buildInfoDetail(trail) {
  const category = trail[0];
  const leafNode = trail[trail.length - 1];
  return {
    key: trail.map((n) => n.slug).join("/"),
    trail,
    category,
    color: category.color,
    icon: category.icon,
    breadcrumbLabel: trail.slice(1).map((n) => n.title).join(" / ") || category.title,
    title: leafNode.title,
    subtitle: category.title,
  };
}
