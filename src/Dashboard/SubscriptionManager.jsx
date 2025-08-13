import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "../context/useSession.jsx";
import {
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function SubscriptionManager() {
  const { user } = useSession();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/paddle/subscription-status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          withCredentials: true,
        }
      );
      setSubscription(response.data.subscription);
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError("Failed to load subscription status");
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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/paddle/cancel-subscription`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          withCredentials: true,
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

  const getPlanLimits = (plan) => {
    switch (plan) {
      case "starter":
        return { links: 50, storage: "1 GB" };
      case "pro":
        return { links: 500, storage: "10 GB" };
      case "lifetime":
        return { links: "Unlimited", storage: "Unlimited" };
      default:
        return { links: 0, storage: "0 GB" };
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="text-center text-red-600 dark:text-red-400">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="text-center">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You're currently on the free plan. Upgrade to unlock premium
            features.
          </p>
          <a
            href="/pricing"
            className="inline-flex items-center px-4 py-2 bg-[#1de4bf] text-black rounded-lg hover:bg-[#1de4bf]/90 transition-colors"
          >
            View Plans
          </a>
        </div>
      </div>
    );
  }

  const limits = getPlanLimits(subscription.plan);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-[#1de4bf]" />
          <h3 className="text-lg font-semibold">Subscription Details</h3>
        </div>
        {getStatusIcon(subscription.status)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            Plan
          </h4>
          <p className="text-lg font-semibold capitalize">
            {subscription.plan} Plan
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </h4>
          <p className="text-lg font-semibold capitalize">
            {subscription.status}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            Started
          </h4>
          <p className="text-sm">{formatDate(subscription.startDate)}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
            {subscription.plan === "lifetime" ? "Valid Until" : "Next Billing"}
          </h4>
          <p className="text-sm">{formatDate(subscription.endDate)}</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="font-medium mb-3">Plan Limits</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Links per month
            </p>
            <p className="font-semibold">{limits.links}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Storage</p>
            <p className="font-semibold">{limits.storage}</p>
          </div>
        </div>
      </div>

      {subscription.status === "active" && subscription.plan !== "lifetime" && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleCancelSubscription}
            disabled={cancelling}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel Subscription"}
          </button>
          <a
            href="/pricing"
            className="px-4 py-2 text-[#1de4bf] border border-[#1de4bf] rounded-lg hover:bg-[#1de4bf]/10 transition-colors"
          >
            Change Plan
          </a>
        </div>
      )}

      {subscription.status === "cancelled" && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Your subscription has been cancelled. You'll have access to premium
            features until {formatDate(subscription.endDate)}.
          </p>
        </div>
      )}
    </div>
  );
}
