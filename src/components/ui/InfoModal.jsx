import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-gray-900 dark:text-gray-100 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black dark:hover:text-white"
              onClick={onClose}
              aria-label="Close"
            >
              <X />
            </button>
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              {children}
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-1 text-sm rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
