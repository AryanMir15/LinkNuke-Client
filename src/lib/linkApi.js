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
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch (error) {
    // If JSON parse fails, return empty object for non-ok responses, null for ok responses
    data = res.ok ? null : {};
  }

  if (!res.ok) {
    const error =
      data?.message || data?.error || `HTTP ${res.status}: ${res.statusText}`;

    // Handle specific HTTP status codes
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("Authentication expired. Please login again.");
    }

    throw new Error(error);
  }

  return data;
}

export async function createLink(link) {
  const res = await fetchWithRetry(LINKS_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(link),
  });
  return handleResponse(res);
}

export async function getLinks() {
  const res = await fetch(LINKS_URL, {
    headers: authHeaders(),
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return [];
  }

  return handleResponse(res);
}

export async function getLink(id) {
  const res = await fetchWithRetry(`${LINKS_URL}/${id}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function trackLink(id) {
  const res = await fetchWithRetry(`${LINKS_URL}/track/${id}`, {
    method: "POST",
  });

  // Don't use handleResponse for tracking - it redirects on 401
  // Tracking should be non-critical and not affect preview
  if (!res.ok) {
    console.log("Track link failed (non-critical):", res.status);
    return null; // Fail silently
  }

  return res.json().catch(() => null);
}

export async function updateLink(id, updates) {
  const res = await fetchWithRetry(`${LINKS_URL}/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

export async function deleteLink(id) {
  const res = await fetch(`${LINKS_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// For public preview (not authenticated)
export async function getPublicLink(linkId) {
  const res = await fetchWithRetry(`${PUBLIC_LINKS_URL}/${linkId}`);
  return handleResponse(res);
}

export async function getUsageStats() {
  const res = await fetch(`${LINKS_URL}/usage-stats`, {
    headers: authHeaders(),
  });

  return handleResponse(res);
}
