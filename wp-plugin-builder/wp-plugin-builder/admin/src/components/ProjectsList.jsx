import React from 'react'

export default function ProjectsList({ projects = [], loading, onOpen }) {
  if (loading) return <div>جاري التحميل...</div>
  if (!projects.length) return <div>لا توجد مشاريع حتى الآن.</div>

  return (
    <div>
      <h3>المشاريع</h3>
      <div>
        {projects.map(p => (
          <div key={p.id} className="wpb-list-item">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <strong>{p.name}</strong>
                <div style={{fontSize:12, color:'#666'}}>ID: {p.id}</div>
              </div>
              <div>
                <button onClick={()=>onOpen(p)} style={{marginLeft:8}}>فتح</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
