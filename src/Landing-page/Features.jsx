import React, { useState, useEffect } from "react";

const targetUsers = [
  {
    title: "Business Professionals",
    desc: "Share contracts, proposals, and sensitive documents with complete confidence.",
  },
  {
    title: "Content Creators",
    desc: "Send exclusive content, early access, or private media that disappears after viewing.",
  },
  {
    title: "Students & Researchers",
    desc: "Share study materials, research data, or assignments without leaving digital traces.",
  },
  {
    title: "Anyone Who Values Privacy",
    desc: "Perfect for personal photos, private messages, or any sensitive information.",
  },
];

const easeOfUse = [
  {
    title: "Drag & Drop",
    desc: "Just drag your files and they're instantly secured.",
  },
  {
    title: "Mobile Friendly",
    desc: "Works perfectly on any device, anywhere.",
  },
  {
    title: "No Registration",
    desc: "Start using it immediately, no signup required.",
  },
  {
    title: "Instant Results",
    desc: "Get your secure link in seconds, not minutes.",
  },
];

const Features = () => {
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

  return (
    <section
      className="relative w-full py-24 sm:py-32 overflow-hidden"
      id="features"
    >
      {/* Background with visible grid and adjusted fade ratio (60/40) */}
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(29, 228, 191, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(29, 228, 191, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Adjusted radial gradient for 60/40 ratio */}
      <div
        className="absolute inset-0 bg-white dark:bg-black"
        style={{
          maskImage:
            "radial-gradient(ellipse at center, transparent 40%, black)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, transparent 40%, black)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header Section */}
        <div
          className={`text-center mb-16 sm:mb-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Perfect for
            <span className="bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-transparent bg-clip-text">
              {" "}
              Everyone
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Whether you're a professional, creator, or just someone who values
            privacy, LinkNuke makes secure sharing effortless.
          </p>
        </div>

        {/* Target Users - Clean Text Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {targetUsers.map((user, index) => (
            <div
              key={index}
              className={`group relative p-6 rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:bg-gray-900/50 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#1de4bf] transition-colors duration-300">
                {user.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {user.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Ease of Use Section */}
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Incredibly
            <span className="bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-transparent bg-clip-text">
              {" "}
              Easy to Use
            </span>
          </h3>
          <p className="text-gray-300 text-base max-w-xl mx-auto">
            No complex setup, no learning curve. Just simple, secure sharing.
          </p>
        </div>

        {/* Ease of Use - Clean Text Format */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {easeOfUse.map((item, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <h4 className="text-sm sm:text-base font-bold text-white mb-2">
                {item.title}
              </h4>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
