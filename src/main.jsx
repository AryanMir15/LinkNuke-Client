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
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1F1F23",
              color: "#fff",
              border: "1px solid #374151",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
            },
            success: {
              iconTheme: {
                primary: "#00ff9d",
                secondary: "#1F1F23",
              },
              style: {
                background: "#1F1F23",
                color: "#fff",
                border: "1px solid #00ff9d",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0, 255, 157, 0.2)",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#1F1F23",
              },
              style: {
                background: "#1F1F23",
                color: "#fff",
                border: "1px solid #ef4444",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(239, 68, 68, 0.2)",
              },
            },
            loading: {
              iconTheme: {
                primary: "#00ffff",
                secondary: "#1F1F23",
              },
              style: {
                background: "#1F1F23",
                color: "#fff",
                border: "1px solid #00ffff",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0, 255, 255, 0.2)",
              },
            },
          }}
        />
        <SessionProvider>
          <AppWrapper />
        </SessionProvider>
      </BrowserRouter>
    </DarkModeProvider>
  </React.StrictMode>
);
