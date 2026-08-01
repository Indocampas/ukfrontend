// F:\uk-academy-app\src\context\FacultyProgramContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "./AuthContext";
import { AI_READY_TEACHER_COURSE } from "../data/aiReadyTeacherCourse";
import { DEFAULT_FACULTY_PROGRAMS } from "../data/defaultFacultyPrograms";

// Every Faculty Program the site should always show: the 13 established,
// backend-managed Faculty Courses (kept locally as a default/fallback set)
// plus the newer AI-Ready Teacher Course. All 14.
const ALL_DEFAULT_PROGRAMS = [...DEFAULT_FACULTY_PROGRAMS, AI_READY_TEACHER_COURSE];

// Merge whatever the backend returns with the local defaults so the Faculty
// Programs section always shows all 14 Faculty Courses, never just whichever
// subset (or none) happens to be in the database right now:
//   - a program returned by the API "wins" over the local default with the
//     same slug/id, since that's the admin-managed, up-to-date version
//   - any default program missing from the API response (backend down,
//     empty, or simply hasn't been seeded yet) is filled in locally
function withDefaultFacultyPrograms(programsFromApi) {
  const apiList = Array.isArray(programsFromApi) ? programsFromApi : [];
  const missingDefaults = ALL_DEFAULT_PROGRAMS.filter(
    (defaultProgram) =>
      !apiList.some(
        (p) => p.slug === defaultProgram.slug || p.id === defaultProgram.id
      )
  );
  return [...apiList, ...missingDefaults];
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";

const FacultyProgramContext = createContext(null);

export function FacultyProgramProvider({ children }) {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(`${API_BASE}/api/faculty-programs`);
            if (!res.ok) throw new Error("Failed to load faculty programs");
            const data = await res.json();
            setPrograms(withDefaultFacultyPrograms(data));
        } catch (err) {
            console.error("Error loading faculty programs:", err);
            setError(err.message);
            // Even if the backend is unreachable, still show all 14 default
            // Faculty Courses so the Faculty Programs section isn't empty.
            setPrograms(withDefaultFacultyPrograms([]));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const authHeaders = () => {
        const token = getToken();
        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    };

    // Admin CRUD operations
    const addProgram = async (program) => {
        try {
            const res = await fetch(`${API_BASE}/api/faculty-programs`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify(program),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to add program");
            }
            const created = await res.json();
            setPrograms((prev) => [created, ...prev]);
            return created;
        } catch (err) {
            console.error("Add program error:", err);
            throw err;
        }
    };

    const updateProgram = async (id, updates) => {
        try {
            const res = await fetch(`${API_BASE}/api/faculty-programs/${id}`, {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify(updates),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update program");
            }
            const updated = await res.json();
            setPrograms((prev) => prev.map((p) => (p.id === id ? updated : p)));
        } catch (err) {
            console.error("Update program error:", err);
            throw err;
        }
    };

    const deleteProgram = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/api/faculty-programs/${id}`, {
                method: "DELETE",
                headers: authHeaders(),
            });
            if (!res.ok && res.status !== 204) {
                const error = await res.json();
                throw new Error(error.message || "Failed to delete program");
            }
            setPrograms((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Delete program error:", err);
            throw err;
        }
    };

    const togglePublish = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/api/faculty-programs/${id}/publish`, {
                method: "PATCH",
                headers: authHeaders(),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to toggle publish");
            }
            const updated = await res.json();
            setPrograms((prev) => prev.map((p) => (p.id === id ? updated : p)));
        } catch (err) {
            console.error("Toggle publish error:", err);
            throw err;
        }
    };

    const getProgramsByCategory = (category) => {
        return programs.filter(p => p.category === category && p.isPublished !== false);
    };

    const getProgramBySlug = (slug) => {
        return programs.find(p => p.slug === slug && p.isPublished !== false) || null;
    };

    const value = {
        programs,
        loading,
        error,
        addProgram,
        updateProgram,
        deleteProgram,
        togglePublish,
        getProgramsByCategory,
        getProgramBySlug,
        fetchPrograms,
    };

    return (
        <FacultyProgramContext.Provider value={value}>
            {children}
        </FacultyProgramContext.Provider>
    );
}

export function useFacultyPrograms() {
    const ctx = useContext(FacultyProgramContext);
    if (!ctx) {
        throw new Error("useFacultyPrograms must be used within FacultyProgramProvider");
    }
    return ctx;
}