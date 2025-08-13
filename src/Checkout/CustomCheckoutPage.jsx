import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  CreditCard,
  Check,
  ArrowLeft,
  Shield,
  Zap,
  Infinity,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function CustomCheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadPlanDetails = async () => {
      try {
        const planType = searchParams.get("plan");
        const token = localStorage.getItem("token");

        if (!token) {
          navigate(
            "/login?returnUrl=" +
              encodeURIComponent(
                window.location.pathname + window.location.search
              )
          );
          return;
        }

        // Get user details
        const userResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        // Set plan details based on plan type
        const planDetails = {
          starter: {
            name: "Starter Plan",
            price: 9,
            currency: "USD",
            features: [
              "Unlimited links",
              "All file formats",
              "50MB file size limit",
              "Basic analytics",
              "Email support",
            ],
            color: "from-blue-500 to-blue-600",
          },
          pro: {
            name: "Pro Plan",
            price: 19,
            currency: "USD",
            features: [
              "Everything in Starter",
              "500MB file size limit",
              "Advanced analytics",
              "Priority support",
              "Custom branding",
              "API access",
            ],
            color: "from-purple-500 to-purple-600",
          },
          lifetime: {
            name: "Lifetime Plan",
            price: 59,
            currency: "USD",
            features: [
              "Everything in Pro",
              "Unlimited file size",
              "Lifetime updates",
              "Premium support",
              "White-label option",
              "Custom integrations",
            ],
            color: "from-emerald-500 to-emerald-600",
          },
        };

        setPlan(planDetails[planType]);
      } catch (error) {
        console.error("Error loading plan details:", error);
        toast.error("Failed to load plan details");
        navigate("/pricing");
      }
    };

    loadPlanDetails();
  }, [searchParams, navigate]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/paddle/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productType: searchParams.get("plan"),
            billingCycle: "monthly",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Redirect to Paddle's hosted checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to process payment. Please try again.");
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate("/pricing");
  };

  if (!plan || !user) {
    return (
      <div className="min-h-screen bg-[#1F1F23] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1de4bf]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F23] text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={goBack}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">LinkNuke</h1>
                <p className="text-gray-400 text-sm">Secure Checkout</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Complete Your Purchase
              </h2>
              <p className="text-gray-400">
                You're about to upgrade to {plan.name}. Here's what you'll get:
              </p>
            </div>

            {/* Plan Card */}
            <div className={`bg-gradient-to-r ${plan.color} p-6 rounded-xl`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold">${plan.price}</div>
                  <div className="text-sm opacity-90">
                    {searchParams.get("plan") === "lifetime"
                      ? "One-time"
                      : "per month"}
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* User Info */}
            <div className="bg-gray-900 p-6 rounded-xl">
              <h4 className="font-semibold mb-4">Account Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Payment Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span>{plan.name}</span>
                  <span className="font-semibold">${plan.price}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span>Tax</span>
                  <span className="text-gray-400">Calculated at checkout</span>
                </div>

                <div className="flex justify-between items-center py-3 text-lg font-bold">
                  <span>Total</span>
                  <span>${plan.price}</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1de4bf] to-[#1bc4a3] hover:from-[#1bc4a3] hover:to-[#1de4bf] text-black font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Complete Payment</span>
                </div>
              )}
            </button>

            {/* Security Notice */}
            <div className="text-center text-sm text-gray-400">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="w-4 h-4" />
                <span>256-bit SSL encryption</span>
              </div>
              <p>Your payment is secure and encrypted. Powered by Paddle.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
