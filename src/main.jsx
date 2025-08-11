import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { DarkModeProvider } from "./context/DarkModeContext";
import { SessionProvider } from "./context/useSession";
import AppWrapper from "./components/ui/AppWrapper";
import "./lib/posthog"; // Initialize PostHog

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DarkModeProvider>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <SessionProvider>
          <AppWrapper />
        </SessionProvider>
      </BrowserRouter>
    </DarkModeProvider>
  </React.StrictMode>
);
