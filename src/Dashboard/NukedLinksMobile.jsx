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

  const filteredLinks = React.useMemo(() => {
    if (!Array.isArray(links)) return [];

    if (activeFilter === "all") {
      return links;
    }

    return links.filter((link) => {
      const linkFormat = link.format?.toLowerCase();
      return linkFormat === activeFilter;
    });
  }, [links, activeFilter]);

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
    <section className="sm:hidden w-full bg-[#1F1F23] px-2 py-4">
      <Toaster position="top-center" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] bg-clip-text text-transparent">
          Your Links
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          Manage your secure content links
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4"
      >
        <div className="bg-[#2A2A2E] rounded-xl p-1 shadow-lg border border-[#2E2E32]">
          <div className="flex overflow-x-auto scrollbar-hide">
            {formatOptions.map((opt) => {
              const active = opt.value === activeFilter;
              const IconComponent = opt.icon;
              return (
                <motion.button
                  key={opt.value}
                  onClick={() => setActiveFilter(opt.value)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1.5 px-3 py-2 transition-all duration-200 font-medium rounded-lg whitespace-nowrap text-xs ${
                    active
                      ? "bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-[#2E2E32]/50"
                  }`}
                >
                  <IconComponent size={12} />
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
          className="flex flex-col items-center justify-center py-8"
        >
          <div className="w-8 h-8 border-2 border-[#1de4bf]/20 border-t-[#1de4bf] rounded-full animate-spin mb-3"></div>
          <p className="text-gray-400 text-xs">Loading your links...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-center mb-4"
        >
          <p className="text-red-400 text-xs">{error}</p>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredLinks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-8"
        >
          <div className="w-12 h-12 bg-[#2A2A2E] rounded-full flex items-center justify-center mb-3 border border-[#2E2E32]">
            <LinkIcon className="w-6 h-6 text-gray-500" />
          </div>
          <h3 className="text-gray-300 text-sm font-semibold mb-1">
            {activeFilter === "all"
              ? "No links created yet"
              : `No ${activeFilter} links found`}
          </h3>
          <p className="text-gray-500 text-xs text-center max-w-xs">
            {activeFilter === "all"
              ? "Create your first secure link to get started"
              : `You haven't created any ${activeFilter} links yet`}
          </p>
        </motion.div>
      )}

      {/* Links List */}
      {!loading && !error && filteredLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3"
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
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group relative"
                >
                  <div className="bg-[#2A2A2E] rounded-xl p-3 shadow-lg border border-[#2E2E32] hover:border-[#1de4bf]/20 transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
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
                          <div className="flex items-center gap-1.5 mt-1">
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
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
                        <Trash size={16} />
                      </motion.button>
                    </div>

                    {/* Link URL */}
                    <div className="bg-[#1F1F23] rounded-lg p-2 mb-3 border border-[#2E2E32]">
                      <p className="text-gray-300 text-xs font-mono truncate">
                        {preview}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <ViewsIcon size={12} />
                        <span>
                          {link.views}/{link.maxViews || "∞"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>
                          {link.expiresAt
                            ? dayjs(link.expiresAt).fromNow(true)
                            : "No expiry"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
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
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black font-semibold rounded-lg text-xs hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5"
                      >
                        <Copy size={14} />
                        Copy
                      </motion.button>
                      <motion.a
                        href={preview}
                        target="_blank"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-2.5 border border-[#1de4bf] text-[#1de4bf] font-semibold rounded-lg text-xs text-center hover:bg-[#1de4bf]/10 transition-all duration-200 flex items-center justify-center gap-1.5"
                      >
                        <Eye size={14} />
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
              className="bg-[#2A2A2E] rounded-xl p-4 shadow-2xl border border-[#2E2E32] w-full max-w-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trash className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Delete Link
                </h3>
                <p className="text-gray-400 text-xs">
                  This action cannot be undone. The link will be permanently
                  removed.
                </p>
              </div>

              <div className="flex gap-2">
                <motion.button
                  onClick={() => setDeletingId(null)}
                  disabled={isDeleting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 bg-[#2E2E32] text-gray-300 font-semibold rounded-lg hover:bg-[#2E2E32]/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-sm"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash size={14} />
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
