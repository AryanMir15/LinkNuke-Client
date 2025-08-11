import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function FeedbackModal({
  open,
  onClose,
  onSubmit,
  incentive = "",
  questions = [
    {
      type: "emoji",
      label: "How do you feel?",
      options: ["😡", "😕", "😐", "😊", "🤩"],
    },
    {
      type: "text",
      label: "What could we improve?",
      placeholder: "Your feedback…",
    },
  ],
  style = "bw", // 'default' or 'bw'
}) {
  const [answers, setAnswers] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (modalRef.current) modalRef.current.focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(answers);
    setAnswers({});
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            ref={modalRef}
            tabIndex={-1}
            className={`w-full max-w-sm rounded-xl p-6 relative focus:outline-none ${
              style === "bw"
                ? "bg-black text-white border border-white/10 shadow-2xl"
                : "bg-white text-gray-900 border border-gray-200 shadow-xl"
            }`}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onSubmit={handleSubmit}
          >
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={onClose}
              aria-label="Close"
            >
              <X />
            </button>
            <h2 className="text-lg font-bold mb-2">Quick Feedback</h2>
            {incentive && (
              <div className="mb-3 text-xs rounded bg-white/10 text-[#1de4bf] px-3 py-1 font-semibold">
                {incentive}
              </div>
            )}
            <div className="space-y-4 mb-6">
              {questions.map((q, i) => (
                <div key={i}>
                  <label className="block mb-1 text-sm font-medium">
                    {q.label}
                  </label>
                  {q.type === "emoji" && (
                    <div className="flex gap-2 justify-center">
                      {q.options.map((emoji) => (
                        <button
                          type="button"
                          key={emoji}
                          className={`text-2xl px-2 py-1 rounded-full border-2 transition-all ${
                            answers[`emoji_${i}`] === emoji
                              ? "border-[#1de4bf] bg-[#1de4bf]/10"
                              : "border-transparent hover:border-gray-400"
                          }`}
                          onClick={() => handleChange(`emoji_${i}`, emoji)}
                          aria-label={emoji}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                  {q.type === "stars" && (
                    <div className="flex gap-1 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className={`text-2xl px-1 py-1 rounded-full transition-all ${
                            answers[`stars_${i}`] >= star
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                          onClick={() => handleChange(`stars_${i}`, star)}
                          aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  )}
                  {q.type === "text" && (
                    <textarea
                      className="w-full mt-1 rounded border border-gray-300 bg-white/10 text-sm p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1de4bf] min-h-[60px]"
                      placeholder={q.placeholder || "Your feedback…"}
                      value={answers[`text_${i}`] || ""}
                      onChange={(e) =>
                        handleChange(`text_${i}`, e.target.value)
                      }
                      required={q.required !== false}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-4 py-1 text-sm rounded bg-gray-700/30 hover:bg-gray-700/60"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 text-sm rounded bg-[#1de4bf] text-white font-semibold hover:bg-[#15c7a8]"
              >
                Send
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
