"use client";
import { useState } from "react";
import axios from "axios";
import { useSession } from "../context/useSession.jsx";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Sparkles } from "lucide-react";
import posthog from "../lib/posthog.js";
// import toast from "react-hot-toast";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out LinkNuke.",
    features: [
      "5 secure links/month",
      "50 MB storage",
      "Image & Text formats only",
      "1 file per link",
      "50 MB max file size",
      "Basic customization",
    ],
    featured: false,
  },

  {
    name: "Pro",
    price: "$9",
    description: "For power users and growing businesses.",
    features: [
      "500 secure links/month",
      "10 GB storage",
      "Image, Video, Text, Audio, Doc",
      "Up to 10 files per link",
      "500 MB max file size",
      "Advanced customization",
      "Feedback system",
      "Priority email support",
    ],
    featured: true,
  },
  {
    name: "Lifetime",
    price: "$49",
    description: "One-time payment, lifetime access.",
    features: [
      "Unlimited secure links",
      "Unlimited storage",
      "Image, Video, Text, Audio, Doc",
      "Unlimited files per link",
      "Unlimited file size",
      "Advanced customization",
      "Feedback system",
      "Priority support",
      "Founding Member badge",
      "Early access to new features",
    ],
    featured: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PricingSection() {
  const [loadingStates, setLoadingStates] = useState({
    Free: false,
    Pro: false,
    Lifetime: false,
  });
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useSession();

  // Check if mobile for performance optimization
  // useEffect(() => {
  //   const checkMobile = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };
  //   checkMobile();
  //   window.addEventListener("resize", checkMobile);
  //   return () => window.removeEventListener("resize", checkMobile);
  // }, []);

  const handleUpgradeClick = async (tier) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [tier.name]: true }));
      setError(null);

      // Check if user is logged in by checking localStorage
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (!storedUser || !token) {
        // Show simple alert for unauthenticated users
        alert("Please login or create an account to purchase");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/paddle/create-checkout`,
        {
          productType: tier.name.toLowerCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      posthog.capture("upgrade_clicked", {
        tier: tier.name,
        price: tier.price,
        featured: tier.featured,
        fromPage: "landing",
        timestamp: new Date().toISOString(),
      });

      // Redirect immediately to checkout
      window.location.href = response.data.checkoutUrl;
    } catch (err) {
      const errorMessage = "Failed to initiate payment. Please try again.";
      setError(errorMessage);

      // Show simple error alert
      alert(errorMessage);

      posthog.capture("payment_error", {
        error: err.message,
        tier: tier.name,
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [tier.name]: false }));
    }
  };

  return (
    <section
      id="pricing"
      className="relative isolate bg-black px-6 py-32 sm:py-40 lg:px-8 text-white overflow-hidden"
    >
      {/* Subtle Background Pattern - Mobile friendly */}
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(29, 228, 191, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(29, 228, 191, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0 bg-white dark:bg-black"
        style={{
          maskImage:
            "radial-gradient(ellipse at center, transparent 40%, black)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, transparent 40%, black)",
        }}
      />

      {/* Header */}
      <div className="relative mx-auto max-w-4xl text-center z-10">
        <div>
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#1de4bf]/10 border border-[#1de4bf]/20 text-[#1de4bf] text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Limited Time Offer
          </div>
          <h2 className="text-base font-semibold text-[#1de4bf]">Pricing</h2>
          <p className="mt-2 font-thin text-[48px] sm:text-[56px] lg:text-[72px] leading-tight tracking-tight">
            Choose the right plan for you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-300 leading-relaxed font-thin">
          Choose an affordable plan that's packed with the best features for
          secure, self-destructing links.
        </p>
      </div>

      {/* Cards */}
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-6xl lg:grid-cols-3 z-10 relative">
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            className={classNames(
              "relative rounded-2xl p-8 sm:p-10 flex flex-col transition-all duration-300",
              tier.name === "Pro" && "hover:scale-[1.05]",
              tier.name === "Lifetime" && "hover:scale-[1.02]",
              tier.name === "Free" && "hover:scale-[1.02]",
              tier.featured && "lg:scale-105",
            )}
            style={{
              // Card styling based on your provided design
              background:
                tier.name === "Pro"
                  ? "radial-gradient(circle 280px at 0% 0%, rgba(29, 228, 191, 0.12), #0c0d0d), radial-gradient(circle 280px at 100% 100%, rgba(29, 228, 191, 0.12), #0c0d0d)"
                  : tier.name === "Lifetime"
                    ? "radial-gradient(circle 280px at 100% 100%, rgba(29, 228, 191, 0.12), #0c0d0d)"
                    : "radial-gradient(circle 280px at 0% 0%, #555555, #0c0d0d)",
              border: "1px solid #202222",
              borderRadius: "10px",
              padding: "1px",
            }}
          >
            {/* Animated dots - Only on Pro card and desktop */}

            {/* Card content */}
            <div
              className={classNames(
                "w-full h-full rounded-lg flex flex-col items-center relative",
                tier.name === "Free" ? "justify-start pt-8" : "justify-center",
              )}
              style={{
                background:
                  tier.name === "Pro"
                    ? "radial-gradient(circle 280px at 0% 0%, rgba(29, 228, 191, 0.12), #0c0d0d), radial-gradient(circle 280px at 100% 100%, rgba(29, 228, 191, 0.12), #0c0d0d)"
                    : tier.name === "Lifetime"
                      ? "radial-gradient(circle 280px at 100% 100%, rgba(29, 228, 191, 0.12), #0c0d0d)"
                      : "radial-gradient(circle 280px at 0% 0%, #555555, #0c0d0d)",
                border: "solid 1px #202222",
                minHeight: "500px",
                width: "calc(100% + 6px)",
                margin: "0 -3px",
              }}
            >
              {/* Border lines - Behind content */}
              <div
                className="absolute h-px bg-gradient-to-r from-gray-500/30 to-gray-800/30"
                style={{ top: "15%", left: "15%", right: "15%", zIndex: 1 }}
              />
              <div
                className="absolute h-px bg-gray-800/30"
                style={{ bottom: "15%", left: "15%", right: "15%", zIndex: 1 }}
              />
              <div
                className="absolute w-px bg-gradient-to-b from-gray-500/30 to-gray-800/30"
                style={{ left: "15%", top: "15%", bottom: "15%", zIndex: 1 }}
              />
              <div
                className="absolute w-px bg-gray-800/30"
                style={{ right: "15%", top: "15%", bottom: "15%", zIndex: 1 }}
              />

              {/* Featured badge */}
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#1de4bf]/20 border border-[#1de4bf]/30 text-[#1de4bf] text-sm font-bold tracking-wide shadow-lg z-30">
                  Most Popular
                </div>
              )}

              {/* Content */}
              <div className="text-center space-y-8 p-8 relative z-10">
                <div className="space-y-3">
                  <h3
                    className={classNames(
                      "font-thin text-white",
                      tier.featured ? "text-[32px]" : "text-[28px]",
                    )}
                  >
                    {tier.name}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-baseline justify-center gap-3">
                      <div
                        className={classNames(
                          "font-thin",
                          tier.featured ? "text-[48px]" : "text-[40px]",
                        )}
                        style={{
                          background:
                            "linear-gradient(45deg, #000000 4%, #fff, #000)",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {tier.price}
                      </div>
                      {tier.name === "Pro" && (
                        <span className="text-gray-400 text-lg line-through">
                          $19
                        </span>
                      )}
                      {tier.name === "Lifetime" && (
                        <span className="text-gray-400 text-lg line-through">
                          $99
                        </span>
                      )}
                    </div>
                    <span className="text-gray-300 text-base">
                      {tier.name === "Lifetime" ? "one-time" : "/month"}
                    </span>
                    {tier.featured && (
                      <div className="mt-3 flex items-center justify-center gap-3">
                        <span className="bg-[#1de4bf]/20 text-[#1de4bf] px-3 py-1 rounded-full text-sm font-bold">
                          53% OFF
                        </span>
                        <span className="text-gray-400 text-sm">
                          Limited Time
                        </span>
                      </div>
                    )}
                    {tier.name === "Lifetime" && (
                      <div className="mt-3 flex items-center justify-center gap-3">
                        <span className="bg-[#1de4bf]/20 text-[#1de4bf] px-3 py-1 rounded-full text-sm font-bold">
                          51% OFF
                        </span>
                        <span className="text-gray-400 text-sm">
                          Limited Time
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 text-base leading-relaxed max-w-xs mx-auto">
                  {tier.description}
                </p>

                <ul className="text-gray-300 space-y-4 text-left max-w-sm mx-auto">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-x-3">
                      <CheckIcon
                        className={classNames(
                          "text-[#1de4bf] flex-none mt-0.5",
                          tier.featured ? "h-5 w-5" : "h-4 w-4",
                        )}
                      />
                      <span
                        className={classNames(
                          tier.featured ? "text-sm" : "text-xs",
                        )}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <>
                  {tier.name === "Free" ? (
                    <a
                      href="/register"
                      className={classNames(
                        "button-wrapper relative overflow-hidden transition-transform duration-300 block",
                        "hover:scale-105",
                      )}
                      style={{
                        width: "100%",
                        height: "45px",
                        borderRadius: "0.45em",
                        fontFamily: "Arial",
                        transition: "background 0.3s, transform 0.3s",
                        background: "#222",
                        position: "relative",
                        textAlign: "center",
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white font-semibold">Register</div>
                      </div>
                    </a>
                  ) : (
                    <div
                      className={classNames(
                        "button-wrapper relative overflow-hidden transition-transform duration-300",
                        tier.featured &&
                          "shadow-lg shadow-[#1de4bf]/20 hover:scale-105",
                        loadingStates[tier.name] && "processing",
                      )}
                      style={{
                        width: "100%",
                        height: "45px",
                        borderRadius: "0.45em",
                        fontFamily: "Arial",
                        transition: "background 0.3s, transform 0.3s",
                        background: tier.featured
                          ? "linear-gradient(135deg, #0891b2, #10b981)"
                          : "#222",
                        position: "relative",
                        textAlign: "center",
                      }}
                      onClick={() => handleUpgradeClick(tier)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div className="text-wrapper absolute inset-0 flex items-center justify-center text-white font-semibold transition-all duration-500">
                          {loadingStates[tier.name]
                            ? "Processing..."
                            : tier.name === "Lifetime"
                              ? "Get Lifetime Access"
                              : "Get Pro Plan"}
                        </div>
                        <div className="icon-wrapper absolute inset-0 flex items-center justify-center text-white opacity-0 transition-all duration-500 transform translate-y-full">
                          <svg
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            height={20}
                            width={20}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
                          </svg>
                        </div>
                      </div>
                      {/* Shine effect - Only on Pro card and desktop */}
                      {tier.featured && !isMobile && (
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: "transparent",
                            zIndex: 1,
                          }}
                        >
                          <div
                            className="shine-effect absolute top-0 left-0 w-0 h-full opacity-0"
                            style={{
                              background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                              transform: "skewX(-20deg)",
                              transition: "all 0.3s ease",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS for animations - Only load on desktop */}
      {!isMobile && (
        <style jsx="true">{`
          .button-wrapper:hover .text-wrapper {
            transform: translateY(-100%);
            opacity: 0;
          }

          .button-wrapper:hover .icon-wrapper {
            opacity: 1;
            transform: translateY(0);
          }

          /* Reverse animation when processing */
          .button-wrapper.processing .text-wrapper {
            transform: translateY(0);
            opacity: 1;
          }

          .button-wrapper.processing .icon-wrapper {
            opacity: 0;
            transform: translateY(100%);
          }

          .button-wrapper.processing:hover .text-wrapper {
            transform: translateY(0);
            opacity: 1;
          }

          .button-wrapper.processing:hover .icon-wrapper {
            opacity: 0;
            transform: translateY(100%);
          }

          .button-wrapper:hover .shine-effect {
            animation: shine 0.5s ease-out;
          }

          @keyframes shine {
            0% {
              left: 0%;
              width: 0%;
              opacity: 0;
            }
            50% {
              width: 100%;
              opacity: 1;
            }
            100% {
              left: 100%;
              width: 0%;
              opacity: 0;
            }
          }

          .text-wrapper {
            transition: all 0.5s ease;
          }

          .icon-wrapper {
            transition: all 0.5s ease;
          }
        `}</style>
      )}
    </section>
  );
}
