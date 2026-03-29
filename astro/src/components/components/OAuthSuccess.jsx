import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { trackEvent } from "../lib/analytics";
import { buildApiUrl } from "../lib/apiConfig";

export default function OAuthSuccess() {
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [error, setError] = useState("");

  useEffect(() => {
    // Parse URL parameters using plain JavaScript
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");
    const redirectTo = urlParams.get("redirectTo");

    console.log("OAuth Success - Token found:", !!token);
    console.log("OAuth Success - User ID:", userId);

    if (!token) {
      console.log("OAuth Success - No token found, setting error state");
      setStatus("error");
      setError("No authentication token found");
      return;
    }

    // Store the token and session indicator in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("session", "active");

    console.log("OAuth Success - Token stored in localStorage");

    // Fetch user data using the token
    const fetchUserData = async () => {
      try {
        console.log("OAuth Success - Fetching user data...");
        const response = await fetch(buildApiUrl("auth/verify-token"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("OAuth Success - User data received");
          if (data.user) {
            // Store user data in localStorage
            localStorage.setItem("user", JSON.stringify(data.user));
            console.log("OAuth Success - User data stored");
          }
        } else {
          console.log("OAuth Success - API response not ok:", response.status);
        }
      } catch (error) {
        console.log("OAuth Success - Error fetching user data:", error);
      }
    };

    // Fetch user data and then redirect
    fetchUserData().then(() => {
      console.log("OAuth Success - Setting status to success");
      // Update status to success
      setStatus("success");

      // Track successful OAuth login
      trackEvent("oauth_login_success", { provider: "Google" });

      // Redirect to dashboard after a short delay
      console.log("OAuth Success - Will redirect to dashboard in 2 seconds...");

      setTimeout(() => {
        console.log("OAuth Success - Redirecting to dashboard");
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
          Welcome back!
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
