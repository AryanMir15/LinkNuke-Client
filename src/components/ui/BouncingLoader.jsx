import React from "react";

const BouncingLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Modern spinning loader */}
        <div className="w-12 h-12 border-4 border-gray-700 border-t-[#1de4bf] rounded-full animate-spin"></div>
        {/* Inner glow effect */}
        <div
          className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-[#1de4bf]/30 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>
      </div>
    </div>
  );
};

export default BouncingLoader;
