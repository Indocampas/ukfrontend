// src/pages/Gallery/GalleryGrid.jsx
// Standalone "All Gallery" page shown at the /gallery route. Reached via
// the "Explore Gallery" button on the homepage Gallery section.
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
} from "react-icons/fi";
import { useGallery } from "../../context/GalleryContext";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "../../data/galleryData.jsx";
import "./GalleryGrid.css";

export default function GalleryGrid() {
  const navigate = useNavigate();
  const { images: GALLERY_DATA } = useGallery();
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const nonMainImages = GALLERY_DATA.filter((img) => !img.isMain);
    if (activeCategory === "All") {
      setFilteredImages(nonMainImages);
    } else {
      setFilteredImages(nonMainImages.filter((img) => img.category === activeCategory));
    }
  }, [activeCategory, GALLERY_DATA]);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const navigateImage = (direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < filteredImages.length) {
      setCurrentIndex(newIndex);
      setSelectedImage(filteredImages[newIndex]);
    }
  };

  // MODIFIED: Handle back navigation to home with scroll to gallery section
  const handleBack = () => {
    navigate("/");
    // Add a small delay to ensure the home page has rendered
    setTimeout(() => {
      const gallerySection = document.getElementById('gallery');
      if (gallerySection) {
        const navbarHeight = 78; // Your NAVBAR_OFFSET value
        const y = gallerySection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 150);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateImage(-1);
      if (e.key === "ArrowRight") navigateImage(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, filteredImages]);

  const getCategoryCount = (category) => {
    const nonMainImages = GALLERY_DATA.filter((img) => !img.isMain);
    if (category === "All") {
      return nonMainImages.length;
    }
    return nonMainImages.filter((img) => img.category === category).length;
  };

  return (
    <section className="gallery-grid-section" ref={gridRef}>
      <div className="gallery-grid-container">
        {/* Header */}
        <div className="gallery-grid-header">
          <button className="back-to-gallery-btn" onClick={handleBack}>
            <FiArrowLeft /> Back to Home
          </button>
          <div className="gallery-grid-title">
            <h2>UK Academy Gallery</h2>
            <p>Explore all our amazing moments</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className={`gallery-grid-filters ${isVisible ? "animate-in" : ""}`}>
          {Object.keys(CATEGORY_ICONS).map((category) => (
            <button
              key={category}
              className={`grid-filter-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
              style={{
                borderColor: activeCategory === category ? CATEGORY_COLORS[category] || "#e8b430" : "transparent",
              }}
            >
              <span className="filter-icon">{CATEGORY_ICONS[category]}</span>
              <span className="filter-name">{category}</span>
              
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className={`gallery-grid-main ${isVisible ? "animate-in" : ""}`}>
          {filteredImages.length === 0 ? (
            <div className="no-images-message">
              <p>No images found in this category</p>
            </div>
          ) : (
            filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="gallery-grid-item"
                onClick={() => openLightbox(image, index)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="gallery-grid-image-wrapper">
                  <img
                    id={`img-${image.id}`}
                    className="gallery-grid-image loaded"
                    src={image.image}
                    alt={image.title}
                    loading="lazy"
                  />
                  <div className="gallery-grid-overlay">
                    <div className="gallery-grid-overlay-content">
                      <h4>{image.title}</h4>
                      <span
                        className="gallery-grid-category-badge"
                        style={{ background: CATEGORY_COLORS[image.category] || "#e8b430" }}
                      >
                        {image.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div className="lightbox-overlay" onClick={closeLightbox}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <FiX />
            </button>

            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage(-1);
              }}
              style={{ display: currentIndex === 0 ? "none" : "flex" }}
            >
              <FiChevronLeft />
            </button>

            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={selectedImage.image} alt={selectedImage.title} />
              <div className="lightbox-info">
                <h3>{selectedImage.title}</h3>
                <p>{selectedImage.description}</p>
                <span
                  className="lightbox-category"
                  style={{ background: CATEGORY_COLORS[selectedImage.category] || "#e8b430" }}
                >
                  {selectedImage.category}
                </span>
                <div className="lightbox-counter">
                  {currentIndex + 1} / {filteredImages.length}
                </div>
              </div>
            </div>

            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage(1);
              }}
              style={{ display: currentIndex === filteredImages.length - 1 ? "none" : "flex" }}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}