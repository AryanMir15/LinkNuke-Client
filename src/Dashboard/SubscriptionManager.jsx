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
  FileText,
} from "lucide-react";

import ErrorBoundary from "../components/ui/ErrorBoundary";
import RefundPolicyModal from "../components/ui/RefundPolicyModal";
import RefundModal from "../components/ui/RefundModal";
import RefundFailedModal from "../components/ui/RefundFailedModal";

export default function SubscriptionManager() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showRefundPolicyModal, setShowRefundPolicyModal] = useState(false);
  const [showRefundFailedModal, setShowRefundFailedModal] = useState(false);
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
      }
    } catch (error) {
      // Fallback: update localStorage with subscription data
      if (subscriptionData) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...currentUser,
          subscription: subscriptionData,
          plan: subscriptionData.plan,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  }, []);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
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

      setSubscription(response.data.subscription);
      setUsage(response.data.usage);
      setBillingPeriod(response.data.billing_period);

      // If we have subscription data, update localStorage user data
      if (response.data.subscription) {
        refreshUserSession(response.data.subscription);
      }
    } catch (err) {
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

      setShowRefundFailedModal(true);
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
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "refunded":
        return <RefreshCw className="h-4 w-4 text-amber-500" />;
      case "paused":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
            <div className="h-5 bg-gray-700 rounded w-32"></div>
          </div>
          <div className="h-4 w-4 bg-gray-700 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-gray-700 rounded w-12 mb-2"></div>
              <div className="h-5 bg-gray-700 rounded w-24"></div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="h-4 bg-gray-700 rounded w-20 mb-6"></div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="h-3 bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-1 bg-gray-700 rounded-full">
                <div className="h-full bg-gray-700 rounded-full w-1/3"></div>
              </div>
            </div>
            <div>
              <div className="h-3 bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-32"></div>
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
          <AlertCircle className="h-8 w-8 mx-auto mb-3" />
          <p className="mb-4 text-sm">{error}</p>
          <button
            onClick={fetchSubscriptionStatus}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
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
          <h3 className="text-base font-medium mb-2 text-white">
            No Active Subscription
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            You're currently on the free plan. Upgrade to unlock premium
            features.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
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
      {/* Subscription Details Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-gray-300" />
          <h3 className="text-base font-medium text-white">
            Subscription Details
          </h3>
        </div>
        <button
          onClick={() => navigate("/pricing")}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          Change Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
            Plan
          </h4>
          <p className="text-base font-medium text-white capitalize flex items-center gap-2">
            {subscription.plan} Plan
            <CheckCircle className="h-4 w-4 text-green-500" />
          </p>
        </div>

        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
            Status
          </h4>
          <p className="text-base font-medium text-white capitalize">
            {subscription.status}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
            Started
          </h4>
          <p className="text-sm text-gray-300">
            {subscription.status === "refunded"
              ? formatDate(
                  subscription.firstPaymentDate || subscription.startDate
                )
              : formatDate(subscription.startDate)}
          </p>
          {isRefundEligible() && subscription.refundStatus === "none" && (
            <button
              onClick={() => setShowRefundModal(true)}
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2 mt-1 underline"
            >
              <Clock className="h-3 w-3" />
              {getRefundDaysRemaining()} days remaining
            </button>
          )}
        </div>

        <div>
          <h4 className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
            {subscription.status === "refunded"
              ? "Refunded On"
              : subscription.plan === "lifetime"
              ? "Valid Until"
              : "Next Billing"}
          </h4>
          <p className="text-sm text-gray-300">
            {subscription.status === "refunded"
              ? formatDate(subscription.refundedAt || subscription.endDate)
              : formatDate(subscription.endDate)}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mb-8"></div>

      {/* Usage & Billing Section */}
      <div className="mb-8">
        <h4 className="text-base font-medium text-white mb-6">
          Usage & Billing
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-300 mb-2">
              Links used: {usage?.links?.current ?? 0}/
              {usage?.links?.limit ?? "Unlimited"} ({usage?.links?.percent ?? 0}
              %)
            </p>
            {usage?.links?.limit && (
              <div className="h-2 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-gray-400 rounded-full transition-all duration-500"
                  style={{ width: `${usage.links.percent}%` }}
                />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-300 mb-1">Billing period</p>
            <p className="text-sm text-white mb-1">
              {billingPeriod?.remaining_days ?? "N/A"} days remaining
            </p>
            <p className="text-xs text-gray-400">
              {formatDate(billingPeriod?.start)} -{" "}
              {formatDate(billingPeriod?.end)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <button
          onClick={handleCancelSubscription}
          disabled={cancelling}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {cancelling ? "Cancelling..." : "Cancel Subscription"}
        </button>
      </div>

      {/* Status Messages */}
      {subscription.status === "cancelled" && (
        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-sm text-amber-400">
            Your subscription has been cancelled. You'll have access to premium
            features until {formatDate(subscription.endDate)}.
          </p>
        </div>
      )}

      {subscription.status === "refunded" && (
        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg relative">
          <button
            onClick={() =>
              setSubscription((prev) => ({ ...prev, status: "hidden" }))
            }
            className="absolute top-2 right-2 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <XCircle className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="h-5 w-5 text-amber-400" />
            <h4 className="font-medium text-amber-400">Refund Processed</h4>
          </div>
          <p className="text-sm text-amber-300">
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
      <RefundModal
        isOpen={showRefundModal}
        onClose={() => {
          setShowRefundModal(false);
          setRefundReason("");
        }}
        onRequestRefund={handleRequestRefund}
        refundDaysRemaining={getRefundDaysRemaining()}
        refundReason={refundReason}
        setRefundReason={setRefundReason}
        refunding={refunding}
      />

      {/* Refund Policy Modal */}
      <RefundPolicyModal
        isOpen={showRefundPolicyModal}
        onClose={() => setShowRefundPolicyModal(false)}
      />

      {/* Refund Failed Modal */}
      <RefundFailedModal
        isOpen={showRefundFailedModal}
        onClose={() => setShowRefundFailedModal(false)}
        supportEmail="support@whynotship.me"
      />
    </div>
  );
}
