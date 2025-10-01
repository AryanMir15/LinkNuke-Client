import React, { useState, useEffect } from "react";
// import posthog from 'posthog-js'  // Disabled analytics
import { Routes, Route, Link } from "react-router-dom";
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

// Import the FeedbackForm component
import FeedbackForm from "./Dashboard/FeedbackForm";

// Feedback Component
const Feedback = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Share Your Feedback</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We'd love to hear your thoughts, suggestions, or any issues you've encountered.
          </p>
        </div>
        <div className="bg-gray-900 p-6 sm:p-8 rounded-xl max-w-2xl mx-auto">
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
};

// Floating Feedback Button Component
const FeedbackButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to="/feedback"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Gradient Background */}
        <div 
          className={`absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter ${
            isHovered ? 'opacity-100' : 'opacity-60'
          }`}
          style={{
            width: 'calc(100% + 4px)',
            height: 'calc(100% + 4px)',
            top: '-2px',
            left: '-2px',
          }}
        />
        {/* Button */}
        <div className="relative flex items-center justify-center px-6 py-3 text-sm font-semibold text-white transition-all duration-200 bg-gray-900 rounded-xl group-hover:bg-gray-800 group-hover:shadow-lg group-hover:-translate-y-0.5 group-hover:shadow-gray-600/30">
          Feedback
          <svg
            aria-hidden="true"
            viewBox="0 0 10 10"
            height={12}
            width={12}
            fill="none"
            className="ml-2 -mr-1 stroke-white stroke-2"
          >
            <path
              d="M0 5h5"
              className="transition opacity-0 group-hover:opacity-100"
            />
            <path
              d="M1 1l4 4-4 4"
              className="transition group-hover:translate-x-[3px]"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
};

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

    // Cursor trail effect - only on desktop
    if (window.innerWidth >= 1024) {
      const trail = document.createElement("div");
      trail.className = "custom-cursor-trail";
      document.body.appendChild(trail);

      let mouseX = 0, mouseY = 0;
      let trailX = 0, trailY = 0;

      const updateTrail = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };

      const animateTrail = () => {
        trailX += (mouseX - trailX) * 0.05;
        trailY += (mouseY - trailY) * 0.05;

        trail.style.left = trailX - 4 + "px";
        trail.style.top = trailY - 4 + "px";

        requestAnimationFrame(animateTrail);
      };

      // Start animation
      requestAnimationFrame(animateTrail);
      document.addEventListener("mousemove", updateTrail);

      // Cleanup
      return () => {
        document.removeEventListener("mousemove", updateTrail);
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
        lenis.destroy();
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style jsx="true" global="true">
        {`
          html {
            scroll-behavior: auto; /* Let Lenis handle smooth scrolling */
          }
          /* Ensure proper scrolling behavior */
          * {
            scroll-behavior: auto;
          }
        `}
      </style>

      {/* SEO: Main navigation */}
      <Navbar />
      <FeedbackButton />
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
        <Route path="/feedback" element={<Feedback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
//Test
export default App;
