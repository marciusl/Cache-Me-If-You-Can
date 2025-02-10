import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ServiceWorkerBase } from "./ServiceWorker";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServiceWorkerBase />
    <App />
  </StrictMode>
);
