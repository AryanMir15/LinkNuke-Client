import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../components/ui/navigation-menu";
import DarkModeToggle from "../components/ui/DarkModeToggle";
import { trackEvent } from "../lib/analytics";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Preview", href: "#preview" },
  { label: "FAQs", href: "#faqs" },
];

export default function Navbar() {
  const [showMobile, setShowMobile] = useState(false);
  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("token");

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      // Very slow slippery scroll
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });

      // Add extra slow scroll effect
      setTimeout(() => {
        const targetPosition = element.offsetTop - 80;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }, 50);
    }
    setShowMobile(false); // Close mobile menu

    // Track navigation clicks
    trackEvent("navbar_clicked", {
      section: href.replace("#", ""),
      isMobile: window.innerWidth < 768,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <header className="fixed w-full z-50 top-0 mt-5">
      <div className="py-2 px-3">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-sm bg-black/20 border border-gray-700/50 rounded-full transition-all duration-300 hover:bg-black/30 hover:border-gray-600/60">
            <div className="flex justify-between items-center" style={{ margin: '3px' }}>
              {/* Logo */}
              <Link
                to="/"
                className="relative flex items-center gap-1.5 font-extrabold text-xl sm:text-xl md:text-2xl text-white select-none"
                style={{ lineHeight: 1 }}
              >
                <img
                  src="/logo.svg"
                  alt="LinkNuke Logo"
                  className="w-12 h-12 sm:w-[50px] sm:h-[50px] md:w-[50px] md:h-[50px]"
                />
                <span className="z-10 relative font-thin hidden md:block text-xl">
                  LinkNuke
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center justify-center flex-1">
                <NavigationMenu>
                  <NavigationMenuList className="flex gap-8 text-base">
                    {navLinks.map(({ label, href }) => (
                      <NavigationMenuItem key={label}>
                        <button
                          onClick={() => scrollToSection(href)}
                          className="text-white hover:text-[#1de4bf] transition cursor-pointer font-thin"
                        >
                          {label}
                        </button>
                      </NavigationMenuItem>
                    ))}
                    <NavigationMenuItem>
                      <button
                        onClick={() => scrollToSection("#pricing")}
                        className="text-white hover:text-[#1de4bf] transition cursor-pointer font-thin"
                      >
                        Pricing
                      </button>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-6">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    className="px-7 py-3.5 rounded-full text-base font-thin text-black bg-white hover:bg-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-base text-white hover:text-[#1de4bf] transition font-thin"
                    >
                      Log in
                    </Link>
                    <div className="relative inline-flex items-center justify-center gap-4 group">
                      <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200" />
                      <Link
                        to="/register"
                        className="group relative inline-flex items-center justify-center text-base rounded-full bg-gray-900 px-8 py-4 font-thin text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
                        title="register"
                      >
                        Get Started
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 10 10"
                          height={10}
                          width={10}
                          fill="none"
                          className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
                        >
                          <path
                            d="M0 5h7"
                            className="transition opacity-0 group-hover:opacity-100"
                          />
                          <path
                            d="M1 1l4 4-4 4"
                            className="transition group-hover:translate-x-[3px]"
                          />
                        </svg>
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Right Buttons */}
              <div className="md:hidden flex items-center justify-between gap-3 -ml-2">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    className="text-sm px-3 py-2 rounded-full text-black bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:opacity-90"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="relative inline-flex items-center justify-center gap-3 group">
                    <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200" />
                    <Link
                      to="/register"
                      className="group relative inline-flex items-center justify-center text-sm rounded-xl bg-gray-900 px-4 py-2.5 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
                      title="register"
                    >
                      Get Started
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 10 10"
                        height={10}
                        width={10}
                        fill="none"
                        className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2"
                      >
                        <path
                          d="M0 5h7"
                          className="transition opacity-0 group-hover:opacity-100"
                        />
                        <path
                          d="M1 1l4 4-4 4"
                          className="transition group-hover:translate-x-[3px]"
                        />
                      </svg>
                    </Link>
                  </div>
                )}
                <button
                  className="text-gray-300 text-xl -ml-1"
                  onClick={() => setShowMobile((prev) => !prev)}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {showMobile && (
        <div className="md:hidden flex flex-col items-center gap-4 py-4 backdrop-blur-md bg-black/95 border-b border-gray-800/50 rounded-b-2xl mx-2 mt-1">
          {navLinks.map(({ label, href }) => (
            <button
              key={label}
              onClick={() => scrollToSection(href)}
              className="text-gray-300 hover:text-[#1de4bf] transition text-base cursor-pointer font-thin"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection("#pricing")}
            className="text-gray-300 hover:text-[#1de4bf] transition text-base cursor-pointer font-thin"
          >
            Pricing
          </button>
          {!isLoggedIn && (
            <Link
              to="/login"
              className="text-gray-300 hover:text-[#1de4bf] transition text-base cursor-pointer font-thin"
            >
              Log in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
