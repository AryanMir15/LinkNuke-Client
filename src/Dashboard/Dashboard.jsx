import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Topbar from "./Topbar";
import GeneratedLinks from "./GeneratedLinks";
import SubscriptionManager from "./SubscriptionManager";
import { useLinksContext } from "../context/useLinksContext";

export default function Dashboard() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrialExpired, setShowTrialExpired] = useState(false);
  const { links, loading: linksLoading } = useLinksContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

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

      // Check if trial has expired
      if (
        response.data.subscription?.isTrial &&
        response.data.subscription?.endDate
      ) {
        const trialEndDate = new Date(response.data.subscription.endDate);
        const now = new Date();

        if (now > trialEndDate) {
          setShowTrialExpired(true);
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

      {/* Trial Expired Banner */}
      {showTrialExpired && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Trial Expired</h3>
              <p className="text-sm opacity-90">
                Your free trial has ended. Upgrade to continue using premium
                features.
              </p>
            </div>
            <button
              onClick={handleUpgrade}
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Trial Ending Soon Banner */}
      {subscription?.isTrial &&
        subscription?.endDate &&
        !showTrialExpired &&
        (() => {
          const trialEndDate = new Date(subscription.endDate);
          const now = new Date();
          const daysLeft = Math.ceil(
            (trialEndDate - now) / (1000 * 60 * 60 * 24)
          );

          if (daysLeft <= 1) {
            return (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Trial Ending Soon</h3>
                    <p className="text-sm opacity-90">
                      Your trial ends in {daysLeft} day
                      {daysLeft !== 1 ? "s" : ""}. Upgrade to keep your data and
                      continue using premium features.
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
                  <span className="font-semibold">{links.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plan</span>
                  <span className="font-semibold capitalize">
                    {subscription?.plan || "Free"}
                    {subscription?.isTrial && " (Trial)"}
                  </span>
                </div>
                {subscription?.isTrial && subscription?.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Trial Ends
                    </span>
                    <span className="font-semibold">
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
