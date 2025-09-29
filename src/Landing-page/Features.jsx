import React from "react";

const Features = () => {

  return (
    <section
      className="relative w-full py-24 sm:py-32 overflow-hidden"
      id="features"
    >
      {/* Background with visible grid and adjusted fade ratio (60/40) */}
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
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Why LinkNuke is
            <span className="bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-transparent bg-clip-text">
              {" "}
              Different
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Two core features that make LinkNuke the most secure and
            user-friendly file sharing solution.
          </p>
        </div>

        {/* Feature 1: Extra Secure Features */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative order-2 lg:order-1">
              <img
                src="/extra-secure-feature.png"
                alt="Extra Secure Features"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>

            {/* Text Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1de4bf]/10 border border-[#1de4bf]/20 text-[#1de4bf] text-xs font-medium">
                Enhanced Privacy
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white">
                Extra Secure Features
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                When enabled, we add basic browser-level protections to
                discourage casual copying. Right-click is disabled, developer
                tools are blocked, and print functions are disabled. While these
                measures provide some protection against casual users, they can
                be bypassed by determined individuals with technical knowledge
                or someone with another phone or camera.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 2: Link Management */}
        <div>
          <div className="space-y-8">
            {/* Text Content */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1de4bf]/10 border border-[#1de4bf]/20 text-[#1de4bf] text-xs font-medium">
                Complete Control
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white">
                Smart Link Management
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                Complete control over your shared links with real-time tracking,
                view limits, and expiration settings. Monitor who accessed what,
                when, and how many times. This is how grand our link management
                system truly is.
              </p>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src="/link-management-dashboard.png"
                alt="Link Management Dashboard"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
