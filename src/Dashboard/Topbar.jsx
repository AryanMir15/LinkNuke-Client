import React from "react";
import { Link } from "react-router-dom";
import { useSession } from "../context/useSession";

const Topbar = () => {
  const { logout } = useSession();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-[#2c2c31] bg-[#1F1F23] shadow-md z-50">
      {/* Left: Logo with Gradient Underline */}
      <div className="relative">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white relative z-10">
          LinkNuke
        </h1>
        <svg
          viewBox="0 0 120 18"
          className="absolute left-0 bottom-0 w-24 sm:w-[115%] h-3 sm:h-4 z-0 pointer-events-none"
          style={{ transform: "rotate(-2deg)" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="linknuke-topbar-underline"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#1de4bf" />
              <stop offset="100%" stopColor="#0bf3a2" />
            </linearGradient>
          </defs>
          <path
            d="M5 12 Q 60 24, 115 6"
            fill="none"
            stroke="url(#linknuke-topbar-underline)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Right: Feedback + Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          to="/feedback"
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black hover:opacity-90 transition shadow-md"
        >
          Feedback
        </Link>
        <button
          onClick={handleLogout}
          className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#2c2c31] text-gray-300 hover:text-white hover:bg-[#33353a] transition shadow"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
