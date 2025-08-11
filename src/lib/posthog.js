import posthog from "posthog-js";

// Initialize PostHog
if (typeof window !== "undefined") {
  posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com",
    loaded: (posthog) => {
      if (import.meta.env.DEV) posthog.debug();
      // Start session recording after initialization
      if (import.meta.env.MODE === "production") {
        posthog.startSessionRecording();
      }
    },
    capture_pageview: true, // Required for automatic pageleave tracking
    capture_pageleave: true, // Enable automatic pageleave events
  });
}

export default posthog;
