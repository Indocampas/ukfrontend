// src/pages/Books/BooksGrid.jsx
// Step 4 of the Books flow: Book cards for the chosen category/subject/standard
import { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { FiArrowLeft, FiEye, FiShoppingCart, FiDownload, FiBookOpen } from "react-icons/fi";
import {
  CATEGORY_MAP,
  unslugifySubject,
  generateCoverImage,
  SUBJECT_COLORS,
} from "../../data/booksData";
import { useBooks } from "../../context/BooksContext";
import BooksBreadcrumb from "./BooksBreadcrumb";
import BookDetailsModal from "./BookDetailsModal";
import "./Books.css";

export default function BooksGrid() {
  const { categoryId, subjectSlug, standard } = useParams();
  const navigate = useNavigate();
  const { getBooksFor } = useBooks();
  const [activeBook, setActiveBook] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const category = CATEGORY_MAP[categoryId];
  const subject = unslugifySubject(subjectSlug, categoryId);

  if (!category || !subject) {
    return <Navigate to="/books" replace />;
  }

  const books = getBooksFor(categoryId, subject, standard);
  const subjectColor = SUBJECT_COLORS[subject] || "#e8b430";

  const handleBuy = (book) => {
    if (book.buyLink) {
      window.open(book.buyLink, "_blank", "noopener,noreferrer");
    } else {
      setActiveBook(book);
    }
  };

  const handleDownload = (book) => {
    if (book.downloadUrl) {
      window.open(book.downloadUrl, "_blank", "noopener,noreferrer");
    } else {
      setActiveBook(book);
    }
  };

  return (
    <div className="uka-books-page">
      <div className="uka-books-container">
        <button
          className="uka-books-back"
          onClick={() => navigate(`/books/${categoryId}/${subjectSlug}`)}
        >
          <FiArrowLeft /> All Classes
        </button>

        <BooksBreadcrumb
          trail={[
            { label: "Books", to: "/books" },
            { label: category.name, to: `/books/${categoryId}` },
            { label: subject, to: `/books/${categoryId}/${subjectSlug}` },
            { label: `Class ${standard}` },
          ]}
        />

        <div className="uka-books-header">
          <span className="uka-books-eyebrow">
            {category.name.toUpperCase()} · {subject.toUpperCase()} · CLASS {standard}
          </span>
          <h1>Available Books</h1>
          <p>
            {books.length} {books.length === 1 ? "book" : "books"} found for {subject}, Class{" "}
            {standard}.
          </p>
        </div>

        {books.length === 0 ? (
          <div className="uka-books-empty">
            <FiBookOpen size={40} style={{ marginBottom: 10, opacity: 0.4 }} />
            <h3>No books here yet</h3>
            <p>Check back soon — the admin team is adding more titles regularly.</p>
          </div>
        ) : (
          <div className="uka-books-grid">
            {books.map((book, i) => {
              const cover =
                book.coverImage || generateCoverImage(book.title, book.subject, book.category);
              const wantsBuy =
                book.actionType === "Buy Now" || book.actionType === "Buy Now + Download";
              const wantsDownload =
                book.actionType === "Download" || book.actionType === "Buy Now + Download";
              
              // Use book-specific color or fallback to subject color
              const bookColor = book.color || subjectColor;

              return (
                <div
                  key={book.id}
                  className="uka-book-card"
                  data-color={bookColor}
                  style={{ 
                    animationDelay: `${i * 0.05}s`,
                    '--card-hover-color': bookColor + '15',
                    '--text-hover-color': '#0a1330',
                  }}
                >
                  <div className="uka-book-cover-wrap" onClick={() => setActiveBook(book)}>
                    <img src={cover} alt={book.title} loading="lazy" />
                    {book.bookType && <span className="uka-book-type-badge">{book.bookType}</span>}
                  </div>
                  <div className="uka-book-body">
                    <h4>{book.title}</h4>
                    <div className="uka-book-meta">
                      <span>{book.subject}</span>
                      <span>Class {book.standard}</span>
                    </div>
                    {book.description && (
                      <p className="uka-book-desc">{book.description}</p>
                    )}
                    {book.price && <div className="uka-book-price">{book.price}</div>}
                    <div className="uka-book-actions">
                      <button
                        className="uka-book-btn uka-book-btn-view"
                        onClick={() => setActiveBook(book)}
                      >
                        <FiEye /> Details
                      </button>
                      {wantsBuy && (
                        <button
                          className="uka-book-btn uka-book-btn-primary"
                          onClick={() => handleBuy(book)}
                        >
                          <FiShoppingCart /> Buy
                        </button>
                      )}
                      {wantsDownload && (
                        <button
                          className="uka-book-btn uka-book-btn-primary"
                          onClick={() => handleDownload(book)}
                        >
                          <FiDownload /> Get
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {activeBook && (
        <BookDetailsModal book={activeBook} onClose={() => setActiveBook(null)} />
      )}
    </div>
  );
}