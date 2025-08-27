import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

import ErrorBoundary from "../components/ui/ErrorBoundary";

export default function SubscriptionManager() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const [usage, setUsage] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState(null);

  useEffect(() => {
    // Only fetch subscription status if user has a paid plan
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.plan && user.plan !== "free") {
      fetchSubscriptionStatus();
    } else {
      // For free users, set loading to false immediately
      setLoading(false);
    }
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching subscription status...");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/paddle/subscription-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Subscription response:", response.data);
      setSubscription(response.data.subscription);
      setUsage(response.data.usage);
      setBillingPeriod(response.data.billing_period);
    } catch (err) {
      console.error("Error fetching subscription:", err);
      console.error("Error response:", err.response?.data);
      setError(
        err.response?.data?.error || "Failed to load subscription status"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period."
      )
    ) {
      return;
    }

    try {
      setCancelling(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/paddle/cancel-subscription`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchSubscriptionStatus();
      alert("Subscription cancelled successfully");
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "paused":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-[#2E2E32] rounded-full"></div>
            <div className="h-6 bg-[#2E2E32] rounded w-32"></div>
          </div>
          <div className="h-5 w-5 bg-[#2E2E32] rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-[#2E2E32] rounded w-16 mb-2"></div>
              <div className="h-6 bg-[#2E2E32] rounded w-32"></div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[#2E2E32] rounded-lg">
          <div className="h-5 bg-[#2E2E32] rounded w-24 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-4 bg-[#2E2E32] rounded w-20 mb-2"></div>
              <div className="h-4 bg-[#2E2E32] rounded w-full mb-2"></div>
              <div className="h-1 bg-[#2E2E32] rounded-full">
                <div className="h-full bg-[#2E2E32] rounded-full w-1/3"></div>
              </div>
            </div>
            <div>
              <div className="h-4 bg-[#2E2E32] rounded w-24 mb-2"></div>
              <div className="h-4 bg-[#2E2E32] rounded w-full mb-2"></div>
              <div className="h-4 bg-[#2E2E32] rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-400">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchSubscriptionStatus}
            className="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-6">
        <div className="text-center">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-semibold mb-2 text-white">
            No Active Subscription
          </h3>
          <p className="text-gray-400 mb-4">
            You're currently on the free plan. Upgrade to unlock premium
            features.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
          >
            View Plans
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-[#1de4bf]" />
          <h3 className="text-lg font-semibold text-white">
            Subscription Details
          </h3>
        </div>
        {getStatusIcon(subscription.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-400 mb-2">Plan</h4>
          <p className="text-lg font-semibold text-white capitalize">
            {subscription.plan} Plan
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-400 mb-2">Status</h4>
          <p className="text-lg font-semibold text-white capitalize">
            {subscription.status}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-400 mb-2">Started</h4>
          <p className="text-sm text-gray-300">
            {formatDate(subscription.startDate)}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-400 mb-2">
            {subscription.plan === "lifetime" ? "Valid Until" : "Next Billing"}
          </h4>
          <p className="text-sm text-gray-300">
            {formatDate(subscription.endDate)}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-[#2E2E32] rounded-lg">
        <h4 className="font-medium mb-3 text-white">Usage & Billing</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Links used</p>
            <p className="font-semibold text-white">
              {usage?.links?.current ?? 0} /{" "}
              {usage?.links?.limit ?? "Unlimited"}
              {usage?.links?.percent && (
                <span className="text-[#1de4bf] ml-2">
                  ({usage.links.percent}%)
                </span>
              )}
            </p>
            {usage?.links?.limit && (
              <div className="mt-2 h-1 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-[#1de4bf] rounded-full transition-all duration-500"
                  style={{ width: `${usage.links.percent}%` }}
                />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-400">Billing period</p>
            <p className="font-semibold text-white">
              {billingPeriod?.remaining_days ?? "N/A"} days remaining
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(billingPeriod?.start)} -{" "}
              {formatDate(billingPeriod?.end)}
            </p>
          </div>
        </div>
      </div>

      {subscription.status === "active" && subscription.plan !== "lifetime" && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleCancelSubscription}
            disabled={cancelling}
            className="px-4 py-2 text-red-400 border border-red-400 rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel Subscription"}
          </button>
          <button
            onClick={() => navigate("/pricing")}
            className="px-4 py-2 text-[#1de4bf] border border-[#1de4bf] rounded-lg hover:bg-[#1de4bf]/10 transition-colors"
          >
            Change Plan
          </button>
        </div>
      )}

      {subscription.status === "cancelled" && (
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400">
            Your subscription has been cancelled. You'll have access to premium
            features until {formatDate(subscription.endDate)}.
          </p>
        </div>
      )}
    </div>
  );
}
