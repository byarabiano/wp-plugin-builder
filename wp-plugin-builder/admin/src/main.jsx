import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Mount React application inside WordPress Admin
 * with full protection against remount, flickering,
 * and WordPress DOM reload issues.
 */

function safeMount() {
    const rootEl = document.getElementById("wpb-root");
    if (!rootEl || rootEl.dataset.mounted === "1") return;

    rootEl.dataset.mounted = "1";

    // Create root only once
    const root = ReactDOM.createRoot(rootEl);

    root.render(
        <App /> // بدون StrictMode لتجنب التكرار
    );
}

// ------------------------------------
// 1) Attempt immediate mount
// ------------------------------------
safeMount();

// ------------------------------------
// 2) If WP loads menu/content late → observe DOM
// ------------------------------------
const observer = new MutationObserver(() => {
    const rootEl = document.getElementById("wpb-root");
    if (rootEl && !rootEl.dataset.mounted) {
        safeMount();
    }
});

// Start observing the entire body for late DOM changes
observer.observe(document.body, {
    childList: true,
    subtree: true,
});
