import React from 'react';

const BouncingLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-12 h-12">
        {/* Bouncing square */}
        <div className="absolute inset-0 bg-[#1de4bf] rounded animate-bounce-square"></div>
        {/* Shadow */}
        <div className="absolute top-[60px] left-0 w-12 h-1.5 bg-[#1de4bf]/30 rounded-full animate-shadow"></div>
      </div>
    </div>
  );
};

export default BouncingLoader;
