// src/components/LeadFormModal/LeadFormModal.jsx
import { useState, useEffect, useMemo } from "react";
import { FiX, FiAlertCircle, FiLoader } from "react-icons/fi";
import { useFormModal } from "../../context/FormModalContext";
import { sendLeadEmail } from "../../utils/sendLeadEmail";
import { UK_ACADEMY_EMAIL } from "../../config/siteConfig";
import { LEAD_FORM_CONFIGS } from "../../config/leadFormConfigs";
import "./LeadFormModal.css";

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildEmptyForm(fields) {
  const empty = {};
  fields.forEach((field) => {
    empty[field.id] = field.type === "checkbox" ? false : "";
  });
  return empty;
}

export default function LeadFormModal() {
  const { activeForm, presetCourse, closeForm } = useFormModal();
  const config = activeForm ? LEAD_FORM_CONFIGS[activeForm] : null;
  const fields = useMemo(() => config?.fields || [], [config]);

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | error

  const isOpen = Boolean(activeForm && config);

  useEffect(() => {
    if (isOpen) {
      const initial = buildEmptyForm(fields);
      const courseField = fields.find((f) => f.id === "course");
      if (courseField && presetCourse) initial.course = presetCourse;
      setForm(initial);
      setErrors({});
      setStatus("idle");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeForm, presetCourse]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && status !== "submitting") closeForm();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, status, closeForm]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    const value = field.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field.id]: value }));
    if (errors[field.id]) setErrors((prev) => ({ ...prev, [field.id]: null }));
  };

  const validate = () => {
    const next = {};
    fields.forEach((field) => {
      const value = form[field.id];

      if (field.required) {
        if (field.type === "checkbox" && !value) {
          next[field.id] = "This is required.";
          return;
        }
        if (field.type !== "checkbox" && field.type !== "file" && !String(value || "").trim()) {
          next[field.id] = `${field.label.replace(/\*$/, "")} is required.`;
          return;
        }
      }

      if (value && field.type === "tel" && !MOBILE_REGEX.test(String(value).trim())) {
        next[field.id] = "Enter a valid 10-digit mobile number.";
      }

      if (value && field.type === "email" && !EMAIL_REGEX.test(String(value).trim())) {
        next[field.id] = "Enter a valid email address.";
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    const emailData = {};
    fields.forEach((field) => {
      const value = form[field.id];
      if (field.type === "checkbox") {
        emailData[field.label] = value ? "Yes" : "No";
      } else if (field.type === "file") {
        emailData[field.label] = value ? `${value} (please attach this photo manually when sending the email)` : "-";
      } else {
        emailData[field.label] = value || "-";
      }
    });

    const nameField = fields.find((f) => f.id === "fullName");
    const subject = `${config.heading} - ${(nameField && form.fullName) || "Website Enquiry"}`;

    const result = sendLeadEmail(subject, emailData);
    
    if (result.ok) {
      // Close the modal immediately on success
      closeForm();
    } else {
      setStatus("error");
    }
  };

  const renderField = (field) => {
    const value = form[field.id];
    const common = {
      id: `lead-${field.id}`,
      value: field.type === "checkbox" ? undefined : value ?? "",
      onChange: handleChange(field),
    };

    switch (field.type) {
      case "select":
        return (
          <select {...common}>
            <option value="">{`Select ${field.label}`}</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return <textarea {...common} rows="3" placeholder={field.placeholder} />;
      case "file":
        return (
          <input
            id={common.id}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              setForm((prev) => ({ ...prev, [field.id]: file ? file.name : "" }));
              if (errors[field.id]) setErrors((prev) => ({ ...prev, [field.id]: null }));
            }}
          />
        );
      case "checkbox":
        return (
          <label className="lead-modal-checkbox-label">
            <input
              id={common.id}
              type="checkbox"
              checked={Boolean(value)}
              onChange={handleChange(field)}
            />
            <span>{field.label}</span>
          </label>
        );
      case "tel":
        return (
          <input
            {...common}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder={field.placeholder}
          />
        );
      case "date":
        return <input {...common} type="date" />;
      case "time":
        return <input {...common} type="time" />;
      case "email":
        return <input {...common} type="email" placeholder={field.placeholder} />;
      default:
        return <input {...common} type="text" placeholder={field.placeholder} />;
    }
  };

  return (
    <div
      className="lead-modal-overlay"
      onClick={() => status !== "submitting" && closeForm()}
      role="dialog"
      aria-modal="true"
      aria-label={config.heading}
    >
      <div className="lead-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="lead-modal-close"
          onClick={closeForm}
          aria-label="Close form"
          disabled={status === "submitting"}
        >
          <FiX />
        </button>

        <div className="lead-modal-header">
          <h3>{config.heading}</h3>
          <p>{config.subheading}</p>
        </div>

        {status === "error" && (
          <div className="lead-modal-banner lead-modal-banner-error">
            <FiAlertCircle />
            <span>
              Couldn't open your email app automatically. Please email us directly at{" "}
              {UK_ACADEMY_EMAIL}.
            </span>
          </div>
        )}

        <form className="lead-modal-form" onSubmit={handleSubmit} noValidate>
          {(() => {
            const rows = [];
            for (let i = 0; i < fields.length; i += 1) {
              const field = fields[i];
              if (field.half && fields[i + 1] && fields[i + 1].half) {
                const next = fields[i + 1];
                rows.push(
                  <div className="lead-modal-row" key={field.id}>
                    <div className="lead-modal-field">
                      <label htmlFor={`lead-${field.id}`}>
                        {field.label}
                        {field.optionalLabel && " (Optional)"}
                      </label>
                      {renderField(field)}
                      {errors[field.id] && (
                        <span className="lead-modal-error">{errors[field.id]}</span>
                      )}
                    </div>
                    <div className="lead-modal-field">
                      <label htmlFor={`lead-${next.id}`}>
                        {next.label}
                        {next.optionalLabel && " (Optional)"}
                      </label>
                      {renderField(next)}
                      {errors[next.id] && (
                        <span className="lead-modal-error">{errors[next.id]}</span>
                      )}
                    </div>
                  </div>
                );
                i += 1;
              } else if (field.type === "checkbox") {
                rows.push(
                  <div className="lead-modal-field" key={field.id}>
                    {renderField(field)}
                    {errors[field.id] && (
                      <span className="lead-modal-error">{errors[field.id]}</span>
                    )}
                  </div>
                );
              } else {
                rows.push(
                  <div className="lead-modal-field" key={field.id}>
                    <label htmlFor={`lead-${field.id}`}>
                      {field.label}
                      {field.optionalLabel && " (Optional)"}
                    </label>
                    {renderField(field)}
                    {errors[field.id] && (
                      <span className="lead-modal-error">{errors[field.id]}</span>
                    )}
                  </div>
                );
              }
            }
            return rows;
          })()}

          <button type="submit" className="lead-modal-btn" disabled={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <FiLoader className="lead-modal-spinner" /> Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}