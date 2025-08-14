import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Topbar from "./Topbar";
import GeneratedLinks from "./GeneratedLinks";
import SubscriptionManager from "./SubscriptionManager";
import { useLinksContext } from "../context/useLinksContext";
import { BarChart3, CreditCard } from "lucide-react";
import PaymentSuccessModal from "../components/ui/PaymentSuccessModal";

export default function Dashboard() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFreePlanLimit, setShowFreePlanLimit] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { links } = useLinksContext();
  const [searchParams] = useSearchParams();
  const paymentSuccess = searchParams.get("payment") === "success";

  // Handle payment success/cancel messages
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast.success("Payment successful! Welcome to LinkNuke Pro!");
      // Refresh subscription status
      fetchSubscriptionStatus();
    } else if (paymentStatus === "cancelled") {
      toast.error("Payment was cancelled");
    }
  }, [searchParams]);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [links]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/paddle/subscription-status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      setSubscription(response.data.subscription);

      // Check if user is on free plan and has reached limit
      if (
        !response.data.subscription?.plan ||
        response.data.subscription?.plan === "free"
      ) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Ensure links is an array before filtering
        const safeLinks = Array.isArray(links) ? links : [];
        const linksThisMonth = safeLinks.filter(
          (link) => new Date(link.createdAt) >= startOfMonth
        ).length;

        if (linksThisMonth >= 5) {
          setShowFreePlanLimit(true);
        }
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    setActiveTab("billing");
  };

  if (loading) {
    return (
      <>
        {paymentSuccess && <PaymentSuccessModal />}
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

  const getLinksThisMonth = () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const safeLinks = Array.isArray(links) ? links : [];
    return safeLinks.filter((link) => new Date(link.createdAt) >= startOfMonth)
      .length;
  };

  return (
    <div className="min-h-screen bg-[#1F1F23]">
      <Topbar />

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
          const linksThisMonth = getLinksThisMonth();
          if (linksThisMonth >= 3) {
            return (
              <div className="bg-gradient-to-r from-[#1de4bf]/20 to-[#0bf3a2]/20 border border-[#1de4bf]/30 text-white px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Free Plan Usage</h3>
                    <p className="text-sm opacity-90">
                      You've used {linksThisMonth}/5 free links this month.
                      Upgrade to create unlimited links.
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
          <div className="flex bg-[#2A2A2E]/80 backdrop-blur-xl rounded-2xl p-1 shadow-lg max-w-[200px] sm:max-w-xs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm lg:text-base ${
                    isActive
                      ? "bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black shadow"
                      : "text-gray-400 hover:text-white hover:bg-[#2E2E32]/50"
                  }`}
                >
                  <Icon
                    size={12}
                    className="sm:size-14 lg:size-16 mr-1 sm:mr-1.5 lg:mr-2"
                  />
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
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Links</span>
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
                {(!subscription?.plan || subscription?.plan === "free") && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Links This Month</span>
                    <span className="font-semibold text-white">
                      {getLinksThisMonth()}/5
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
