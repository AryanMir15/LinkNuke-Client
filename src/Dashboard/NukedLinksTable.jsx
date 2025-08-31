"use client";

import React, { useState, useEffect } from "react";
import { Copy, Eye, Trash } from "lucide-react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AnimatePresence, motion } from "framer-motion";
import { useLinksContext } from "../context/useLinksContext";

dayjs.extend(relativeTime);

const formatOptions = [
  { label: "All", value: "all" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Text", value: "text" },
  { label: "Audio", value: "audio" },
  { label: "Document", value: "document" },
];

const NukedLinksTable = () => {
  const { links, loading, error, remove } = useLinksContext();
  const [activeFilter, setActiveFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    document.body.style.overflow = deletingId ? "hidden" : "";
  }, [deletingId]);

  const filteredLinks =
    links?.filter((link) => {
      if (activeFilter === "all") return true;
      return link.format?.toLowerCase() === activeFilter.toLowerCase();
    }) || [];

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
    toast.success("Copied!");
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (deletingId) {
      setIsDeleting(true);
      try {
        await remove(deletingId);
      } catch (error) {
        console.error("Delete failed:", error);
      } finally {
        setIsDeleting(false);
        setDeletingId(null);
      }
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 bg-[#1F1F23]">
      <div className="text-center mb-8 relative">
        <h2 className="text-3xl font-extrabold text-white">Nuked Links</h2>
      </div>

      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-[#2A2A2E]/80 backdrop-blur-xl rounded-2xl p-1 shadow-lg">
          {formatOptions.map((opt) => {
            const active = opt.value === activeFilter;
            return (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={`px-4 py-2 transition duration-200 font-medium rounded ${
                  active
                    ? "bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black shadow"
                    : "text-gray-400 hover:text-white hover:bg-[#2E2E32]/50"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-6">Loading...</div>
      )}
      {error && <div className="text-center text-red-500 py-6">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-[#1F1F23] rounded-md overflow-hidden">
          <thead className="bg-[#2A2A2E] text-sm text-gray-300">
            <tr>
              {[
                "Title",
                "Link",
                "Views",
                "Expiry",
                "Status",
                "Created",
                "Actions",
              ].map((h) => (
                <th key={h} className="text-left px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filteredLinks.length === 0 ? (
                <motion.tr
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-[#2A2A2E] rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="text-gray-400 text-lg font-medium">
                        {activeFilter === "all"
                          ? "No links created yet"
                          : `No ${activeFilter} links found`}
                      </div>
                      <p className="text-gray-500 text-sm max-w-md">
                        {activeFilter === "all"
                          ? "Create your first link to get started. Choose a format above and upload your content."
                          : `You haven't created any ${activeFilter} links yet. Try creating one!`}
                      </p>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                filteredLinks.map((link, index) => {
                  const preview =
                    link.url ||
                    `${window.location.origin}/preview/${link.linkId}`;
                  const expired = isLinkExpired(link);
                  return (
                    <motion.tr
                      key={link._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="hover:bg-[#2E2E32] transition-colors"
                    >
                      <td className="px-4 py-3 text-white font-medium text-sm">
                        {link.title}
                      </td>
                      <td className="px-4 py-3 text-sm max-w-xs truncate">
                        <a
                          href={preview}
                          target="_blank"
                          rel="noopener"
                          className="text-[#1de4bf] underline hover:text-[#0bf3a2] transition"
                        >
                          {preview}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {link.views ?? 0}/{link.maxViews || "∞"}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {!link.expiresAt
                          ? "—"
                          : new Date(link.expiresAt) < new Date()
                          ? "Expired"
                          : `in ${dayjs(link.expiresAt).fromNow(true)}`}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`${
                            expired
                              ? "bg-red-900/30 text-red-400"
                              : "bg-green-900/30 text-green-400"
                          } px-2 py-1 rounded text-xs font-bold`}
                        >
                          {expired ? "Nuked" : "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {link.createdAt
                          ? dayjs(link.createdAt).format("YYYY-MM-DD HH:mm")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleCopy(preview)}
                            className="hover:text-[#1de4bf] text-gray-400 transition"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => window.open(preview, "_blank")}
                            className="hover:text-[#0bf3a2] text-gray-400 transition"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingId(link._id)}
                            className="hover:text-red-400 text-gray-400 transition"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1F1F23] rounded-2xl p-6 shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-lg font-bold text-white mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-300 mb-4">
                This will permanently remove the link. Proceed?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-[#2c2c31] text-gray-300 hover:text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NukedLinksTable;
