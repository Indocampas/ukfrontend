// src/pages/Contact/Contact.jsx
import { useState, useEffect, useRef } from "react";
import { FiPhoneCall, FiMail, FiMapPin, FiClock, FiAlertCircle, FiLoader } from "react-icons/fi";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { sendLeadEmail } from "../../utils/sendLeadEmail";
import {
  UK_ACADEMY_EMAIL,
  UK_ACADEMY_SOCIALS,
  UK_ACADEMY_WHATSAPP_NUMBER,
  UK_ACADEMY_WHATSAPP_DEFAULT_MESSAGE,
} from "../../config/siteConfig";
import "./Contact.css";

const EMPTY_FORM = { name: "", phone: "", email: "", message: "" };
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const WHATSAPP_LINK = `https://wa.me/${UK_ACADEMY_WHATSAPP_NUMBER}?text=${encodeURIComponent(
  UK_ACADEMY_WHATSAPP_DEFAULT_MESSAGE
)}`;

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | redirected | error
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!MOBILE_REGEX.test(form.phone.trim())) next.phone = "Enter a valid 10-digit mobile number.";
    if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!form.message.trim()) next.message = "Please add a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    const result = sendLeadEmail(`Contact Us - ${form.name.trim() || "Website Message"}`, {
      Name: form.name.trim(),
      Phone: form.phone.trim(),
      Email: form.email.trim(),
      Message: form.message.trim(),
    });

    if (result.ok) {
      setStatus("idle");
      setForm(EMPTY_FORM);
    } else {
      setStatus("error");
    }
  };

  return (
    <section className="contact-uka-section" id="contact" ref={sectionRef}>
      <div className="contact-uka-container">
        <div className={`contact-uka-header ${isVisible ? "animate-in" : ""}`}>
          <span className="contact-uka-tag">GET IN TOUCH</span>
          <h2>We'd Love To Hear From You</h2>
          <p>Reach out for admissions, counselling or a campus visit</p>
        </div>

        <div className="contact-uka-grid">
         <div className={`contact-uka-info ${isVisible ? "animate-in" : ""}`}>
  <div className="contact-uka-info-item">
    <FiPhoneCall />
    <div>
      <h4>Call Us</h4>
      <p>
        <a href="tel:+919944316004">+91 9944316004</a>
        {" | "}
        <a href="tel:+918148974739">+91 8148974739</a>
      </p>
    </div>
  </div>
  <div className="contact-uka-info-item">
    <FiMail />
    <div>
      <h4>Email Us</h4>
      <p>
        <a href={`mailto:${UK_ACADEMY_EMAIL}`}>{UK_ACADEMY_EMAIL}</a>
      </p>
    </div>
  </div>
  <div className="contact-uka-info-item">
    <FiMapPin />
    <div>
      <h4>Visit Us</h4>
      <p>
        <a
          href="https://maps.google.com/?q=696/5, NSP Towers, Hosur-Bagalur Main Road, Ngo Colony, Hosur - 635109"
          target="_blank"
          rel="noreferrer"
        >
          696/5, NSP Towers, Hosur-Bagalur Main Road, Ngo Colony, Hosur - 635109
        </a>
      </p>
    </div>
  </div>
  <div className="contact-uka-info-item">
    <FiClock />
    <div>
      <h4>Office Hours</h4>
      <p>Mon - Sun: 8:30 AM - 8:30 PM</p>
    </div>
  </div>

  <a className="contact-uka-whatsapp" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
    <FaWhatsapp /> Chat With Us
  </a>
</div>

          <form className={`contact-uka-form ${isVisible ? "animate-in" : ""}`} onSubmit={handleSubmit} noValidate>
            {status === "error" && (
              <div className="contact-uka-banner">
                <FiAlertCircle />
                <span>
                  Couldn't open your email app automatically. Please email us directly at{" "}
                  {UK_ACADEMY_EMAIL}.
                </span>
              </div>
            )}

            <div className="contact-uka-form-row">
              <div className="contact-uka-form-field">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Enter your Name"
                  value={form.name}
                  onChange={handleChange("name")}
                />
                {errors.name && <span className="contact-uka-error">{errors.name}</span>}
              </div>
              <div className="contact-uka-form-field">
                <label htmlFor="contact-phone">Phone Number</label>
                <input
                  id="contact-phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter your mobile number"
                  value={form.phone}
                  onChange={handleChange("phone")}
                />
                {errors.phone && <span className="contact-uka-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="contact-uka-form-field">
              <label htmlFor="contact-email">Email Address</label>
              <input
                id="contact-email"
                type="email"
                placeholder="Enter your Mail ID"
                value={form.email}
                onChange={handleChange("email")}
              />
              {errors.email && <span className="contact-uka-error">{errors.email}</span>}
            </div>

            <div className="contact-uka-form-field">
              <label htmlFor="contact-message">Your Message</label>
              <textarea
                id="contact-message"
                placeholder="Tell us how we can help..."
                rows="4"
                value={form.message}
                onChange={handleChange("message")}
              />
              {errors.message && <span className="contact-uka-error">{errors.message}</span>}
            </div>

            <button type="submit" className="contact-uka-submit" disabled={status === "submitting"}>
              {status === "submitting" ? (
                <>
                  <FiLoader className="contact-uka-spinner" /> SENDING...
                </>
              ) : (
                "SEND MESSAGE"
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="contact-uka-footer">
        <div className="contact-uka-footer-inner">
          <div className="contact-uka-footer-brand">
            <span className="contact-uka-footer-logo">UK ACADEMY</span>
            <p>Professional Learning Center</p>
          </div>
          <div className="contact-uka-socials">
            <a href={UK_ACADEMY_SOCIALS.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href={UK_ACADEMY_SOCIALS.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href={UK_ACADEMY_SOCIALS.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>
        <p className="contact-uka-copyright">
          © {new Date().getFullYear()} UK Academy. All rights reserved.
        </p>
      </div>
    </section>
  );
}