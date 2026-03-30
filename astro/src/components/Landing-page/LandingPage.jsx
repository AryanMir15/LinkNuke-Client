import React, { Suspense } from "react";
import Hero from "./Hero";
import Features from "./Features";
import PainPoints from "./PainPoints";
import Preview from "./Preview";
import Pricing from "./Pricing";
import CTA from "./CTA";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Preview />
      <PainPoints />
      <Features />
      <Pricing />
      <Suspense
        fallback={
          <div className="min-h-[400px] flex items-center justify-center text-white">
            Loading FAQs...
          </div>
        }
      >
        <FAQs />
      </Suspense>
      <CTA />
      <Footer />
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-white mb-4">LinkNuke</h1>
        <p className="text-gray-300 text-lg">Secure link-sharing platform</p>
      </div>
    </div>
  );
}
