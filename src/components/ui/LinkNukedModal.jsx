import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Zap } from "lucide-react";

export default function LinkNukedModal() {
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
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 rounded-3xl" />

          {/* Nuked Icon */}
          <motion.div
            className="flex justify-center mb-7 relative z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "backOut" }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-full flex items-center justify-center shadow-xl shadow-red-500/30 relative">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: "backOut" }}
              >
                <Trash2 className="w-10 h-10 text-white" />
              </motion.div>
              {/* Explosion effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-full blur-md opacity-30 -z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1.5 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              />
              {/* Sparkle effects */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  style={{
                    top: `${20 + Math.sin((i * 60 * Math.PI) / 180) * 30}%`,
                    left: `${50 + Math.cos((i * 60 * Math.PI) / 180) * 30}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.8 + i * 0.1,
                    duration: 0.3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 2,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white text-center mb-2 tracking-tight">
              Link Nuked! 💥
            </h2>
            <p className="text-gray-400/90 text-sm text-center mb-8 leading-relaxed">
              This link has been automatically destroyed by LinkNuke after
              reaching its view limit.
            </p>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="space-y-4 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="text-center mb-6">
              <p className="text-gray-300 text-sm mb-4">
                Want to create links like this?
              </p>
            </div>

            <Link
              to="/register"
              className="group relative w-full bg-gradient-to-r from-[#1de4bf] via-[#00ffc3] to-[#00ffff] text-black font-semibold py-3.5 px-6 rounded-2xl text-center block transition-all duration-300 hover:shadow-xl hover:shadow-[#1de4bf]/30 hover:scale-[1.02] hover:brightness-110 overflow-hidden shine-button"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Create Your Own Nuke Links
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ff66] via-[#00ffad] to-[#00fff7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <div className="text-center">
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                Learn more about LinkNuke
              </Link>
            </div>
          </motion.div>
        </div>

        {/* CSS for shine effect */}
        <style jsx>{`
          .shine-button {
            position: relative;
            overflow: hidden;
          }

          .shine-button::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            transition: left 0.5s ease;
          }

          .shine-button:hover::before {
            left: 100%;
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
}
