import React, { createContext, useContext, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("session");
      setUser(null);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const verifySession = async () => {
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

      try {
        // Check if we have a session indicator
        const session = localStorage.getItem("session");
        if (!session) {
          throw new Error("No session");
        }

        // Verify session validity with server
        console.log(
          "Session verification URL:",
          `${import.meta.env.VITE_API_URL}/auth/verify`
        );
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Invalid session");
        }

        const userData = await res.json();
        setUser(userData.user || userData);
      } catch (error) {
        localStorage.removeItem("session");
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
    <SessionContext.Provider value={{ user, setUser, logout }}>
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
