// admin/src/ui-builder/utils/node-utils.js
import { normalizeNodes } from "./tree-utils";

/** deep clone (simple) */
export function cloneNode(node) {
  return JSON.parse(JSON.stringify(node));
}

/** deep merge props (shallow props merge) */
export function mergeProps(node, partial) {
  return { ...node, props: { ...(node.props || {}), ...(partial || {}) } };
}

/**
 * Convert a node to an HTML string (very opinionated, basic)
 * This is used by export pipeline to generate plugin files.
 * You will extend this for each widget type.
 */
export function renderNodeToHTML(node) {
  if (!node) return "";
  const type = node.type;
  const p = node.props || {};

  switch (type) {
    case "text":
      return `<div style="${inlineStyle({ fontSize: p.fontSize + "px", color: p.color })}">${escapeHtml(p.content || "")}</div>`;
    case "button":
      return `<button style="${inlineStyle({ background: p.background, color: p.color, padding: p.padding, borderRadius: p.borderRadius })}">${escapeHtml(p.content || "")}</button>`;
    case "image":
      return `<img src="${escapeAttr(p.src || "")}" style="${inlineStyle({ width: p.width ? p.width + "px" : "auto" })}" />`;
    case "container":
    case "row":
    case "column":
      return `<div style="${inlineStyle({ background: p.background, padding: (p.padding || 0) + "px", minHeight: p.minHeight ? p.minHeight + "px" : "auto" })}">${(node.children || []).map(renderNodeToHTML).join("")}</div>`;
    default:
      return `<div>${escapeHtml(node.type)}</div>`;
  }
}

/* helpers */
function inlineStyle(obj = {}) {
  return Object.keys(obj)
    .filter(k => obj[k] !== undefined && obj[k] !== null && obj[k] !== "")
    .map(k => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${obj[k]}`)
    .join(";");
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeAttr(s = "") {
  return String(s).replace(/"/g, "&quot;");
}

/** Convert whole tree to HTML body */
export function renderTreeToHTML(nodes) {
  const normalized = normalizeNodes(nodes);
  return normalized.map(renderNodeToHTML).join("");
}
