import React from "react";
import { motion } from "framer-motion";
import { X, Copy } from "lucide-react";

const shareOptions = [
  {
    name: "Twitter",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getShareUrl: (url) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    getShareUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    getShareUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
  },
  {
    name: "WhatsApp",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
      </svg>
    ),
    getShareUrl: (url) => `https://wa.me/?text=${encodeURIComponent(url)}`,
  },
];

export default function SuccessModal({
  isOpen,
  onClose,
  linkUrl,
  linkType = "content",
  onCopy,
}) {
  if (!isOpen) return null;

  const previewUrl = `/preview/${linkUrl.split("/").pop()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(linkUrl);
    if (onCopy) onCopy();
  };

  const getLinkTypeText = (type) => {
    switch (type) {
      case "image":
        return "Your image is live and shareable";
      case "video":
        return "Your video is live and shareable";
      case "audio":
        return "Your audio is live and shareable";
      case "text":
        return "Your text is live and shareable";
      case "document":
        return "Your document is live and shareable";
      default:
        return "Your content is live and shareable";
    }
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ffff]/5 via-transparent to-[#00ff9d]/5 rounded-3xl" />

          {/* Success Icon */}
          <motion.div
            className="flex justify-center mb-7 relative z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "backOut" }}
          >
            <div className="w-18 h-18 bg-gradient-to-br from-[#00ff9d] via-[#00ffc3] to-[#00ffff] rounded-full flex items-center justify-center shadow-xl shadow-[#00ff9d]/30 relative">
              <motion.svg
                className="w-9 h-9 text-black"
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
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00ff9d] to-[#00ffff] rounded-full blur-md opacity-30 -z-10" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white text-center mb-2 tracking-tight">
              Link Ready
            </h2>
            <p className="text-gray-400/90 text-sm text-center mb-8 leading-relaxed">
              {getLinkTypeText(linkType)}
            </p>
          </motion.div>

          {/* Link Display */}
          <motion.div
            className="bg-[#0a0a0b] border border-gray-700/40 rounded-2xl p-5 mb-7 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-[#00ffff] font-mono text-sm truncate block font-medium">
                  {linkUrl}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-[#00ffff] p-2 rounded-xl hover:bg-[#00ffff]/10 transition-all duration-200 hover:scale-105"
                title="Copy link"
              >
                <Copy size={16} />
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
            <a
              href={`${previewUrl}?preview=creator`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-[#00ff9d] via-[#00ffc3] to-[#00ffff] text-black font-semibold py-3.5 px-6 rounded-2xl text-center block transition-all duration-300 hover:shadow-xl hover:shadow-[#00ff9d]/30 hover:scale-[1.02] hover:brightness-110 relative overflow-hidden group"
            >
              <span className="relative z-10">Preview</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ff66] via-[#00ffad] to-[#00fff7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>

            {/* Share Options */}
            <div className="flex gap-3">
              {shareOptions.slice(0, 4).map((opt, index) => (
                <motion.a
                  key={opt.name}
                  href={opt.getShareUrl(linkUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#0a0a0b] border border-gray-700/40 hover:border-[#00ffff]/60 rounded-xl p-3.5 text-center transition-all duration-300 hover:bg-[#00ffff]/8 hover:scale-105 group"
                  title={`Share via ${opt.name}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                >
                  <div className="text-gray-400 group-hover:text-[#00ffff] transition-colors duration-200">
                    {opt.icon}
                  </div>
                </motion.a>
              ))}
            </div>
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

























