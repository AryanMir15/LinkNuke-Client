import React, { useEffect, useState } from "react";
import Topbar from "./Topbar";
import Configurator from "./Configurator";
import NukedLinksTable from "./NukedLinksTable";
import NukedLinksMobile from "./NukedLinksMobile";
import SubscriptionManager from "./SubscriptionManager";
import { useMediaQuery } from "react-responsive";
import { trackEvent } from "../lib/analytics";
import EmailVerificationBanner from "../components/ui/EmailVerificationBanner";

function Dashboard() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [activeTab, setActiveTab] = useState("links");

  useEffect(() => {
    // Track dashboard visit
    trackEvent("dashboard_visited", {
      timestamp: new Date().toISOString(),
      isMobile: isMobile,
    });
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-[#1F1F23]">
      <EmailVerificationBanner />
      <Topbar />

      {/* Tab Navigation */}
      <div className="px-4 py-6">
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab("links")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "links"
                ? "bg-[#1de4bf] text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            My Links
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "subscription"
                ? "bg-[#1de4bf] text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Subscription
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "links" ? (
          <>
            <Configurator />
            {isMobile ? <NukedLinksMobile /> : <NukedLinksTable />}
          </>
        ) : (
          <SubscriptionManager />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
