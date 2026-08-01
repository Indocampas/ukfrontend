// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const TOKEN_KEY = "uka_token";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return false;
    }
  });
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsCheckingAuth(false);
      return;
    }

    // Check token validity
    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          clearToken();
          setIsAuthenticated(false);
          return null;
        }
        if (!res.ok) throw new Error("Session expired");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setIsAuthenticated(true);
        }
      })
      .catch((err) => {
        console.error("Auth check error:", err);
        clearToken();
        setIsAuthenticated(false);
      })
      .finally(() => setIsCheckingAuth(false));
  }, []);

  const login = async (email, password) => {
    setError("");
    setIsCheckingAuth(true);

    // Hardcoded admin credentials for now
    const ADMIN_EMAIL = "ukjeeneetacademy@gmail.com";
    const ADMIN_PASSWORD = "UKAcademy123";

    try {
      // Try backend login first
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          setToken(data.token);
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
          return true;
        }
      }

      // Fallback to hardcoded credentials if backend fails
      if (
        email.trim().toLowerCase() === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
      ) {
        setToken("ukacademy-admin-authenticated");
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
        return true;
      }

      setError("Invalid email or password. Please try again.");
      setIsCheckingAuth(false);
      return false;
    } catch (err) {
      console.error("Login error:", err);
      
      // Try hardcoded credentials as fallback
      if (
        email.trim().toLowerCase() === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
      ) {
        setToken("ukacademy-admin-authenticated");
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
        return true;
      }

      setError("Server error. Please try again later.");
      setIsCheckingAuth(false);
      return false;
    }
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
  };

  const value = { isAuthenticated, isCheckingAuth, login, logout, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

// ---- token helpers ----
export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

function clearToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}