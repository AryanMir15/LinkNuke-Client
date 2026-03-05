import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PricingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing page pricing section
    navigate("/", { replace: true });

    // Wait for navigation to complete, then scroll to pricing section
    setTimeout(() => {
      const pricingElement = document.getElementById("pricing");
      if (pricingElement) {
        pricingElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }, [navigate]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1de4bf] mx-auto mb-4"></div>
        <p>Redirecting to pricing...</p>
      </div>
    </div>
  );
}
