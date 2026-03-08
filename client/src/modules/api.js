const API_BASE = import.meta.env.VITE_API_BASE;

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

const handleErrorResponse = async (res) => {
  try {
    const err = await res.json();
    return err.error || err.message || `Error: ${res.status}`;
  } catch {
    return `Server error: ${res.status} ${res.statusText}`;
  }
};

export async function extractText(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/api/ocr/extract`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errMsg = await handleErrorResponse(res);
    throw new Error(errMsg);
  }

  return res.json();
}

export async function analyzeIngredients(text, file) {
  const formData = new FormData();
  formData.append("text", text);
  if (file) {
    formData.append("image", file);
  }

  const res = await fetch(`${API_BASE}/api/analysis/analyze`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) {
    const errMsg = await handleErrorResponse(res);
    throw new Error(errMsg);
  }

  return res.json();
}

export async function getAnalysisHistory() {
  const res = await fetch(`${API_BASE}/api/analysis/history`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errMsg = await handleErrorResponse(res);
    throw new Error(errMsg);
  }

  return res.json();
}
