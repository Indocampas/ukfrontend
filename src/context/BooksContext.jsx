// src/context/BooksContext.jsx (Updated with debugging)

import { createContext, useContext, useEffect, useState } from "react";
import { getToken } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://ukacademy.onrender.com";

const BooksContext = createContext(null);

export function BooksProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/books`);
      if (!res.ok) throw new Error("Failed to load books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Error loading books:", err);
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

  const addBook = async (book) => {
    try {
      // Log the exact data being sent
      console.log("Sending book data:", JSON.stringify(book, null, 2));

      const res = await fetch(`${API_BASE}/api/books`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(book),
      });

      // Log the response status
      console.log("Response status:", res.status);

      // Try to get the error response
      if (!res.ok) {
        let errorMessage = `Failed to add book (Status: ${res.status})`;
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            console.error("Server error response:", errorData);
            if (errorData.message) errorMessage = errorData.message;
            if (errorData.error) errorMessage = errorData.error;
          } else {
            const text = await res.text();
            console.error("Server error text:", text);
            errorMessage = text || errorMessage;
          }
        } catch (e) {
          console.error("Could not parse error response:", e);
          errorMessage = `${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const created = await res.json();
      setBooks((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error("Add book error:", err);
      throw err;
    }
  };

  const updateBook = async (id, updates) => {
    try {
      const bookData = {
        title: updates.title || "",
        category: updates.category || "",
        subject: updates.subject || "",
        standard: updates.standard || 0,
        author: updates.author || "",
        publisher: updates.publisher || "",
        description: updates.description || "",
        edition: updates.edition || "",
        price: updates.price || "",
        bookType: updates.bookType || "Printed Book",
        actionType: updates.actionType || "Buy Now",
        buyLink: updates.buyLink || "",
        downloadUrl: updates.downloadUrl || "",
        isPublished: updates.isPublished !== undefined ? updates.isPublished : true,
        coverImage: updates.coverImage || null
      };

      console.log("Updating book:", JSON.stringify(bookData, null, 2));

      const res = await fetch(`${API_BASE}/api/books/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(bookData),
      });

      if (!res.ok) {
        let errorMessage = `Failed to update book (Status: ${res.status})`;
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json();
            if (errorData.message) errorMessage = errorData.message;
          } else {
            const text = await res.text();
            errorMessage = text || errorMessage;
          }
        } catch (e) {
          errorMessage = `${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const updated = await res.json();
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err) {
      console.error("Update book error:", err);
      throw err;
    }
  };

  const deleteBook = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/books/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok && res.status !== 204) {
        let errorMessage = `Failed to delete book (Status: ${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (e) {
          errorMessage = `${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Delete book error:", err);
      throw err;
    }
  };

  const togglePublish = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/books/${id}/publish`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      if (!res.ok) {
        let errorMessage = `Failed to toggle publish (Status: ${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (e) {
          errorMessage = `${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }
      const updated = await res.json();
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err) {
      console.error("Toggle publish error:", err);
      throw err;
    }
  };

  const getBooksFor = (category, subject, standard) => {
    return books.filter(
      (b) =>
        b.category === category &&
        b.subject === subject &&
        String(b.standard) === String(standard) &&
        b.isPublished !== false
    );
  };

  const countBooksFor = (category, subject, standard) => {
    let list = books.filter((b) => b.category === category && b.isPublished !== false);
    if (subject) list = list.filter((b) => b.subject === subject);
    if (standard !== undefined && standard !== null)
      list = list.filter((b) => String(b.standard) === String(standard));
    return list.length;
  };

  const value = {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    togglePublish,
    getBooksFor,
    countBooksFor,
  };

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks() {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used within BooksProvider");
  return ctx;
}