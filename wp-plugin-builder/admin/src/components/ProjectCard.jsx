import React from 'react'

export default function ProjectCard({ project, onOpen, onDelete }) {
  const created = project.created ? new Date(project.created).toLocaleString() : ''
  return (
    <div className="wpb-card">
      <div className="wpb-card-head">
        <div className="wpb-card-title">{project.name}</div>
        <div className="wpb-card-id">ID: {project.id}</div>
      </div>

      <div className="wpb-card-body">
        <div className="wpb-card-meta">Created: {created}</div>
        <div className="wpb-card-actions">
          <button onClick={()=>onOpen(project)} className="wpb-btn wbp-open">فتح</button>
          <button onClick={()=>onDelete(project)} className="wpb-btn wbp-delete">حذف</button>
        </div>
      </div>
    </div>
  )
}
