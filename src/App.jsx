import React, { useEffect } from "react";
// import posthog from 'posthog-js'  // Disabled analytics
import { Routes, Route } from "react-router-dom";
import Lenis from "lenis";
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
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2, // How long it takes to "catch up" to scroll position
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for smooth feel
      direction: "vertical", // Scroll direction
      gestureDirection: "vertical", // Gesture direction
      smooth: true, // Enable smooth scrolling
      mouseMultiplier: 1, // Mouse wheel sensitivity
      smoothTouch: false, // Disable smooth scrolling on touch devices
      touchMultiplier: 2, // Touch sensitivity
      infinite: false, // Don't loop infinitely
    });

    // Animation frame loop for smooth scrolling
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Lenis smooth scroll CSS */}
      <style jsx="true">{`
        html {
          scroll-behavior: auto; /* Let Lenis handle smooth scrolling */
        }

        body {
          scroll-behavior: auto; /* Let Lenis handle smooth scrolling */
        }

        /* Ensure proper scrolling behavior */
        * {
          scroll-behavior: auto;
        }
      `}</style>

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
