import React from 'react'
import ProjectCard from './ProjectCard'

export default function ProjectsGrid({ projects = [], onOpen, onDelete }) {
  if (!projects || !projects.length) {
    return (
      <div style={{padding:20, border:'1px dashed #e6e6e6', borderRadius:8}}>
        <p style={{margin:0}}>لا توجد مشاريع حتى الآن. أنشئ مشروعًا جديدًا لبدء العمل.</p>
      </div>
    )
  }

  return (
    <div style={gridStyle}>
      {projects.map(p => (
        <ProjectCard key={p.id} project={p} onOpen={onOpen} onDelete={onDelete} />
      ))}
    </div>
  )
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: 16
}
