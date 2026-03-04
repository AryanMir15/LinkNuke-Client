"use client";
import { trackEvent } from "../lib/analytics";

export default function FinalCTA() {
  const handleCTAClick = () => {
    trackEvent("final_cta_clicked", {
      source: "landing_page_bottom",
      timestamp: typeof window !== "undefined" ? new Date().toISOString() : "",
    });
  };

  return (
    <section className="relative bg-black py-16 sm:py-24 px-6 text-white overflow-hidden rounded-2xl mt-12 mb-12">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="font-medium text-[48px] sm:text-[56px] lg:text-[72px] leading-tight tracking-tight mb-6">
          Send sensitive files without the fear of oversharing.
        </h2>

        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8 sm:mb-10 max-w-xl mx-auto font-thin">
          Stop your investor deck from getting leaked. Your data, your control,
          deleted forever after one view.
        </p>

        <div className="flex justify-center">
          <div className="relative inline-flex items-center justify-center gap-4 group">
            <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200" />
            <a
              href="/register"
              onClick={handleCTAClick}
              className="group relative inline-flex items-center justify-center text-sm rounded-xl bg-gray-900 px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
            >
              Send a Self-Destructing Link
              <svg
                aria-hidden="true"
                viewBox="0 0 10 10"
                height={10}
                width={10}
                fill="none"
                className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
              >
                <path
                  d="M0 5h7"
                  className="transition opacity-0 group-hover:opacity-100"
                />
                <path
                  d="M1 1l4 4-4 4"
                  className="transition group-hover:translate-x-[3px]"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
