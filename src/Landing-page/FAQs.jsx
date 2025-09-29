"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";

const faqData = [
  {
    q: "What is LinkNuke?",
    a: "LinkNuke lets you send sensitive info with links that self-destruct after one view or a timer. No leaks, no leftovers, no second chances.",
  },
  {
    q: "How does LinkNuke keep my data secure?",
    a: "Your data is encrypted in transit and at rest. Once a link expires or is viewed, your content is permanently deleted from our servers.",
  },
  {
    q: "Can I control how long my link stays active?",
    a: "Yes! Set a view limit or an expiry timer. You decide exactly when your link self-destructs.",
  },
  {
    q: "What file types can I share?",
    a: "You can share text, images, videos, audio, and documents. All uploads are validated for security.",
  },
  {
    q: "Can anyone access my LinkNuke link?",
    a: "Only those with the unique link can access your content. For extra security, enable password protection or the 'Extra Secure' mode.",
  },
  {
    q: "What happens if someone tries to access an expired link?",
    a: "Expired links are nuked—no previews, no access, no recovery. Your data is gone for good.",
  },
  {
    q: "Do you store my data after the link expires?",
    a: "Never. Once a link is nuked, your data is permanently deleted. Your privacy is our top priority.",
  },
  {
    q: "How is this different from Google Docs?",
    a: "Google Docs links can be copied, forwarded, and remain accessible unless you manually revoke access. LinkNuke links self-destruct after one view or a timer, and your data is permanently deleted from our servers—no manual cleanup required.",
  },
  {
    q: "What happens to my data after deletion?",
    a: "Once a link is nuked (viewed or expired), your data is permanently deleted from our servers. There are no backups, no logs, and no way to recover it. We believe in true data control.",
  },
  {
    q: "Can I recover a nuked link?",
    a: "No. Once a link is nuked, it is gone forever. This is by design, to ensure your sensitive information cannot be accessed again by anyone—including us.",
  },
];

export default function Faq() {
  return (
    <section
      className="py-28 px-6 text-white relative overflow-hidden bg-black"
      id="faqs"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1de4bf]/10 via-black to-transparent opacity-40" />

      <h2 className="font-thin text-[48px] sm:text-[56px] lg:text-[72px] leading-tight tracking-tight mb-10 text-center text-white">
        Frequently Asked Questions
      </h2>

      <Accordion
        type="single"
        collapsible
        className="max-w-2xl mx-auto space-y-2"
      >
        {faqData.map((item, index) => (
          <div key={index}>
            <AccordionItem value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base sm:text-lg font-thin text-white hover:text-[#0bf3a2] focus:text-[#0bf3a2]">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          </div>
        ))}
      </Accordion>
    </section>
  );
}
