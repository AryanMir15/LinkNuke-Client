// Central API configuration
// Production backend URL from Vercel environment variables
const PRODUCTION_BACKEND_URL = "https://linknuke-backend.fly.dev/api/v1";

// Determine environment and set base URL
export const API_BASE_URL =
  // If we have a development API URL, use it
  import.meta.env.VITE_API_URL ||
  // If we're in development mode, use empty string (will be handled by dev server)
  import.meta.env.DEV
    ? ""
    : // Otherwise, use production backend URL directly
      PRODUCTION_BACKEND_URL;

// Helper function to build API URLs
export function buildApiUrl(path) {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  const url = `${API_BASE_URL}/${cleanPath}`;

  // Debug: Log the URL being built
  console.log(
    "buildApiUrl:",
    url,
    "(API_BASE_URL:",
    API_BASE_URL,
    ")",
    "MODE:",
    import.meta.env.MODE,
    ")",
  );

  return url;
}
