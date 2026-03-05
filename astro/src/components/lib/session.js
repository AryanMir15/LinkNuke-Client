import posthog from "./posthog";

export const initSessionTracking = () => {
  if (import.meta.env.MODE === "production") {
    // Start session recording (automatically captures $pageleave with time_spent)
    posthog.startSessionRecording();

    // Track initial pageview
    const initialPage = window.location.pathname;
    posthog.capture("$pageview", {
      $current_url: window.location.href,
      page_name: initialPage === "/" ? "home" : initialPage.slice(1),
    });

    // Handle navigation changes
    const handleNavigation = () => {
      const currentPath = window.location.pathname;
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        page_name: currentPath === "/" ? "home" : currentPath.slice(1),
      });
    };

    // Override history methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleNavigation();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleNavigation();
    };

    window.addEventListener("popstate", handleNavigation);
  }
};
