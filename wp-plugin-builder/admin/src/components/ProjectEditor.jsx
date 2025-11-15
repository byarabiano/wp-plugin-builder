import React, { useEffect, useState } from 'react'
import { loadProject, saveProject } from '../api'

export default function ProjectEditor({ project, onSaved }) {
  const [data, setData] = useState(project.data || {})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // إذا الكائن project هو مجرد ميتاداتا (من list) فحمِّله من API بالكامل
    let mounted = true
    async function fetchFull() {
      if (!project || !project.id) return
      setLoading(true)
      try {
        const res = await loadProject(project.id)
        if (res && res.project) {
          if (mounted) setData(res.project.data || {})
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchFull()
    return ()=> mounted = false
  }, [project])

  async function handleSave() {
    try {
      const res = await saveProject(project.id, data)
      if (res && res.success) {
        alert('تم حفظ المشروع')
        if (onSaved) onSaved()
      } else {
        alert('فشل الحفظ')
      }
    } catch (e) {
      console.error(e)
      alert('خطأ أثناء الحفظ')
    }
  }

  return (
    <div>
      <h2>محرر المشروع: {project.name}</h2>
      {loading ? <div>جاري التحميل...</div> : (
        <div>
          <div style={{marginBottom:12}}>
            <label> JSON بيانات المشروع (مبدئياً)</label>
            <textarea
              style={{width:'100%', minHeight:300, padding:10, fontFamily:'monospace'}}
              value={JSON.stringify(data, null, 2)}
              onChange={e=>{
                try {
                  const parsed = JSON.parse(e.target.value)
                  setData(parsed)
                } catch (err) {
                  // لا نقطع التغيير — نترك النص كما هو حتى المستخدم يصلحه
                  setData(e.target.value)
                }
              }}
            />
          </div>

          <div style={{display:'flex', gap:10}}>
            <button onClick={handleSave}>حفظ المشروع</button>
          </div>
        </div>
      )}
    </div>
  )
}
