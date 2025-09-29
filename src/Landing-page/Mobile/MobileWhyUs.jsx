"use client";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    title: "Built for Speed",
    desc: "Blazing fast page loads. No bloat. No bullshit. Just pure performance.",
    icon: "⚡️",
  },
  {
    title: "Customize Everything",
    desc: "Themes, domains, bios, buttons, widgets—make it yours down to the last pixel.",
    icon: "🎨",
  },
  {
    title: "Advanced Analytics",
    desc: "See who clicked what, when, and why. Real-time insights without the guesswork.",
    icon: "📊",
  },
  {
    title: "Smart Link Scheduling",
    desc: "Schedule drops, promotions, or switch links automatically based on time.",
    icon: "🕒",
  },
  {
    title: "Built-in AI Tools",
    desc: "Generate bios, headlines, and even full pages in seconds with built-in AI assist.",
    icon: "🤖",
  },
  {
    title: "No Code Required",
    desc: "It’s simple enough for beginners. Powerful enough for pros.",
    icon: "🧠",
  },
];

export default function MobileWhyUs() {
  return (
    <section className="py-24 bg-black text-white px-6 relative overflow-hidden">
      {/* Background blur */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-700/10 via-fuchsia-600/5 to-transparent blur-2xl" />

      {/* Heading */}
      <div className="text-center mb-14 max-w-xl mx-auto animate-fade-up">
        <h2 className="text-3xl font-bold mb-3 leading-snug">
          Why creators choose
          <span className="block bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            LinkNuke
          </span>
        </h2>
        <p className="text-base text-gray-400">
          We’re not just another link-in-bio tool. We’re the launchpad for your
          entire digital presence.
        </p>
      </div>

      {/* Cards grid */}
      <div className="space-y-6 max-w-xl mx-auto">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-5"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h4 className="text-lg font-semibold mb-1">{feature.title}</h4>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
