// admin/src/ui-builder/components/InspectorPanel.jsx
import React from "react";
import { useEditorStore } from "../hooks/useEditorStore";

/**
 * InspectorPanel shows props for activeElement and allows editing.
 * It uses a naive schema mapping: checks known prop keys and renders forms.
 */

export default function InspectorPanel() {
  const activeId = useEditorStore(s => s.activeElement);
  const getNode = useEditorStore(s => s.getNode);
  const update = useEditorStore(s => s.updateElement);

  const node = activeId ? getNode(activeId) : null;

  if (!node) {
    return (
      <div style={{ padding: 12, color: "#666" }}>
        اختر عنصرًا لتحرير خصائصه.
      </div>
    );
  }

  const props = node.props || {};

  function handleChange(key, value) {
    update(node.id, { [key]: value });
  }

  return (
    <div style={{ padding: 12 }}>
      <h4 style={{ marginTop: 0 }}>{node.type} — خصائص</h4>

      {/* generic fields */}
      {node.type === "text" && (
        <>
          <label>المحتوى</label>
          <textarea value={props.content || ""} onChange={e=>handleChange("content", e.target.value)} style={{ width:"100%", minHeight:80 }} />
          <label>حجم الخط (px)</label>
          <input type="number" value={props.fontSize || 16} onChange={e=>handleChange("fontSize", Number(e.target.value))} />
          <label>اللون</label>
          <input type="color" value={props.color || "#000000"} onChange={e=>handleChange("color", e.target.value)} />
        </>
      )}

      {node.type === "button" && (
        <>
          <label>النص</label>
          <input value={props.content || ""} onChange={e=>handleChange("content", e.target.value)} />
          <label>خلفية</label>
          <input type="color" value={props.background || "#0073aa"} onChange={e=>handleChange("background", e.target.value)} />
          <label>لون النص</label>
          <input type="color" value={props.color || "#ffffff"} onChange={e=>handleChange("color", e.target.value)} />
          <label>Padding</label>
          <input value={props.padding || "8px 14px"} onChange={e=>handleChange("padding", e.target.value)} />
        </>
      )}

      {node.type === "image" && (
        <>
          <label>URL الصورة</label>
          <input value={props.src || ""} onChange={e=>handleChange("src", e.target.value)} />
          <label>العرض (px)</label>
          <input type="number" value={props.width || 300} onChange={e=>handleChange("width", Number(e.target.value))} />
        </>
      )}

      {node.type === "container" && (
        <>
          <label>خلفية</label>
          <input type="color" value={props.background || "#ffffff"} onChange={e=>handleChange("background", e.target.value)} />
          <label>Padding (px)</label>
          <input type="number" value={props.padding || 12} onChange={e=>handleChange("padding", Number(e.target.value))} />
          <label>Min Height (px)</label>
          <input type="number" value={props.minHeight || 40} onChange={e=>handleChange("minHeight", Number(e.target.value))} />
        </>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={()=>navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(node, null, 2))}>نسخ JSON</button>
      </div>
    </div>
  );
}
