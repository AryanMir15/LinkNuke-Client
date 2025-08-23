// linkApi.js - Centralized API service for Link CRUD

// Use the environment variable for the API base URL
const API_BASE = import.meta.env.VITE_API_URL;
const LINKS_URL = API_BASE + "/links";
const PUBLIC_LINKS_URL = API_BASE + "/public/links";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = data?.message || data?.error || res.statusText;
    throw new Error(error);
  }
  return data;
}

export async function createLink(link) {
  const res = await fetch(LINKS_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(link),
    credentials: "include",
  });
  return handleResponse(res);
}

export async function getLinks() {
  const res = await fetch(LINKS_URL, {
    headers: authHeaders(),
    credentials: "include",
  });
  return handleResponse(res);
}

export async function getLink(id) {
  const res = await fetch(`${LINKS_URL}/${id}`, {
    headers: authHeaders(),
    credentials: "include",
  });
  return handleResponse(res);
}

export async function trackLink(id) {
  const res = await fetch(`${LINKS_URL}/track/${id}`, {
    method: "POST",
    headers: authHeaders(),
    credentials: "include",
  });
  return handleResponse(res);
}

export async function updateLink(id, updates) {
  const res = await fetch(`${LINKS_URL}/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(updates),
    credentials: "include",
  });
  return handleResponse(res);
}

export async function deleteLink(id) {
  const res = await fetch(`${LINKS_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
    credentials: "include",
  });
  return handleResponse(res);
}

// For public preview (not authenticated)
export async function getPublicLink(linkId) {
  const res = await fetch(`${PUBLIC_LINKS_URL}/${linkId}`);
  return handleResponse(res);
}

export async function getUsageStats() {
  const res = await fetch(`${LINKS_URL}/usage`, {
    headers: authHeaders(),
    credentials: "include",
  });
  return handleResponse(res);
}
