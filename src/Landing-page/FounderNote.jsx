import React, { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function FounderDashboardNote() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(29, 228, 191, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(29, 228, 191, 0.3) 1px, transparent 1px)
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

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1de4bf]/10 border border-[#1de4bf]/20 text-[#1de4bf] text-xs font-medium mb-6">
            <Heart className="h-3 w-3 mr-2" />
            From the Founder
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Why I Built LinkNuke
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            A personal journey from frustration to innovation in digital
            privacy.
          </p>
        </div>

        {/* Founder Story */}
        <div
          className={`mb-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
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
              <h3 className="text-3xl sm:text-4xl font-bold text-white">
                Hi, I'm the founder of LinkNuke
              </h3>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
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
        <div
          className={`transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="space-y-8">
            {/* Text Content */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1de4bf]/10 border border-[#1de4bf]/20 text-[#1de4bf] text-xs font-medium">
                Future Vision
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white">
                My Vision for the Future
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                I believe everyone deserves to share information without fear.
                LinkNuke is just the beginning. I'm committed to building tools
                that make privacy the default, not the exception.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className={`mt-16 text-center transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            to="/feedback"
            className="group relative inline-flex items-center px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(29,228,191,0.4)] hover:scale-105 shine-button overflow-hidden"
          >
            <span className="relative z-10">Share Your Feedback</span>
            <Heart className="w-4 h-4 ml-2 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0bf3a2] to-[#1de4bf] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <p className="text-gray-400 text-sm mt-4">
            Your input shapes the future of LinkNuke
          </p>
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
