import React from "react";
import { motion } from "framer-motion";
import { X, Heart, MessageCircle } from "lucide-react";

export default function WelcomeModal({ isOpen, onClose, planName = "Pro" }) {
  if (!isOpen) return null;

  const handleFeedbackClick = () => {
    // You can customize this to navigate to your feedback form or open a feedback modal
    window.open("/feedback", "_blank");
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
        className="w-full max-w-2xl mx-auto relative"
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ff9d]/5 via-transparent to-[#00ffff]/5 rounded-3xl" />

          <div className="flex items-center gap-8 relative z-10">
            {/* Welcome Icon */}
            <motion.div
              className="flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: "backOut" }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#00ff9d] via-[#00ffc3] to-[#00ffff] rounded-full flex items-center justify-center shadow-xl shadow-[#00ff9d]/30 relative">
                <motion.div
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Heart className="w-12 h-12 text-black fill-current" />
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 0, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Heart className="w-12 h-12 text-black fill-current" />
                  </motion.div>
                </motion.div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00ff9d] to-[#00ffff] rounded-full blur-md opacity-30 -z-10" />
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                  Welcome to {planName}
                </h2>
                <p className="text-gray-400/90 text-lg mb-4 leading-relaxed">
                  Thank you for choosing LinkNuke. We're thrilled to have you on
                  board and can't wait to see what you'll create.
                </p>
              </motion.div>

              {/* Feedback Section */}
              <motion.div
                className="bg-gradient-to-r from-[#00ff9d]/10 to-[#00ffff]/10 border border-[#00ffff]/20 rounded-2xl p-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-[#00ffff]" />
                  <span className="text-[#00ffff] font-semibold text-sm">
                    Your Voice Matters
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  As LinkNuke is still new, we would appreciate{" "}
                  <strong className="text-[#00ffff]">ANY</strong> comment,
                  suggestion, or feedback you may have. Your input helps us
                  build something amazing together.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <button
                  onClick={handleFeedbackClick}
                  className="bg-gradient-to-r from-[#00ff9d] via-[#00ffc3] to-[#00ffff] text-black font-semibold py-3 px-6 rounded-xl text-center block transition-all duration-300 hover:shadow-xl hover:shadow-[#00ff9d]/30 hover:scale-[1.02] hover:brightness-110 relative overflow-hidden group"
                >
                  <span className="relative z-10">Share Feedback</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00ff66] via-[#00ffad] to-[#00fff7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button
                  onClick={onClose}
                  className="bg-[#0a0a0b] border border-gray-700/40 hover:border-[#00ffff]/60 rounded-xl p-3 px-6 text-center transition-all duration-300 hover:bg-[#00ffff]/8 hover:scale-105 group"
                >
                  <span className="text-gray-400 group-hover:text-[#00ffff] transition-colors duration-200 font-medium">
                    Start Creating
                  </span>
                </button>
              </motion.div>
            </div>
          </div>
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
