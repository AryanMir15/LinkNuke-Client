import React, { useEffect } from "react";
import Topbar from "./Topbar";
import Configurator from "./Configurator";
import NukedLinksTable from "./NukedLinksTable";
import NukedLinksMobile from "./NukedLinksMobile";
import { useMediaQuery } from "react-responsive";
import { trackEvent } from "../lib/analytics";
import EmailVerificationBanner from "../components/ui/EmailVerificationBanner";

function Dashboard() {
  const isMobile = useMediaQuery({ maxWidth: 767 }); //

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
      <Configurator />
      {isMobile ? <NukedLinksMobile /> : <NukedLinksTable />}
    </div>
  );
}

export default Dashboard;
