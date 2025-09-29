import { Link } from "react-router-dom";
import ShineButton from "../components/ui/ShineButton";
import { GridBackground } from "../components/ui/grid-background";
import { trackEvent } from "../lib/analytics";

const Hero = () => {
  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("token");

  const handleCTAClick = (action) => {
    trackEvent("hero_cta_clicked", {
      action: action,
      isLoggedIn: !!isLoggedIn,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <main>
      <section
        className="relative isolate overflow-hidden min-h-[100dvh]"
        id="home"
        role="banner"
        aria-label="LinkNuke - Secure Self-Destructing Links Hero Section"
      >
      <GridBackground
        className="bg-black"
        gridSize="4:4"
        colors={{
          background: "bg-black",
          borderColor: "border-gray-900/10",
          borderSize: "1px",
        }}
        beams={{
          count: 3,
          speed: 8,
          colors: ["bg-gray-600/20", "bg-gray-500/15", "bg-gray-400/10"],
          shadow: "shadow-sm shadow-gray-500/10 rounded-full",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-20 md:py-[8rem] relative z-10">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* LEFT SIDE - TEXT CONTENT */}
            <div className="lg:pt-4 lg:pr-8">
              <div className="lg:max-w-lg">
                <div className="text-white space-y-8">
                  <div className="space-y-6">
                    <h1 className="font-semibold text-[48px] sm:text-[56px] lg:text-[64px] leading-tight tracking-tight">
                      One-Time Links That
                      <br />
                      <span className="bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-transparent bg-clip-text">
                        Self-Destruct
                      </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-300 leading-relaxed w-full max-w-[28rem] sm:max-w-[32rem] break-words font-normal">
                      Share sensitive files and links that automatically delete
                      themselves after being viewed. Complete privacy, zero
                      traces left behind.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row flex-nowrap gap-4 pt-4">
                    {isLoggedIn ? (
                      <Link
                        to="/dashboard"
                        onClick={() => handleCTAClick("go_to_dashboard")}
                        className="group relative bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black font-medium px-8 py-4 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-[#1de4bf] focus:ring-offset-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center shine-button"
                      >
                        <span className="relative z-10">Go to Dashboard</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0bf3a2] to-[#1de4bf] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/register"
                          onClick={() =>
                            handleCTAClick("start_sharing_securely")
                          }
                          className="inline-flex w-full sm:w-auto"
                        >
                          <ShineButton
                            size="lg"
                            label="Start Sharing Securely"
                            className="px-8 py-4 rounded-full w-full sm:w-auto shine-button"
                            bgColor="linear-gradient(325deg, hsl(160 84% 39%) 0%, hsl(174 84% 40%) 55%, hsl(160 84% 39%) 90%)"
                          />
                        </Link>
                        <Link
                          to="/login"
                          onClick={() => handleCTAClick("sign_in")}
                          className="group relative bg-transparent text-white border-2 border-white/30 font-medium px-8 py-4 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl inline-flex items-center justify-center min-h-[44px] w-full sm:w-auto"
                        >
                          Sign In
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="text-sm text-gray-400 font-normal">
                    No credit card required. Get started for free.
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - DASHBOARD IMAGE */}
            <img
              src="/dashboard.png"
              alt="LinkNuke Dashboard"
              className="w-3xl max-w-md md:max-w-none rounded-xl shadow-lg ring-1 ring-white/5 sm:w-228 md:-ml-4 lg:-ml-0 lg:w-[120%] lg:-mr-16 xl:w-[135%] xl:-mr-28"
              style={{
                filter: "drop-shadow(0 8px 16px rgba(29, 228, 191, 0.08))",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              }}
            />
          </div>
        </div>
      </GridBackground>
      </section>
    </main>

      {/* CSS for mobile optimizations */}
      <style jsx="true">{`
        /* Reduce particles to 3 on mobile */
        @media (max-width: 768px) {
          [data-slot="grid-background"] [class*="animate-"] {
            display: none !important;
          }
          [data-slot="grid-background"] [class*="animate-"]:nth-child(-n + 3) {
            display: block !important;
          }
        }

        /* CTA button shine effect only - no cart animation */
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
  );
};

export default Hero;
