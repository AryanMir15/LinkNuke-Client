import { Link } from "react-router-dom";
import ShineButton from "../components/ui/ShineButton";
import { trackEvent } from "../lib/analytics";
import { useEffect } from "react";
import GridPattern from "../components/ui/GridPattern";

const Hero = () => {
  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("token");

  useEffect(() => {
    // Only create cursor trail on laptop screens and above (1024px+)
    if (window.innerWidth < 1024) return;

    // Create custom cursor trail
    const trail = document.createElement("div");
    trail.className = "custom-cursor-trail";
    document.body.appendChild(trail);

    let mouseX = 0,
      mouseY = 0;
    let trailX = 0,
      trailY = 0;

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

    // Speed-capped scroll behavior
    let isScrolling = false;
    let scrollTimeout;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        document.body.style.scrollBehavior = "smooth";
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    document.addEventListener("mousemove", updateTrail);
    window.addEventListener("scroll", handleScroll, { passive: true });
    animateTrail();

    // Handle resize to show/hide cursor trail
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        if (trail.parentNode) trail.parentNode.removeChild(trail);
      } else if (!document.querySelector(".custom-cursor-trail")) {
        document.body.appendChild(trail);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousemove", updateTrail);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (trail.parentNode) trail.parentNode.removeChild(trail);
    };
  }, []);

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
        {/* Background */}
        <div className="absolute inset-0 bg-black" />
        <GridPattern />
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-20 md:py-[8rem] relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* MAIN HEADLINE */}
            <div className="space-y-8 mb-8">
              <h1 className="font-thin text-[48px] sm:text-[56px] lg:text-[72px] leading-tight tracking-tight text-white">
                One-Time Links That
                <br />
                <span className="bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-transparent bg-clip-text">
                  Self-Destruct
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-thin">
                Share sensitive files and links that automatically delete
                themselves after being viewed. Complete privacy, zero traces
                left behind.
              </p>
            </div>

            {/* CTA BUTTON */}
            <div className="mb-32">
              {isLoggedIn ? (
                <div className="relative inline-flex items-center justify-center gap-4 group">
                  <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200" />
                  <Link
                    to="/dashboard"
                    onClick={() => handleCTAClick("go_to_dashboard")}
                    className="group relative inline-flex items-center justify-center text-sm rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
                    title="dashboard"
                  >
                    Go to Dashboard
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
                  </Link>
                </div>
              ) : (
                <div className="relative inline-flex items-center justify-center gap-4 group">
                  <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200" />
                  <Link
                    to="/register"
                    onClick={() => handleCTAClick("start_sharing_securely")}
                    className="group relative inline-flex items-center justify-center text-sm rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
                    title="payment"
                  >
                    Get Started For Free
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
                  </Link>
                </div>
              )}
            </div>

            {/* DASHBOARD IMAGE */}
            <div className="w-full max-w-5xl scale-[1.3]">
              <img
                src="/dashboard.png"
                alt="LinkNuke Dashboard"
                className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
                style={{
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CSS for mobile optimizations and custom cursor */}
      <style jsx="true">{`
        /* CTA button shine effect */
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

        /* Capped slow smooth scroll */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
          scroll-timeline: auto;
          scroll-snap-type: none;
        }

        * {
          scroll-behavior: smooth;
        }

        /* Speed-capped smooth scroll */
        @media (prefers-reduced-motion: no-preference) {
          html {
            scroll-behavior: smooth;
            scroll-timeline: auto;
            scroll-snap-type: none;
            /* Cap scroll speed */
            scroll-snap-align: none;
          }

          body {
            scroll-behavior: smooth;
            overflow-x: hidden;
            /* Limit scroll velocity */
            scroll-snap-type: none;
          }

          /* ULTRA slow speed limiting */
          * {
            scroll-behavior: smooth;
            transition: scroll-behavior 1.8s
              cubic-bezier(0.05, 0.15, 0.25, 0.95);
            scroll-snap-type: none;
          }
        }

        /* Capped scroll with custom easing */
        @supports (scroll-behavior: smooth) {
          html {
            scroll-behavior: smooth;
            scroll-padding-top: 80px;
            scroll-snap-type: none;
            /* Speed cap */
            scroll-snap-align: none;
          }

          * {
            scroll-behavior: smooth;
            scroll-timeline: auto;
            /* Custom slow easing */
            transition: scroll-behavior 0.5s
              cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
        }

        /* Additional speed capping */
        html,
        body {
          scroll-behavior: smooth;
          scroll-snap-type: none;
          /* Limit maximum scroll speed */
          scroll-padding-top: 80px;
        }

        /* Custom cursor trail - only on laptop screens and above */
        .custom-cursor-trail {
          position: fixed;
          width: 8px;
          height: 8px;
          background: #1de4bf;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.8;
          transition: transform 0.15s ease-out;
          box-shadow: 0 0 10px rgba(29, 228, 191, 0.5);
        }

        /* Hide cursor trail on screens below laptop (1024px) */
        @media (max-width: 1023px) {
          .custom-cursor-trail {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
};

export default Hero;
