// src/Landing-page/Footer.jsx
import { Twitter, Github, Mail, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.svg" alt="LinkNuke Logo" className="w-8 h-8" />
              <h3 className="font-bold text-xl text-white">LinkNuke</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Secure link-sharing built for privacy and control.
            </p>
            <div className="flex gap-3">
              <a
                href="https://x.com/Tanzeelmirr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#1de4bf]/20 transition-colors"
              >
                <Twitter className="w-4 h-4 text-gray-300 hover:text-[#1de4bf]" />
              </a>
              <a
                href="https://github.com/AryanMir15"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#1de4bf]/20 transition-colors"
              >
                <Github className="w-4 h-4 text-gray-300 hover:text-[#1de4bf]" />
              </a>
              <a
                href="mailto:support@whynotship.me"
                aria-label="Email"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#1de4bf]/20 transition-colors"
              >
                <Mail className="w-4 h-4 text-gray-300 hover:text-[#1de4bf]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-base mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-[#1de4bf] transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-[#1de4bf] transition-colors text-sm"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-400 hover:text-[#1de4bf] transition-colors text-sm"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#faqs"
                  className="text-gray-400 hover:text-[#1de4bf] transition-colors text-sm"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold text-white text-base mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-[#1de4bf] transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-[#1de4bf] transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@whynotship.me"
                  className="text-gray-400 hover:text-[#1de4bf] transition-colors text-sm"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="LinkNuke"
                className="w-6 h-6 opacity-60"
              />
              <span className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} LinkNuke. All rights reserved.
              </span>
            </div>
            <div className="text-gray-500 text-sm">
              Part of{" "}
              <a
                href="https://whynotship.me"
                className="text-[#1de4bf] hover:underline"
              >
                WhyNotShip.me
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
