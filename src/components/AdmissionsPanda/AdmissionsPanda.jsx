// src/components/AdmissionsPanda/AdmissionsPanda.jsx
import { useState, useEffect } from "react";
import { useFormModal } from "../../context/FormModalContext";
import bot from "../../assets/images/AIbot/ad.png";
import "./AdmissionsPanda.css";

const SCROLL_THRESHOLD = 160;

export default function AdmissionsPanda() {
  const { openForm } = useFormModal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpen = () => openForm("Enquire Now");
return (
  <div className={`admissions-panda-widget ${scrolled ? "is-scrolled" : ""}`}>
    {!scrolled ? (
      /* HOME PAGE */
      <div className="admissions-panda-home">

        <img
          src={bot}
          alt="UK Academy Assistant"
          className="admissions-panda-img"
          draggable="false"
        />

        <button
          className="admissions-panda-banner"
          onClick={handleOpen}
        >
          🔥 Admissions Open
        </button>

      </div>
    ) : (
      /* AFTER SCROLL */
      <div className="admissions-panda-scroll">

        <button
          className="admissions-panda-tooltip"
          onClick={handleOpen}
        >
          🔥 Admissions Open
        </button>

        <img
          src={bot}
          alt="UK Academy Assistant"
          className="admissions-panda-img"
          draggable="false"
        />

      </div>
    )}
  </div>
);
}