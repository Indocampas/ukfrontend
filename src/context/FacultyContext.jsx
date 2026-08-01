// src/context/FacultyContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";

const FacultyContext = createContext(null);

export function FacultyProvider({ children }) {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      // No headers needed for public GET
      const res = await fetch(`${API_BASE}/api/faculty`);
      if (!res.ok) throw new Error("Failed to load faculty");
      const data = await res.json();
      setFaculty(data);
    } catch (err) {
      console.error("Error loading faculty:", err);
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
  const addFaculty = async (member) => {
    const res = await fetch(`${API_BASE}/api/faculty`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(member),
    });
    if (!res.ok) throw new Error("Failed to add faculty");
    const created = await res.json();
    setFaculty((prev) => [...prev, created]);
    return created;
  };

  const updateFaculty = async (id, updates) => {
    const res = await fetch(`${API_BASE}/api/faculty/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update faculty");
    const updated = await res.json();
    setFaculty((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const deleteFaculty = async (id) => {
    const res = await fetch(`${API_BASE}/api/faculty/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok && res.status !== 204) throw new Error("Failed to delete faculty");
    setFaculty((prev) => prev.filter((m) => m.id !== id));
  };

  const reorderFaculty = async (facultyList) => {
    const res = await fetch(`${API_BASE}/api/faculty/reorder`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(facultyList),
    });
    if (!res.ok) throw new Error("Failed to reorder faculty");
    const updated = await res.json();
    setFaculty(updated);
  };

  const value = {
    faculty,
    loading,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    reorderFaculty,
  };

  return <FacultyContext.Provider value={value}>{children}</FacultyContext.Provider>;
}

export function useFaculty() {
  const ctx = useContext(FacultyContext);
  if (!ctx) throw new Error("useFaculty must be used within FacultyProvider");
  return ctx;
}