// src/context/SyllabusContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";

const SyllabusContext = createContext(null);

export function SyllabusProvider({ children }) {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const fetchSyllabus = async () => {
    try {
      // No headers needed for public GET
      const res = await fetch(`${API_BASE}/api/syllabus`);
      if (!res.ok) throw new Error("Failed to load syllabus");
      const data = await res.json();
      setSyllabus(data);
    } catch (err) {
      console.error("Error loading syllabus:", err);
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
  const addSyllabus = async (item) => {
    const res = await fetch(`${API_BASE}/api/syllabus`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Failed to add syllabus");
    const created = await res.json();
    setSyllabus((prev) => [...prev, created]);
    return created;
  };

  const updateSyllabus = async (id, updates) => {
    const res = await fetch(`${API_BASE}/api/syllabus/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update syllabus");
    const updated = await res.json();
    setSyllabus((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const deleteSyllabus = async (id) => {
    const res = await fetch(`${API_BASE}/api/syllabus/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok && res.status !== 204) throw new Error("Failed to delete syllabus");
    setSyllabus((prev) => prev.filter((s) => s.id !== id));
  };

  const togglePublish = async (id) => {
    const res = await fetch(`${API_BASE}/api/syllabus/${id}/publish`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to toggle publish");
    const updated = await res.json();
    setSyllabus((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const value = {
    syllabus,
    loading,
    addSyllabus,
    updateSyllabus,
    deleteSyllabus,
    togglePublish,
  };

  return <SyllabusContext.Provider value={value}>{children}</SyllabusContext.Provider>;
}

export function useSyllabus() {
  const ctx = useContext(SyllabusContext);
  if (!ctx) throw new Error("useSyllabus must be used within SyllabusProvider");
  return ctx;
}