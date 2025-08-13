import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = () => {
      const transactionId = searchParams.get("_ptxn");
      const paymentStatus = searchParams.get("payment");

      if (transactionId) {
        // If we have a transaction ID, redirect to dashboard with success
        navigate("/dashboard?payment=success", { replace: true });
      } else if (paymentStatus === "cancelled") {
        // If payment was cancelled, redirect to pricing
        navigate("/pricing?payment=cancelled", { replace: true });
      } else {
        // Default fallback
        navigate("/dashboard", { replace: true });
      }
    };

    handleRedirect();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#1F1F23] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1de4bf] mx-auto mb-4" />
        <p className="text-white">Processing payment...</p>
      </div>
    </div>
  );
}
