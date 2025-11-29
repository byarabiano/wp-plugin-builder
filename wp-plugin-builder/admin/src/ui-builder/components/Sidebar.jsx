// admin/src/ui-builder/components/Sidebar.jsx
import React from "react";
import { ELEMENT_LIBRARY } from "../element-library";
import ElementButton from "./ElementButton";

export default function Sidebar() {
  return (
    <div style={{ paddingBottom: 40 }}>
      <h3 style={{ marginTop: 0 }}>مكتبة العناصر</h3>

      {ELEMENT_LIBRARY.map((el) => (
        <ElementButton key={el.type} element={el} />
      ))}

      <hr style={{ margin: "12px 0" }} />
      <div style={{ color: "#666", fontSize: 13 }}>
        اسحب العنصر إلى اللوحة (Canvas) لإضافته.
      </div>
    </div>
  );
}
