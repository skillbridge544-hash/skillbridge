const BASE = import.meta.env.VITE_API_URL || "https://skillbridge-production-9578.up.railway.app";

export function apiUrl() {
  return BASE;
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("sb_token");
  if (auth || token) {
    if (!token) {
      const err = new Error("Authentification requise.");
      err.status = 401;
      throw err;
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const err = new Error(data?.message || "Une erreur est survenue.");
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }
  return data;
}

export const api = {
  register: (body) => request("/api/auth/register", { method: "POST", body }),
  login: (body) => request("/api/auth/login", { method: "POST", body }),
  me: () => request("/api/users/me", { auth: true }),
  patchMe: (body) => request("/api/users/me", { method: "PATCH", body, auth: true }),
  skills: (userId) => request(`/api/users/${userId}/skills`),
  addSkill: (body) => request("/api/skills", { method: "POST", body, auth: true }),
  deleteSkill: (id) => request(`/api/skills/${id}`, { method: "DELETE", auth: true }),
  passport: (identifiant) => request(`/api/passport/${identifiant}`),
  projects: (userId) => request(`/api/users/${userId}/projects`),
  addProject: (body) => request("/api/projects", { method: "POST", body, auth: true }),
  patchProject: (id, body) => request(`/api/projects/${id}`, { method: "PATCH", body, auth: true }),
  deleteProject: (id) => request(`/api/projects/${id}`, { method: "DELETE", auth: true }),
  opportunities: (query = "") => request(`/api/opportunities${query}`),
  opportunity: (id) => request(`/api/opportunities/${id}`),
  createOpportunity: (body) => request("/api/opportunities", { method: "POST", body, auth: true }),
  patchOpportunity: (id, body) => request(`/api/opportunities/${id}`, { method: "PATCH", body, auth: true }),
  match: (oppId, userId) => request(`/api/opportunities/${oppId}/match/${userId}`),
  matches: (userId) => request(`/api/users/${userId}/matches`),
  suggestions: (domaine) => request(`/api/domaines/${encodeURIComponent(domaine)}/suggestions-competences`),
  mentors: (domaine = "") => request(`/api/mentors${domaine ? `?domaine=${encodeURIComponent(domaine)}` : ""}`),
  requestMentorship: (mentor_id) => request("/api/mentorship-requests", { method: "POST", body: { mentor_id }, auth: true }),
  patchMentorship: (id, statut) => request(`/api/mentorship-requests/${id}`, { method: "PATCH", body: { statut }, auth: true }),
  sendMessage: (body) => request("/api/messages", { method: "POST", body, auth: true }),
  conversation: (conversationId) => request(`/api/messages/${conversationId}`, { auth: true }),
};
