import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckIcon, Sparkles, Clock, Zap, Shield } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import posthog from "../lib/posthog";

const tiers = [
  {
    name: "Free",
    id: "tier-free",
    priceMonthly: "$0",
    priceYearly: "$0",
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
    trialDays: 0,
  },
  {
    name: "Starter",
    id: "tier-starter",
    priceMonthly: "$9",
    priceYearly: "$90",
    description: "Perfect for individuals and small teams.",
    features: [
      "50 secure links/month",
      "1 GB storage",
      "Image & Text formats",
      "Up to 5 files per link",
      "100 MB max file size",
      "Basic customization",
      "Email support",
    ],
    featured: false,
    trialDays: 0,
  },
  {
    name: "Pro",
    id: "tier-pro",
    priceMonthly: "$19",
    priceYearly: "$190",
    description: "For power users and growing businesses.",
    features: [
      "500 secure links/month",
      "10 GB storage",
      "All file formats (Image, Video, Text, Audio, Doc)",
      "Up to 10 files per link",
      "500 MB max file size",
      "Advanced customization",
      "Feedback system",
      "Priority email support",
    ],
    featured: true,
    trialDays: 0,
  },
  {
    name: "Lifetime",
    id: "tier-lifetime",
    priceMonthly: "$59",
    priceYearly: "$59",
    description: "One-time payment, lifetime access.",
    features: [
      "Unlimited secure links",
      "Unlimited storage",
      "All file formats",
      "Unlimited files per link",
      "Unlimited file size",
      "Advanced customization",
      "Feedback system",
      "Priority support",
      "Founding Member badge",
      "Early access to new features",
    ],
    featured: false,
    trialDays: 0,
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const navigate = useNavigate();

  const handleStartTrial = async (tier) => {
    try {
      setLoading(true);
      setSelectedTier(tier);

      // Check if user is logged in
      const session = localStorage.getItem("session");
      if (!session) {
        // Redirect to register with plan info
        navigate(
          `/register?plan=${tier.name.toLowerCase()}&returnUrl=${encodeURIComponent(
            "/dashboard"
          )}`
        );
        return;
      }

      // For free plan, just redirect to dashboard
      if (tier.name.toLowerCase() === "free") {
        navigate("/dashboard");
        return;
      }

      // For paid plans, redirect to checkout
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/paddle/create-checkout`,
        {
          productType: tier.name.toLowerCase(),
          billingCycle,
        },
        {
          withCredentials: true,
        }
      );

      // Redirect directly to Paddle's hosted checkout
      window.location.href = response.data.checkoutUrl;

      posthog.capture("upgrade_clicked", {
        tier: tier.name,
        billingCycle,
        fromPage: "pricing",
      });
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Failed to initiate upgrade. Please try again.");
    } finally {
      setLoading(false);
      setSelectedTier(null);
    }
  };

  const handleUpgrade = async (tier) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/paddle/create-checkout`,
        {
          productType: tier.name.toLowerCase(),
          billingCycle: "monthly",
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.checkoutUrl) {
        // Redirect directly to Paddle's hosted checkout
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Failed to process upgrade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="relative px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Choose Your Plan
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Start with a free trial, then choose the plan that fits your
              needs.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <span
                className={`text-sm ${
                  billingCycle === "monthly" ? "text-white" : "text-gray-400"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() =>
                  setBillingCycle(
                    billingCycle === "monthly" ? "yearly" : "monthly"
                  )
                }
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1de4bf] focus:ring-offset-2 focus:ring-offset-black"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    billingCycle === "yearly"
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm ${
                  billingCycle === "yearly" ? "text-white" : "text-gray-400"
                }`}
              >
                Yearly
                <span className="ml-1 text-xs bg-[#1de4bf] text-black px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-6 py-24 mx-auto max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-3xl p-8 ring-1 ring-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                tier.featured
                  ? "ring-[#1de4bf] bg-gradient-to-br from-gray-900/80 to-gray-800/80"
                  : "hover:ring-gray-700"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-[#1de4bf] px-4 py-1 text-sm font-semibold text-black">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <p className="mt-2 text-gray-400">{tier.description}</p>

                <div className="mt-8">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold">
                      {billingCycle === "yearly"
                        ? tier.priceYearly
                        : tier.priceMonthly}
                    </span>
                    <span className="text-gray-400 ml-2">
                      {tier.name === "Lifetime"
                        ? ""
                        : billingCycle === "yearly"
                        ? "/year"
                        : "/month"}
                    </span>
                  </div>

                  {tier.trialDays > 0 && (
                    <div className="mt-2 flex items-center justify-center text-sm text-[#1de4bf]">
                      <Clock className="w-4 h-4 mr-1" />
                      {tier.trialDays}-day free trial
                    </div>
                  )}
                </div>

                <ul className="mt-8 space-y-4 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-[#1de4bf] mr-3 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 space-y-3">
                  {tier.name === "Free" ? (
                    <button
                      onClick={() => handleStartTrial(tier)}
                      disabled={loading && selectedTier?.id === tier.id}
                      className="w-full py-3 px-6 rounded-xl font-semibold bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading && selectedTier?.id === tier.id ? (
                        "Processing..."
                      ) : (
                        <>
                          <Zap className="w-4 h-4 inline mr-2" />
                          Get Started Free
                        </>
                      )}
                    </button>
                  ) : tier.trialDays > 0 ? (
                    <button
                      onClick={() => handleStartTrial(tier)}
                      disabled={loading && selectedTier?.id === tier.id}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        tier.featured
                          ? "bg-[#1de4bf] text-black hover:bg-[#1de4bf]/90"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading && selectedTier?.id === tier.id ? (
                        "Starting Trial..."
                      ) : (
                        <>
                          <Zap className="w-4 h-4 inline mr-2" />
                          Start Free Trial
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(tier)}
                      disabled={loading && selectedTier?.id === tier.id}
                      className="w-full py-3 px-6 rounded-xl font-semibold bg-[#1de4bf] text-black hover:bg-[#1de4bf]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading && selectedTier?.id === tier.id ? (
                        "Processing..."
                      ) : (
                        <>
                          <Shield className="w-4 h-4 inline mr-2" />
                          {tier.name === "Lifetime"
                            ? "Get Lifetime Access"
                            : `Upgrade to ${tier.name}`}
                        </>
                      )}
                    </button>
                  )}

                  {tier.trialDays > 0 && (
                    <button
                      onClick={() => handleUpgrade(tier)}
                      disabled={loading && selectedTier?.id === tier.id}
                      className="w-full py-2 px-6 rounded-xl font-medium text-gray-400 hover:text-white transition-colors"
                    >
                      Skip trial, upgrade now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What's included in the free plan?
              </h3>
              <p className="text-gray-400">
                The free plan includes 5 secure links per month, 50MB storage,
                and support for image and text files only. You can upload 1 file
                per link with a maximum size of 50MB.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Can I upgrade anytime?
              </h3>
              <p className="text-gray-400">
                Yes! You can upgrade to any paid plan at any time. Your usage
                limits will be updated immediately after payment.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Is the lifetime plan really one-time payment?
              </h3>
              <p className="text-gray-400">
                Yes! The lifetime plan is a single payment that gives you access
                forever, including all future updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
