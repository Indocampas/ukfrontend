// src/context/StudentAuthContext.jsx
//
// LOCAL DEVELOPMENT MODE
// -----------------------------------------------------------------------
// Student sign-in for the Scholarship Exam module runs entirely on the
// frontend for now — no backend calls. Email/Mobile OTP is simulated
// locally (a one-time code is generated in-browser and shown right on the
// screen, since there's no SMS/email service to deliver it). "Continue with
// Google" decodes the Google ID token client-side to read the name/email —
// fine for local development, since there's no server to verify it against.
//
// The student "session" is just a JSON blob in sessionStorage. Swap this
// file's internals for real API calls (see BACKEND_API_CONTRACT_SCHOLARSHIP.md)
// when backend integration is ready; the shape returned to callers
// (`student`, `isAuthenticated`, etc.) is designed to stay the same.
import { createContext, useContext, useState } from "react";
import { makeLocalId } from "../utils/localStore";

const STUDENT_SESSION_KEY = "uka_student_session";
const PENDING_OTP_KEY = "uka_student_pending_otp";
// Set VITE_GOOGLE_CLIENT_ID in .env to enable the "Continue with Google" button.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const OTP_TTL_MS = 5 * 60 * 1000;

const StudentAuthContext = createContext(null);

function getStoredSession() {
  try {
    const raw = sessionStorage.getItem(STUDENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeSession(student) {
  try {
    sessionStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(student));
  } catch {
    /* ignore */
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(STUDENT_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function generateOtp() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function storePendingOtp(pending) {
  try {
    sessionStorage.setItem(PENDING_OTP_KEY, JSON.stringify(pending));
  } catch {
    /* ignore */
  }
}

function getPendingOtp() {
  try {
    const raw = sessionStorage.getItem(PENDING_OTP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Decodes (does NOT verify) a Google Identity Services JWT to pull out the
// name/email for local session creation. This is safe here because there is
// no backend to protect yet — this is purely a local-dev convenience.
function decodeGoogleCredential(idToken) {
  const payloadPart = idToken.split(".")[1];
  const json = decodeURIComponent(
    atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/"))
      .split("")
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );
  return JSON.parse(json);
}

export function StudentAuthProvider({ children }) {
  // The session lives in sessionStorage synchronously (no backend round trip
  // to await), so it's read via a lazy initializer rather than an effect —
  // there's never actually a "checking" period in local dev mode.
  const [student, setStudent] = useState(() => getStoredSession());
  const [isCheckingAuth] = useState(false);
  const [error, setError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [devOtp, setDevOtp] = useState(null);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // --- Email OTP (simulated locally) ---
  const sendEmailOtp = async (email, name) => {
    setError("");
    if (!email) {
      setError("Please enter your email address.");
      return false;
    }
    setIsSendingOtp(true);
    await wait(400);
    const otp = generateOtp();
    storePendingOtp({ method: "email", target: email.toLowerCase(), name: name || "", otp, expiresAt: Date.now() + OTP_TTL_MS });
    setDevOtp(otp);
    setIsSendingOtp(false);
    return true;
  };

  const verifyEmailOtp = async (email, otp) => {
    setError("");
    setIsVerifying(true);
    await wait(300);
    const pending = getPendingOtp();
    if (!pending || pending.method !== "email" || pending.target !== email.toLowerCase()) {
      setError("Please request a new OTP.");
      setIsVerifying(false);
      return false;
    }
    if (Date.now() > pending.expiresAt) {
      setError("That OTP has expired. Please request a new one.");
      setIsVerifying(false);
      return false;
    }
    if (otp !== pending.otp) {
      setError("Incorrect OTP. Please try again.");
      setIsVerifying(false);
      return false;
    }
    const newStudent = {
      id: makeLocalId("student"),
      name: pending.name || email.split("@")[0],
      email,
      phone: "",
      method: "email",
    };
    storeSession(newStudent);
    setStudent(newStudent);
    setDevOtp(null);
    setIsVerifying(false);
    return true;
  };

  // --- Mobile OTP (simulated locally) ---
  const sendPhoneOtp = async (phone, name) => {
    setError("");
    if (!phone) {
      setError("Please enter your mobile number.");
      return false;
    }
    setIsSendingOtp(true);
    await wait(400);
    const otp = generateOtp();
    storePendingOtp({ method: "phone", target: phone, name: name || "", otp, expiresAt: Date.now() + OTP_TTL_MS });
    setDevOtp(otp);
    setIsSendingOtp(false);
    return true;
  };

  const verifyPhoneOtp = async (phone, otp) => {
    setError("");
    setIsVerifying(true);
    await wait(300);
    const pending = getPendingOtp();
    if (!pending || pending.method !== "phone" || pending.target !== phone) {
      setError("Please request a new OTP.");
      setIsVerifying(false);
      return false;
    }
    if (Date.now() > pending.expiresAt) {
      setError("That OTP has expired. Please request a new one.");
      setIsVerifying(false);
      return false;
    }
    if (otp !== pending.otp) {
      setError("Incorrect OTP. Please try again.");
      setIsVerifying(false);
      return false;
    }
    const newStudent = {
      id: makeLocalId("student"),
      name: pending.name || phone,
      email: "",
      phone,
      method: "phone",
    };
    storeSession(newStudent);
    setStudent(newStudent);
    setDevOtp(null);
    setIsVerifying(false);
    return true;
  };

  // --- Google (decoded locally, no backend round trip) ---
  const loginWithGoogle = async (googleIdToken) => {
    setError("");
    setIsVerifying(true);
    try {
      const payload = decodeGoogleCredential(googleIdToken);
      const newStudent = {
        id: makeLocalId("student"),
        name: payload.name || payload.email,
        email: payload.email || "",
        phone: "",
        method: "google",
      };
      storeSession(newStudent);
      setStudent(newStudent);
      setIsVerifying(false);
      return true;
    } catch {
      setError("Could not read your Google account details. Please try another sign-in method.");
      setIsVerifying(false);
      return false;
    }
  };

  const logout = () => {
    clearSession();
    setStudent(null);
  };

  const value = {
    student,
    isAuthenticated: !!student,
    isCheckingAuth,
    error,
    isSendingOtp,
    isVerifying,
    devOtp,
    googleClientId: GOOGLE_CLIENT_ID,
    sendEmailOtp,
    verifyEmailOtp,
    sendPhoneOtp,
    verifyPhoneOtp,
    loginWithGoogle,
    logout,
  };

  return <StudentAuthContext.Provider value={value}>{children}</StudentAuthContext.Provider>;
}

export function useStudentAuth() {
  const ctx = useContext(StudentAuthContext);
  if (!ctx) {
    throw new Error("useStudentAuth must be used within a StudentAuthProvider");
  }
  return ctx;
}
