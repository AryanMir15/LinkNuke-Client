import React, { useState, useEffect } from "react";

const ProgressBar = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);

      // Artificial loading simulation
      const timer1 = setTimeout(() => setProgress(20), 100);
      const timer2 = setTimeout(() => setProgress(40), 300);
      const timer3 = setTimeout(() => setProgress(60), 500);
      const timer4 = setTimeout(() => setProgress(80), 700);
      const timer5 = setTimeout(() => setProgress(95), 900);
      const timer6 = setTimeout(() => setProgress(100), 1100);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
        clearTimeout(timer6);
      };
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
      <div
        className="h-full bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 10px rgba(29, 228, 191, 0.5)",
        }}
      />
    </div>
  );
};

export default ProgressBar;
