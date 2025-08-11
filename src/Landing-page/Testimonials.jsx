"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const staticTestimonials = [
  // Testimonials coming soon
];

const TestimonialCard = ({ testimonial }) => (
  <motion.div
    key={testimonial.name + testimonial.quote}
    className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md text-center text-white transition-all duration-300 hover:border-purple-500"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.4 }}
  >
    <p className="text-lg mb-4 italic leading-relaxed text-gray-300">
      “{testimonial.quote}”
    </p>
    <h4 className="font-bold text-white">{testimonial.name}</h4>
    <p className="text-sm text-gray-400">{testimonial.title}</p>
  </motion.div>
);

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(staticTestimonials);
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("linknuke_feedbacks") || "[]"
    );
    const approved = stored.filter((fb) => fb.approved && fb.text_1);
    if (approved.length > 0) {
      setTestimonials(
        approved.map((fb) => ({
          name: fb.name || "Anonymous",
          title: fb.emoji_0 || "User",
          quote: fb.text_1,
        }))
      );
    }
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  useEffect(() => {
    timeoutRef.current = setTimeout(next, 6000);
    return () => clearTimeout(timeoutRef.current);
  }, [index, testimonials.length]);

  return (
    <section className="relative py-28 bg-black text-white overflow-hidden px-6">
      {/* Subtle background gradient for depth */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#111111] to-[#0a0a0a]" />

      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight">
          Real People. Real Results.
        </h2>
        <p className="text-gray-400 text-sm mt-2 italic">
          See what our first users say (coming soon)
        </p>
      </div>

      <div className="flex flex-col-reverse md:flex-row md:items-center justify-center gap-6 mt-10 md:mt-0 relative w-full">
        {/* Mobile Controls */}
        <div className="flex md:hidden justify-center gap-6 mt-6">
          <button
            onClick={prev}
            className="bg-white/10 border border-white/10 p-2 rounded-full text-white hover:bg-white/20 hover:scale-110 transition w-auto"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={next}
            className="bg-white/10 border border-white/10 p-2 rounded-full text-white hover:bg-white/20 hover:scale-110 transition w-auto"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Testimonial Card */}
        <div className="mx-auto">
          <AnimatePresence mode="wait">
            <TestimonialCard key={index} testimonial={testimonials[index]} />
          </AnimatePresence>
        </div>

        {/* Desktop Controls */}
        <button
          onClick={prev}
          className="hidden md:flex absolute left-4 md:left-16 bg-white/10 border border-white/10 p-2 rounded-full text-white hover:bg-white/20 hover:scale-110 transition z-20"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={next}
          className="hidden md:flex absolute right-4 md:right-16 bg-white/10 border border-white/10 p-2 rounded-full text-white hover:bg-white/20 hover:scale-110 transition z-20"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
