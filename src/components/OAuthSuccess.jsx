import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";
import { trackEvent } from "../lib/analytics";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");

    if (!token) {
      setStatus("error");
      setError("No authentication token found");
      return;
    }

    // Store the token and session indicator in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("session", "active");

    // Fetch user data using the token
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/verify`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            // Store user data in localStorage
            localStorage.setItem("user", JSON.stringify(data.user));
            console.log("✅ OAuth: User data stored successfully");
          }
        }
      } catch (error) {
        console.error("Error fetching user data after OAuth:", error);
      }
    };

    // Fetch user data and then redirect
    fetchUserData().then(() => {
      // Update status to success
      setStatus("success");

      // Track successful OAuth login
      trackEvent("oauth_login_success", { provider: "Google" });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    });
  }, [searchParams, navigate]);

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
            onClick={() => navigate("/login")}
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
