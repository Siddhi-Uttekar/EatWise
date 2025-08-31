export function getRatingColor(rating) {
  const map = { excellent: "green", good: "green", fair: "yellow", poor: "orange", dangerous: "red" };
  return map[rating] || "gray";
}

export function getRiskColor(risk) {
  const map = { safe: "green", moderate: "yellow", risky: "red" };
  return map[risk] || "gray";
}

export function getRiskEmoji(risk) {
  const map = { safe: "✅", moderate: "⚠️", risky: "❌" };
  return map[risk] || "ℹ️";
}
