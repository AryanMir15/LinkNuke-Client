import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Topbar from "./Topbar";
import GeneratedLinks from "./GeneratedLinks";
import SubscriptionManager from "./SubscriptionManager";
import { useLinksContext } from "../context/useLinksContext";

export default function Dashboard() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFreePlanLimit, setShowFreePlanLimit] = useState(false);
  const { links } = useLinksContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [links]); // Add links as dependency

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
    navigate("/pricing");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1de4bf]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Topbar />

      {/* Free Plan Limit Banner */}
      {showFreePlanLimit && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3">
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
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
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
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);

          const safeLinks = Array.isArray(links) ? links : [];
          const linksThisMonth = safeLinks.filter(
            (link) => new Date(link.createdAt) >= startOfMonth
          ).length;

          if (linksThisMonth >= 3) {
            return (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3">
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
                    className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })()}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <GeneratedLinks />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SubscriptionManager />

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Links
                  </span>
                  <span className="font-semibold">
                    {Array.isArray(links) ? links.length : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plan</span>
                  <span className="font-semibold capitalize">
                    {subscription?.plan || "Free"}
                  </span>
                </div>
                {(!subscription?.plan || subscription?.plan === "free") &&
                  (() => {
                    const startOfMonth = new Date();
                    startOfMonth.setDate(1);
                    startOfMonth.setHours(0, 0, 0, 0);

                    const safeLinks = Array.isArray(links) ? links : [];
                    const linksThisMonth = safeLinks.filter(
                      (link) => new Date(link.createdAt) >= startOfMonth
                    ).length;

                    return (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Links This Month
                        </span>
                        <span className="font-semibold">
                          {linksThisMonth}/5
                        </span>
                      </div>
                    );
                  })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
