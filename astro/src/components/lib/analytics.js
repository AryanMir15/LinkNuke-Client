import posthog from "./posthog";

// Track payment completion
export const trackPaymentCompleted = (paymentData) => {
  posthog.capture("payment_completed", {
    amount: paymentData.amount,
    currency: paymentData.currency || "USD",
    plan: paymentData.plan,
    payment_method: paymentData.paymentMethod,
    timestamp: new Date().toISOString(),
    ...paymentData,
  });
};

// Track page views
export const trackPageView = (pageName, properties = {}) => {
  posthog.capture("$pageview", {
    page_name: pageName,
    ...properties,
  });
};

// Track page leave events with time spent
export const trackPageLeave = (pageName, timeSpent, properties = {}) => {
  posthog.capture("$pageleave", {
    page_name: pageName,
    time_spent: timeSpent,
    ...properties,
  });
};

// Track custom events
export const trackEvent = (eventName, properties = {}) => {
  posthog.capture(eventName, {
    timestamp: new Date().toISOString(),
    ...properties,
  });
};

// Session tracking initialization
export const initSessionTracking = () => {
  if (import.meta.env.MODE === "production") {
    let lastPage = null;
    let pageEnterTime = Date.now();

    // Track initial pageview
    const initialPage = window.location.pathname;
    trackPageView(initialPage === "/" ? "home" : initialPage.slice(1));
    lastPage = initialPage;

    // Set up history listener
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // Override pushState
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleNavigation();
    };

    // Override replaceState
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleNavigation();
    };

    // Listen to popstate events (back/forward navigation)
    window.addEventListener("popstate", handleNavigation);

    function handleNavigation() {
      const currentPath = window.location.pathname;
      if (currentPath === lastPage) return;

      // Calculate time spent on previous page
      const now = Date.now();
      const timeSpent = now - pageEnterTime;

      // Track page leave
      if (lastPage) {
        const pageName = lastPage === "/" ? "home" : lastPage.slice(1);
        trackPageLeave(pageName, timeSpent);
      }

      // Track new pageview
      const newPageName = currentPath === "/" ? "home" : currentPath.slice(1);
      trackPageView(newPageName);

      // Update tracking variables
      lastPage = currentPath;
      pageEnterTime = now;
    }
  }
};
