"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "../context/useSession.jsx";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Sparkles } from "lucide-react";
import posthog from "../lib/posthog.js";

const tiers = [
  {
    name: "Starter",
    id: "tier-starter",
    href: "#",
    priceMonthly: "$9",
    description: "Essential features for basic link management.",
    features: [
      "50 secure links/month",
      "1 GB storage",
      "Image & Text formats",
      "Basic customization",
      "Email support",
    ],
    featured: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    priceMonthly: "$19",
    description: "For marketers and power users with higher limits.",
    features: [
      "500 secure links/month",
      "10 GB storage",
      "All file formats (Image, Video, Text, Audio, Doc)",
      "Advanced customization",
      "Feedback system",
      "Priority email support",
    ],
    featured: true,
  },
  {
    name: "Lifetime",
    id: "tier-lifetime",
    href: "#",
    priceMonthly: "$59",
    description: "Buy once, help shape LinkNukes future.",
    features: [
      "Unlimited secure links",
      "Unlimited storage",
      "All file formats",
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
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSession();

  const handleUpgradeClick = async (tier) => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is logged in by checking localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        window.location.href = `/login?returnUrl=${encodeURIComponent(
          window.location.pathname
        )}`;
        return;
      }

      const response = await axios.post("/api/v1/paddle/create-checkout", {
        productType: tier.name.toLowerCase(),
      });

      posthog.capture("upgrade_clicked", {
        tier: tier.name,
        price: tier.priceMonthly,
        featured: tier.featured,
        timestamp: new Date().toISOString(),
      });

      window.location.href = response.data.checkoutUrl;
    } catch (err) {
      console.error("Payment init failed:", err);
      setError("Failed to initiate payment. Please try again.");
      posthog.capture("payment_error", {
        error: err.message,
        tier: tier.name,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById("pricing");
    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <section
      id="pricing"
      className="relative isolate bg-black px-6 py-20 sm:py-24 lg:px-8 text-white"
    >
      {/* Glowing Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#1de4bf]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#0bf3a2]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#1de4bf]/5 to-[#0bf3a2]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative mx-auto max-w-4xl text-center">
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#1de4bf]/10 border border-[#1de4bf]/20 text-[#1de4bf] text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Limited Time Offer
          </div>
          <h2 className="text-base font-semibold text-[#1de4bf]">Pricing</h2>
          <p className="mt-2 text-5xl font-semibold tracking-tight sm:text-6xl">
            Choose the right plan for you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl">
          Choose an affordable plan that's packed with the best features for
          secure, self-destructing links.
        </p>
      </div>

      {/* Cards */}
      <div
        className={`mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-6xl lg:grid-cols-3 transition-all duration-700 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={classNames(
              "relative rounded-3xl p-8 sm:p-10 flex flex-col ring-1 ring-white/10 backdrop-blur-md bg-white/5 transition-all duration-300",
              "hover:scale-[1.03] hover:ring-[#1de4bf]/40 hover:shadow-lg hover:shadow-[#1de4bf]/20",
              tier.featured &&
                "border border-transparent bg-gradient-to-br from-[#1de4bf]/20 via-black/40 to-[#0bf3a2]/20 shadow-xl shadow-[#1de4bf]/10"
            )}
          >
            {tier.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#1de4bf]/20 border border-[#1de4bf]/30 text-[#1de4bf] text-xs font-bold tracking-wide shadow-sm">
                Most Popular
              </div>
            )}
            <h3 id={tier.id} className="text-lg font-semibold mb-4">
              {tier.name}
            </h3>
            <div className="flex flex-col items-center mb-6">
              {tier.featured && (
                <span className="text-gray-400 text-lg line-through mb-1">
                  $199
                </span>
              )}
              <div className="flex items-baseline gap-x-2">
                <span className="text-5xl font-bold">{tier.priceMonthly}</span>
                <span className="text-gray-300 text-sm">
                  {tier.name === "Lifetime" ? "one-time" : "/month"}
                </span>
              </div>
              {tier.featured && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="bg-[#1de4bf]/20 text-[#1de4bf] px-2 py-0.5 rounded-full text-xs font-bold">
                    90% OFF
                  </span>
                  <span className="text-gray-400 text-xs">Limited Time</span>
                </div>
              )}
            </div>
            <p className="text-gray-300 text-sm mb-6">{tier.description}</p>
            <ul className="text-sm text-gray-300 space-y-3 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-x-3">
                  <CheckIcon className="h-5 w-5 text-[#1de4bf] flex-none" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgradeClick(tier)}
              className={classNames(
                "mt-auto w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                tier.featured
                  ? "bg-[#1de4bf] text-gray-900 hover:scale-105"
                  : "bg-gray-700 text-white hover:scale-105"
              )}
            >
              {loading
                ? "Processing..."
                : tier.name === "Lifetime"
                ? "Get Lifetime Access"
                : tier.name === "Starter"
                ? "Get Started"
                : "Get Pro Plan"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
