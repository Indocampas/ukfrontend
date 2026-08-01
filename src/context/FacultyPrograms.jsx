// F:\uk-academy-app\src\pages\FacultyPrograms\FacultyPrograms.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaArrowRight, FaGraduationCap } from "react-icons/fa";
import { useFacultyPrograms } from "../../context/FacultyProgramContext";
import "./FacultyPrograms.css";
import facultyImage from "../../assets/faculty/Faculty-program.png";

export default function FacultyPrograms({ onNavigate }) {
    const navigate = useNavigate();
    const { programs, loading } = useFacultyPrograms();
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const [counts, setCounts] = useState({
        certified: 0,
        programs: 0,
        mentors: 0,
        success: 0
    });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        startCountAnimation();
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const startCountAnimation = () => {
        const targetCounts = {
            certified: 5000,
            programs: programs.length || 150,
            mentors: 50,
            success: 96
        };

        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            
            setCounts({
                certified: Math.round(progress * targetCounts.certified),
                programs: Math.round(progress * targetCounts.programs),
                mentors: Math.round(progress * targetCounts.mentors),
                success: Math.round(progress * targetCounts.success)
            });

            if (step >= steps) {
                setCounts(targetCounts);
                clearInterval(timer);
            }
        }, interval);

        return () => clearInterval(timer);
    };

    const handleWhatsAppClick = () => {
        window.open("https://wa.me/919361949355?text=Hi%2C%20I%20want%20to%20know%20more%20about%20the%20Faculty%20Certification%20Program", "_blank");
    };

    const handleExploreCourses = () => {
        if (onNavigate) {
            onNavigate("/");
        } else {
            navigate("/");
        }
    };

    // Get published programs count
    const publishedPrograms = programs.filter(p => p.isPublished !== false).length;

    return (
        <section id="FacultyPrograms" className="faculty-programs" ref={sectionRef}>
            <div className="faculty-programs-container">
                <div className="faculty-image-wrapper">
                    <div className="faculty-image-container">
                        <img 
                            src={facultyImage} 
                            alt="Faculty Program" 
                            className="faculty-image"
                        />
                    </div>
                </div>

                <div className="faculty-content">
                    <div className="faculty-badge">
                        <FaGraduationCap className="badge-icon" />
                        <span>FACULTY PROGRAM</span>
                    </div>

                    <h1 className="faculty-title">
                        EMPOWERING EDUCATORS.
                        <br />
                        <span className="highlight">INSPIRING FUTURE LEADERS.</span>
                    </h1>

                    <p className="faculty-description">
                        Join our Faculty Development & Certification Program and transform your 
                        teaching expertise into impactful learning experiences and become a certified Faculty
                    </p>

                    <div className="faculty-buttons">
                        <button 
                            className="btn-certified"
                            onClick={handleWhatsAppClick}
                        >
                            <FaWhatsapp className="whatsapp-icon" />
                            Become a Certified Faculty
                        </button>
                        <button 
                            className="btn-explore"
                            onClick={handleExploreCourses}
                        >
                            Explore Program
                            <FaArrowRight className="arrow-icon" />
                        </button>
                    </div>

                    <div className="faculty-stats">
                        <div className="stat-item">
                            <span className="stat-number">{counts.certified}+</span>
                            <span className="stat-label">Certified Teachers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{loading ? '...' : publishedPrograms}+</span>
                            <span className="stat-label">Programs</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{counts.mentors}+</span>
                            <span className="stat-label">Expert Mentors</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{counts.success}%</span>
                            <span className="stat-label">Success Rate</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}