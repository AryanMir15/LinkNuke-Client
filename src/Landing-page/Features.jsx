import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Clock,
  EyeOff,
  Link2,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: <Link2 className="h-8 w-8" />,
    title: "Instant Creation",
    desc: "Drop files, get secure links instantly.",
    longDesc:
      "Upload your sensitive files and receive a secure one-time link immediately. No registration required, no waiting time. Your data is protected from the moment you upload.",
    step: 1,
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Smart Expiration",
    desc: "Set time limits or one-view access.",
    longDesc:
      "Configure exactly when your link expires - whether it's after one view, 24 hours, or any custom timeframe. Your data disappears exactly when you want it to.",
    step: 2,
  },
  {
    icon: <EyeOff className="h-8 w-8" />,
    title: "Zero Footprint",
    desc: "Complete invisibility until accessed.",
    longDesc:
      "Your files remain completely hidden until someone opens the link. No previews, no metadata leaks, no digital traces. Complete stealth until the moment of access.",
    step: 3,
  },
  {
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Auto-Destruct",
    desc: "Viewed or expired? Boom. Gone forever.",
    longDesc:
      "Once accessed or expired, your data self-destructs permanently with no possibility of recovery. Military-grade deletion ensures your secrets stay secret.",
    step: 4,
  },
];

const Features = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("features");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section
      className="relative w-full px-4 sm:px-6 lg:px-8 py-24 sm:py-32 bg-black overflow-hidden"
      id="features"
    >
      {/* Simple Background */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-gradient-to-r from-[#1de4bf]/5 to-[#0bf3a2]/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header Section */}
        <div
          className={`text-center mb-16 sm:mb-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#1de4bf]/10 border border-[#1de4bf]/20 text-[#1de4bf] text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            How It Works
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Four Steps to
            <span className="bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-transparent bg-clip-text">
              {" "}
              Complete Privacy
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            From creation to destruction, your data follows a secure pipeline
            that ensures complete privacy and zero traces.
          </p>
        </div>

        {/* Vertical Accordion Layout */}
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`space-y-4 transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Main Feature Card */}
              <div
                className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                  activeCard === index
                    ? "scale-[1.02] border-[#1de4bf]/30 bg-[#1de4bf]/5"
                    : "border-gray-800 bg-gray-900/30 hover:border-gray-700 hover:bg-gray-900/50"
                }`}
                onClick={() => setActiveCard(index)}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1de4bf]/20 to-[#0bf3a2]/20 flex items-center justify-center text-[#1de4bf] group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        {feature.icon}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#1de4bf] transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>

                    {/* Step Number - Aligned to the right */}
                    <div className="flex items-center justify-between sm:justify-end space-x-3">
                      <div className="w-6 h-6 rounded-full bg-gray-800 text-gray-400 text-xs font-bold flex items-center justify-center group-hover:bg-[#1de4bf] group-hover:text-black transition-all duration-300">
                        {feature.step}
                      </div>

                      {/* Chevron Icon */}
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                          activeCard === index ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeCard === index
                      ? "max-h-32 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {feature.longDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
