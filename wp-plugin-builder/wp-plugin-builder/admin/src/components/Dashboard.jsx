import React, { useState } from 'react'
import { newProject } from '../api'

export default function Dashboard({ onCreateSuccess }) {
  const [name, setName] = useState('')

  async function handleCreate() {
    const n = (name && name.trim()) || 'Untitled'
    try {
      const res = await newProject(n)
      if (res && res.project) {
        setName('')
        if (onCreateSuccess) onCreateSuccess(res.project)
      } else {
        alert('خطأ في إنشاء المشروع')
      }
    } catch (e) {
      console.error(e)
      alert('خطأ في الاتصال بالخادم')
    }
  }

  return (
    <div>
      <h3>إنشاء مشروع جديد</h3>
      <div style={{display:'flex', gap:8}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="اسم المشروع" style={{flex:1, padding:8}} />
        <button onClick={handleCreate} style={{padding:'8px 12px'}}>إنشاء</button>
      </div>
    </div>
  )
}
