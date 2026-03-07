"use client";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function WhyLinkNuke() {
  return (
    <section className="bg-black text-white px-6 py-28 relative overflow-hidden">
      {/* Gradient Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-900/20 via-fuchsia-700/10 to-transparent blur-3xl" />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
          style={{ willChange: "opacity, transform" }}
        >
          <h2 className="text-4xl font-bold tracking-tight leading-snug">
            Why settle for basic?
          </h2>
          <p className="text-gray-300 text-lg">
            Other link tools are bloated. They add a million features you’ll
            never use and charge you for it.{" "}
            <span className="text-white font-semibold">LinkNuke</span> focuses
            on what actually matters: security, speed, and simplicity.
          </p>
          <ul className="space-y-4 mt-6 text-sm">
            <li className="flex items-start gap-3">
              <Sparkles size={18} className="text-purple-400 mt-1" />
              <div>
                <strong>No code. No mess.</strong>
                <p className="text-gray-300">
                  Just plug in your links, tweak the design, and you’re live. As
                  easy as copying a meme.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Sparkles size={18} className="text-purple-400 mt-1" />
              <div>
                <strong>Privacy first.</strong>
                <p className="text-gray-300">
                  We don’t track weird stuff or sell your data. You own your
                  links, your clicks, your profile.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Card */}
        <div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md p-8 
            shadow-[0_5px_30px_-10px_rgba(168,85,247,0.3)] transition-all duration-300 
            hover:scale-[1.03] hover:shadow-[0_0_30px_#a855f740]"
          style={{ willChange: "opacity, transform" }}
        >
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Ditch the Linktree clones.</h3>
            <p className="text-gray-300 text-sm">
              LinkNuke is smarter, faster, cleaner. This isn’t some
              cookie-cutter profile builder. We give you full control, real
              analytics, and tools that actually grow your brand. No BS.
            </p>

            <div className="flex gap-4 pt-4">
              <Link
                to="/login"
                className="mt- bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md hover:scale-105 transition"
              >
                Try LinkNuke Free →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
