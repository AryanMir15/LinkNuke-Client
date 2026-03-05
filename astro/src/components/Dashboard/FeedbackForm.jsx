import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Check, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import emailjs from "emailjs-com";
import { Listbox, Transition } from "@headlessui/react";
import { trackEvent } from "../lib/analytics";

const categories = [
  { label: "Bug Report", value: "Bug" },
  { label: "Feature Request", value: "Feature" },
  { label: "General Feedback", value: "General" },
];

export default function FeedbackForm() {
  const [form, setForm] = useState({ name: "", email: "", feedback: "" });
  const [category, setCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.feedback) {
      toast.error("Email and message are required.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name || "Anonymous",
        email: form.email,
        title: category.label,
        message: form.feedback,
        time: new Date().toLocaleString(),
      };
      await emailjs.send(
        "service_fczz522",
        "template_ntn0mh3",
        payload,
        "EShWf0EqJ2utBwst6"
      );

      // Track feedback submission
      trackEvent("feedback_submitted", {
        category: category.value,
        hasName: !!form.name, // whether user provided name
        timestamp: new Date().toISOString(),
      });

      setShowSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch {
      toast.error("Failed to send. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1F1F23] px-4 py-12">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#2E2E32] rounded-xl p-8 shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              Thanks for reaching out!
            </h2>
            <p className="text-gray-400 mb-4">
              Your message has been sent. Redirecting...
            </p>
            <Loader2 className="animate-spin mx-auto text-[#1de4bf]" />
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-[#2E2E32] rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6"
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-white text-center">
          Send Us a Message
        </h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-gray-300">
            Name (optional)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="px-3 py-2 bg-[#1F1F23] shadow-sm rounded text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1de4bf]"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm text-gray-300">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="px-3 py-2 bg-[#1F1F23] shadow-sm rounded text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1de4bf]"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-sm text-gray-300">
            Category
          </label>
          <Listbox value={category} onChange={setCategory}>
            <div className="relative">
              <Listbox.Button className="w-full flex justify-between items-center px-3 py-2 bg-[#1F1F23] shadow-sm rounded text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1de4bf]">
                <span>{category.label}</span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-[#2E2E32] rounded shadow-lg max-h-60 overflow-auto focus:outline-none">
                  {categories.map((opt) => (
                    <Listbox.Option
                      key={opt.value}
                      className={({ active }) =>
                        `cursor-pointer select-none px-3 py-2 ${
                          active
                            ? "bg-[#1de4bf]/10 text-[#1de4bf]"
                            : "text-gray-200"
                        }`
                      }
                      value={opt}
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between">
                          <span className={selected ? "font-semibold" : ""}>
                            {opt.label}
                          </span>
                          {selected && (
                            <Check className="w-5 h-5 text-[#1de4bf]" />
                          )}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="feedback" className="text-sm text-gray-300">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={form.feedback}
            onChange={handleChange}
            className="px-3 py-2 bg-[#1F1F23] shadow-sm rounded text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1de4bf] min-h-[100px]"
            placeholder="Your message…"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-[#1de4bf] text-black rounded text-sm font-semibold shadow hover:opacity-90 disabled:opacity-60 transition"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Send"}
        </button>
      </form>
    </div>
  );
}
