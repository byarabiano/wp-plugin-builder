import React, { useState } from 'react'
import { newProject } from '../api'

export default function NewProjectModal({ visible, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    try {
      const res = await newProject(name || 'Untitled')
      if (res && res.project) {
        setName('')
        if (onCreated) onCreated(res.project)
        if (onClose) onClose()
      } else {
        alert('فشل في إنشاء المشروع')
      }
    } catch (e) {
      console.error(e)
      alert('خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>إنشاء مشروع جديد</h3>
        <input placeholder="اسم المشروع" value={name} onChange={e=>setName(e.target.value)} style={{padding:8, width:'100%', marginBottom:12}} />
        <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
          <button onClick={onClose} style={btnSecondary}>إلغاء</button>
          <button onClick={handleCreate} style={btnPrimary} disabled={loading}>{loading ? 'إنشاء...' : 'إنشاء'}</button>
        </div>
      </div>
    </div>
  )
}

const overlay = {
  position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999
}
const modal = { background:'#fff', padding:20, borderRadius:8, width:420, boxShadow:'0 8px 24px rgba(0,0,0,0.12)' }
const btnPrimary = { background:'#0073aa', color:'#fff', border:'none', padding:'8px 12px', borderRadius:6, cursor:'pointer' }
const btnSecondary = { background:'#f1f1f1', border:'none', padding:'8px 12px', borderRadius:6, cursor:'pointer' }
