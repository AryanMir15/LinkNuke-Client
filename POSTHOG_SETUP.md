# PostHog Analytics Setup

This project has been configured with PostHog analytics to track user behavior and key events.

## Setup Instructions

1. **Create a PostHog account** at [posthog.com](https://posthog.com)

2. **Get your API key** from your PostHog project settings

3. **Create a `.env` file** in the `Client` directory with the following variables:

   ```
   VITE_POSTHOG_API_KEY=your_posthog_api_key_here
   VITE_POSTHOG_HOST=https://app.posthog.com
   ```

4. **Replace `your_posthog_api_key_here`** with your actual PostHog API key

## Tracked Events

The following events are automatically tracked:

1. **`user_signed_up`** - When a user completes registration

   - Properties: email, name, timestamp

2. **`user_logged_in`** - When a user successfully logs in

   - Properties: email, timestamp

3. **`dashboard_visited`** - When a user visits the dashboard

   - Properties: timestamp, isMobile

4. **`core_feature_clicked`** - When a user clicks on file format selection

   - Properties: feature, format, timestamp

5. **`upgrade_clicked`** - When a user clicks on upgrade/pricing buttons

   - Properties: tier, price, featured, timestamp

6. **`payment_completed`** - When a payment is completed (manual tracking)

   - Properties: amount, currency, plan, payment_method, timestamp

7. **`$pageview`** - Automatic page view tracking
   - Properties: page_name, path, search, hash

## Usage

### Manual Event Tracking

To track custom events, import the analytics utility:

```javascript
import { trackEvent, trackPaymentCompleted } from "../lib/analytics";

// Track a custom event
trackEvent("custom_event_name", {
  property1: "value1",
  property2: "value2",
});

// Track payment completion
trackPaymentCompleted({
  amount: 19.99,
  currency: "USD",
  plan: "LinkNuke Pro",
  paymentMethod: "stripe",
});
```

### Direct PostHog Usage

You can also use PostHog directly:

```javascript
import posthog from "../lib/posthog";

posthog.capture("event_name", {
  property: "value",
});
```

## Development

In development mode, PostHog debug mode is enabled to help with testing and debugging.

## Privacy

PostHog is configured to respect user privacy and GDPR compliance. No personally identifiable information is sent unless explicitly included in event properties.
