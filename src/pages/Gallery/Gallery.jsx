// src/pages/Gallery/Gallery.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiCamera, FiPlay } from "react-icons/fi";
import { useGallery } from "../../context/GalleryContext";
import { DEFAULT_GALLERY_DATA } from "../../data/galleryData.jsx";
import "./Gallery.css";

// The bundled "Academy" hero image/title/subtitle used to seed the page
// before the backend responds. Records created or returned by the backend
// don't necessarily carry an `isMain` flag (the admin UI has no control to
// set one), so relying on `isMain` alone made this featured card vanish
// the moment real backend data replaced the local defaults. Falling back
// through an "Academy" category match and finally to the bundled default
// guarantees this section always renders with the same look, while still
// letting a backend-marked main image or an "Academy" category upload
// take over automatically if one exists.
const FALLBACK_ACADEMY_IMAGE = DEFAULT_GALLERY_DATA.find((img) => img.isMain);

export default function Gallery() {
  const navigate = useNavigate();
  const { images: GALLERY_DATA } = useGallery();
  const [isVisible, setIsVisible] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );
    if (galleryRef.current) observer.observe(galleryRef.current);
    return () => observer.disconnect();
  }, []);

  const handleExploreGallery = () => {
    // Navigate to the dedicated Gallery page which shows every remaining
    // gallery image along with its full content.
    navigate("/gallery");
  };

  const academyImage =
    GALLERY_DATA.find((img) => img.isMain) ||
    GALLERY_DATA.find((img) => img.category === "Academy") ||
    FALLBACK_ACADEMY_IMAGE;

  return (
    <section className="gallery-section" id="gallery" ref={galleryRef}>
      <div className="gallery-container">
        <div className={`gallery-header ${isVisible ? "animate-in" : ""}`}>
          <span className="gallery-tag">
            <FiCamera /> OUR GALLERY
          </span>
          <h2>Capturing Moments of Excellence</h2>
          <p>Explore the vibrant life and achievements at UK Academy</p>
        </div>

        {/* Academy Main Image - Featured */}
        {academyImage && (
          <div className={`academy-featured ${isVisible ? "animate-in" : ""}`}>
            <div className="academy-featured-wrapper">
              <img
                src={academyImage.image}
                alt={academyImage.title}
                className="academy-featured-image"
              />
              <div className="academy-featured-overlay">
                <div className="academy-featured-content">
                  <h2>{academyImage.title}</h2>
                  <p>{academyImage.description}</p>
                  <button className="academy-explore-btn" onClick={handleExploreGallery}>
                    <FiPlay /> Explore Gallery
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
