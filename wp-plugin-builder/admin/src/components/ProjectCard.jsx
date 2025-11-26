import React from "react";

export default function ProjectCard({ project, onOpen, onDelete }) {
  if (!project) return null;

  const created = project.date
    ? new Date(project.date).toLocaleString()
    : "غير معروف";

  const updated = project.updated
    ? new Date(project.updated).toLocaleString()
    : created;

  return (
    <div className="wpb-card">
      <div className="wpb-card-head">
        <div className="wpb-card-title">{project.name}</div>
        <div className="wpb-card-id">ID: {project.id}</div>
      </div>

      <div className="wpb-card-body">
        <div className="wpb-card-meta">
          <div>تاريخ الإنشاء: {created}</div>
          <div>آخر تعديل: {updated}</div>
        </div>

        <div className="wpb-card-actions">
          <button onClick={() => onOpen(project)} className="wpb-btn wpb-open">
            فتح
          </button>
          <button
            onClick={() => onDelete(project)}
            className="wpb-btn wpb-delete"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
