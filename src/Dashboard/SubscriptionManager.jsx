import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Clock,
  DollarSign,
} from "lucide-react";

import ErrorBoundary from "../components/ui/ErrorBoundary";
import RefundPolicyModal from "../components/ui/RefundPolicyModal";

export default function SubscriptionManager() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showRefundPolicyModal, setShowRefundPolicyModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");

  const [usage, setUsage] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState(null);
  const subscriptionFetched = useRef(false);

  const refreshUserSession = useCallback(async (subscriptionData) => {
    try {
      const token = localStorage.getItem("token");
      // Fetch fresh user data from the server
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/verify`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.user) {
        // Update localStorage with fresh user data
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log("✅ SubscriptionManager: User session refreshed");
      }
    } catch (error) {
      console.error("Error refreshing user session:", error);
      // Fallback: update localStorage with subscription data
      if (subscriptionData) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...currentUser,
          subscription: subscriptionData,
          plan: subscriptionData.plan,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log(
          "✅ SubscriptionManager: User session updated with subscription data"
        );
      }
    }
  }, []);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 SubscriptionManager: Fetching subscription status...");
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("❌ No token found in localStorage");
        setError("Authentication required");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/paddle/subscription-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "✅ SubscriptionManager: Subscription response:",
        response.data
      );
      setSubscription(response.data.subscription);
      setUsage(response.data.usage);
      setBillingPeriod(response.data.billing_period);

      // If we have subscription data, update localStorage user data
      if (response.data.subscription) {
        refreshUserSession(response.data.subscription);
      }
    } catch (err) {
      console.error(
        "❌ SubscriptionManager: Error fetching subscription:",
        err
      );
      console.error(
        "❌ SubscriptionManager: Error response:",
        err.response?.data
      );
      console.error(
        "❌ SubscriptionManager: Error status:",
        err.response?.status
      );

      let errorMessage = "Failed to load subscription status";

      if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshUserSession]);

  useEffect(() => {
    // Only fetch subscription status once on mount
    if (!subscriptionFetched.current) {
      subscriptionFetched.current = true;
      fetchSubscriptionStatus();
    }
  }, [fetchSubscriptionStatus]);

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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/paddle/cancel-subscription`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchSubscriptionStatus();

      // Show appropriate message based on response
      if (response.data.localCancellation) {
        alert(
          "Subscription cancelled! Due to network issues, the cancellation will be fully processed shortly. You'll receive a confirmation email from Paddle."
        );
      } else {
        alert(
          "Subscription cancelled successfully! You'll receive a confirmation email from Paddle."
        );
      }
    } catch (err) {
      console.error("Error cancelling subscription:", err);

      // Provide more specific error messages
      let errorMessage = "Failed to cancel subscription. Please try again.";

      if (err.response?.status === 500) {
        const serverError = err.response.data?.error;
        if (serverError?.includes("not found")) {
          errorMessage =
            "Subscription not found. It may have already been cancelled.";
        } else if (serverError?.includes("already cancelled")) {
          errorMessage = "Subscription has already been cancelled.";
        } else if (serverError?.includes("unauthorized")) {
          errorMessage = "You're not authorized to cancel this subscription.";
        } else if (
          serverError?.includes("timeout") ||
          serverError?.includes("network")
        ) {
          errorMessage =
            "Network timeout. The cancellation may still be processing. Please check your subscription status in a few minutes.";
        }
      } else if (err.response?.status === 503) {
        errorMessage =
          "Payment service is temporarily unavailable. Please try again in a few minutes.";
      } else if (err.response?.status === 400) {
        errorMessage = "No active subscription found to cancel.";
      }

      alert(errorMessage);
    } finally {
      setCancelling(false);
    }
  };

  const handleRequestRefund = async () => {
    try {
      setRefunding(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/paddle/request-refund`,
        { reason: refundReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchSubscriptionStatus();
      setShowRefundModal(false);
      setRefundReason("");

      alert(
        `Refund processed successfully! You've been refunded $${response.data.refundAmount} and your access has been removed immediately.`
      );
    } catch (err) {
      console.error("Error requesting refund:", err);

      let errorMessage = "Failed to process refund request. Please try again.";

      if (err.response?.status === 400) {
        const serverError = err.response.data?.error;
        if (serverError?.includes("already requested")) {
          errorMessage = "Refund has already been requested or processed.";
        } else if (serverError?.includes("expired")) {
          errorMessage =
            "Refund window has expired. Refunds are only available within 15 days of first payment.";
        } else if (serverError?.includes("No active subscription")) {
          errorMessage = "No active subscription found to refund.";
        } else {
          errorMessage = serverError || errorMessage;
        }
      } else if (err.response?.status === 500) {
        const serverError = err.response.data?.error;
        if (serverError?.includes("already refunded")) {
          errorMessage = "Transaction has already been refunded.";
        } else if (serverError?.includes("not found")) {
          errorMessage = "Transaction not found.";
        } else {
          errorMessage = serverError || "Server error. Please try again later.";
        }
      } else if (err.response?.status === 503) {
        errorMessage =
          "Payment service is temporarily unavailable. Please try again in a few minutes.";
      }

      alert(errorMessage);
    } finally {
      setRefunding(false);
    }
  };

  // Check if user is eligible for refund (within 15 days)
  const isRefundEligible = () => {
    if (!subscription?.firstPaymentDate && !subscription?.startDate)
      return false;

    const firstPaymentDate = new Date(
      subscription.firstPaymentDate || subscription.startDate
    );
    const daysSincePayment = Math.floor(
      (Date.now() - firstPaymentDate) / (1000 * 60 * 60 * 24)
    );

    return daysSincePayment <= 15;
  };

  // Get days remaining in refund window
  const getRefundDaysRemaining = () => {
    if (!subscription?.firstPaymentDate && !subscription?.startDate) return 0;

    const firstPaymentDate = new Date(
      subscription.firstPaymentDate || subscription.startDate
    );
    const daysSincePayment = Math.floor(
      (Date.now() - firstPaymentDate) / (1000 * 60 * 60 * 24)
    );

    return Math.max(0, 15 - daysSincePayment);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "refunded":
        return <RefreshCw className="h-5 w-5 text-orange-500" />;
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

        {subscription.refundStatus && subscription.refundStatus !== "none" && (
          <div>
            <h4 className="font-medium text-gray-400 mb-2">Refund Status</h4>
            <p className="text-sm text-gray-300 capitalize flex items-center gap-2">
              {subscription.refundStatus === "completed" && (
                <DollarSign className="h-4 w-4 text-green-400" />
              )}
              {subscription.refundStatus === "requested" && (
                <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />
              )}
              {subscription.refundStatus === "failed" && (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
              {subscription.refundStatus}
            </p>
          </div>
        )}

        {isRefundEligible() && subscription.refundStatus === "none" && (
          <div>
            <h4 className="font-medium text-gray-400 mb-2">Refund Window</h4>
            <p className="text-sm text-orange-300 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {getRefundDaysRemaining()} days remaining
            </p>
          </div>
        )}
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

      {(subscription.status === "active" ||
        subscription.status === "cancelled") &&
        subscription.plan !== "lifetime" && (
          <div className="mt-6 flex flex-wrap gap-3">
            {isRefundEligible() &&
              (subscription.refundStatus === "none" ||
                subscription.refundStatus === "failed") && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowRefundModal(true)}
                    className="px-4 py-2 text-orange-400 border border-orange-400 rounded-lg hover:bg-orange-400/10 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {subscription.refundStatus === "failed"
                      ? "Retry Refund"
                      : "Request Refund"}
                    <span className="text-xs bg-orange-400/20 px-2 py-1 rounded">
                      {getRefundDaysRemaining()}d left
                    </span>
                  </button>
                  <button
                    onClick={() => setShowRefundPolicyModal(true)}
                    className="text-xs text-gray-400 hover:text-gray-300 transition-colors underline"
                  >
                    View Refund Policy
                  </button>
                </div>
              )}

            {!isRefundEligible() && subscription.refundStatus === "none" && (
              <div className="px-4 py-2 text-gray-500 border border-gray-600 rounded-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Refund Window Expired
              </div>
            )}

            {subscription.refundStatus === "requested" && (
              <div className="px-4 py-2 text-yellow-400 border border-yellow-400 rounded-lg flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Refund Processing...
              </div>
            )}

            {subscription.refundStatus === "failed" && (
              <div className="px-4 py-2 text-red-400 border border-red-400 rounded-lg flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Refund Failed - Click "Retry Refund" to try again
              </div>
            )}

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

      {subscription.status === "refunded" && (
        <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="h-5 w-5 text-orange-400" />
            <h4 className="font-medium text-orange-400">Refund Processed</h4>
          </div>
          <p className="text-sm text-orange-300">
            Your subscription has been refunded and your access has been removed
            immediately.
            {subscription.refundedAt && (
              <span className="block mt-1">
                Refunded on: {formatDate(subscription.refundedAt)}
                {subscription.refundAmount && (
                  <span className="ml-2">(${subscription.refundAmount})</span>
                )}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="h-6 w-6 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">
                Request Refund
              </h3>
            </div>

            <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-medium text-orange-400">
                    15-Day Refund Policy
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowRefundModal(false);
                    setShowRefundPolicyModal(true);
                  }}
                  className="text-xs text-orange-300 hover:text-orange-200 underline"
                >
                  View Details
                </button>
              </div>
              <p className="text-xs text-orange-300">
                You have {getRefundDaysRemaining()} days remaining to request a
                refund. Refunds are processed immediately and your access will
                be removed.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason for refund (optional)
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Help us improve by sharing your feedback..."
                className="w-full p-3 bg-[#2E2E32] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#1de4bf] focus:outline-none resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundReason("");
                }}
                className="flex-1 px-4 py-2 text-gray-400 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestRefund}
                disabled={refunding}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refunding ? "Processing..." : "Request Refund"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Policy Modal */}
      <RefundPolicyModal
        isOpen={showRefundPolicyModal}
        onClose={() => setShowRefundPolicyModal(false)}
      />
    </div>
  );
}
