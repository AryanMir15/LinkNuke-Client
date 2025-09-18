import React from "react";
import { motion } from "framer-motion";
import { X, Mail } from "lucide-react";

export default function RefundFailedModal({
  isOpen,
  onClose,
  supportEmail = "support@whynotship.me",
}) {
  if (!isOpen) return null;

  const handleEmailClick = () => {
    window.open(
      `mailto:${supportEmail}?subject=Refund Request&body=Hi, I'd like to request a refund for my recent purchase. Please let me know how to proceed.`
    );
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="w-full max-w-sm mx-auto relative"
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 30 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Main Modal Card */}
        <div className="bg-[#1F1F23] border border-gray-700/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/5 via-transparent to-[#ff8c42]/5 rounded-3xl" />

          {/* Warning Icon */}
          <motion.div
            className="flex justify-center mb-7 relative z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "backOut" }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[#ff6b35] via-[#ff8c42] to-[#ffa726] rounded-full flex items-center justify-center shadow-xl shadow-[#ff6b35]/30 relative">
              <motion.svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </motion.svg>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35] to-[#ffa726] rounded-full blur-md opacity-30 -z-10" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white text-center mb-2 tracking-tight">
              Refund Request Failed
            </h2>
            <p className="text-gray-400/90 text-sm text-center mb-8 leading-relaxed">
              We're sorry, but we couldn't process your refund request
              automatically. Please contact us directly and we'll help you right
              away.
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="bg-[#0a0a0b] border border-gray-700/40 rounded-2xl p-5 mb-7 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-[#ff6b35] font-mono text-sm truncate block font-medium">
                  {supportEmail}
                </span>
              </div>
              <button
                onClick={handleEmailClick}
                className="text-gray-400 hover:text-[#ff6b35] p-2 rounded-xl hover:bg-[#ff6b35]/10 transition-all duration-200 hover:scale-105"
                title="Send email"
              >
                <Mail size={16} />
              </button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="space-y-4 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <button
              onClick={handleEmailClick}
              className="w-full bg-gradient-to-r from-[#ff6b35] via-[#ff8c42] to-[#ffa726] text-white font-semibold py-3.5 px-6 rounded-2xl text-center block transition-all duration-300 hover:shadow-xl hover:shadow-[#ff6b35]/30 hover:scale-[1.02] hover:brightness-110 relative overflow-hidden group"
            >
              <span className="relative z-10">Contact Support</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff5722] via-[#ff7043] to-[#ff9800] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button
              onClick={onClose}
              className="w-full bg-[#0a0a0b] border border-gray-700/40 hover:border-[#ff6b35]/60 rounded-xl p-3.5 text-center transition-all duration-300 hover:bg-[#ff6b35]/8 hover:scale-105 group"
            >
              <span className="text-gray-400 group-hover:text-[#ff6b35] transition-colors duration-200 font-medium">
                Close
              </span>
            </button>
          </motion.div>
        </div>

        {/* Close Button */}
        <motion.button
          className="absolute -top-3 -right-3 w-9 h-9 bg-[#1F1F23] border border-gray-700/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-110 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Close"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={15} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
