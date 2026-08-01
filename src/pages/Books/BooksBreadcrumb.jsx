// src/pages/Books/BooksBreadcrumb.jsx
import { useNavigate } from "react-router-dom";

export default function BooksBreadcrumb({ trail }) {
  // trail: array of { label, to } — last item has no `to` (current page)
  const navigate = useNavigate();

  return (
    <div className="uka-books-breadcrumb">
      {trail.map((item, i) => {
        const isLast = i === trail.length - 1;
        return (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            {isLast ? (
              <span className="current">{item.label}</span>
            ) : (
              <button onClick={() => navigate(item.to)}>{item.label}</button>
            )}
            {!isLast && <span className="sep">/</span>}
          </span>
        );
      })}
    </div>
  );
}
