// src/data/batches.js
// Batch-selection data for Live Class leaves (spec section 6).
const BATCH_TEMPLATES = [
  { key: "morning", label: "Morning Batch", time: "6 AM – 9 AM" },
  { key: "afternoon", label: "Afternoon Batch", time: "2 PM – 5 PM" },
  { key: "evening", label: "Evening Batch", time: "6 PM – 9 PM" },
];

function hashSeed(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic-but-varied seats-left count (5–35) per batch, per course path. */
export function buildLiveBatches(pathKey) {
  return BATCH_TEMPLATES.map((tpl, i) => {
    const seed = hashSeed(`${pathKey}/${tpl.key}`);
    const seatsLeft = 5 + (seed % 31);
    return { ...tpl, seatsLeft };
  });
}
