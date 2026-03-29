import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { trackEvent } from "../lib/analytics";

export default function OAuthSuccess() {
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🔍🔍🔍 [OAUTH_SUCCESS] Component mounted");
    console.log("🔍🔍🔍 [OAUTH_SUCCESS] Current URL:", window.location.href);
    console.log(
      "🔍🔍🔍 [OAUTH_SUCCESS] Search params:",
      window.location.search,
    );

    // Parse URL parameters using plain JavaScript
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");
    const redirectTo = urlParams.get("redirectTo");

    console.log("🔍🔍🔍 [OAUTH_SUCCESS] Parsed params:", {
      token: !!token,
      userId: userId,
      redirectTo: redirectTo,
      tokenLength: token?.length,
    });

    console.log("🔍🔍🔍 [OAUTH_SUCCESS] Token found:", !!token);
    console.log("🔍🔍🔍 [OAUTH_SUCCESS] User ID:", userId);

    if (!token) {
      console.log(
        "❌🔍🔍🔍 [OAUTH_SUCCESS] No token found, setting error state",
      );
      setStatus("error");
      setError("No authentication token found");
      return;
    }

    console.log("✅🔍🔍🔍 [OAUTH_SUCCESS] Storing token in localStorage");
    // Store the token and session indicator in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("session", "active");

    console.log("🔍🔍🔍 [OAUTH_SUCCESS] Token stored, localStorage now:", {
      token: !!localStorage.getItem("token"),
      session: localStorage.getItem("session"),
    });

    // Fetch user data using the token
    const fetchUserData = async () => {
      try {
        console.log("🔍 [OAUTH_SUCCESS] Fetching user data...");
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_API_URL}/auth/verify-token`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("🔍 [OAUTH_SUCCESS] API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ [OAUTH_SUCCESS] User data received:", data);
          if (data.user) {
            // Store user data in localStorage
            localStorage.setItem("user", JSON.stringify(data.user));
            console.log("✅ [OAUTH_SUCCESS] User data stored in localStorage");
          }
        } else {
          console.log(
            "❌ [OAUTH_SUCCESS] API response not ok:",
            response.status,
          );
        }
      } catch (error) {
        console.log("❌ [OAUTH_SUCCESS] Error fetching user data:", error);
      }
    };

    // Fetch user data and then redirect
    fetchUserData().then(() => {
      console.log("✅ [OAUTH_SUCCESS] Setting status to success");
      // Update status to success
      setStatus("success");

      // Track successful OAuth login
      trackEvent("oauth_login_success", { provider: "Google" });

      // Redirect to dashboard after a short delay
      console.log(
        "🔄 [OAUTH_SUCCESS] Will redirect to /dashboard in 2 seconds...",
      );

      // Debug localStorage right before redirect
      console.log("🔍 [OAUTH_SUCCESS] localStorage before redirect:", {
        token: localStorage.getItem("token"),
        session: localStorage.getItem("session"),
        user: localStorage.getItem("user"),
      });

      setTimeout(() => {
        console.log("🔄 [OAUTH_SUCCESS] Redirecting to /dashboard now");
        window.location.href = "/dashboard";
      }, 2000);
    });
  }, []);

  if (status === "processing") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-[#1de4bf] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Completing Authentication
          </h2>
          <p className="text-gray-400">Please wait while we log you in...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✕</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-2 bg-[#1de4bf] text-black rounded-lg hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-[#1de4bf] mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-white mb-2">
          Welcome back! 🎉
        </h2>
        <p className="text-gray-400 mb-4">
          You've successfully signed in with Google
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-[#1de4bf] rounded-full animate-pulse"></div>
          <span>Redirecting to your dashboard...</span>
        </div>
      </div>
    </div>
  );
}
