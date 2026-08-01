

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowRight,
  FiCheckCircle,
  FiCalendar,
  FiTrendingUp,
  FiHome,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import {
  FaChalkboardTeacher,
  FaUniversity,
  FaGraduationCap,
} from "react-icons/fa";

import "./Courses.css";

/* =========================================================
   COURSE DATA
   ========================================================= */

const COURSE_CATEGORIES = [
  {
    slug: "neet",
    type: "explorer",
    title: "NEET",
    icon: <FaUniversity />,
    target: "Class 11th to 12th + Dropper",
    description:
      "Comprehensive NEET preparation for Class 11, Class 12 & Repeaters, with Classroom Courses at our Hosur campus and full Online Courses.",
    features: [
      "For Class 11 / 12 / Repeaters",
      "Classroom Courses – Hosur",
      "Live & Recorded Classes",
      "Doubt-Clearing Sessions",
    ],
    duration: "Class 11th–12th",
    level: "NEET",
    color: "#4CAF50",
  },

  {
    slug: "jee",
    type: "explorer",
    title: "JEE",
    icon: <FaGraduationCap />,
    target: "Class 11th to 12th + Dropper",
    description:
      "Complete JEE Main & Advanced preparation for Class 11, Class 12 & Repeaters, with Classroom Courses at our Hosur campus and full Online Courses.",
    features: [
      "For Class 11 / 12 / Repeaters",
      "Classroom Courses – Hosur",
      "Live & Recorded Classes",
      "Doubt-Clearing Sessions",
    ],
    duration: "Class 11th–12th",
    level: "JEE",
    color: "#e8b430",
  },

  {
    slug: "neet-jee-schools",
    type: "catalog",
    title: "NEET & JEE Foundation (Schools)",
    icon: <FiHome />,
    target: "Class 6th to 12th (School Tie-up)",
    description:
      "School Tie-Up Program for Class 6th to 12th, delivered in two modules: Module 1 – Foundation Program and Module 2 – Integrated Program.",
    features: [
      "Module 1: Foundation Program",
      "Module 2: Integrated Program",
      "Class 6 to 12",
      "School-Integrated",
    ],
    duration: "Class 6th–12th",
    level: "Schools",
    color: "#e8b430",
  },

  {
    slug: "ntse-olympiad",
    type: "catalog",
    title: "Foundation (NTSE / Olympiad)",
    icon: <FiTrendingUp />,
    target: "Class 6th to 10th",
    description:
      "Build a strong foundation for NTSE & Olympiads (IMO, NSO, IEO, NSTSE), with Classroom and Online (Recorded / Live) options.",
    features: [
      "Classroom Courses",
      "Online: Recorded & Live",
      "Class 6 to 10",
      "Transparent Fee Breakup",
    ],
    duration: "Class 6th–10th",
    level: "Intermediate",
    color: "#2196F3",
  },

  {
    slug: "neet-jee-individual",
    type: "catalog",
    title: "NEET & JEE Foundation (Individual)",
    icon: <FiUsers />,
    target: "Class 6th to 12th",
    description:
      "Direct-admission NEET & JEE foundation program for individual students, Class 6th to 12th, with Classroom and Online (Recorded / Live) options.",
    features: [
      "Direct Individual Admission",
      "Classroom & Online Options",
      "Class 6 to 12",
      "Transparent Fee Breakup",
    ],
    duration: "Class 6th–12th",
    level: "Foundation",
    color: "#9C27B0",
  },

  {
    slug: "faculty-programs",
    type: "faculty",
    title: "Faculty Programs (Faculties)",
    icon: <FaChalkboardTeacher />,
    target: "Teachers & Educators",
    description:
      "Our professional Faculty Courses — certification and training programs for teachers and aspiring educators.",
    features: [
      "Faculty Courses",
      "Certification",
      "Expert Trainers",
      "Career Growth",
    ],
    duration: "3–12 Months",
    level: "Faculty",
    color: "#9C27B0",
  },
];

/* =========================================================
   AUTOPLAY SETTINGS
   ========================================================= */

const DESKTOP_AUTOPLAY_INTERVAL_MS = 10000;
const MOBILE_AUTOPLAY_INTERVAL_MS = 3000;


/* =========================================================
   COURSES COMPONENT
   ========================================================= */

export default function Courses({ onNavigate }) {

  const navigate = useNavigate();

  /* =======================================================
     RESPONSIVE CARDS PER SLIDE

     Desktop  : 3 cards
     Tablet   : 2 cards
     Mobile   : 1 card
  ======================================================= */

  const getCardsPerSlide = () => {

    if (window.innerWidth <= 600) {
      return 1;
    }

    if (window.innerWidth <= 900) {
      return 2;
    }

    return 3;
  };


  const [cardsPerSlide, setCardsPerSlide] =
    useState(getCardsPerSlide);


  /* =======================================================
     SLIDE COUNT

     Desktop:
     6 cards / 3 = 2 slides

     Tablet:
     6 cards / 2 = 3 slides

     Mobile:
     6 cards / 1 = 6 slides
  ======================================================= */

  const slideCount = Math.ceil(
    COURSE_CATEGORIES.length / cardsPerSlide
  );


  const [activeIndex, setActiveIndex] =
    useState(0);


  const autoplayRef =
    useRef(null);


  const touchStartX =
    useRef(null);


  const touchDeltaX =
    useRef(0);


  /* =======================================================
     HANDLE SCREEN RESIZE
  ======================================================= */

  useEffect(() => {

    const handleResize = () => {

      const newCardsPerSlide =
        getCardsPerSlide();

      setCardsPerSlide(
        newCardsPerSlide
      );

      /*
        Reset to first slide when
        screen size changes.
      */

      setActiveIndex(0);

    };


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);


  /* =======================================================
     GO TO SLIDE
  ======================================================= */

  const goToIndex = (index) => {

    const nextIndex =
      ((index % slideCount) +
        slideCount) %
      slideCount;


    setActiveIndex(
      nextIndex
    );

  };


  /* =======================================================
     NEXT SLIDE
  ======================================================= */

  const handleNextClick = () => {

    goToIndex(
      activeIndex + 1
    );

    restartAutoplay();

  };


  /* =======================================================
     PREVIOUS SLIDE
  ======================================================= */

  const handlePrevClick = () => {

    goToIndex(
      activeIndex - 1
    );

    restartAutoplay();

  };


  /* =======================================================
     DOT CLICK
  ======================================================= */

  const handleDotClick = (
    index
  ) => {

    goToIndex(index);

    restartAutoplay();

  };


  /* =======================================================
     AUTOPLAY
     
     Mobile:
     5 seconds

     Desktop / Tablet:
     10 seconds
  ======================================================= */

  const restartAutoplay = () => {

    if (
      autoplayRef.current
    ) {

      clearInterval(
        autoplayRef.current
      );

    }


    const interval =
      window.innerWidth <= 600
        ? MOBILE_AUTOPLAY_INTERVAL_MS
        : DESKTOP_AUTOPLAY_INTERVAL_MS;


    autoplayRef.current =
      setInterval(() => {

        setActiveIndex(
          (previousIndex) => {

            return (
              (previousIndex + 1) %
              slideCount
            );

          }
        );

      }, interval);

  };


  /* =======================================================
     START AUTOPLAY

     Restart whenever:
     - Number of cards per slide changes
     - Slide count changes
  ======================================================= */

  useEffect(() => {

    restartAutoplay();


    return () => {

      if (
        autoplayRef.current
      ) {

        clearInterval(
          autoplayRef.current
        );

      }

    };

  }, [
    cardsPerSlide,
    slideCount,
  ]);


  /* =======================================================
     TOUCH START
  ======================================================= */

  const handleTouchStart = (
    event
  ) => {

    touchStartX.current =
      event.touches[0].clientX;

    touchDeltaX.current = 0;

  };


  /* =======================================================
     TOUCH MOVE
  ======================================================= */

  const handleTouchMove = (
    event
  ) => {

    if (
      touchStartX.current ===
      null
    ) {

      return;

    }


    touchDeltaX.current =
      event.touches[0].clientX -
      touchStartX.current;

  };


  /* =======================================================
     TOUCH END
  ======================================================= */

  const handleTouchEnd = () => {

    const SWIPE_THRESHOLD = 50;


    if (
      touchDeltaX.current >
      SWIPE_THRESHOLD
    ) {

      handlePrevClick();

    }


    if (
      touchDeltaX.current <
      -SWIPE_THRESHOLD
    ) {

      handleNextClick();

    }


    touchStartX.current =
      null;


    touchDeltaX.current =
      0;

  };


  /* =======================================================
     LEARN MORE
  ======================================================= */

  const handleLearnMore = (
    course
  ) => {

    let path;


    if (
      course.type ===
      "faculty"
    ) {

      path =
        "/faculty-programs";

    } else {

      path =
        `/courses/${course.slug}`;

    }


    if (onNavigate) {

      onNavigate(path);

    } else {

      navigate(path);

    }

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="courses-page">

      <section
        className="courses-section"
        id="courses"
      >

        <div className="courses-container">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="courses-header">

            <span className="courses-tag">
              OUR COURSES
            </span>


            <h2 className="courses-title">
              Programs Designed for Your Success
            </h2>


            <p className="courses-subtitle">
              Explore our carefully designed academic
              and professional programs.
            </p>

          </div>


          {/* =================================================
              CAROUSEL
          ================================================= */}

          <div className="courses-carousel">


            {/* PREVIOUS BUTTON */}

            <button
              type="button"
              className="
                courses-carousel-arrow
                courses-carousel-arrow-prev
              "
              onClick={
                handlePrevClick
              }
              aria-label="Previous courses"
            >

              <FiChevronLeft />

            </button>


            {/* =================================================
                CAROUSEL VIEWPORT
            ================================================= */}

            <div
              className="
                courses-carousel-viewport
              "
              onTouchStart={
                handleTouchStart
              }
              onTouchMove={
                handleTouchMove
              }
              onTouchEnd={
                handleTouchEnd
              }
            >


              {/* =================================================
                  CAROUSEL TRACK
              ================================================= */}

              <div
                className="
                  courses-grid
                "
                style={{
                  transform:
                    `translateX(-${
                      activeIndex *
                      (100 /
                        cardsPerSlide)
                    }%)`,
                }}
              >


                {/* =================================================
                    COURSE CARDS
                ================================================= */}

                {COURSE_CATEGORIES.map(
                  (
                    course,
                    index
                  ) => (

                    <div
                      key={
                        course.slug
                      }
                      className="
                        course-slide
                      "
                      style={{
                        flex:
                          `0 0 ${
                            100 /
                            cardsPerSlide
                          }%`,

                        width:
                          `${
                            100 /
                            cardsPerSlide
                          }%`,

                        minWidth:
                          `${
                            100 /
                            cardsPerSlide
                          }%`,
                      }}
                    >


                      {/* COURSE CARD */}

                      <article
                        className="
                          course-card
                        "
                        style={{
                          "--course-color":
                            course.color,
                        }}
                      >


                        {/* CARD HEADER */}

                        <div
                          className="
                            course-header
                          "
                        >

                          <div
                            className="
                              course-icon-wrapper
                            "
                            style={{
                              background:
                                course.color,
                            }}
                          >

                            <div
                              className="
                                course-icon
                              "
                            >

                              {
                                course.icon
                              }

                            </div>

                          </div>


                          <span
                            className="
                              course-level
                            "
                            style={{
                              background:
                                course.color,
                            }}
                          >

                            {
                              course.level
                            }

                          </span>

                        </div>


                        {/* CARD BODY */}

                        <div
                          className="
                            course-body
                          "
                        >


                          {/* TITLE */}

                          <h3
                            className="
                              course-title
                            "
                          >

                            {
                              course.title
                            }

                          </h3>


                          {/* TARGET */}

                          <p
                            className="
                              course-target
                            "
                          >

                            {
                              course.target
                            }

                          </p>


                          {/* DESCRIPTION */}

                          <p
                            className="
                              course-description
                            "
                          >

                            {
                              course.description
                            }

                          </p>


                          {/* FEATURES */}

                          <div
                            className="
                              course-features
                            "
                          >

                            {course.features
                              .slice(
                                0,
                                3
                              )
                              .map(
                                (
                                  feature
                                ) => (

                                  <span
                                    className="
                                      course-feature
                                    "
                                    key={
                                      feature
                                    }
                                  >

                                    <FiCheckCircle
                                      className="
                                        feature-icon
                                      "
                                    />

                                    {
                                      feature
                                    }

                                  </span>

                                )
                              )}

                          </div>


                          {/* FOOTER */}

                          <div
                            className="
                              course-footer
                            "
                          >


                            {/* DURATION */}

                            <span
                              className="
                                course-duration
                              "
                            >

                              <FiCalendar />

                              {
                                course.duration
                              }

                            </span>


                            {/* LEARN MORE */}

                            <button
                              type="button"
                              className="
                                course-learn-more
                              "
                              onClick={() =>
                                handleLearnMore(
                                  course
                                )
                              }
                            >

                              Learn More

                              <FiArrowRight
                                className="
                                  arrow-icon
                                "
                              />

                            </button>

                          </div>

                        </div>

                      </article>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* NEXT BUTTON */}

            <button
              type="button"
              className="
                courses-carousel-arrow
                courses-carousel-arrow-next
              "
              onClick={
                handleNextClick
              }
              aria-label="Next courses"
            >

              <FiChevronRight />

            </button>

          </div>


          {/* =================================================
              CAROUSEL DOTS
          ================================================= */}

          <div
            className="
              courses-carousel-dots
            "
          >

            {Array.from({
              length:
                slideCount,
            }).map(
              (
                _,
                index
              ) => (

                <button
                  type="button"
                  key={
                    index
                  }
                  className={`
                    courses-carousel-dot
                    ${
                      index ===
                      activeIndex
                        ? "is-active"
                        : ""
                    }
                  `}
                  onClick={() =>
                    handleDotClick(
                      index
                    )
                  }
                  aria-label={
                    `Go to course group ${
                      index + 1
                    }`
                  }
                />

              )
            )}

          </div>

        </div>

      </section>

    </div>

  );

}