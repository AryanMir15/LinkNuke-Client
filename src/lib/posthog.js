import posthog from "posthog-js";

// Only initialize PostHog if the API key is available and we're in production
if (import.meta.env.VITE_POSTHOG_KEY && import.meta.env.PROD) {
  try {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
      // Disable automatic pageview tracking to reduce noise
      loaded: (posthog) => {
        if (import.meta.env.DEV) posthog.debug();
      },
      // Handle ad blocker gracefully
      capture_pageview: false,
      capture_pageleave: false,
      // Reduce retry attempts to prevent spam
      retry_attempts: 2,
      retry_delay: 1000,
    });
  } catch (error) {
    console.warn(
      "PostHog initialization failed (likely blocked by ad blocker):",
      error
    );
  }
}

// Create a safe wrapper that won't break if PostHog is blocked
const safePostHog = {
  capture: (...args) => {
    try {
      if (posthog && typeof posthog.capture === "function") {
        posthog.capture(...args);
      }
    } catch (error) {
      // Silently fail if PostHog is blocked
      console.debug("PostHog capture failed:", error);
    }
  },
  identify: (...args) => {
    try {
      if (posthog && typeof posthog.identify === "function") {
        posthog.identify(...args);
      }
    } catch (error) {
      console.debug("PostHog identify failed:", error);
    }
  },
  set: (...args) => {
    try {
      if (posthog && typeof posthog.set === "function") {
        posthog.set(...args);
      }
    } catch (error) {
      console.debug("PostHog set failed:", error);
    }
  },
};

export default safePostHog;
