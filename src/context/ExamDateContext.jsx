// src/context/ExamDateContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";

const ExamDateContext = createContext(null);

export function ExamDateProvider({ children }) {
  const [examDates, setExamDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamDates();
  }, []);

  const fetchExamDates = async () => {
    try {
      // No headers needed for public GET
      const res = await fetch(`${API_BASE}/api/exam-dates`);
      if (!res.ok) throw new Error("Failed to load exam dates");
      const data = await res.json();
      setExamDates(data);
    } catch (err) {
      console.error("Error loading exam dates:", err);
    } finally {
      setLoading(false);
    }
  };

  const authHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // --- Admin CRUD operations ---
  const addExamDate = async (item) => {
    const res = await fetch(`${API_BASE}/api/exam-dates`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Failed to add exam date");
    const created = await res.json();
    setExamDates((prev) => [...prev, created]);
    return created;
  };

  const updateExamDate = async (id, updates) => {
    const res = await fetch(`${API_BASE}/api/exam-dates/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update exam date");
    const updated = await res.json();
    setExamDates((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const deleteExamDate = async (id) => {
    const res = await fetch(`${API_BASE}/api/exam-dates/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok && res.status !== 204) throw new Error("Failed to delete exam date");
    setExamDates((prev) => prev.filter((e) => e.id !== id));
  };

  const togglePublish = async (id) => {
    const res = await fetch(`${API_BASE}/api/exam-dates/${id}/publish`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to toggle publish");
    const updated = await res.json();
    setExamDates((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const value = {
    examDates,
    loading,
    addExamDate,
    updateExamDate,
    deleteExamDate,
    togglePublish,
  };

  return <ExamDateContext.Provider value={value}>{children}</ExamDateContext.Provider>;
}

export function useExamDate() {
  const ctx = useContext(ExamDateContext);
  if (!ctx) throw new Error("useExamDate must be used within ExamDateProvider");
  return ctx;
}