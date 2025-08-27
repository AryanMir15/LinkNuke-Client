"use client";

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + `/auth/reset-password/${token}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: form.password,
            confirmPassword: form.confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        switch (res.status) {
          case 400:
            toast.error("Invalid or expired token.");
            break;
          case 404:
            toast.error("User not found. Weird...");
            break;
          case 500:
            toast.error("Server down bad. Try again later.");
            break;
          default:
            toast.error(data.error || "Reset failed.");
        }
        return;
      }

      toast.success("Password reset successful!");
      navigate("/login");
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-gray-100 flex flex-col sm:flex-row">
      {/* Left: Reset Password Form */}
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
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm text-gray-400 block">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-[#1F1F23] text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1de4bf] shadow-md transition"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="text-sm text-gray-400 block"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-[#1F1F23] text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1de4bf] shadow-md transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full font-semibold text-sm tracking-wide bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:opacity-90 transition text-black flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
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
