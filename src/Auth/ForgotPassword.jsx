"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const interval = setInterval(() => setCooldown((c) => c - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        switch (res.status) {
          case 400:
            toast.error("Bad request. Invalid email?");
            break;
          case 404:
            toast.error("No user found with this email.");
            break;
          case 429:
            toast.error("Chill out. Too many requests.");
            break;
          case 500:
            toast.error("Server down bad. Try again later.");
            break;
          default:
            toast.error(data.error || "Something went wrong.");
        }
        return;
      }

      toast.success("Reset link sent! Check your inbox.");
      setCooldown(30);
    } catch {
      toast.error("Network issue. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-gray-100 flex flex-col sm:flex-row">
      {/* Left: Forgot Password Form */}
      <div className="w-full sm:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold relative inline-block">
              <span className="relative z-10 text-white">LinkNuke</span>
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
              Reset your LinkNuke password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm text-gray-400 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-lg bg-[#1F1F23] text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1de4bf] shadow-md transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full py-2.5 rounded-full font-semibold text-sm tracking-wide bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:opacity-90 transition text-black flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : cooldown > 0 ? (
                `Resend in ${cooldown}s`
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Remember your password?{" "}
            <Link to="/login" className="text-[#1de4bf] hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Modern Gradient Wave Panel (matching Login/Register) */}
      <div className="hidden sm:block w-1/2 relative overflow-hidden bg-[#16181c]">
        {/* Accent Gradient Overlay with Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0bf3a2] via-[#1de4bf] to-[#0bf3a2] opacity-20 " />

        {/* SVG Wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-3/4"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0bf3a2" />
              <stop offset="50%" stopColor="#1de4bf" />
              <stop offset="100%" stopColor="#0bf3a2" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGrad)"
            d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,186.7C672,181,768,139,864,122.7C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
}
