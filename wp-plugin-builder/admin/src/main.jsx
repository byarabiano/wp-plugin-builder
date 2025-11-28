import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// -------------------------
// Mount React into WordPress Admin
// -------------------------

function mountReactApp() {
  const rootEl = document.getElementById("wpb-root");

  if (!rootEl) {
    return setTimeout(mountReactApp, 50);
  }

  if (!rootEl.dataset.mounted) {
    rootEl.dataset.mounted = "1";

    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

mountReactApp();
