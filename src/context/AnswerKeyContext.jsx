// src/context/AnswerKeyContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";

const AnswerKeyContext = createContext(null);

export function AnswerKeyProvider({ children }) {
  const [answerKeys, setAnswerKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnswerKeys();
  }, []);

  const fetchAnswerKeys = async () => {
    try {
      // No headers needed for public GET
      const res = await fetch(`${API_BASE}/api/answer-keys`);
      if (!res.ok) throw new Error("Failed to load answer keys");
      const data = await res.json();
      setAnswerKeys(data);
    } catch (err) {
      console.error("Error loading answer keys:", err);
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
  const addAnswerKey = async (item) => {
    const res = await fetch(`${API_BASE}/api/answer-keys`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error("Failed to add answer key");
    const created = await res.json();
    setAnswerKeys((prev) => [...prev, created]);
    return created;
  };

  const updateAnswerKey = async (id, updates) => {
    const res = await fetch(`${API_BASE}/api/answer-keys/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update answer key");
    const updated = await res.json();
    setAnswerKeys((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const deleteAnswerKey = async (id) => {
    const res = await fetch(`${API_BASE}/api/answer-keys/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok && res.status !== 204) throw new Error("Failed to delete answer key");
    setAnswerKeys((prev) => prev.filter((a) => a.id !== id));
  };

  const togglePublish = async (id) => {
    const res = await fetch(`${API_BASE}/api/answer-keys/${id}/publish`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to toggle publish");
    const updated = await res.json();
    setAnswerKeys((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const value = {
    answerKeys,
    loading,
    addAnswerKey,
    updateAnswerKey,
    deleteAnswerKey,
    togglePublish,
  };

  return <AnswerKeyContext.Provider value={value}>{children}</AnswerKeyContext.Provider>;
}

export function useAnswerKey() {
  const ctx = useContext(AnswerKeyContext);
  if (!ctx) throw new Error("useAnswerKey must be used within AnswerKeyProvider");
  return ctx;
}