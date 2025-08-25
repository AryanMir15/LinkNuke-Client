import React, { createContext, useState, useEffect, useCallback } from "react";
import * as api from "../lib/linkApi";
import toast from "react-hot-toast";
import FeedbackModal from "../components/ui/FeedbackModal";

const LinksContext = createContext();

export function LinksProvider({ children }) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  // Removed unused linksShared state

  let sharedCount = 0;
  // Call this after a link is shared
  const handleLinkShared = () => {
    sharedCount++;
    if (sharedCount === 3) setShowFeedbackModal(true);
  };

  // Call this to trigger modal manually (e.g. at trial end)
  const triggerFeedbackModal = () => setShowFeedbackModal(true);

  // Store feedback in localStorage (MVP)
  const handleFeedbackSubmit = (answers) => {
    const feedbacks = JSON.parse(
      localStorage.getItem("linknuke_feedbacks") || "[]"
    );
    feedbacks.push({
      ...answers,
      date: new Date().toISOString(),
      approved: false,
    });
    localStorage.setItem("linknuke_feedbacks", JSON.stringify(feedbacks));
    setShowFeedbackModal(false);
  };

  // Check if user is logged in
  const isLoggedIn = () => {
    return typeof window !== "undefined" && localStorage.getItem("token");
  };

  // Fetch all links
  const fetchLinks = useCallback(async () => {
    // Only fetch if user is logged in
    if (!isLoggedIn()) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.getLinks();
      // Ensure data is always an array before sorting
      const safeLinks = Array.isArray(data) ? data : [];
      // Sort by newest first
      const sortedLinks = safeLinks.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLinks(sortedLinks);
      // Cache the links after successful fetch
      localStorage.setItem("cachedLinks", JSON.stringify(sortedLinks));
    } catch (err) {
      setError(err.message);
      // Only show toast error if user is logged in (to avoid unauthorized errors on public pages)
      if (isLoggedIn()) {
        toast.error(err.message || "Failed to fetch links");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchLinks();
      } catch (err) {
        const cached = localStorage.getItem("cachedLinks");
        if (cached) {
          setLinks(JSON.parse(cached));
          toast.error("Using cached links - Couldn't refresh: " + err.message);
        } else {
          toast.error("Failed to load links: " + err.message);
        }
      }
    };

    if (isLoggedIn()) loadData();
    window.addEventListener("focus", loadData);
    return () => window.removeEventListener("focus", loadData);
  }, [fetchLinks]); // Remove links.length dependency to prevent circular updates

  // Create link
  const create = async (link) => {
    setLoading(true);
    setError(null);
    try {
      const newLink = await api.createLink(link);
      setLinks((prev) => [newLink, ...prev]);
      toast.success("Link created!");
      return newLink;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to create link");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update link
  const update = async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await api.updateLink(id, updates);
      setLinks((prev) => prev.map((l) => (l._id === id ? updated : l)));
      toast.success("Link updated!");
      return updated;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to update link");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete link
  const remove = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteLink(id);
      setLinks((prev) => prev.filter((l) => l._id !== id));
      toast("Link deleted", { icon: "🗑️" });
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to delete link");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Track link (simulate nuking)
  const track = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const tracked = await api.trackLink(id);
      setLinks((prev) => prev.map((l) => (l._id === id ? tracked : l)));
      if (tracked.status === "Nuked" || tracked.expired) {
        toast.error("Link nuked or expired!");
      } else {
        toast.success("View count updated!");
      }
      return tracked;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to track link");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get single link (for view/edit)
  const get = async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await api.getLink(id);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to fetch link");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinksContext.Provider
      value={{
        links,
        loading,
        error,
        fetchLinks,
        create,
        update,
        remove,
        track,
        get,
        handleLinkShared,
        triggerFeedbackModal,
      }}
    >
      {children}
      <FeedbackModal
        open={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
        incentive="Get 3 extra days by sharing your thoughts!"
        questions={[
          {
            type: "emoji",
            label: "How do you feel about LinkNuke?",
            options: ["😡", "😕", "😐", "😊", "🤩"],
          },
          {
            type: "text",
            label: "What would make LinkNuke even better?",
            placeholder: "Your feedback…",
          },
        ]}
        style="bw"
      />
    </LinksContext.Provider>
  );
}

export { LinksContext };
