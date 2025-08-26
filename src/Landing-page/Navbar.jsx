import * as React from "react";
import { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../components/ui/navigation-menu";
import DarkModeToggle from "../components/ui/DarkModeToggle";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Use Cases", href: "#usecases" },
  { label: "FAQs", href: "#faqs" },
];

export default function Navbar() {
  const [showMobile, setShowMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("session");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isVisible ? "top-0" : "-top-24"
      }`}
    >
      <div className="backdrop-blur-md bg-black/80 border-b border-gray-800 py-2 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="relative flex items-center gap-2 font-extrabold text-xl sm:text-xl md:text-2xl text-white select-none"
            style={{ lineHeight: 1 }}
          >
            <img
              src="/logo.svg"
              alt="LinkNuke Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10"
            />
            <span className="z-10 relative font-semibold hidden md:block">
              LinkNuke
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-6 text-sm">
                {navLinks.map(({ label, href }) => (
                  <NavigationMenuItem key={label}>
                    <HashLink
                      smooth
                      to={`/${href}`}
                      className="text-gray-300 hover:text-[#1de4bf] transition"
                    >
                      {label}
                    </HashLink>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <Link
                    to="/pricing"
                    className="text-gray-300 hover:text-[#1de4bf] transition"
                  >
                    Pricing
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4 ml-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="px-3 py-1.5 rounded-full text-sm font-medium text-black bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:opacity-90 transition shadow-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-300 hover:text-[#1de4bf] transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-full text-sm font-medium text-black bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:opacity-90 transition shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Buttons */}
          <div className="md:hidden flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="text-xs px-3 py-1 rounded-full text-black bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:opacity-90"
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
                  className="text-xs px-3 py-1 rounded-full text-black bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:opacity-90"
                >
                  Sign up
                </Link>
              </>
            )}
            <button
              className="text-gray-300 text-xl ml-2"
              onClick={() => setShowMobile((prev) => !prev)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {showMobile && (
        <div className="md:hidden flex flex-col items-center gap-4 py-4 backdrop-blur-md bg-black/90 border-b border-gray-800">
          {navLinks.map(({ label, href }) => (
            <HashLink
              key={label}
              smooth
              to={`/${href}`}
              className="text-gray-300 hover:text-[#1de4bf] transition text-base"
              onClick={() => setShowMobile(false)}
            >
              {label}
            </HashLink>
          ))}
          <Link
            to="/pricing"
            className="text-gray-300 hover:text-[#1de4bf] transition text-base"
            onClick={() => setShowMobile(false)}
          >
            Pricing
          </Link>
        </div>
      )}
    </header>
  );
}
