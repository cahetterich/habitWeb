// src/services/userService.js

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function handleResponse(res) {
  if (!res.ok) {
    let message = "Erro ao comunicar com a API.";
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignora
    }
    throw new Error(message);
  }
  return res.json();
}

// GET /api/me
export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/api/me`, {
    cache: "no-store",
  });
  return handleResponse(res);
}
