import React, { useState } from "react";
import { newProject } from "@/api";

export default function NewProjectBox({ onCreateSuccess }) {
  const [name, setName] = useState("");

  async function handleCreate() {
    const projectName = (name && name.trim()) || "Untitled";

    try {
      const res = await newProject(projectName);

      if (res && res.project) {
        setName("");
        if (onCreateSuccess) onCreateSuccess(res.project);
      } else {
        alert("خطأ في إنشاء المشروع");
      }
    } catch (e) {
      console.error(e);
      alert("خطأ في الاتصال بالخادم");
    }
  }

  return (
    <div style={{ padding: 15, background: "#fff", borderRadius: 8 }}>
      <h3>إنشاء مشروع جديد</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اسم المشروع"
        style={{
          width: "100%",
          padding: 8,
          marginTop: 10,
          marginBottom: 10,
        }}
      />
      <button
        onClick={handleCreate}
        style={{
          padding: "8px 12px",
          background: "#0073aa",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        إنشاء
      </button>
    </div>
  );
}
