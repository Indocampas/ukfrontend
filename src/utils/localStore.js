// src/utils/localStore.js
// Tiny JSON-safe localStorage wrapper used by the Scholarship Exam module
// while it runs without a backend. Every read/write is wrapped in try/catch
// since localStorage can throw (private browsing, storage full, etc.).

export function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function makeLocalId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
