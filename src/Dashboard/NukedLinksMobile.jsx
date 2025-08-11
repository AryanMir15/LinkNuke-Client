"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Copy,
  Trash,
  Eye,
  Calendar,
  Eye as ViewsIcon,
  Clock,
  Link as LinkIcon,
  FileText,
  Image,
  Video,
  Music,
  File,
} from "lucide-react";
import { useLinksContext } from "../context/useLinksContext";

dayjs.extend(relativeTime);

const formatOptions = [
  { label: "All", value: "all", icon: LinkIcon },
  { label: "Image", value: "image", icon: Image },
  { label: "Video", value: "video", icon: Video },
  { label: "Text", value: "text", icon: FileText },
  { label: "Audio", value: "audio", icon: Music },
  { label: "Document", value: "document", icon: File },
];

const formatIcons = {
  image: Image,
  video: Video,
  text: FileText,
  audio: Music,
  document: File,
};

const NukedLinksMobile = () => {
  const { links, loading, error, remove } = useLinksContext();
  const [activeFilter, setActiveFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = deletingId ? "hidden" : "";
  }, [deletingId]);

  const filteredLinks =
    activeFilter === "all"
      ? links
      : links.filter((l) => l.format?.toLowerCase() === activeFilter);

  const isLinkExpired = (link) => {
    const now = new Date();
    const expiredByDate = link.expiresAt && new Date(link.expiresAt) < now;
    const expiredByViews = link.maxViews && link.views >= link.maxViews;
    return (
      expiredByDate || expiredByViews || link.status === "Nuked" || link.expired
    );
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied!", {
      style: {
        background: "#2A2A2E",
        color: "#fff",
        border: "1px solid #1de4bf",
      },
    });
  };

  const confirmDelete = async () => {
    if (deletingId) {
      setIsDeleting(true);
      try {
        await remove(deletingId);
        toast.success("Link deleted!", {
          style: {
            background: "#2A2A2E",
            color: "#fff",
            border: "1px solid #ef4444",
          },
        });
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("Failed to delete link", {
          style: {
            background: "#2A2A2E",
            color: "#fff",
            border: "1px solid #ef4444",
          },
        });
      } finally {
        setIsDeleting(false);
        setDeletingId(null);
      }
    }
  };

  const getFormatIcon = (format) => {
    const IconComponent = formatIcons[format?.toLowerCase()] || LinkIcon;
    return <IconComponent size={16} />;
  };

  return (
    <section className="sm:hidden w-full min-h-screen bg-gradient-to-br from-[#1F1F23] via-[#1A1A1E] to-[#1F1F23] px-4 py-6">
      <Toaster position="top-center" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] bg-clip-text text-transparent">
          Nuked Links
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your secure content links
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <div className="bg-[#2A2A2E]/60 backdrop-blur-xl rounded-2xl p-1 shadow-lg border border-gray-700/30">
          <div className="flex overflow-x-auto scrollbar-hide">
            {formatOptions.map((opt) => {
              const active = opt.value === activeFilter;
              const IconComponent = opt.icon;
              return (
                <motion.button
                  key={opt.value}
                  onClick={() => setActiveFilter(opt.value)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-3 transition-all duration-200 font-medium rounded-xl whitespace-nowrap ${
                    active
                      ? "bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-[#2E2E32]/50"
                  }`}
                >
                  <IconComponent size={16} />
                  {opt.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="w-12 h-12 border-3 border-[#1de4bf]/20 border-t-[#1de4bf] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 text-sm">Loading your links...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredLinks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#2A2A2E] to-[#1F1F23] rounded-full flex items-center justify-center mb-4 border border-gray-700/30">
            <LinkIcon className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-gray-300 text-lg font-semibold mb-2">
            {activeFilter === "all"
              ? "No links created yet"
              : `No ${activeFilter} links found`}
          </h3>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            {activeFilter === "all"
              ? "Create your first secure link to get started"
              : `You haven't created any ${activeFilter} links yet`}
          </p>
        </motion.div>
      )}

      {/* Links Grid */}
      {!loading && !error && filteredLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredLinks.map((link, index) => {
              const preview = `${window.location.origin}/preview/${
                link.linkId || link.url.split("/").pop()
              }`;
              const expired = isLinkExpired(link);

              return (
                <motion.div
                  key={link._id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative"
                >
                  <div className="bg-gradient-to-br from-[#2A2A2E] to-[#232326] rounded-2xl p-4 shadow-lg border border-gray-700/30 hover:border-[#1de4bf]/20 transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            expired
                              ? "bg-red-900/30 text-red-400"
                              : "bg-gradient-to-br from-[#1de4bf]/20 to-[#0bf3a2]/20 text-[#1de4bf]"
                          }`}
                        >
                          {getFormatIcon(link.format)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm truncate">
                            {link.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                expired
                                  ? "bg-red-900/30 text-red-400"
                                  : "bg-green-900/30 text-green-400"
                              }`}
                            >
                              {expired ? "Expired" : "Active"}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {link.format?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setDeletingId(link._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash size={18} />
                      </motion.button>
                    </div>

                    {/* Link URL */}
                    <div className="bg-[#1F1F23] rounded-xl p-3 mb-3 border border-gray-700/20">
                      <p className="text-gray-300 text-xs font-mono truncate">
                        {preview}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <ViewsIcon size={14} />
                        <span>
                          {link.views}/{link.maxViews || "∞"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>
                          {link.expiresAt
                            ? dayjs(link.expiresAt).fromNow(true)
                            : "No expiry"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {link.createdAt
                            ? dayjs(link.createdAt).format("MMM DD")
                            : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => handleCopy(preview)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black font-semibold rounded-xl text-sm hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Copy size={16} />
                        Copy Link
                      </motion.button>
                      <motion.a
                        href={preview}
                        target="_blank"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 border-2 border-[#0bf3a2] text-[#0bf3a2] font-semibold rounded-xl text-sm text-center hover:bg-[#0bf3a2]/10 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        Preview
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-[#2A2A2E] to-[#232326] rounded-2xl p-6 shadow-2xl border border-gray-700/30 w-full max-w-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Delete Link
                </h3>
                <p className="text-gray-400 text-sm">
                  This action cannot be undone. The link will be permanently
                  removed.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setDeletingId(null)}
                  disabled={isDeleting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-[#2E2E32] text-gray-300 font-semibold rounded-xl hover:bg-[#2E2E32]/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash size={16} />
                      Delete
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NukedLinksMobile;
