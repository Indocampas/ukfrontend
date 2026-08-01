import { useState } from "react";
import { FiClock, FiUsers, FiCheck } from "react-icons/fi";
import { buildLiveBatches } from "../../../data/batches";
import { useFormModal } from "../../../context/FormModalContext";

export default function BatchSelector({ pathKey, color, courseLabel }) {
  const batches = buildLiveBatches(pathKey);
  const [selected, setSelected] = useState(null);
  const { openForm } = useFormModal();

  const handleSelect = (batch) => {
    setSelected(batch.key);
    openForm("Apply Now", { course: `${courseLabel} — ${batch.label} (${batch.time})` });
  };

  return (
    <section className="course-detail2-section">
      <h2 className="course-detail2-section-title">Live Class Batches</h2>
      <div className="batch-selector-grid">
        {batches.map((b) => {
          const isSelected = selected === b.key;
          const isLow = b.seatsLeft <= 10;
          return (
            <div className={`batch-card ${isSelected ? "is-selected" : ""}`} key={b.key} style={isSelected ? { borderColor: color } : undefined}>
              <h4>{b.label}</h4>
              <p className="batch-card-time">
                <FiClock /> {b.time}
              </p>
              <p className={`batch-card-seats ${isLow ? "is-low" : ""}`}>
                <FiUsers /> {b.seatsLeft} seats available
              </p>
              <button
                className="batch-card-select"
                style={isSelected ? { background: color, borderColor: color } : { borderColor: color, color }}
                onClick={() => handleSelect(b)}
              >
                {isSelected ? <><FiCheck /> Selected</> : "Select"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
