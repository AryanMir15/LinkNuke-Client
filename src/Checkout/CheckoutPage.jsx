import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCheckout = async () => {
      try {
        // Get checkout URL from URL params
        const checkoutUrl = searchParams.get("checkout_url");

        if (checkoutUrl) {
          // Redirect to Paddle checkout
          window.location.href = checkoutUrl;
        } else {
          // Check for payment status
          const paymentStatus = searchParams.get("payment");

          if (paymentStatus === "success") {
            setStatus("success");
            toast.success("Payment successful! Welcome to LinkNuke Pro!");
            setTimeout(() => navigate("/dashboard"), 3000);
          } else if (paymentStatus === "cancelled") {
            setStatus("cancelled");
            toast.error("Payment was cancelled");
            setTimeout(() => navigate("/pricing"), 3000);
          } else {
            setError("Invalid checkout session");
          }
        }
      } catch (error) {
        console.error("Checkout error:", error);
        setError("Something went wrong with the checkout process");
      }
    };

    handleCheckout();
  }, [searchParams, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Processing Payment...
          </h2>
          <p className="text-gray-400">
            Please wait while we redirect you to the payment page.
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-400 mb-4">
            Welcome to LinkNuke Pro! Redirecting to dashboard...
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Payment Cancelled
          </h2>
          <p className="text-gray-400 mb-4">
            Your payment was cancelled. Redirecting to pricing...
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Checkout Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/pricing")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  return null;
}
