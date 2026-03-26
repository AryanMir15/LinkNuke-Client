import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppWrapper from "../components/components/ui/AppWrapper.jsx";
import "./index.css";

export default function ReactApp() {
  return (
    <BrowserRouter basename="/dashboard">
      <AppWrapper />
    </BrowserRouter>
  );
}
