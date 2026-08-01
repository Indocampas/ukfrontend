// src/pages/Books/BookDetailsModal.jsx
import { FiX, FiShoppingCart, FiDownload, FiPhoneCall } from "react-icons/fi";
import { generateCoverImage } from "../../data/booksData";
import {
  UK_ACADEMY_WHATSAPP_NUMBER,
} from "../../config/siteConfig";

export default function BookDetailsModal({ book, onClose }) {
  if (!book) return null;

  const cover = book.coverImage || generateCoverImage(book.title, book.subject, book.category);
  const wantsBuy = book.actionType === "Buy Now" || book.actionType === "Buy Now + Download";
  const wantsDownload =
    book.actionType === "Download" || book.actionType === "Buy Now + Download";

  const handleBuy = () => {
    if (book.buyLink) {
      window.open(book.buyLink, "_blank", "noopener,noreferrer");
    } else {
      const msg = encodeURIComponent(
        `Hi UK Academy, I'd like to buy "${book.title}" (${book.subject}, Class ${book.standard}).`
      );
      window.open(`https://wa.me/${UK_ACADEMY_WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    }
  };

  const handleDownload = () => {
    if (book.downloadUrl) {
      window.open(book.downloadUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="uka-book-modal-overlay" onClick={onClose}>
      <div className="uka-book-modal" onClick={(e) => e.stopPropagation()}>
        <button className="uka-book-modal-close" onClick={onClose} aria-label="Close">
          <FiX />
        </button>
        <div className="uka-book-modal-cover">
          <img src={cover} alt={book.title} />
        </div>
        <div className="uka-book-modal-body">
          <div className="uka-book-meta">
            <span>{book.subject}</span>
            <span>Class {book.standard}</span>
            {book.bookType && <span>{book.bookType}</span>}
          </div>
          <h2>{book.title}</h2>
          <div className="uka-book-modal-info">
            {book.author && (
              <>
                <b>Author:</b> {book.author}
                <br />
              </>
            )}
            {book.publisher && (
              <>
                <b>Publisher:</b> {book.publisher}
                <br />
              </>
            )}
            {book.edition && (
              <>
                <b>Edition/Year:</b> {book.edition}
              </>
            )}
          </div>
          {book.description && (
            <p className="uka-book-modal-desc">{book.description}</p>
          )}
          {book.price && <div className="uka-book-modal-price">{book.price}</div>}

          <div className="uka-book-modal-actions">
            {wantsBuy && (
              <button className="uka-book-btn uka-book-btn-primary" onClick={handleBuy}>
                <FiShoppingCart /> Buy Now
              </button>
            )}
            {wantsDownload && (
              <button
                className="uka-book-btn uka-book-btn-view"
                onClick={handleDownload}
                disabled={!book.downloadUrl}
              >
                <FiDownload /> Download
              </button>
            )}
            {!book.buyLink && wantsBuy && (
              <span style={{ fontSize: 11.5, color: "#6b7280", alignSelf: "center" }}>
                <FiPhoneCall style={{ verticalAlign: "middle" }} /> Opens WhatsApp to order
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
