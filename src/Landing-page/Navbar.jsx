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
    <header className="fixed w-full z-50 top-0">
      <div className="py-3 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="backdrop-blur-lg bg-gray-800/30 border border-gray-600/20 rounded-full py-3 px-5">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link
                to="/"
                className="relative flex items-center gap-1.5 font-extrabold text-lg sm:text-lg md:text-xl text-white select-none"
                style={{ lineHeight: 1 }}
              >
                <img
                  src="/logo.svg"
                  alt="LinkNuke Logo"
                  className="w-11 h-11 sm:w-12 sm:h-12 md:w-12 md:h-12"
                />
                <span className="z-10 relative font-thin hidden md:block">
                  LinkNuke
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center justify-center flex-1">
                <NavigationMenu>
                  <NavigationMenuList className="flex gap-7 text-sm">
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
              <div className="hidden md:flex items-center gap-5">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    className="px-6 py-3 rounded-full text-sm font-thin text-black bg-white hover:bg-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-sm text-white hover:text-[#1de4bf] transition font-thin"
                    >
                      Log in
                    </Link>
                    <div className="relative inline-flex items-center justify-center gap-4 group">
                      <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200" />
                      <Link
                        to="/register"
                        className="group relative inline-flex items-center justify-center text-sm rounded-full bg-gray-900 px-7 py-3.5 font-thin text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
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
              <div className="md:hidden flex items-center gap-3">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    className="text-xs px-3 py-1.5 rounded-full text-black bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:opacity-90"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-xs text-gray-300 hover:text-[#1de4bf]"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="text-xs px-3 py-1.5 rounded-full text-black bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:opacity-90"
                    >
                      Sign up
                    </Link>
                  </>
                )}
                <button
                  className="text-gray-300 text-lg ml-1"
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
        <div className="md:hidden flex flex-col items-center gap-4 py-4 backdrop-blur-md bg-black/90 border-b border-gray-800">
          {navLinks.map(({ label, href }) => (
            <button
              key={label}
              onClick={() => scrollToSection(href)}
              className="text-gray-300 hover:text-[#1de4bf] transition text-base cursor-pointer"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => scrollToSection("#pricing")}
            className="text-gray-300 hover:text-[#1de4bf] transition text-base cursor-pointer"
          >
            Pricing
          </button>
        </div>
      )}
    </header>
  );
}
