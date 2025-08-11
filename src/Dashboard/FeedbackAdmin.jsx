import React, { useState, useEffect } from "react";

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("linknuke_feedbacks") || "[]"
    );
    setFeedbacks(stored);
  }, []);

  const updateFeedbacks = (newFeedbacks) => {
    setFeedbacks(newFeedbacks);
    localStorage.setItem("linknuke_feedbacks", JSON.stringify(newFeedbacks));
  };

  const toggleApprove = (idx) => {
    const updated = [...feedbacks];
    updated[idx].approved = !updated[idx].approved;
    updateFeedbacks(updated);
  };

  const deleteFeedback = (idx) => {
    const updated = feedbacks.filter((_, i) => i !== idx);
    updateFeedbacks(updated);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Feedback Admin</h1>
      {feedbacks.length === 0 ? (
        <div className="text-gray-500">No feedback yet.</div>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((fb, idx) => (
            <li
              key={idx}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 border border-gray-200"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{fb.emoji_0 || ""}</span>
                <span className="text-gray-700 text-sm">
                  {new Date(fb.date).toLocaleString()}
                </span>
                {fb.approved && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-[#1de4bf]/20 text-[#1de4bf] text-xs font-semibold">
                    Approved
                  </span>
                )}
              </div>
              <div className="text-gray-800 text-base">{fb.text_1}</div>
              <div className="flex gap-2 mt-2">
                <button
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    fb.approved
                      ? "bg-gray-200 text-gray-600"
                      : "bg-[#1de4bf] text-white"
                  }`}
                  onClick={() => toggleApprove(idx)}
                >
                  {fb.approved ? "Unapprove" : "Approve"}
                </button>
                <button
                  className="px-3 py-1 rounded text-sm bg-red-100 text-red-600 font-semibold"
                  onClick={() => deleteFeedback(idx)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
