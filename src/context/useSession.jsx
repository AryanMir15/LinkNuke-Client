/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const verifySession = async () => {
      const currentPath = window.location.pathname;

      // Only verify session on protected route prefixes. All other pages are public.
      const isProtectedRoute =
        currentPath.startsWith("/dashboard") ||
        currentPath.startsWith("/feedback");

      // Always skip verification on explicit auth pages to avoid loops
      const isAuthPage =
        currentPath === "/login" ||
        currentPath === "/register" ||
        currentPath === "/verify-pin" ||
        currentPath === "/forgot-password";

      if (!isProtectedRoute || isAuthPage) {
        setLoading(false);
        return;
      }

      try {
        // Check if we have a JWT token
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        console.log("🔍🔍🔍 JWT SESSION: Starting session verification");
        console.log("🔍🔍🔍 JWT SESSION: Token exists:", !!token);
        console.log("🔍🔍🔍 JWT SESSION: User data exists:", !!userData);

        if (!token || !userData) {
          throw new Error("No token or user data");
        }

        // Parse user data from localStorage
        const parsedUser = JSON.parse(userData);
        console.log("🔍🔍🔍 JWT SESSION: Parsed user:", parsedUser);

        // Verify token with server by making a test API call
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/verify`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(
          "🔍🔍🔍 JWT SESSION: Verification response status:",
          response.status
        );

        if (!response.ok) {
          throw new Error(`Verification failed: ${response.status}`);
        }

        // Token is valid, set user
        setUser(parsedUser);
        console.log("🔍🔍🔍 JWT SESSION: Session verified successfully");
      } catch (error) {
        console.error("🔍🔍🔍 JWT SESSION: Verification failed:", error);

        // Clear invalid token/data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);

        // Redirect to login only when on protected routes
        if (isProtectedRoute) {
          console.log("🔍🔍🔍 JWT SESSION: Redirecting to login");
          window.location.href = "/login";
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-[#1de4bf]" size={32} />
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ user, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
