import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import App from "../../App";
import Login from "../../Auth/Login";
import Register from "../../Auth/Register";
import VerifyPin from "../../Auth/verifyPin";
import ForgotPassword from "../../Auth/ForgotPassword";
import ResetPassword from "../../Auth/ResetPassword";
import Dashboard from "../../Dashboard/Dashboard";
import { LinksProvider } from "../../context/LinksContext";
import PreviewPage from "../../Preview/PreviewPage";
import FeedbackForm from "../../Dashboard/FeedbackForm";
import OAuthSuccess from "../OAuthSuccess";
import ProgressBar from "./ProgressBar";
import PricingPage from "../../Pricing/PricingPage";

// Auth protection component
const ProtectedRoute = ({ children }) => {
  const session = localStorage.getItem("session");
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppWrapper() {
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Immediately hide content and start loading
    setShowContent(false);
    setIsLoading(true);

    // Scroll to top immediately
    window.scrollTo(0, 0);

    // Page view tracking is now handled by automatic session tracking

    // Show content after 0.3 seconds (reduced from 0.9s)
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // Complete loading animation after 0.5 seconds (reduced from 1.1s)
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Fallback: Show content after 2 seconds regardless to prevent white pages
    const fallbackTimer = setTimeout(() => {
      setShowContent(true);
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(loadingTimer);
      clearTimeout(fallbackTimer);
    };
  }, [location.pathname, location.search, location.hash]);

  return (
    <>
      <ProgressBar isLoading={isLoading} />
      <div
        className={`transition-opacity duration-0 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-pin" element={<VerifyPin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LinksProvider>
                  <Dashboard />
                </LinksProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/preview/:linkId"
            element={
              <LinksProvider>
                <PreviewPage />
              </LinksProvider>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <LinksProvider>
                  <FeedbackForm />
                </LinksProvider>
              </ProtectedRoute>
            }
          />

          {/* Catch-all route must be last */}
          <Route path="/*" element={<App />} />
        </Routes>
      </div>
    </>
  );
}

export default AppWrapper;
