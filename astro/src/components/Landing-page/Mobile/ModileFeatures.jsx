"use client";
import {
  LayoutDashboard,
  Sparkles,
  CalendarCheck,
  Bot,
  Share2,
  BarChart3,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: <LayoutDashboard size={28} />,
    title: "Custom Themes",
    desc: "Pick colors, gradients, and fonts that match your whole vibe. Your link page, your rules.",
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Analytics That Matter",
    desc: "Clicks, views, traffic sources — no fluff, just the facts you actually care about.",
  },
  {
    icon: <Share2 size={28} />,
    title: "Social Embeds",
    desc: "Showcase your latest YouTube video, tweet, or playlist right on your page.",
  },
  {
    icon: <CalendarCheck size={28} />,
    title: "Smart Scheduling",
    desc: "Schedule links to appear when you want. Launch promos while you sleep.",
  },
  {
    icon: <Bot size={28} />,
    title: "AI Bio Generator",
    desc: "Can’t think of what to write? Our AI will do the charm-offensive for you.",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Magic Previews",
    desc: "Preview links in style with rich thumbnails that don’t look like junk.",
  },
];

function FadeInCard({ children }) {
  return <div>{children}</div>;
}

export default function MobileFeatures() {
  return (
    <section className="bg-black py-24 px-4 text-white" id="features">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h2 className="font-thin text-[32px] sm:text-[40px] leading-tight tracking-tight mb-3 text-white">
          Everything You Need. Nothing You Don't.
        </h2>
        <p className="text-gray-400 text-base">
          LinkNuke isn’t bloated. It’s the cleanest way to show off everything
          you’re doing — with style and simplicity.
        </p>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        {features.map((item, i) => (
          <FadeInCard key={i}>
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5">
              <div className="mb-3 text-cyan-300">{item.icon}</div>
              <h3 className="text-lg font-thin mb-1 text-white">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          </FadeInCard>
        ))}
      </div>
    </section>
  );
}
