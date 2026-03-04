// src/Landing-page/Footer.jsx

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
                <svg
                  className="w-4 h-4 text-gray-300 hover:text-[#1de4bf]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="https://github.com/AryanMir15"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#1de4bf]/20 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-300 hover:text-[#1de4bf]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="mailto:support@whynotship.me"
                aria-label="Email"
                className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#1de4bf]/20 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-300 hover:text-[#1de4bf]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-base mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-[#1de4bf] transition-colors text-sm"
                >
                  Home
                </a>
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
            <h4 className="font-semibold text-white text-base mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@whynotship.me"
                  className="text-gray-400 hover:text-[#1de4bf] transition-colors text-sm"
                >
                  📧 support@whynotship.me
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/Tanzeelmirr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#1de4bf] transition-colors text-sm"
                >
                  🐦 @Tanzeelmirr (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/AryanMir15"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#1de4bf] transition-colors text-sm"
                >
                  💻 @AryanMir15 (GitHub)
                </a>
              </li>
              <li>
                <a
                  href="https://whynotship.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#1de4bf] transition-colors text-sm"
                >
                  🚀 WhyNotShip.me
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
                &copy; 2024 LinkNuke. All rights reserved.
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
