"use client";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative bg-black py-16 sm:py-24 px-6 text-white overflow-hidden rounded-2xl mt-12 mb-12">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
          Send sensitive files without the fear of oversharing.
        </h2>

        <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xl mx-auto">
          Stop your investor deck from getting leaked. Your data, your control,
          deleted forever after one view.
        </p>

        <div className="flex justify-center">
          <a
            href="/register"
            className="bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] hover:from-[#1de4bf]/90 hover:to-[#0bf3a2]/90 text-black font-semibold py-3 sm:py-4 px-6 sm:px-10 rounded-full text-base sm:text-lg shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            Send a Self-Destructing Link{" "}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
