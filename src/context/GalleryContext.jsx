// src/context/GalleryContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_GALLERY_DATA } from "../data/galleryData.jsx";
import { getToken } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";
const GalleryContext = createContext(null);

export function GalleryProvider({ children }) {
  const [images, setImages] = useState(DEFAULT_GALLERY_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState("");

  const fetchGallery = async () => {
    try {
      // No headers needed for public GET
      const res = await fetch(`${API_BASE}/api/gallery`);
      if (!res.ok) throw new Error("Failed to load gallery");
      const data = await res.json();
      setImages(data);
      setError("");
    } catch (err) {
      console.error("Could not load gallery from server, showing defaults.", err);
      setError("Could not load the latest gallery. Showing cached images.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const authHeaders = () => {
    const token = getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const addImage = async (item) => {
    try {
      const res = await fetch(`${API_BASE}/api/gallery`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: item.title,
          category: item.category,
          image: item.image,
          description: item.description,
        }),
      });
      if (res.status === 401) {
        throw new Error("You must be logged in to add images. Please log in again.");
      }
      if (!res.ok) {
        throw new Error("Failed to add image");
      }
      const created = await res.json();
      setImages((prev) => [...prev, created]);
      setLastSaved(new Date());
      return created;
    } catch (err) {
      console.error("Add image error:", err);
      throw err;
    }
  };

  const replaceImage = async (id, newImageSrc) => {
    try {
      const res = await fetch(`${API_BASE}/api/gallery/${id}/image`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ image: newImageSrc }),
      });
      if (res.status === 401) {
        throw new Error("You must be logged in to replace images. Please log in again.");
      }
      if (!res.ok) {
        throw new Error("Failed to replace image");
      }
      const updated = await res.json();
      setImages((prev) => prev.map((img) => (img.id === id ? updated : img)));
      setLastSaved(new Date());
    } catch (err) {
      console.error("Replace image error:", err);
      throw err;
    }
  };

  const updateImage = async (id, updates) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
    );
    try {
      const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.status === 401) {
        throw new Error("You must be logged in to update images. Please log in again.");
      }
      if (!res.ok) throw new Error("Failed to update image");
      const updated = await res.json();
      setImages((prev) => prev.map((img) => (img.id === id ? updated : img)));
      setLastSaved(new Date());
    } catch (err) {
      console.error(err);
      fetchGallery();
    }
  };

  const deleteImage = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) {
        throw new Error("You must be logged in to delete images. Please log in again.");
      }
      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to delete image");
      }
      setImages((prev) => prev.filter((img) => img.id !== id));
      setLastSaved(new Date());
    } catch (err) {
      console.error("Delete image error:", err);
      throw err;
    }
  };

  const saveGallery = async () => {
    await fetchGallery();
    setLastSaved(new Date());
  };

  const resetToDefaults = () => {
    console.warn("resetToDefaults is not supported against the live backend.");
    fetchGallery();
  };

  const value = {
    images,
    isLoading,
    error,
    addImage,
    replaceImage,
    updateImage,
    deleteImage,
    resetToDefaults,
    saveGallery,
    lastSaved,
  };

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  );
}

export function useGallery() {
  const ctx = useContext(GalleryContext);
  if (!ctx) {
    throw new Error("useGallery must be used within a GalleryProvider");
  }
  return ctx;
}