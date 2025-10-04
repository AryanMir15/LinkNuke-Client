import React from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function FounderDashboardNote() {
  return (
    <section className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(29, 228, 191, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(29, 228, 191, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute inset-0 bg-white/10 dark:bg-black/90"
        style={{
          maskImage:
            "radial-gradient(ellipse at center, transparent 30%, black 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, transparent 30%, black 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1de4bf]/10 border border-[#1de4bf]/20 text-[#1de4bf] text-xs font-medium mb-6">
            <Heart className="h-3 w-3 mr-2" />
            From the Founder
          </div>
          <h2 className="font-medium text-[48px] sm:text-[56px] lg:text-[72px] leading-tight tracking-tight text-white mb-6">
            Why I Built LinkNuke
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto font-thin">
            A personal journey from frustration to innovation in digital
            privacy.
          </p>
        </div>

        {/* Founder Story */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <img
                src="/profile.jpeg"
                alt="Founder"
                className="w-64 h-64 mx-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>

            {/* Text Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1de4bf]/10 border border-[#1de4bf]/20 text-[#1de4bf] text-xs font-medium">
                Personal Mission
              </div>
              <h3 className="font-medium text-[32px] sm:text-[40px] text-white">
                Hi, I'm the founder of LinkNuke
              </h3>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed font-thin">
                <p>
                  I created LinkNuke because I was tired of seeing my personal
                  information scattered across the internet. Every time I shared
                  a link, I felt like I was giving away pieces of my digital
                  identity.
                </p>
                <p>
                  That's why I built a platform that puts{" "}
                  <span className="font-semibold text-[#1de4bf]">
                    your privacy first
                  </span>
                  . No tracking, no data collection, no compromises.
                </p>
                <p>
                  This isn't just another tool—it's my commitment to a more
                  private internet. Every feature is designed with one goal:
                  keeping your data safe.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div>
          <div className="space-y-8">
            {/* Text Content */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1de4bf]/10 border border-[#1de4bf]/20 text-[#1de4bf] text-xs font-medium">
                Future Vision
              </div>
              <h3 className="font-medium text-[32px] sm:text-[40px] text-white">
                My Vision for the Future
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto font-thin">
                I believe everyone deserves to share information without fear.
                LinkNuke is just the beginning. I'm committed to building tools
                that make privacy the default, not the exception.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="relative inline-flex items-center justify-center gap-4 group">
            <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200" />
            <Link
              to="/feedback"
              className="group relative inline-flex items-center justify-center text-sm rounded-xl bg-gray-900 px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
              title="Share Your Feedback"
            >
              Share Your Feedback
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
        </div>
      </div>

    </section>
  );
}
