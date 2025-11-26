import React from "react";
import ReactDOM from "react-dom/client";
import AdminRouter from "./AdminRouter";
import "./index.css";

function mount() {
  const rootEl = document.getElementById("wp-pb-root");

  if (!rootEl) {
    return setTimeout(mount, 50);
  }

  if (!rootEl.dataset.mounted) {
    rootEl.dataset.mounted = "1";
    ReactDOM.createRoot(rootEl).render(<AdminRouter />);
  }
}

mount();
