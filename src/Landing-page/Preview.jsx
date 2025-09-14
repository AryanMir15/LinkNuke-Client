import React, { useState, useEffect } from "react";
import { Play } from "lucide-react";

const Preview = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    const element = document.getElementById("preview");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden py-32 sm:py-40"
      id="preview"
    >
      {/* Smooth transition gradient from hero section */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-black/20 to-black/40 z-10" />

      {/* Background with visible grid */}
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(228,228,231,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(228,228,231,0.3) 1px, transparent 1px)
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

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header Section */}
        <div
          className={`text-center mb-16 sm:mb-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            See LinkNuke in
            <span className="bg-gradient-to-r from-[#e4e4e7] to-[#a1a1aa] text-transparent bg-clip-text">
              {" "}
              Action
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            Watch how easy it is to create secure, self-destructing links that
            protect your sensitive content.
          </p>
        </div>

        {/* Video Placeholder Section */}
        <div
          className={`transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative max-w-6xl mx-auto">
            {/* Bigger 16:9 Video Placeholder */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-2xl border border-gray-400/20 overflow-hidden shadow-2xl">
              {/* Faint Grid Overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(228,228,231,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(228,228,231,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Hollow Center Content */}
              <div className="relative flex items-center justify-center h-full">
                <div className="text-center">
                  {/* Play Button */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-black mb-4 mx-auto shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <Play
                      className="w-6 h-6 sm:w-8 sm:h-8 ml-1"
                      fill="currentColor"
                    />
                  </div>

                  {/* Placeholder Text */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    Demo Video Coming Soon
                  </h3>
                  <p className="text-gray-400 text-sm max-w-md mx-auto">
                    Experience the power of LinkNuke through our interactive
                    demonstration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
