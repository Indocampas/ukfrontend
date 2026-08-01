import { useState, useEffect, useRef } from "react";
import {
  FiChevronRight,
  FiFileText,
  FiEdit,
  FiHeadphones,
  FiUsers,
  FiActivity,
  FiAward,
  FiAlertCircle,
  FiLoader,
  FiChevronLeft,
  FiClock,
  FiTarget,
  FiBookOpen,
  FiCheckCircle,
} from "react-icons/fi";
import {
  FaUniversity,
  FaStethoscope,
  FaWhatsapp,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaHeart,
  FaStar,
  FaFlask,
  FaBook,
  FaRocket,
  FaTrophy,
} from "react-icons/fa";

import { useFormModal } from "../../context/FormModalContext";
import { downloadBrochure } from "../../utils/downloadBrochure";

import {
  CLASS_OPTIONS,
  COURSE_OPTIONS,
  UK_ACADEMY_EMAIL,
  UK_ACADEMY_WHATSAPP_NUMBER,
  UK_ACADEMY_WHATSAPP_DEFAULT_MESSAGE,
} from "../../config/siteConfig";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination, Keyboard } from "swiper/modules";

// Background images (unique per slide)
import studentsImg1 from "../../assets/images/Student1.png";
import studentsImg2 from "../../assets/images/Student2.png";
import studentsImg3 from "../../assets/images/Student3.png";
import studentsImg4 from "../../assets/images/Student4.png";
import studentsImg5 from "../../assets/images/student5.jpeg";
import studentsImg6 from "../../assets/images/student6.jpeg";
// If you have more images, add them here; we'll cycle through these
const SLIDE_BACKGROUNDS = [studentsImg1, studentsImg2, studentsImg3, studentsImg4,studentsImg5, studentsImg6];

import "./Hero.css";

// =========================================================
// STATS
// =========================================================
const STATS = [
  { icon: <FiUsers />, value: 2000, label: "Students Trained", suffix: "+" },
  { icon: <FiActivity />, value: 95, label: "Success Rate", suffix: "%" },
  { icon: <FaStethoscope />, value: 150, label: "Medical Seats", suffix: "+" },
  { icon: <FaUniversity />, value: 120, label: "IIT/NIT Selections", suffix: "+" },
];

// =========================================================
// WHATSAPP
// =========================================================
const WHATSAPP_LINK = `https://wa.me/${UK_ACADEMY_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  UK_ACADEMY_WHATSAPP_DEFAULT_MESSAGE
)}`;

// =========================================================
// EMPTY FORM
// =========================================================
const EMPTY_ENQUIRY = {
  name: "",
  mobile: "",
  className: "",
  course: "",
};

// =========================================================
// VALIDATION
// =========================================================
const MOBILE_REGEX = /^[6-9]\d{9}$/;

// =========================================================
// FEATURES DATA
// =========================================================
const FEATURES = [
  {
    icon: <FaChalkboardTeacher />,
    title: "Expert Faculty",
    desc: "Learn from IIT/NIT alumni with years of teaching experience.",
  },
  {
    icon: <FaStar />,
    title: "Proven Results",
    desc: "95% success rate with 150+ medical seats and 120+ IIT/NIT selections.",
  },
  {
    icon: <FaHeart />,
    title: "Personalized Care",
    desc: "Individual mentoring, doubt sessions, and performance tracking.",
  },
  {
    icon: <FaUserGraduate />,
    title: "Best In Class",
    desc: "Comprehensive study material, mock tests, and online support.",
  },
];

// =========================================================
// COURSE CATEGORIES – SLUGS FIXED ✅
// =========================================================
const COURSE_CATEGORIES = [
  {
    slug: "neet",
    title: "NEET",
    badge: "NEET ",
    headline: "Crack NEET",
    subHeadline: "Achieve Your Dream",
    description:
      "Comprehensive NEET preparation for Class 11, Class 12 & Repeaters, with Classroom Courses at our Hosur campus and full Online Courses.",
    icon: <FaStethoscope />,
    subtitle: "Medical Entrance",
    audience: "Class 11 ,12 & Droppers ",
    shortDesc:
      "Comprehensive coaching for medical entrance with live classes, mock tests, and doubt support.",
    features: ["Live Classes", "Mock Tests", "Doubt Support", "Study Materials"],
    duration: "2 Years",
    level: "Advanced",
  },
  {
    slug: "jee",
    title: "JEE",
    badge: "JEE ",
    headline: "Crack JEE",
    subHeadline: "Engineer Your Future",
    description:
      "Complete JEE Main & Advanced preparation for Class 11, Class 12 & Repeaters, with Classroom Courses at our Hosur campus and full Online Courses.",
    icon: <FaFlask />,
    subtitle: "Engineering Entrance",
    audience: "Class 11 , 12 & Droppers",
    shortDesc:
      "Focused training for JEE Main & Advanced with problem-solving sessions.",
    features: ["Live Classes", "Problem Solving", "Doubt Support", "Study Materials"],
    duration: "2 Years",
    level: "Advanced",
  },
  {
    slug: "faculty-program",
    title: "Faculty Programs (Faculties)",
    badge: "Faculty Program",
    headline: "Build Your Teaching Career",
    subHeadline: "Empower Educators",
    description:
      "Our professional Faculty Courses — certification and training programs for teachers and aspiring educators.",
    icon: <FaChalkboardTeacher />,
    subtitle: "Teacher Training",
    audience: "Graduates & Postgraduates",
    shortDesc:
      "Develop teaching skills, subject mastery, and classroom management techniques.",
    features: ["Subject Mastery", "Teaching Methodology", "Mock Teaching", "Feedback"],
    duration: "3 Months",
    level: "Professional",
  },
  {
    slug: "foundation-individual",   // ✅ FIXED
    title: "NEET & JEE Foundation (Individual)",
    badge: "Foundation",
    headline: "Build Strong Basics",
    subHeadline: "Start Early, Stay Ahead",
    description:
      "Direct-admission NEET & JEE foundation program for individual students, Class 6th to 12th, with Classroom and Online (Recorded / Live) options.",
    icon: <FaBook />,
    subtitle: "Concept Building",
    audience: "Class 6 to 12",
    shortDesc:
      "Strengthen fundamentals in Maths & Science for long-term success.",
    features: ["Concept Clarity", "Practice Sessions", "Periodic Tests", "Parent-Teacher Meet"],
    duration: "3 Years",
    level: "Beginner",
  },
  {
    slug: "foundation-school",
    title: "NEET & JEE Foundation (Schools)",
    badge: "Foundation",
    headline: "Build Strong Basics Early",
    subHeadline: "Conceptual Clarity from Class 6–12",
    description:
      "School Tie-Up Program for Class 6th to 12th, delivered in two modules: Module 1 – Foundation Program and Module 2 – Integrated Program.",
    icon: <FaBook />,
    subtitle: "School Integrated Program",
    audience: "Class 6 to 12",
    shortDesc:
      "Strengthen fundamentals in Science & Maths with a syllabus aligned to school boards and competitive exams.",
    features: [
      "Concept Clarity",
      "Practice Sessions",
      "Periodic Tests",
      "Parent‑Teacher Meets",
      "Doubt Resolution",
    ],
    duration: "Up to 7 Years (Class 6–12)",
    level: "Beginner to Intermediate",
  },
  
];

// =========================================================
// HERO COMPONENT
// =========================================================
import { useNavigate } from "react-router-dom"; // ✅ ADDED

export default function Hero({ scrollToSection }) {
  const navigate = useNavigate(); // ✅ ADDED
  const { openForm } = useFormModal();

  const [form, setForm] = useState(EMPTY_ENQUIRY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState(STATS.map(() => 0));

  const heroRef = useRef(null);

  // ✅ Route mapping for VIEW COURSE button
  const getCourseRoute = (slug) => {
    switch (slug) {
      case 'faculty-program':
        return '/faculty-programs';               // Goes to the Faculty Programs list
      case 'foundation-individual':
        return '/courses/neet-jee-individual';   // Existing route
      case 'foundation-school':
        return '/courses/neet-jee-schools';      // Existing route
      default:
        return `/courses/${slug}`;                // neet → /courses/neet, jee → /courses/jee
    }
  };

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Main visibility
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Count up animation
  useEffect(() => {
    if (!isVisible) return;
    const duration = 2500;
    const startTime = performance.now();

    const animateCounts = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounts(STATS.map((stat) => Math.round(stat.value * eased)));

      if (progress < 1) {
        requestAnimationFrame(animateCounts);
      }
    };

    requestAnimationFrame(animateCounts);
  }, [isVisible]);

  // Ripple effect
  const createRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  // Side actions
  const SIDE_ACTIONS = [
    {
      icon: <FiEdit />,
      label: "Apply Now",
      onClick: (e) => { createRipple(e); openForm("Apply Now"); },
    },
    {
      icon: <FiHeadphones />,
      label: "Free Counselling",
      onClick: (e) => { createRipple(e); openForm("Free Counselling"); },
    },
    {
      icon: <FiFileText />,
      label: "Brochure",
      onClick: (e) => { createRipple(e); downloadBrochure(); },
    },
    {
      icon: <FiAward />,
      label: "Scholarship Test",
      onClick: (e) => { createRipple(e); openForm("Scholarship Test"); },
    },
  ];

  // Form handlers
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter the student's full name.";
    if (!MOBILE_REGEX.test(form.mobile.trim())) next.mobile = "Enter a valid 10-digit mobile number.";
    if (!form.className) next.className = "Please select a class/standard.";
    if (!form.course) next.course = "Please select a course.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    const message =
      `Hi UK Academy, I'd like to enquire about your NEET/JEE courses.%0A%0A` +
      `*Student Name:* ${form.name.trim()}%0A` +
      `*Mobile Number:* ${form.mobile.trim()}%0A` +
      `*Current Class:* ${form.className}%0A` +
      `*Course Interested In:* ${form.course}%0A`;
    const whatsappUrl = `https://wa.me/${UK_ACADEMY_WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    setStatus("idle");
    setForm(EMPTY_ENQUIRY);
  };

  return (
    <div className="uka-page" id="home">
      <section className="uka-hero" ref={heroRef}>
        {/* Particles (keep) */}
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i % 3}`} />
          ))}
        </div>

        {/* Hero Carousel */}
        <div className="uka-hero-carousel-wrapper">
          <Swiper
            modules={[Autoplay, Navigation, Pagination, Keyboard]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            speed={800}
            navigation={{
              prevEl: ".hero-prev",
              nextEl: ".hero-next",
            }}
            pagination={{
              clickable: true,
              el: ".hero-pagination",
              bulletClass: "uka-dot",
              bulletActiveClass: "active",
            }}
            keyboard={{ enabled: true }}
            className="hero-swiper"
          >
            {COURSE_CATEGORIES.map((course, index) => {
              // Assign background image based on index (cycle through available images)
              const bgImage = SLIDE_BACKGROUNDS[index % SLIDE_BACKGROUNDS.length];
              return (
                <SwiperSlide key={course.slug}>
                  <div
                    className="uka-hero-slide"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Overlay for readability */}
                    <div className="uka-slide-overlay"></div>

                    {/* Left Content */}
                    <div className="uka-hero-left">
                      <div className={`uka-animated-content ${isVisible ? "animate-in" : ""}`}>
                        <p className="uka-eyebrow reveal">{course.badge || course.title}</p>
                        <h1 className="uka-headline reveal">
                          <span className="headline-line">{course.headline || course.title}</span>
                          <br />
                          <span className="uka-headline-gold headline-shine reveal">
                            {course.subHeadline || "Achieve Your Dream"}
                          </span>
                        </h1>
                        <p className="uka-subtext reveal">{course.description || ""}</p>
                        <div className="uka-cta-row reveal">
                          <button
                            className="uka-btn-gold uka-btn-lg ripple-btn"
                            onClick={(e) => {
                              createRipple(e);
                              openForm("Enquire Now");
                            }}
                          >
                            ENQUIRE NOW <FiChevronRight />
                          </button>
                          {/* ✅ VIEW COURSE – now uses getCourseRoute */}
                          <button
                            className="uka-btn-outline uka-btn-lg ripple-btn"
                            onClick={(e) => {
                              createRipple(e);
                              navigate(getCourseRoute(course.slug));
                            }}
                          >
                            VIEW COURSE <FiFileText />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Navigation Arrows */}
          <div className="hero-nav hero-prev">
            <FiChevronLeft />
          </div>
          <div className="hero-nav hero-next">
            <FiChevronRight />
          </div>
          <div className="hero-pagination" />
        </div>

        {/* Statistics */}
        <div className="uka-stats-wrapper reveal">
          <div className="uka-stats">
            {STATS.map((stat, index) => (
              <div className="uka-stat" key={stat.label}>
                <span className="uka-stat-icon">{stat.icon}</span>
                <div className="uka-stat-content">
                  <span className="uka-stat-value">
                    {counts[index]}{stat.suffix}
                  </span>
                  <span className="uka-stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Actions */}
        <div className="uka-side-actions">
          {SIDE_ACTIONS.map((action, index) => (
            <button
              className={`uka-side-action ${index === 0 ? "active" : ""} ripple-btn`}
              key={action.label}
              onClick={action.onClick}
            >
              <span className="uka-side-icon">{action.icon}</span>
              <span className="uka-side-label">{action.label}</span>
            </button>
          ))}
          <a className="uka-side-action uka-whatsapp pulse-whatsapp" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
            <FaWhatsapp />
          </a>
        </div>
      </section>
    </div>
  );
}