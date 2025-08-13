import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CreditCard, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCheckout = async () => {
      try {
        const checkoutUrl = searchParams.get("checkout_url");
        const transactionId = searchParams.get("_ptxn");
        const paymentStatus = searchParams.get("payment");

        // If we have a checkout URL, redirect to Paddle's hosted checkout
        if (checkoutUrl) {
          console.log("Redirecting to Paddle checkout:", checkoutUrl);
          window.location.href = checkoutUrl;
          return;
        }

        // Handle payment completion
        if (transactionId) {
          setStatus("success");
          setTimeout(() => {
            navigate("/dashboard?payment=success", { replace: true });
          }, 2000);
          return;
        }

        // Handle payment cancellation
        if (paymentStatus === "cancelled") {
          setStatus("cancelled");
          setTimeout(() => {
            navigate("/pricing?payment=cancelled", { replace: true });
          }, 2000);
          return;
        }

        // If no relevant parameters, show error
        setError("Invalid checkout session. Please try again.");
        setTimeout(() => {
          navigate("/pricing", { replace: true });
        }, 3000);
      } catch (error) {
        console.error("Checkout error:", error);
        setError("Something went wrong with the checkout process");
        setTimeout(() => {
          navigate("/pricing", { replace: true });
        }, 3000);
      }
    };

    handleCheckout();
  }, [searchParams, navigate]);

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#1F1F23] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="min-h-screen bg-[#1F1F23] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Payment Cancelled
          </h2>
          <p className="text-gray-400">Redirecting to pricing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1F1F23] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Checkout Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F23] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1de4bf] mx-auto mb-4" />
        <p className="text-white">Redirecting to payment...</p>
      </div>
    </div>
  );
}
