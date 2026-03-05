import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function InfoModal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-[#1F1F23] border border-gray-700/50 rounded-xl shadow-2xl p-6 w-full max-w-sm text-white relative backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1], // Custom easing for smooth animation
            }}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors duration-200"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-bold mb-3 text-white">{title}</h2>
            <div className="text-sm text-gray-300 mb-6 leading-relaxed">
              {children}
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 text-sm rounded-lg bg-[#232326] border border-gray-700 hover:border-[#00ffff] hover:bg-[#00ffff]/10 text-white transition-all duration-200"
                onClick={onClose}
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
