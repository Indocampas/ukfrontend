// src/pages/Books/BooksStandards.jsx
// Step 3 of the Books flow: Standard/Class grid for the chosen category+subject
import { useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import {
  CATEGORY_MAP,
  CATEGORY_STANDARDS,
  unslugifySubject,
  SUBJECT_COLORS,
} from "../../data/booksData";
import { useBooks } from "../../context/BooksContext";
import BooksBreadcrumb from "./BooksBreadcrumb";
import "./Books.css";

export default function BooksStandards() {
  const { categoryId, subjectSlug } = useParams();
  const navigate = useNavigate();
  const { countBooksFor } = useBooks();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const category = CATEGORY_MAP[categoryId];
  const subject = unslugifySubject(subjectSlug, categoryId);
  const standards = CATEGORY_STANDARDS[categoryId];

  if (!category || !subject || !standards) {
    return <Navigate to="/books" replace />;
  }

  // Get the subject color for dynamic hover
  const subjectColor = SUBJECT_COLORS[subject] || "#e8b430";

  return (
    <div className="uka-books-page">
      <div className="uka-books-container">
        <button
          className="uka-books-back"
          onClick={() => navigate(`/books/${categoryId}/${subjectSlug}`)}
        >
          <FiArrowLeft /> All Subjects
        </button>

        <BooksBreadcrumb
          trail={[
            { label: "Books", to: "/books" },
            { label: category.name, to: `/books/${categoryId}` },
            { label: subject },
          ]}
        />

        <div className="uka-books-header">
          <span className="uka-books-eyebrow">{category.name.toUpperCase()} · {subject.toUpperCase()}</span>
          <h1>Choose a Standard / Class</h1>
          <p>Select a class to see the {subject} books available for {category.name}.</p>
        </div>

        <div className="uka-tile-grid">
          {standards.map((std, i) => {
            const count = countBooksFor(categoryId, subject, std);
            return (
              <button
                key={std}
                className="uka-tile-card standard"
                data-color={subjectColor}
                style={{ 
                  animationDelay: `${i * 0.04}s`,
                  '--card-hover-color': subjectColor + '20',
                  '--text-hover-color': '#0a1330',
                }}
                onClick={() =>
                  navigate(`/books/${categoryId}/${subjectSlug}/${std}`)
                }
              >
                <div className="uka-tile-icon" style={{ background: subjectColor }}>
                  {std}
                </div>
                <h4>Class {std}</h4>
                <span>
                  {count} {count === 1 ? "Book" : "Books"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}