import React, { useState, useEffect } from "react";
import { X, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const EmailVerificationBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    checkEmailVerificationStatus();
  }, []);

  const checkEmailVerificationStatus = async () => {
    try {
      const session = localStorage.getItem("session");
      if (!session) return;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/email/subscription`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserEmail(data.subscriber.email);
        setIsVerified(data.subscriber.isVerified);
        setIsVisible(!data.subscriber.isVerified);
      } else if (response.status === 404) {
        // User not in email subscription list, check if they're verified
        setIsVerified(true);
        setIsVisible(false);
      }
    } catch (error) {
      console.error("Error checking email verification status:", error);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/resend-pin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        }
      );

      if (response.ok) {
        toast.success("Verification email sent! Check your inbox.");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error("Failed to send verification email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem("emailVerificationDismissed", Date.now().toString());
  };

  // Check if banner was recently dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("emailVerificationDismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const hoursSinceDismissed =
        (Date.now() - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        setIsVisible(false);
      }
    }
  }, []);

  if (!isVisible || isVerified) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                Please verify your email address to unlock all features
              </p>
              <p className="text-xs opacity-90 mt-1">
                We sent a verification link to{" "}
                <span className="font-semibold">{userEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleResendVerification}
              disabled={isLoading}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>Resend</span>
                </div>
              )}
            </button>

            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
