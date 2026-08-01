// src/components/Navbar/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiPhoneCall, FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import logoImage from "../../assets/images/logo.png";

export const NAV_LINKS = [
  {
    name: "Home",
    section: "home",
    submenu: [
      { name: "About Us", section: "about" },
      { name: "Vision & Mission", section: "vision-mission" },
    ],
  },
  { name: "Courses", section: "courses" },
   { name: "Faculty Program", section: "FacultyPrograms" },
  { name: "Why UK Academy", section: "why" },
  { name: "Results", section: "results" },
  { name: "Faculty", section: "faculty" },
  { name: "Gallery", section: "gallery" },
  { name: "Books", section: "books" },
  { name: "Scholarship", section: "scholarship" },
  { name: "Contact", section: "contact" },
];

const NAVBAR_OFFSET = 78;

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (e) => {
      const openRef = openDropdown && dropdownRefs.current[openDropdown];
      if (openRef && !openRef.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (section) => {
    setOpenDropdown((prev) => (prev === section ? null : section));
  };

  const handleSubmenuClick = (sub) => {
    setOpenDropdown(null);
    setIsOpen(false);
    if (sub.section) {
      scrollToSection(sub.section);
    } else if (sub.path) {
      navigate(sub.path);
    }
  };

  useEffect(() => {
    if (location.pathname !== "/") return undefined;

    const sectionIds = NAV_LINKS.flatMap((link) =>
      link.submenu ? [link.section, ...link.submenu.filter((s) => s.section).map((s) => s.section)] : [link.section]
    );
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${NAVBAR_OFFSET + 10}px 0px -55% 0px`,
        threshold: 0.1,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  const performScroll = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const top =
        el.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET + 1;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => performScroll(sectionId), 150);
    } else {
      performScroll(sectionId);
    }
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    navigate("/login");
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    logout();
    navigate("/");
  };

  return (
    <header className="uka-navbar">
      <div className="uka-navbar-inner">
        <div className="uka-logo" onClick={() => scrollToSection("home")}>
          <img 
            src={logoImage} 
            alt="UK Academy Logo" 
            className="uka-logo-image"
            style={{ width: '65px', height: '65px' }} // Increased size inline
          />
          <div className="uka-logo-text">
            <span className="uka-logo-title">UK ACADEMY</span>
            <span className="uka-logo-subtitle">Professional Learning Center </span>
          </div>
        </div>

        <nav className={`uka-nav-links ${isOpen ? "open" : ""}`}>
          {NAV_LINKS.map((link) =>
            link.submenu ? (
              <div
                key={link.section}
                className={`uka-nav-dropdown ${openDropdown === link.section ? "open" : ""}`}
                ref={(el) => (dropdownRefs.current[link.section] = el)}
              >
                <a
                  href={`#${link.section}`}
                  className={`uka-nav-dropdown-trigger ${
                    activeSection === link.section ||
                    link.submenu.some((s) => s.section && activeSection === s.section)
                      ? "active"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.section);
                  }}
                  onMouseEnter={() => setOpenDropdown(link.section)}
                >
                  {link.name}
                  <span
                    className="uka-nav-dropdown-caret"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDropdown(link.section);
                    }}
                  >
                    <FiChevronDown />
                  </span>
                </a>
                <div
                  className="uka-nav-dropdown-menu"
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {link.submenu.map((sub) => (
                    <a
                      key={sub.section || sub.path}
                      href={sub.section ? `#${sub.section}` : sub.path}
                      className={
                        (sub.section && activeSection === sub.section) ||
                        (sub.path && location.pathname === sub.path)
                          ? "active"
                          : ""
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmenuClick(sub);
                      }}
                    >
                      {sub.name}
                    </a>
                  ))}
                </div>
              </div>
            ) : link.isRoute ? (
              <a
                key={link.section}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                  setIsOpen(false);
                }}
                className={location.pathname.startsWith(link.path) ? "active" : ""}
              >
                {link.name}
              </a>
            ) : (
              <a
                key={link.section}
                href={`#${link.section}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.section);
                }}
                className={activeSection === link.section ? "active" : ""}
              >
                {link.name}
              </a>
            )
          )}
          {!isAuthenticated ? (
            <button
              className="uka-mobile-login-btn"
              onClick={handleLoginClick}
            >
              Login
            </button>
          ) : (
            <div className="uka-mobile-admin-actions">
              <button
                className="uka-mobile-login-btn"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/admin/gallery");
                }}
              >
                <FiUser /> Admin
              </button>
              <button
                className="uka-mobile-logout-btn"
                onClick={handleLogoutClick}
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </nav>

        <div className="uka-navbar-right">
          <div className="uka-call">
            <FiPhoneCall className="uka-call-icon" />
            <div className="uka-call-text">
              <span className="uka-call-number">+91 9944316004</span>
              <span className="uka-call-label">Call Now</span>
            </div>
          </div>
          {isAuthenticated ? (
            <div className="uka-navbar-admin-actions desktop-only">
              <button
                className="uka-btn-gold"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/admin/gallery");
                }}
              >
                <FiUser /> Admin
              </button>
              <button className="uka-btn-outline-small" onClick={handleLogoutClick}>
                <FiLogOut />
              </button>
            </div>
          ) : (
            <button className="uka-btn-gold desktop-only" onClick={handleLoginClick}>
              Login
            </button>
          )}
          <button
            className="uka-navbar-toggle"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}