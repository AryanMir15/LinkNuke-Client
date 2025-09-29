import React from "react";
import { Play } from "lucide-react";

const Preview = () => {
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
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-thin text-[48px] sm:text-[56px] lg:text-[72px] leading-tight tracking-tight text-white mb-6">
            See LinkNuke in
            <span className="bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-transparent bg-clip-text">
              {" "}
              Action
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-thin">
            Hover over the video to see how easy it is to create secure,
            self-destructing links that protect your sensitive content.
          </p>
        </div>

        {/* Video Placeholder Section */}
        <div>
          <div className="relative max-w-6xl mx-auto">
            {/* Video Container - Built to fit video dimensions */}
            <div className="relative w-full rounded-2xl border border-gray-400/20 overflow-hidden shadow-2xl">
              {/* Demo Video - Container adapts to video size */}
              <video
                className="w-full h-auto rounded-2xl"
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
                poster="/demo-video-poster.jpg"
              >
                <source src="/Demo-Video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Faint Grid Overlay - positioned over video */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(228,228,231,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(228,228,231,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "30px 30px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
