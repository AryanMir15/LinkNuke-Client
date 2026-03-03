// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) => !page.includes("/dashboard"),
    }),
  ],
  vite: {
    define: {
      "import.meta.env.VITE_PUBLIC_PADDLE_ENVIRONMENT": JSON.stringify(
        process.env.PUBLIC_PADDLE_ENVIRONMENT,
      ),
      "import.meta.env.VITE_PUBLIC_PADDLE_TOKEN": JSON.stringify(
        process.env.PUBLIC_PADDLE_TOKEN,
      ),
      "import.meta.env.VITE_PUBLIC_POSTHOG_KEY": JSON.stringify(
        process.env.PUBLIC_POSTHOG_KEY,
      ),
      "import.meta.env.VITE_PUBLIC_API_URL": JSON.stringify(
        process.env.PUBLIC_API_URL,
      ),
    },
  },
});
