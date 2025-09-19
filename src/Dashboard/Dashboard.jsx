import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Topbar from "./Topbar";
import GeneratedLinks from "./GeneratedLinks";
import SubscriptionManager from "./SubscriptionManager";
import { useLinksContext } from "../context/useLinksContext";
import { getUsageStats } from "../lib/linkApi";
import { BarChart3, CreditCard } from "lucide-react";
import PaymentSuccessModal from "../components/ui/PaymentSuccessModal";
import WelcomeModal from "../components/ui/WelcomeModal";

export default function Dashboard() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFreePlanLimit, setShowFreePlanLimit] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false); // Only show on payment success
  const [usageStats, setUsageStats] = useState({
    monthlyTotal: 0,
    allTimeTotal: 0,
  });
  const { links, fetchLinks } = useLinksContext();
  const [searchParams] = useSearchParams();
  const paymentProcessed = useRef(false);
  const initialDataFetched = useRef(false);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/paddle/subscription-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubscription(response.data.subscription);

      // Check if user is on free plan or refunded and has reached limit
      if (
        !response.data.subscription?.plan ||
        response.data.subscription?.plan === "free" ||
        response.data.subscription?.status === "refunded"
      ) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Get links from context directly instead of dependency
        const currentLinks = Array.isArray(links) ? links : [];
        const linksThisMonth = currentLinks.filter(
          (link) => new Date(link.createdAt) >= startOfMonth
        ).length;

        if (linksThisMonth >= 5) {
          setShowFreePlanLimit(true);
        } else {
          setShowFreePlanLimit(false);
        }
      } else {
        // User is on a paid plan - hide the free plan limit banner
        setShowFreePlanLimit(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove links dependency to prevent infinite loop

  const refreshUserSession = useCallback(async () => {
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
      // Fallback: try to get user data from subscription status
      try {
        const token = localStorage.getItem("token");
        const subResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/paddle/subscription-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (subResponse.data.subscription) {
          // Update localStorage user data with subscription info
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          const updatedUser = {
            ...currentUser,
            subscription: subResponse.data.subscription,
            plan: subResponse.data.subscription.plan,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } catch (subError) {}
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        if (!isMounted || initialDataFetched.current) return;

        initialDataFetched.current = true;

        // Fetch links in background (don't wait for it)
        if (!links || links.length === 0) {
          fetchLinks().catch((err) => {});
        }

        // Always fetch subscription status to get accurate data
        if (isMounted) {
          await fetchSubscriptionStatus();
        }
      } catch (err) {
        if (isMounted && err.name !== "AbortError") {
          toast.error(err.message || "Failed to load dashboard");
        }
        setLoading(false); // Ensure loading is set to false on error
      }
    };

    fetchData();

    // Fallback timeout to ensure loading never gets stuck
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run only once on mount

  // Handle payment success/cancel messages (run only once)
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");

    // Only process if there's a payment parameter and we haven't processed it yet
    if (paymentStatus && !paymentProcessed.current) {
      paymentProcessed.current = true;

      if (paymentStatus === "success") {
        toast.success("Payment successful! Welcome to LinkNuke Pro!");
        // Show welcome modal for successful payment
        setShowWelcomeModal(true);
        // Always refresh subscription status after payment success
        // This will update the UI to show the new Pro plan
        fetchSubscriptionStatus();
        // Also refresh user session data
        refreshUserSession();
        // Force a page reload to ensure UI updates with new subscription data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (paymentStatus === "cancelled") {
        toast.error("Payment was cancelled");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run only once on mount

  const handleUpgrade = () => {
    setActiveTab("billing");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUsageStats();
        if (data && typeof data === "object") {
          setUsageStats(data);
        } else {
          setUsageStats({ monthlyTotal: 0, allTimeTotal: 0 });
        }
      } catch (error) {
        toast.error("Failed to load usage statistics");
        setUsageStats({ monthlyTotal: 0, allTimeTotal: 0 });
      }
    };

    // Only fetch stats once when we have links data (avoid double calls)
    if (links !== null && Array.isArray(links) && links.length > 0) {
      // Debounce to prevent rapid successive calls
      const timeoutId = setTimeout(fetchStats, 500);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links?.length]); // Only depend on links length, not the entire links array

  if (loading) {
    return (
      <>
        {searchParams.get("payment") === "success" && <PaymentSuccessModal />}
        <div className="min-h-screen bg-[#1F1F23]">
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1de4bf]"></div>
          </div>
        </div>
      </>
    );
  }

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      id: "billing",
      label: "Billing & Plans",
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen bg-[#1F1F23]">
      <Topbar />

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        planName={subscription?.plan || "Pro"}
      />

      {/* Free Plan Limit Banner */}
      {showFreePlanLimit && (
        <div className="bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Free Plan Limit Reached</h3>
              <p className="text-sm opacity-90">
                You've used all 5 free links this month. Upgrade to create more
                links and unlock premium features.
              </p>
            </div>
            <button
              onClick={handleUpgrade}
              className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Free Plan Usage Banner */}
      {(!subscription?.plan || subscription?.plan === "free") &&
        !showFreePlanLimit &&
        (() => {
          if (usageStats.monthlyTotal >= 3) {
            return (
              <div className="bg-gradient-to-r from-[#1de4bf]/20 to-[#0bf3a2]/20 border border-[#1de4bf]/30 text-white px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Free Plan Usage</h3>
                    <p className="text-sm opacity-90">
                      You've used {usageStats.monthlyTotal}/5 free links this
                      month. Upgrade to create unlimited links.
                    </p>
                  </div>
                  <button
                    onClick={handleUpgrade}
                    className="bg-[#1de4bf] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#0bf3a2] transition-colors"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })()}

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Centered Tab Navigation */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          <div className="flex bg-[#2A2A2E]/80 backdrop-blur-xl rounded-xl p-1.5 shadow-lg max-w-[320px]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                    isActive
                      ? "bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black shadow"
                      : "text-gray-400 hover:text-white hover:bg-[#2E2E32]/50"
                  }`}
                >
                  <Icon className="size-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div className="w-full">
            <GeneratedLinks />
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
            {/* Billing Header */}
            <div className="bg-[#2A2A2E] rounded-xl p-4 sm:p-6 shadow-lg border border-[#2E2E32]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Billing & Plans
                  </h2>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base">
                    Manage your subscription and billing preferences
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-400">Current Plan</p>
                  <p className="text-lg font-semibold text-white capitalize">
                    {subscription?.plan || "Free"}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription Manager */}
            <div className="bg-[#2A2A2E] rounded-xl shadow-lg border border-[#2E2E32]">
              <SubscriptionManager />
            </div>

            {/* Quick Stats */}
            <div className="bg-[#2A2A2E] rounded-xl shadow-lg p-4 sm:p-6 border border-[#2E2E32]">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Total Links Created</span>
                    <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">i</span>
                    </div>
                  </div>
                  <span className="font-semibold text-white">
                    {subscription?.usage?.totalLinksCreated || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Links</span>
                  <span className="font-semibold text-white">
                    {Array.isArray(links) ? links.length : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span className="font-semibold text-white capitalize">
                    {subscription?.plan || "Free"}
                  </span>
                </div>
                {(!subscription?.plan ||
                  subscription?.plan === "free" ||
                  subscription?.status === "refunded") && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Limit</span>
                    <span className="font-semibold text-white">
                      {usageStats.monthlyTotal}/5
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
