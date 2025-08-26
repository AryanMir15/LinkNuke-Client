import { useState, useEffect } from "react";
import ImageModal from "./modals/ImageModal";
import VideoModal from "./modals/VideoModal";
import TextModal from "./modals/TextModal";
import AudioModal from "./modals/AudioModal";
import DocumentsModal from "./modals/DocumentsModal";
import {
  Image,
  Video,
  FileText,
  FileAudio,
  FileText as DocumentIcon,
  Lock,
} from "lucide-react";
import { Check, ChevronDown } from "lucide-react";
import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";
import { trackEvent } from "../lib/analytics";
import axios from "axios";
import { toast } from "react-hot-toast";

const formats = [
  {
    label: "Image",
    icon: (
      <Image
        size={36}
        className="text-[#1de4bf] drop-shadow-sm"
        strokeWidth={1.5}
      />
    ),
    premium: false,
  },
  {
    label: "Video",
    icon: (
      <Video
        size={36}
        className="text-[#06b6d4] drop-shadow-sm"
        strokeWidth={1.5}
      />
    ),
    premium: true,
  },
  {
    label: "Text",
    icon: (
      <FileText
        size={36}
        className="text-[#22c55e] drop-shadow-sm"
        strokeWidth={1.5}
      />
    ),
    premium: false,
  },
  {
    label: "Audio",
    icon: (
      <FileAudio
        size={36}
        className="text-[#818cf8] drop-shadow-sm"
        strokeWidth={1.5}
      />
    ),
    premium: true,
  },
  {
    label: "Doc",
    icon: (
      <DocumentIcon
        size={36}
        className="text-[#fbbf24] drop-shadow-sm"
        strokeWidth={1.5}
      />
    ),
    premium: true,
  },
];

const Configurator = () => {
  const [activeType, setActiveType] = useState("Image");
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Only fetch subscription status if user has a paid plan
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.plan && user.plan !== "free") {
      fetchSubscriptionStatus();
    }
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/paddle/subscription-status`,
        {
          withCredentials: true,
        }
      );
      setSubscription(response.data.subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const closeModal = () => setActiveType(null);

  const handleFormatSelect = (formatLabel) => {
    const format = formats.find((f) => f.label === formatLabel);

    // Check if format requires premium and user doesn't have it
    if (
      format.premium &&
      (!subscription?.plan || subscription?.plan === "free")
    ) {
      toast.error(
        "This format requires a Pro or Lifetime plan. Upgrade to unlock all file types."
      );
      return;
    }

    setActiveType(formatLabel);

    // Track core feature usage
    trackEvent("core_feature_clicked", {
      feature: "file_format_selection",
      format: formatLabel,
      timestamp: new Date().toISOString(),
    });
  };

  const isPremiumUser =
    subscription?.plan === "pro" || subscription?.plan === "lifetime";

  return (
    <section className="w-full px-4 sm:px-6 py-8 sm:py-16 bg-[#1F1F23]">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10 text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Choose the file format for your link
        </h2>

        {/* Format Tabs */}
        <div className="relative z-10 flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex bg-[#2c2c31]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-1 sm:p-2 border border-[#2E2E32] shadow-[0_8px_32px_rgba(29,228,191,0.05)]">
            {formats.map((format, idx) => {
              const isActive = format.label === activeType;
              const isFirst = idx === 0;
              const isLast = idx === formats.length - 1;
              const isDisabled = format.premium && !isPremiumUser;

              return (
                <div key={idx} className="relative">
                  <button
                    onClick={() => handleFormatSelect(format.label)}
                    disabled={isDisabled}
                    className={`group relative flex items-center justify-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 transition-all duration-300 ease-out
                      ${isFirst ? "rounded-l-lg sm:rounded-l-xl" : ""} 
                      ${isLast ? "rounded-r-lg sm:rounded-r-xl" : ""}
                      ${!isFirst && !isLast ? "mx-0.5" : ""}
                      ${
                        isActive
                          ? "bg-[#1de4bf]/10 text-white shadow-lg"
                          : isDisabled
                          ? "text-gray-500 cursor-not-allowed opacity-50"
                          : "text-gray-300 hover:text-white hover:bg-[#2E2E32]/80"
                      }
                    `}
                  >
                    <div className="relative">
                      <div
                        className={`transition-all duration-300 ${
                          isActive
                            ? "text-[#1de4bf]"
                            : isDisabled
                            ? "text-gray-500"
                            : "text-gray-300"
                        }`}
                      >
                        {React.cloneElement(format.icon, {
                          size: 24,
                          className: `${
                            isActive
                              ? "text-[#00ffff]"
                              : isDisabled
                              ? "text-gray-500"
                              : "text-gray-400"
                          } transition-colors duration-300 group-hover:text-gray-300`,
                        })}
                      </div>
                      {format.premium && !isPremiumUser && (
                        <Lock
                          size={12}
                          className="absolute -top-1 -right-1 text-[#1de4bf]"
                        />
                      )}
                    </div>
                  </button>

                  {/* Subtle separator */}
                  {!isLast && (
                    <div
                      className={`absolute right-0 top-1/2 -translate-y-1/2 w-px h-6 ${
                        isActive ? "bg-[#1de4bf]/40" : "bg-[#2c2c31]/70"
                      } transition-colors duration-300`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium Notice */}
        {!isPremiumUser && (
          <div className="bg-gradient-to-r from-[#1de4bf]/10 to-[#0bf3a2]/10 border border-[#1de4bf]/20 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-sm text-gray-300">
              <Lock size={14} className="inline mr-1 text-[#1de4bf]" />
              Video, Audio, and Document formats require a Pro or Lifetime plan
            </p>
          </div>
        )}

        {/* Modals */}
        <div>
          {/* Modals */}
          <AnimatePresence mode="wait">
            {activeType === "Image" && (
              <motion.div
                key="Image"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{
                  duration: window.innerWidth < 768 ? 0.1 : 0.25,
                  ease:
                    window.innerWidth < 768 ? "easeOut" : [0.22, 1, 0.36, 1],
                }}
              >
                <ImageModal closeModal={closeModal} />
              </motion.div>
            )}
            {activeType === "Video" && (
              <motion.div
                key="Video"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{
                  duration: window.innerWidth < 768 ? 0.1 : 0.25,
                  ease:
                    window.innerWidth < 768 ? "easeOut" : [0.22, 1, 0.36, 1],
                }}
              >
                <VideoModal closeModal={closeModal} />
              </motion.div>
            )}
            {activeType === "Text" && (
              <motion.div
                key="Text"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{
                  duration: window.innerWidth < 768 ? 0.1 : 0.25,
                  ease:
                    window.innerWidth < 768 ? "easeOut" : [0.22, 1, 0.36, 1],
                }}
              >
                <TextModal closeModal={closeModal} />
              </motion.div>
            )}
            {activeType === "Audio" && (
              <motion.div
                key="Audio"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{
                  duration: window.innerWidth < 768 ? 0.1 : 0.25,
                  ease:
                    window.innerWidth < 768 ? "easeOut" : [0.22, 1, 0.36, 1],
                }}
              >
                <AudioModal closeModal={closeModal} />
              </motion.div>
            )}
            {activeType === "Doc" && (
              <motion.div
                key="Doc"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{
                  duration: window.innerWidth < 768 ? 0.1 : 0.25,
                  ease:
                    window.innerWidth < 768 ? "easeOut" : [0.22, 1, 0.36, 1],
                }}
              >
                <DocumentsModal closeModal={closeModal} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Configurator;
