// Central API configuration
// In production, always use relative paths so Vercel rewrites work: /api/* -> https://linknuke-backend.fly.dev/api/*
// In development, you can set VITE_PUBLIC_API_URL in .env file to override
export const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? ""
    : import.meta.env.VITE_PUBLIC_API_URL || "";

// Helper function to build API URLs
export function buildApiUrl(path) {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const url = `${API_BASE_URL}/api/${cleanPath}`;

  // Debug: Log the URL being built
  if (import.meta.env.DEV) {
    console.log("buildApiUrl:", url, "(API_BASE_URL:", API_BASE_URL, ")");
  }

  return url;
}
