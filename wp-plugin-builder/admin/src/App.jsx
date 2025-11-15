import React, { useEffect, useState } from 'react'
import HeaderBar from './components/HeaderBar'
import ProjectsGrid from './components/ProjectsGrid'
import NewProjectModal from './components/NewProjectModal'
import { listProjects } from './api'

export default function App() {
  const [projects, setProjects] = useState([])
  const [activeProject, setActiveProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(()=> { fetchProjects() }, [])

  async function fetchProjects() {
    setLoading(true)
    try {
      const res = await listProjects()
      setProjects(res.projects || [])
    } catch (e) {
      console.error(e)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  function handleOpen(p) {
    // افتح المحرر (نستعمل modal أو نافذة جانبية لاحقاً)
    setActiveProject(p)
    // نحمّل المشروع الكامل في ProjectEditor لاحقاً (حالما نبنيه)
  }

  async function handleDelete(p) {
    // مسح بسيط من الواجهة فقط (الخلفية غير مفعّلة بعد)
    if (!confirm('هل تريد حذف المشروع "' + p.name + '"؟')) return
    // سنحذف محلياً من القائمة (يمكننا إضافة endpoint حذف لاحقاً)
    setProjects(prev => prev.filter(x => x.id !== p.id))
    // أيضاً إزالة من options لو رغبت - لكن الآن نتركها متاحة للتطوير
  }

  // Search filter
  const visible = projects.filter(p => {
    if (!search) return true
    return (p.name || '').toLowerCase().includes(search.toLowerCase()) || (p.id || '').toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div style={{direction:'rtl', fontFamily:'Arial, sans-serif', padding: 20}}>
      <HeaderBar
        onOpenNew={() => setShowNew(true)}
        onSearch={(q)=>setSearch(q)}
        searchValue={search}
        setSearchValue={setSearch}
      />

      <div style={{display:'flex', gap:20}}>
        <div style={{flex:1}}>
          <h3>المشاريع</h3>
          <ProjectsGrid projects={visible} onOpen={handleOpen} onDelete={handleDelete} />
        </div>

        <div style={{width:480}}>
          <div style={{padding:16, border:'1px solid #eee', borderRadius:8, background:'#fafafa'}}>
            <h3>معلومات المشروع</h3>
            {activeProject ? (
              <div>
                <div><strong>الاسم:</strong> {activeProject.name}</div>
                <div style={{fontSize:12, color:'#666'}}>ID: {activeProject.id}</div>
                <div style={{marginTop:12}}>
                  <button onClick={()=>alert('ننتقل الآن إلى محرر المشروع (خطوة لاحقة)')} style={{padding:'8px 10px'}}>فتح المحرر</button>
                </div>
              </div>
            ) : (
              <div>اختر مشروعًا من اليسار لعرض التفاصيل.</div>
            )}
          </div>

          <div style={{marginTop:12, padding:12, border:'1px solid #eee', borderRadius:8}}>
            <h4>Quick Actions</h4>
            <div style={{display:'flex', gap:8}}>
              <button onClick={()=>setShowNew(true)} style={{padding:'8px 10px'}}>مشروع جديد</button>
              <button onClick={()=>alert('Export سيتم إضافته لاحقاً')} style={{padding:'8px 10px'}}>تصدير</button>
            </div>
          </div>

        </div>
      </div>

      <NewProjectModal
        visible={showNew}
        onClose={()=>setShowNew(false)}
        onCreated={(proj)=>{
          fetchProjects()
          setActiveProject(proj)
        }}
      />
    </div>
  )
}
