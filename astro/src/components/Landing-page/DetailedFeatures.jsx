"use client";
import { useEffect, useState, useRef } from "react";
import MobileFeatures from "./Mobile/ModileFeatures";
import {
  LayoutDashboard,
  Sparkles,
  CalendarCheck,
  Bot,
  Share2,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Custom Themes",
    desc: "Your link page, your rules. Pick colors, gradients, and fonts that match your vibe—no bloat, just you.",
  },
  {
    icon: BarChart3,
    title: "Analytics That Matter",
    desc: "Clicks, views, traffic sources—no fluff, just the facts you actually care about.",
  },
  {
    icon: Share2,
    title: "Social Embeds",
    desc: "Showcase your latest YouTube, tweet, or playlist right on your page. No extra steps.",
  },
  {
    icon: CalendarCheck,
    title: "Smart Scheduling",
    desc: "Schedule links to appear when you want. Launch promos while you sleep. Set it and forget it.",
  },
  {
    icon: Bot,
    title: "AI Bio Generator",
    desc: "Can’t think of what to write? Our AI will do the charm-offensive for you—no cringe.",
  },
  {
    icon: Sparkles,
    title: "Magic Previews",
    desc: "Preview links in style with rich thumbnails that don’t leak info or look like junk.",
  },
];

function LazyCard({ children }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[200px]">
      {visible ? children : null}
    </div>
  );
}

export default function Features() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // Skip during SSR

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <MobileFeatures />;
  }

  return (
    <section
      className="bg-black py-28 px-6 text-white relative overflow-hidden"
      id="features"
    >
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h2 className="text-4xl font-normal md:font-medium tracking-tight mb-4">
          Everything You Need. Nothing You Don’t.
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          LinkNuke isn’t bloated. It’s the cleanest way to show off everything
          you’re doing — with style and simplicity.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, i) => (
          <LazyCard key={i}>
            <div
              className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-6
                         transition-all duration-300
                         hover:scale-[1.025]
                         hover:border-fuchsia-700/40"
              style={{ willChange: "transform" }}
            >
              <div className="mb-4 text-cyan-300">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </div>
          </LazyCard>
        ))}
      </div>
    </section>
  );
}
