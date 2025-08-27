// linkApi.js - Centralized API service for Link CRUD

// Use the environment variable for the API base URL
const API_BASE = import.meta.env.VITE_API_URL;
const LINKS_URL = API_BASE + "/links";
const PUBLIC_LINKS_URL = API_BASE + "/public/links";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 9000]; // 1s, 3s, 9s

async function fetchWithRetry(url, options = {}, retryCount = 0) {
  try {
    const response = await fetch(url, options);
    if (!response.ok && retryCount < MAX_RETRIES) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retryCount >= MAX_RETRIES) throw error;
    await new Promise((resolve) =>
      setTimeout(resolve, RETRY_DELAYS[retryCount])
    );
    return fetchWithRetry(url, options, retryCount + 1);
  }
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

async function handleResponse(res) {
  console.log(
    "handleResponse called with status:",
    res.status,
    "for URL:",
    res.url
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.log("handleResponse error - status:", res.status, "data:", data);
    const error = data?.message || data?.error || res.statusText;
    console.log("handleResponse throwing error:", error);
    throw new Error(error);
  }
  console.log("handleResponse success - data:", data);
  return data;
}

export async function createLink(link) {
  const res = await fetchWithRetry(LINKS_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(link),
    credentials: "include",
  });
  return handleResponse(res);
}

export async function getLinks() {
  console.log("getLinks called with URL:", LINKS_URL);
  const res = await fetch(LINKS_URL, {
    headers: authHeaders(),
    credentials: "include",
  });

  if (res.status === 401) {
    console.log("getLinks: 401 error, redirecting to /login");
    localStorage.removeItem("session");
    window.location.href = "/login";
    return [];
  }

  return handleResponse(res);
}

export async function getLink(id) {
  const res = await fetchWithRetry(`${LINKS_URL}/${id}`, {
    headers: authHeaders(),
    credentials: "include",
  });
  return handleResponse(res);
}

export async function trackLink(id) {
  const res = await fetchWithRetry(`${LINKS_URL}/track/${id}`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse(res);
}

export async function updateLink(id, updates) {
  const res = await fetchWithRetry(`${LINKS_URL}/${id}`, {
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
  const res = await fetchWithRetry(`${PUBLIC_LINKS_URL}/${linkId}`);
  return handleResponse(res);
}

export async function getUsageStats() {
  console.log("getUsageStats called with URL:", `${LINKS_URL}/usage-stats`);
  const res = await fetch(`${LINKS_URL}/usage-stats`, {
    headers: authHeaders(),
    credentials: "include",
  });
  console.log("getUsageStats response status:", res.status);
  if (!res.ok) {
    console.log("getUsageStats failed with status:", res.status);
  }
  return handleResponse(res);
}
