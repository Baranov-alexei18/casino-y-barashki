import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@pages/index.tsx";
import { LoadingScreen } from "@features/preloading-screen";

import "./global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoadingScreen />
    <App />
  </StrictMode>,
);
