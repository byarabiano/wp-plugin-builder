// admin/src/ui-builder/element-library.js
export const ELEMENT_LIBRARY = [
  {
    type: "container",
    label: "حاوية (Container)",
    defaultProps: { background: "#ffffff", padding: 12, minHeight: 40 }
  },
  {
    type: "text",
    label: "نص (Text)",
    defaultProps: { content: "نص تجريبي", fontSize: 16, color: "#222" }
  },
  {
    type: "button",
    label: "زر (Button)",
    defaultProps: { content: "اضغط هنا", background: "#0073aa", color: "#fff", padding: "8px 14px" }
  },
  {
    type: "image",
    label: "صورة (Image)",
    defaultProps: { src: "https://via.placeholder.com/300x150", width: 300 }
  }
];
