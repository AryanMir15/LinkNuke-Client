"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

export default function VerifyPin() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || "";

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => setCooldown((c) => c - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  const focusNext = (i) => i < 5 && inputRefs.current[i + 1]?.focus();
  const focusPrev = (i) => i > 0 && inputRefs.current[i - 1]?.focus();

  const handleChange = (e, i) => {
    const v = e.target.value;
    if (/^\d$/.test(v)) {
      const next = [...pin];
      next[i] = v;
      setPin(next);
      focusNext(i);
    } else if (v === "") {
      const next = [...pin];
      next[i] = "";
      setPin(next);
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...pin];
      if (pin[i]) {
        next[i] = "";
        setPin(next);
      } else {
        focusPrev(i);
        const prev = [...pin];
        prev[i - 1] = "";
        setPin(prev);
      }
    }
    if (e.key === "Enter") handleVerify();
  };

  const handlePaste = (e) => {
    const txt = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(txt)) {
      const arr = txt.split("");
      setPin(arr);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = pin.join("");
    if (code.length !== 6) {
      toast.error("Enter all 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/auth/verify-pin",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, pin: code }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Invalid PIN. Try again.");
        return;
      }

      toast.success("Account verified!");
      navigate("/dashboard");
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;

    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/auth/resend-pin",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to resend.");

      toast.success("PIN resent. Check your email.");
      setCooldown(30);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-gray-100 flex items-center justify-center px-4 py-10">
      <Toaster position="top-center" />
      <div className="w-full max-w-md space-y-8">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold relative inline-block text-white">
            <span className="relative z-10">LinkNuke</span>
            <svg
              viewBox="0 0 120 24"
              preserveAspectRatio="none"
              className="absolute left-1/2 transform -translate-x-1/2 top-full mt-[-4px] w-[115%] h-5 sm:h-6 z-0 pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="linknuke-underline"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#1de4bf" />
                  <stop offset="100%" stopColor="#0bf3a2" />
                </linearGradient>
              </defs>
              <path
                d="M5 18 Q 60 30, 115 12"
                fill="none"
                stroke="url(#linknuke-underline)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </h1>

          <p className="text-sm mt-8 text-gray-400">
            Enter the 6-digit PIN we sent to{" "}
            <span className="text-white font-medium">{email}</span>
          </p>
        </div>

        {/* PIN Inputs */}
        <div
          className="flex justify-center gap-3 sm:gap-4"
          onPaste={handlePaste}
        >
          {pin.map((digit, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              ref={(el) => (inputRefs.current[i] = el)}
              placeholder="•"
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl rounded-lg bg-[#1F1F23] text-gray-100 border border-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1de4bf] transition shadow-md"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-2.5 rounded-full font-semibold text-sm tracking-wide bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:opacity-90 transition text-black flex items-center justify-center"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            "Verify Account"
          )}
        </button>

        {/* Resend Code */}
        <button
          onClick={handleResend}
          disabled={cooldown > 0 || loading}
          className={`w-full text-center text-sm ${
            cooldown > 0 || loading
              ? "text-gray-400 opacity-50 cursor-not-allowed"
              : "text-[#1de4bf] hover:underline"
          }`}
        >
          {cooldown > 0 ? `Resend Code in ${cooldown}s` : "Resend Code"}
        </button>
      </div>
    </div>
  );
}
