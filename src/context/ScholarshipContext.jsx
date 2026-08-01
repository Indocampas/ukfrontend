// src/context/ScholarshipContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import { getToken } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";

const ScholarshipContext = createContext(null);

export function ScholarshipProvider({ children }) {
  const [exams, setExams] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState("");

  const authHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // ----- Admin functions -----
  const createExam = async (exam) => {
    const res = await fetch(`${API_BASE}/api/scholarship/admin/exams`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(exam),
    });
    if (!res.ok) throw new Error("Failed to create exam");
    const created = await res.json();
    setExams((prev) => [...prev, created]);
    setLastSaved(new Date());
    return created;
  };

  const updateExam = async (id, updates) => {
    const res = await fetch(`${API_BASE}/api/scholarship/admin/exams/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update exam");
    const updated = await res.json();
    setExams((prev) => prev.map((e) => (e.id === id ? updated : e)));
    setLastSaved(new Date());
  };

  const deleteExam = async (id) => {
    const res = await fetch(`${API_BASE}/api/scholarship/admin/exams/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok && res.status !== 204) throw new Error("Failed to delete exam");
    setExams((prev) => prev.filter((e) => e.id !== id));
    setLastSaved(new Date());
  };

  const uploadExamTemplate = async (examId, template) => {
    const res = await fetch(`${API_BASE}/api/scholarship/admin/exams/${examId}/template`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(template),
    });
    if (!res.ok) throw new Error("Failed to upload template");
    const updated = await res.json();
    setExams((prev) => prev.map((e) => (e.id === examId ? updated : e)));
    setLastSaved(new Date());
    return updated;
  };

  const updateExamTemplateQuestions = async (examId, questions) => {
    const res = await fetch(`${API_BASE}/api/scholarship/admin/exams/${examId}/template/questions`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(questions),
    });
    if (!res.ok) throw new Error("Failed to update template questions");
    const updated = await res.json();
    setExams((prev) => prev.map((e) => (e.id === examId ? updated : e)));
    setLastSaved(new Date());
  };

  const getRegisteredStudents = async (examId) => {
    const res = await fetch(`${API_BASE}/api/scholarship/admin/exams/${examId}/registrations`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to get registrations");
    return await res.json();
  };

  const setStudentScore = async (regId, score) => {
    const res = await fetch(`${API_BASE}/api/scholarship/admin/registrations/${regId}/score`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(score),
    });
    if (!res.ok) throw new Error("Failed to set score");
    const updated = await res.json();
    setRegistrations((prev) => prev.map((r) => (r.id === regId ? updated : r)));
    setLastSaved(new Date());
  };

  const setWinner = async (regId, isWinner) => {
    const res = await fetch(`${API_BASE}/api/scholarship/admin/registrations/${regId}/winner`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(isWinner),
    });
    if (!res.ok) throw new Error("Failed to set winner");
    const updated = await res.json();
    setRegistrations((prev) => prev.map((r) => (r.id === regId ? updated : r)));
    setLastSaved(new Date());
  };

  const publishResults = async (examId) => {
    const res = await fetch(`${API_BASE}/api/scholarship/admin/exams/${examId}/publish`, {
      method: "POST",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to publish results");
    const updated = await res.json();
    setExams((prev) => prev.map((e) => (e.id === examId ? updated : e)));
    setLastSaved(new Date());
  };

  const unpublishResults = async (examId) => {
    const res = await fetch(`${API_BASE}/api/scholarship/admin/exams/${examId}/unpublish`, {
      method: "POST",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to unpublish results");
    const updated = await res.json();
    setExams((prev) => prev.map((e) => (e.id === examId ? updated : e)));
    setLastSaved(new Date());
  };

  // ----- Student functions -----
  const getOpenExams = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/scholarship/exams/open`);
      if (res.status === 401) {
        console.warn("Not authenticated for scholarship exams");
        return [];
      }
      if (!res.ok) throw new Error("Failed to fetch open exams");
      const data = await res.json();
      // Only update state if data has changed
      setExams((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(data)) {
          return prev;
        }
        return data;
      });
      return data;
    } catch (err) {
      console.error("Error fetching open exams:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Alias for backward compatibility
  const getOpenExamsForRegistration = getOpenExams;

  const registerForExam = async (examId, studentInfo) => {
    const res = await fetch(`${API_BASE}/api/scholarship/exams/${examId}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentInfo),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "Registration failed");
    }
    const created = await res.json();
    setRegistrations((prev) => [...prev, created]);
    return created;
  };

  const getMyRegistrations = async (studentId) => {
    try {
      const res = await fetch(`${API_BASE}/api/scholarship/registrations?studentId=${studentId}`);
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch registrations");
      const data = await res.json();
      setRegistrations(data);
      return data;
    } catch (err) {
      console.error("Error fetching registrations:", err);
      return [];
    }
  };

  const getRegistration = (examId, studentId) => {
    return registrations.find((r) => r.examId === examId && r.studentId === studentId) || null;
  };

  const saveExamProgress = async (regId, answers) => {
    const res = await fetch(`${API_BASE}/api/scholarship/registrations/${regId}/progress`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });
    if (!res.ok) throw new Error("Failed to save progress");
    const updated = await res.json();
    setRegistrations((prev) => prev.map((r) => (r.id === regId ? updated : r)));
  };

  const submitExamAnswers = async (regId, answers) => {
    const res = await fetch(`${API_BASE}/api/scholarship/registrations/${regId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });
    if (!res.ok) throw new Error("Failed to submit exam");
    const updated = await res.json();
    setRegistrations((prev) => prev.map((r) => (r.id === regId ? updated : r)));
    return updated;
  };

  const fetchMyResult = async (regId) => {
    const res = await fetch(`${API_BASE}/api/scholarship/registrations/${regId}/result`);
    if (!res.ok) throw new Error("Failed to fetch result");
    return await res.json();
  };

  const checkRegistrationOpen = (examId) => {
    const exam = exams.find((e) => e.id === examId);
    if (!exam) return false;
    if (!exam.registrationOpen) return false;
    const now = new Date();
    const openDate = exam.registrationOpenDate ? new Date(exam.registrationOpenDate) : null;
    const closeDate = exam.registrationCloseDate ? new Date(exam.registrationCloseDate) : null;
    if (openDate && now < openDate) return false;
    if (closeDate && now > closeDate) return false;
    return true;
  };

  const isRegistrationOpen = (exam) => {
    if (!exam) return false;
    if (!exam.registrationOpen) return false;
    const now = new Date();
    const openDate = exam.registrationOpenDate ? new Date(exam.registrationOpenDate) : null;
    const closeDate = exam.registrationCloseDate ? new Date(exam.registrationCloseDate) : null;
    if (openDate && now < openDate) return false;
    if (closeDate && now > closeDate) return false;
    return true;
  };

  const getAllExams = async () => {
    const res = await fetch(`${API_BASE}/api/scholarship/admin/exams`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch exams");
    const data = await res.json();
    setExams(data);
    return data;
  };

  const value = {
    exams,
    registrations,
    isLoading,
    error,
    lastSaved,
    createExam,
    updateExam,
    deleteExam,
    uploadExamTemplate,
    updateExamTemplateQuestions,
    getRegisteredStudents,
    setStudentScore,
    setWinner,
    publishResults,
    unpublishResults,
    getOpenExams,
    getOpenExamsForRegistration,
    registerForExam,
    getMyRegistrations,
    getRegistration,
    saveExamProgress,
    submitExamAnswers,
    fetchMyResult,
    checkRegistrationOpen,
    isRegistrationOpen,
    getAllExams,
  };

  return <ScholarshipContext.Provider value={value}>{children}</ScholarshipContext.Provider>;
}

export function useScholarship() {
  const ctx = useContext(ScholarshipContext);
  if (!ctx) {
    throw new Error("useScholarship must be used within a ScholarshipProvider");
  }
  return ctx;
}