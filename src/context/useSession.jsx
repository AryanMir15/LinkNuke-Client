import React, { createContext, useContext, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      const currentPath = window.location.pathname;

      // Don't verify session on auth pages to prevent redirect loops
      if (
        currentPath === "/login" ||
        currentPath === "/register" ||
        currentPath === "/verify-pin" ||
        currentPath === "/forgot-password"
      ) {
        setLoading(false);
        return;
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token validity with server
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Invalid session");
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        localStorage.clear();
        // Only redirect if not already on auth pages
        if (
          !currentPath.includes("/login") &&
          !currentPath.includes("/register")
        ) {
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#1de4bf]" />
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook to consume the session context
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
