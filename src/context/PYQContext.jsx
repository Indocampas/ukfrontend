// src/context/PYQContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";

const PYQContext = createContext(null);

export function PYQProvider({ children }) {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPYQs();
  }, []);

  const fetchPYQs = async () => {
    try {
      // No headers needed for public GET
      const res = await fetch(`${API_BASE}/api/pyq`);
      if (!res.ok) throw new Error("Failed to load PYQs");
      const data = await res.json();
      setPyqs(data);
    } catch (err) {
      console.error("Error loading PYQs:", err);
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

  const addPYQ = async (pyq) => {
    const res = await fetch(`${API_BASE}/api/pyq`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(pyq),
    });
    if (!res.ok) throw new Error("Failed to add PYQ");
    const created = await res.json();
    setPyqs((prev) => [...prev, created]);
    return created;
  };

  const updatePYQ = async (id, updates) => {
    const res = await fetch(`${API_BASE}/api/pyq/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update PYQ");
    const updated = await res.json();
    setPyqs((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const deletePYQ = async (id) => {
    const res = await fetch(`${API_BASE}/api/pyq/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok && res.status !== 204) throw new Error("Failed to delete PYQ");
    setPyqs((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePublish = async (id) => {
    const res = await fetch(`${API_BASE}/api/pyq/${id}/publish`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to toggle publish");
    const updated = await res.json();
    setPyqs((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const value = {
    pyqs,
    loading,
    addPYQ,
    updatePYQ,
    deletePYQ,
    togglePublish,
  };

  return <PYQContext.Provider value={value}>{children}</PYQContext.Provider>;
}

export function usePYQ() {
  const ctx = useContext(PYQContext);
  if (!ctx) throw new Error("usePYQ must be used within PYQProvider");
  return ctx;
}