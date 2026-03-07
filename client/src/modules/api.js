const API_BASE = import.meta.env.VITE_API_BASE;

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export async function extractText(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/ocr/extract`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to extract text");
  }

  return res.json();
}

export async function analyzeIngredients(text, file) {
  const formData = new FormData();
  formData.append("text", text);
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/analysis/analyze`, {
    method: "POST",
    headers: { ...getAuthHeaders() }, // Add token here
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Analysis failed");
  }

  return res.json();
}

export async function getAnalysisHistory() {
  const res = await fetch(`${API_BASE}/analysis/history`, {
    headers: getAuthHeaders(), // Add token here
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch history");
  }

  return res.json();
}

