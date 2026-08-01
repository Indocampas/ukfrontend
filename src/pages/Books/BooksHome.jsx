// src/pages/Books/BooksHome.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as FiIcons from "react-icons/fi";
import { BOOK_CATEGORIES } from "../../data/booksData";
import { useBooks } from "../../context/BooksContext";
import "./Books.css";

export default function BooksHome() {
  const navigate = useNavigate();
  const { countBooksFor } = useBooks();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="books" className="uka-books-page">
      <div className="uka-books-container">
        <div className="uka-books-header">
          <span className="uka-books-eyebrow">STUDY MATERIAL</span>
          <h1>Books Library</h1>
          <p>
            Browse NCERT, JEE, NEET, Olympiad and NSTSE books curated by UK Academy —
            pick a category to get started.
          </p>
        </div>

        <div className="uka-cat-grid">
          {BOOK_CATEGORIES.map((cat, i) => {
            const Icon = FiIcons[cat.icon] || FiIcons.FiBook;
            const count = countBooksFor(cat.id);
            return (
              <button
                key={cat.id}
                className="uka-cat-card"
                data-color={cat.gradient[0]}
                style={{
                  '--gradient-start': cat.gradient[0],
                  '--gradient-end': cat.gradient[1],
                  animationDelay: `${i * 0.06}s`,
                }}
                onClick={() => navigate(`/books/${cat.id}`)}
              >
                <div className="uka-cat-icon">
                  <Icon />
                </div>
                <div>
                  <h3>{cat.name}</h3>
                  <p>{cat.tagline}</p>
                </div>
                <span className="uka-cat-count">
                  {count} {count === 1 ? "Book" : "Books"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}