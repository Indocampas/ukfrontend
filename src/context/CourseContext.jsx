// src/context/CourseContext.jsx// src/context/CourseContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "./AuthContext";

// CHANGE THIS LINE:
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";

// ... rest of the file remains the same

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const res = await fetch(`${API_BASE}/api/courses`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to load courses: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Could not load courses from server.", err);
      setError(err.message || "Could not load the latest courses. Showing cached data.");
      // Keep existing courses if any, don't clear them
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const authHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // --- Admin CRUD operations ---
  const addCourse = async (course) => {
    const res = await fetch(`${API_BASE}/api/courses`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(course),
    });
    if (!res.ok) throw new Error("Failed to add course");
    const created = await res.json();
    setCourses((prev) => [...prev, created]);
    setLastSaved(new Date());
    return created;
  };

  const updateCourse = async (id, updates) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    try {
      const res = await fetch(`${API_BASE}/api/courses/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update course");
      const updated = await res.json();
      setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setLastSaved(new Date());
    } catch (err) {
      console.error(err);
      await fetchCourses();
    }
  };

  const deleteCourse = async (id) => {
    const res = await fetch(`${API_BASE}/api/courses/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok && res.status !== 204) throw new Error("Failed to delete course");
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setLastSaved(new Date());
  };

  const replaceCourseImage = async (id, imageDataUrl) => {
    const res = await fetch(`${API_BASE}/api/courses/${id}/image`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(imageDataUrl),
    });
    if (!res.ok) throw new Error("Failed to replace course image");
    const updated = await res.json();
    setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setLastSaved(new Date());
  };

  const uploadCourseVideo = async (id, file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("video", file);
    const res = await fetch(`${API_BASE}/api/courses/${id}/video`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload course video");
    const updated = await res.json();
    setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setLastSaved(new Date());
  };

  const setCourseVideoUrl = async (id, videoUrl) => {
    const res = await fetch(`${API_BASE}/api/courses/${id}/video`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(videoUrl),
    });
    if (!res.ok) throw new Error("Failed to set video URL");
    const updated = await res.json();
    setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setLastSaved(new Date());
  };

  const uploadCoursePdf = async (id, file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append("pdf", file);
    const res = await fetch(`${API_BASE}/api/courses/${id}/pdf`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload PDF");
    const updated = await res.json();
    setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setLastSaved(new Date());
  };

  const setCoursePdfUrl = async (id, pdfUrl) => {
    const res = await fetch(`${API_BASE}/api/courses/${id}/pdf`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(pdfUrl),
    });
    if (!res.ok) throw new Error("Failed to set PDF URL");
    const updated = await res.json();
    setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setLastSaved(new Date());
  };

  const saveCourses = async () => {
    await fetchCourses();
    setLastSaved(new Date());
  };

  const value = {
    courses,
    isLoading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    replaceCourseImage,
    uploadCourseVideo,
    setCourseVideoUrl,
    uploadCoursePdf,
    setCoursePdfUrl,
    saveCourses,
    lastSaved,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourses() {
  const ctx = useContext(CourseContext);
  if (!ctx) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return ctx;
}