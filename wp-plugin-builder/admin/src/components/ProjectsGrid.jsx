import React from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid({ projects = [], onOpen, onDelete }) {
  if (!projects || projects.length === 0) {
    return (
      <div style={emptyBox}>
        <p style={{ margin: 0, fontSize: 15 }}>
          لا توجد مشاريع حتى الآن.  
          <br />
          اضغط على “مشروع جديد” لبدء أول مشروع لك.
        </p>
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      {projects.map((project, i) => (
        <div key={project.id} style={{ animation: `fadeIn .3s ease ${i * 0.05}s both` }}>
          <ProjectCard
            project={project}
            onOpen={onOpen}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

// عندما لا توجد مشاريع
const emptyBox = {
  padding: 30,
  border: "1px dashed #ddd",
  borderRadius: 10,
  textAlign: "center",
  background: "#fafafa",
};

// شبكة العرض
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 20,
  marginTop: 20,
};
