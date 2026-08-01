// src/pages/Books/BooksSubjects.jsx
// Step 2 of the Books flow: Subject grid for the chosen category
import { useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import * as FiIcons from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";
import {
  CATEGORY_MAP,
  CATEGORY_SUBJECTS,
  SUBJECT_ICONS,
  SUBJECT_COLORS,
  slugifySubject,
} from "../../data/booksData";
import { useBooks } from "../../context/BooksContext";
import BooksBreadcrumb from "./BooksBreadcrumb";
import "./Books.css";

export default function BooksSubjects() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { countBooksFor } = useBooks();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const category = CATEGORY_MAP[categoryId];
  const subjects = CATEGORY_SUBJECTS[categoryId];

  if (!category || !subjects) {
    return <Navigate to="/books" replace />;
  }

  return (
    <div className="uka-books-page">
      <div className="uka-books-container">
        <button className="uka-books-back" onClick={() => navigate("/books")}>
          <FiArrowLeft /> All Categories
        </button>

        <BooksBreadcrumb
          trail={[
            { label: "Books", to: "/books" },
            { label: category.name },
          ]}
        />

        <div className="uka-books-header">
          <span className="uka-books-eyebrow">{category.name.toUpperCase()}</span>
          <h1>Choose a Subject</h1>
          <p>{category.tagline}</p>
        </div>

        <div className="uka-tile-grid">
          {subjects.map((subject, i) => {
            const Icon = FiIcons[SUBJECT_ICONS[subject]] || FiIcons.FiBook;
            const color = SUBJECT_COLORS[subject] || "#0a1330";
            const count = countBooksFor(categoryId, subject);
            return (
              <button
                key={subject}
                className="uka-tile-card"
                data-color={color}
                style={{ 
                  animationDelay: `${i * 0.05}s`,
                  '--card-hover-color': color + '20',
                  '--text-hover-color': '#0a1330',
                }}
                onClick={() => navigate(`/books/${categoryId}/${slugifySubject(subject)}`)}
              >
                <div className="uka-tile-icon" style={{ background: color }}>
                  <Icon />
                </div>
                <h4>{subject}</h4>
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