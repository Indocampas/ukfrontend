// src/pages/Scholarship/ScholarshipRegister.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ScholarshipRegister.css";

export default function ScholarshipRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    class: "",
    school: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Build mailto: link
    const subject = encodeURIComponent("Scholarship Test Registration");
    const body = encodeURIComponent(`
      Full Name: ${formData.fullName}
      Email: ${formData.email}
      Phone: ${formData.phone}
      Class: ${formData.class}
      School: ${formData.school || "Not provided"}
    `);
    const mailtoLink = `mailto:scholarship@ukacademy.com?subject=${subject}&body=${body}`;

    // Open the user's email client
    window.location.href = mailtoLink;

    // After a short delay, navigate to the confirmation page
    setTimeout(() => {
      setLoading(false);
      navigate("/scholarship/registered", { state: { email: formData.email } });
    }, 500);
  };

  return (
    <section className="scholarship-register-section">
      <div className="scholarship-register-container">
        {/* Back Button */}
        <Link to="/scholarship" className="scholarship-register-back">
          ← Back to Scholarship
        </Link>

        <h2>Register for Scholarship Test</h2>
        <p>Fill in your details below. Upon submission, your email client will open with a pre‑filled message – just send it to complete your registration.</p>

        <form onSubmit={handleSubmit} className="scholarship-register-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Current Class *</label>
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              required
            >
              <option value="">Select Class</option>
              {[6, 7, 8, 9, 10, 11, 12].map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>School Name</label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="scholarship-register-submit" disabled={loading}>
            {loading ? "Opening email…" : "Submit via Email"}
          </button>
        </form>
      </div>
    </section>
  );
}