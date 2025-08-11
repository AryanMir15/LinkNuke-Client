"use client";
import { PenTool, Briefcase, Megaphone, GraduationCap } from "lucide-react";

const useCases = [
  {
    icon: <PenTool className="h-6 w-6 text-pink-400" />,
    title: "Creators & Artists",
    desc: "Showcase your work, link to your shop, and connect with fans — all in one sleek page.",
  },
  {
    icon: <Briefcase className="h-6 w-6 text-yellow-300" />,
    title: "Freelancers",
    desc: "Make your portfolio pop, add contact forms, and schedule client calls from one link.",
  },
  {
    icon: <Megaphone className="h-6 w-6 text-cyan-400" />,
    title: "Influencers & Marketers",
    desc: "Track link clicks, promote your latest content, and drive traffic like a beast.",
  },
  {
    icon: <GraduationCap className="h-6 w-6 text-purple-400" />,
    title: "Students & Devs",
    desc: "Share your resume, projects, and socials with recruiters — minus the awkwardness.",
  },
];

export default function MobileUseCases() {
  return (
    <section className="bg-black text-white py-24 px-6" id="usecases">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/10 via-fuchsia-600/5 to-transparent blur-2xl -z-10" />

      <div className="max-w-2xl mx-auto text-center mb-16">
        <h2 className="text-3xl font-bold mb-4 leading-snug">
          Built for creators. <br /> Powered by possibilities.
        </h2>
        <p className="text-gray-400 text-base">
          Whether you're building a personal brand or launching a business,
          <span className="text-white font-medium"> LinkBolt </span>
          adapts to you — not the other way around.
        </p>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        {useCases.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-5 transition-all duration-300"
          >
            <div className="mb-4 w-12 h-12 flex items-center justify-center bg-white/10 rounded-full shadow-inner shadow-black/30">
              {item.icon}
            </div>
            <h4 className="text-lg font-semibold mb-1">{item.title}</h4>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
