"use client";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "../lib/analytics";

export default function FinalCTA() {
  const handleCTAClick = () => {
    trackEvent("final_cta_clicked", {
      source: "landing_page_bottom",
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <section className="relative bg-black py-16 sm:py-24 px-6 text-white overflow-hidden rounded-2xl mt-12 mb-12">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="font-thin text-[48px] sm:text-[56px] lg:text-[72px] leading-tight tracking-tight mb-6">
          Send sensitive files without the fear of oversharing.
        </h2>

        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto font-thin">
          Stop your investor deck from getting leaked. Your data, your control,
          deleted forever after one view.
        </p>

        <div className="flex justify-center">
          <a
            href="/register"
            onClick={handleCTAClick}
            className="group relative bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:from-[#1de4bf]/90 hover:to-[#0bf3a2]/90 text-black font-semibold py-3 sm:py-4 px-6 sm:px-10 rounded-full text-base sm:text-lg shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-95 shine-button overflow-hidden"
          >
            <span className="relative z-10">Send a Self-Destructing Link</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0bf3a2] to-[#1de4bf] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
        </div>
      </div>

      {/* CSS for shine effect */}
      <style jsx="true">{`
        .shine-button {
          position: relative;
          overflow: hidden;
        }

        .shine-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.5s ease;
        }

        .shine-button:hover::before {
          left: 100%;
        }
      `}</style>
    </section>
  );
}
