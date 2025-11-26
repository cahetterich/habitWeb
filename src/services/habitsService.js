// src/services/habitsService.js

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function handleResponse(res) {
  if (!res.ok) {
    let message = "Erro ao comunicar com a API.";
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return res.json();
}

// GET /api/habits
export async function listHabits() {
  const res = await fetch(`${BASE_URL}/api/habits`, {
    cache: "no-store",
  });
  return handleResponse(res);
}

// POST /api/habits
export async function createHabit(data) {
  const res = await fetch(`${BASE_URL}/api/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      frequency: data.frequency,
      frequencyLabel: data.frequencyLabel,
    }),
  });
  return handleResponse(res);
}

// POST /api/habits/:id/toggle-today
export async function toggleHabitToday(id) {
  const res = await fetch(`${BASE_URL}/api/habits/${id}/toggle-today`, {
    method: "POST",
  });
  return handleResponse(res);
}

export async function getHabit(id) {
  const res = await fetch(`${BASE_URL}/api/habits/${id}`, {
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function updateHabit(id, data) {
  const res = await fetch(`${BASE_URL}/api/habits/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteHabit(id) {
  const res = await fetch(`${BASE_URL}/api/habits/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
