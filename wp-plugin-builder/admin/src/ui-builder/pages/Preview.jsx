// admin/src/ui-builder/pages/Preview.jsx
import React from "react";
import { useEditorStore } from "../hooks/useEditorStore";
import { renderTreeToHTML } from "../utils/node-utils";

export default function PreviewPage() {
  const elements = useEditorStore(s => s.elements || []);
  const html = renderTreeToHTML(elements);

  return (
    <div style={{ padding: 20 }}>
      <h3>معاينة</h3>
      <div style={{ border: "1px solid #eee", padding: 12 }}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
