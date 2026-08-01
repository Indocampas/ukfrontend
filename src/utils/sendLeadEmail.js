// src/utils/sendLeadEmail.js
//
// This project uses the browser's native "mailto:" link to deliver every
// form submission straight to the official UK Academy inbox. There is no
// backend server and no third-party email API involved.
//
// Because a "mailto:" link simply asks the visitor's device to open its
// default email app with a pre-filled message, it is not possible to:
//   - store submitted details in a database, or
//   - automatically send an acknowledgement email back to the student.
// Both of those would require a backend service or an email API such as
// EmailJS.
import { UK_ACADEMY_EMAIL } from "../config/siteConfig";

/** Builds a mailto: link with a formatted subject + body from form data. */
export function buildMailtoFallback(subject, data) {
  const bodyLines = Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}: ${value}`);
  const body = encodeURIComponent(bodyLines.join("\n"));
  return `mailto:${UK_ACADEMY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
}

/**
 * "Sends" a form submission by opening the visitor's email client with a
 * pre-filled message addressed to the official UK Academy inbox.
 *
 * @param {string} subject - Email subject line.
 * @param {Object} data - Human-readable field labels mapped to their values.
 * @returns {{ok: boolean}} Always resolves ok:true once the mailto link has
 *   been triggered — the actual "sending" happens in the visitor's own
 *   email app, so the website has no way to confirm delivery.
 */
export function sendLeadEmail(subject, data) {
  try {
    const mailtoHref = buildMailtoFallback(subject, data);
    window.location.href = mailtoHref;
    return { ok: true };
  } catch (err) {
    console.error("Failed to open mail client:", err);
    return { ok: false, reason: "mailto_failed" };
  }
}
