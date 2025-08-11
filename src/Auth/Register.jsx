import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { trackEvent } from "../lib/analytics";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.name.split(" ")[0],
          lastName: form.name.split(" ")[1] || "",
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.pending) {
          toast("Account exists but not verified. Redirecting...");
          navigate("/verify-pin", { state: { email: form.email } });
          return;
        }

        switch (res.status) {
          case 400:
            toast.error("Invalid form. Fill in all fields properly.");
            break;
          case 401:
            toast.error("Unauthorized. Weird... Try again.");
            break;
          case 403:
            toast.error("Access forbidden. Suspicious activity?");
            break;
          case 409:
            toast.error("Email already exists. Try logging in.");
            break;
          case 429:
            toast.error("Too many requests. Slow your roll.");
            break;
          case 500:
            toast.error("Server on fire. We're working on it.");
            break;
          default:
            toast.error(data.error || "Registration failed. Try again.");
        }
        return;
      }

      toast.success("Registered! Check email to verify.");

      // Track user signup event
      trackEvent("user_signed_up", {
        email: form.email,
        name: form.name,
        timestamp: new Date().toISOString(),
      });

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/verify-pin", { state: { email: form.email } });
      }, 2000);
    } catch {
      toast.error("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-gray-100 flex flex-col sm:flex-row">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-[#1F1F23] rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-2">Account created!</h2>
            <p className="mb-4 text-gray-400">Redirecting to verification...</p>
            <Loader2 className="animate-spin mx-auto text-[#1de4bf]" />
          </div>
        </div>
      )}

      {/* Left: Form */}
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
              Create your LinkNuke account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              {
                label: "Full Name",
                name: "name",
                type: "text",
                placeholder: "John Doe",
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                placeholder: "example@email.com",
              },
              {
                label: "Password",
                name: "password",
                type: "password",
                placeholder: "••••••••",
              },
              {
                label: "Confirm Password",
                name: "confirmPassword",
                type: "password",
                placeholder: "••••••••",
              },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} className="space-y-1">
                <label htmlFor={name} className="text-sm text-gray-400 block">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  placeholder={placeholder}
                  className="w-full px-3 py-2 rounded-lg bg-[#1F1F23] text-gray-100 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1de4bf] shadow-md transition"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full font-semibold text-sm tracking-wide bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:opacity-90 transition text-black flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Register"
              )}
            </button>
          </form>

          <button
            onClick={() =>
              (window.location.href = `${
                import.meta.env.VITE_API_URL
              }/auth/google`)
            }
            className="w-full py-2.5 rounded-full bg-[#1F1F23] text-white font-medium text-sm hover:bg-[#2E2E32] transition flex items-center justify-center gap-2 shadow-md"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              className="w-4 h-4"
            />
            Sign in with Google
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1de4bf] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      {/* Right: Modern Gradient Wave Panel */}
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
