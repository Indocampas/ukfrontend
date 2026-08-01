// src/context/FormModalContext.jsx
import { createContext, useContext, useState, useCallback, useMemo } from "react";

const FormModalContext = createContext(null);

export function FormModalProvider({ children }) {
  // activeForm is either null, or the exact button/form label
  // e.g. "Apply Now" | "Free Counselling" | "Scholarship Test" | "Book Free Counselling" | "Enquire Now"
  const [activeForm, setActiveForm] = useState(null);
  const [presetCourse, setPresetCourse] = useState("");

  const openForm = useCallback((formType, options = {}) => {
    setActiveForm(formType);
    setPresetCourse(options.course || "");
  }, []);

  const closeForm = useCallback(() => {
    setActiveForm(null);
    setPresetCourse("");
  }, []);

  const value = useMemo(
    () => ({ activeForm, presetCourse, openForm, closeForm }),
    [activeForm, presetCourse, openForm, closeForm]
  );

  return <FormModalContext.Provider value={value}>{children}</FormModalContext.Provider>;
}

export function useFormModal() {
  const ctx = useContext(FormModalContext);
  if (!ctx) {
    throw new Error("useFormModal must be used within a FormModalProvider");
  }
  return ctx;
}
