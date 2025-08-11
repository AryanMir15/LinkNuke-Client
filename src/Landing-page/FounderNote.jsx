import React from "react";
import { Heart, Shield, Zap, Lock, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function FounderDashboardNote() {
  return (
    <section className="relative bg-black px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {/* Simplified Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#1de4bf]/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#0bf3a2]/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#1de4bf]/10 border border-[#1de4bf]/20 text-[#1de4bf] text-sm font-medium mb-4">
            <Heart className="h-4 w-4 mr-2" />
            From the Founder
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Why I Built LinkNuke
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
            A personal journey from frustration to innovation in digital privacy
          </p>
        </div>

        {/* Founder Profile & Story */}
        <div className="bg-gray-900/60 rounded-2xl p-6 sm:p-8 border border-gray-800 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Founder Image */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden border-2 border-[#1de4bf]/30">
                <img
                  src="/profile.jpeg"
                  alt="Founder"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Founder Message */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Hi, I'm the founder of LinkNuke
              </h3>
              <div className="space-y-3 text-gray-300 text-sm sm:text-base leading-relaxed">
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

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-gray-900/40 rounded-xl p-4 sm:p-6 border border-gray-800">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1de4bf]/20 rounded-lg flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#1de4bf]" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
              Zero Tracking
            </h4>
            <p className="text-gray-300 text-xs sm:text-sm">
              We don't collect, store, or analyze your data. Your privacy is
              non-negotiable.
            </p>
          </div>

          <div className="bg-gray-900/40 rounded-xl p-4 sm:p-6 border border-gray-800">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0bf3a2]/20 rounded-lg flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#0bf3a2]" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
              Instant Security
            </h4>
            <p className="text-gray-300 text-xs sm:text-sm">
              Links self-destruct automatically. No traces left behind, ever.
            </p>
          </div>

          <div className="bg-gray-900/40 rounded-xl p-4 sm:p-6 border border-gray-800 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1de4bf]/20 rounded-lg flex items-center justify-center mb-3">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#1de4bf]" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
              Built for You
            </h4>
            <p className="text-gray-300 text-xs sm:text-sm">
              Every feature is designed based on real privacy needs, not profit
              motives.
            </p>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="bg-[#1de4bf]/5 rounded-2xl p-6 sm:p-8 border border-[#1de4bf]/20">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1de4bf] to-[#0bf3a2] rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                My Vision for the Future
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                I believe everyone deserves to share information without fear.
                LinkNuke is just the beginning. I'm committed to building tools
                that make privacy the default, not the exception.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
            <Link
              to="/feedback"
              className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black rounded-lg sm:rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Share Your Feedback
              <Heart className="w-4 h-4 ml-2" />
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm">
              Your input shapes the future of LinkNuke
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
