// src/Landing-page/Footer.jsx
import { Twitter, Github, Mail, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative isolate bg-gradient-to-b from-black via-gray-950 to-black text-gray-300 pt-24 pb-12 px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#1de4bf]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#0bf3a2]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Logo and Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img src="/logo.svg" alt="LinkNuke Logo" className="w-12 h-12" />
              <div>
                <h3 className="font-bold text-2xl text-white">LinkNuke</h3>
                <div className="w-20 h-1 bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] rounded-full mt-1"></div>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md mb-8">
              Secure link-sharing built for privacy and control. Disappear your
              links when you're done with enterprise-grade security.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://x.com/Tanzeelmirr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-12 h-12 bg-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-[#1de4bf]/20 hover:border-[#1de4bf]/30 border border-gray-700/50 transition-all duration-300 group"
              >
                <Twitter className="w-5 h-5 text-gray-300 group-hover:text-[#1de4bf] transition-colors" />
              </a>
              <a
                href="https://github.com/AryanMir15"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-12 h-12 bg-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-[#1de4bf]/20 hover:border-[#1de4bf]/30 border border-gray-700/50 transition-all duration-300 group"
              >
                <Github className="w-5 h-5 text-gray-300 group-hover:text-[#1de4bf] transition-colors" />
              </a>
              <a
                href="mailto:Support@WhyNotShip.me"
                aria-label="Email"
                className="w-12 h-12 bg-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-[#1de4bf]/20 hover:border-[#1de4bf]/30 border border-gray-700/50 transition-all duration-300 group"
              >
                <Mail className="w-5 h-5 text-gray-300 group-hover:text-[#1de4bf] transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#1de4bf]" />
              Product
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-[#1de4bf] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#1de4bf] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-300 hover:text-[#1de4bf] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#1de4bf] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-300 hover:text-[#1de4bf] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#1de4bf] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#faqs"
                  className="text-gray-300 hover:text-[#1de4bf] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#1de4bf] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#0bf3a2]" />
              Support
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-[#0bf3a2] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#0bf3a2] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-[#0bf3a2] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#0bf3a2] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:linknuke.noreply@gmail.com"
                  className="text-gray-300 hover:text-[#0bf3a2] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#0bf3a2] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="https://whynotship.me"
                  className="text-gray-300 hover:text-[#0bf3a2] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-[#0bf3a2] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  WhyNotShip.me
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src="/logo.svg"
                alt="LinkNuke"
                className="w-8 h-8 opacity-60"
              />
              <span className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} LinkNuke. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <span>Part of</span>
                <a
                  href="https://whynotship.me"
                  className="font-medium text-[#0bf3a2] hover:underline transition-colors"
                >
                  WhyNotShip.me
                </a>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-gray-400">
                <span>Secure your links</span>
                <span className="text-[#1de4bf]">→</span>
                <span className="text-white font-medium">LinkNuke</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
