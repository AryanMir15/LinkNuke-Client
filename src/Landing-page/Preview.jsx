import React, { useState, useEffect } from "react";
import {
  FileText,
  Image,
  Video,
  Music,
  Eye,
  Zap,
  Sparkles,
} from "lucide-react";

const useCases = [
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Contract Sharing",
    desc: "Share contracts that disappear after review.",
  },
  {
    icon: <Image className="h-5 w-5" />,
    title: "Photo Privacy",
    desc: "Send sensitive photos without leaving traces.",
  },
  {
    icon: <Video className="h-5 w-5" />,
    title: "Video Security",
    desc: "Share videos that self-destruct after viewing.",
  },
  {
    icon: <Music className="h-5 w-5" />,
    title: "Audio Files",
    desc: "Send voice messages that vanish when done.",
  },
];

const Preview = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("usecases");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <section
      className="relative w-full px-4 sm:px-6 lg:px-8 py-24 sm:py-32 bg-black overflow-hidden"
      id="usecases"
    >
      {/* Simple Background */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-gradient-to-l from-[#1de4bf]/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header Section */}
        <div
          className={`text-center mb-16 sm:mb-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#1de4bf]/10 border border-[#1de4bf]/20 text-[#1de4bf] text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Use Cases
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Perfect for Any
            <span className="bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-transparent bg-clip-text">
              {" "}
              Sensitive Content
            </span>
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
            From legal documents to personal photos, LinkNuke keeps your content
            secure and private.
          </p>
        </div>

        {/* Use Cases - Modern Card Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className={`group p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1de4bf]/20 to-[#0bf3a2]/20 flex items-center justify-center text-[#1de4bf] group-hover:scale-110 transition-transform duration-300">
                  {useCase.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#1de4bf] transition-colors duration-300">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {useCase.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Preview Section */}
        <div
          className={`text-center transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-10 lg:p-12 border border-gray-800">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1de4bf] to-[#0bf3a2] flex items-center justify-center text-black">
                  <Eye className="w-6 h-6" />
                </div>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                See LinkNuke in Action
              </h3>
              
              <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-10">
                Watch how easy it is to create secure, self-destructing links
                that protect your sensitive content.
              </p>

              <button className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#1de4bf] to-[#0bf3a2] text-black font-semibold hover:scale-105 transition-all duration-300">
                <Zap className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Preview;
