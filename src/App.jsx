import React from "react";
// import posthog from 'posthog-js'  // Disabled analytics
import { Routes, Route } from "react-router-dom";
import Hero from "./Landing-page/Hero";
import FeatureSection from "./Landing-page/Features";
import Preview from "./Landing-page/Preview";
import Pricing from "./Landing-page/Pricing";
import FAQs from "./Landing-page/FAQs";
import Footer from "./Landing-page/Footer";
import Navbar from "./Landing-page/Navbar";
import FinalCTA from "./Landing-page/CTA";
import PainPoints from "./Landing-page/PainPoints";
import FeedbackAdmin from "./Dashboard/FeedbackAdmin";
import NotFound from "./Landing-page/NotFound";
import FounderNote from "./Landing-page/FounderNote";
import Privacy from "./Landing-page/Privacy";
import Terms from "./Landing-page/Terms";
import RefundPolicy from "./Landing-page/RefundPolicy";
import OAuthSuccess from "./components/OAuthSuccess";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* SEO: Main navigation */}
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Preview />
              <PainPoints />
              <FeatureSection />
              <Pricing />
              <FounderNote />
              <FAQs />
              <FinalCTA />
              <Footer />
            </>
          }
        />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/dashboard/feedback-admin" element={<FeedbackAdmin />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
//Test
export default App;
