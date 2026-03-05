import React from "react";
import Hero from "./Hero";
import Features from "./Features";
import PainPoints from "./PainPoints";
import Preview from "./Preview";
import FAQs from "./FAQs";
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
      <FAQs />
      <CTA />
      <Footer />
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-white mb-4">LinkNuke</h1>
        <p className="text-gray-300 text-lg">Secure link-sharing platform</p>
      </div>
    </div>
  );
}
