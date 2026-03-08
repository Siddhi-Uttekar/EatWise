const API_BASE = import.meta.env.VITE_API_BASE;

const handleErrorResponse = async (res) => {
  try {
    const err = await res.json();
    return err.error || err.message || `Error: ${res.status}`;
  } catch {
    return `Server error: ${res.status} ${res.statusText}`;
  }
};

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errMsg = await handleErrorResponse(res);
    throw new Error(errMsg);
  }

  return res.json();
}

export async function registerUser(userInfo) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  });

  if (!res.ok) {
    const errMsg = await handleErrorResponse(res);
    throw new Error(errMsg);
  }

  return res.json();
}
