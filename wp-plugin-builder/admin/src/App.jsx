import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import ProjectsGrid from "@/components/ProjectsGrid";
import NewProjectModal from "@/components/NewProjectModal";
import HeaderBar from "@/components/HeaderBar";

// الصفحة الجديدة
import UIBuilder from "@/components/UIBuilder";

// مكوّن إنشاء المشاريع القديم (بعد التعديل)
import NewProjectBox from "@/components/NewProjectBox";

// API
import { listProjects } from "@/api";

// صفحة تحرير المشروع الحالية
import ProjectEditor from "@/pages/ProjectEditor";


/* ---------------------- Dashboard Page ---------------------- */

function DashboardPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await listProjects();
      setProjects(res.projects || []);
    } finally {
      setLoading(false);
    }
  }

  function openProject(p) {
    navigate(`/project/${p.id}`);
  }

  function handleDelete(p) {
    if (!confirm(`حذف المشروع "${p.name}" ؟`)) return;
    setProjects(prev => prev.filter(x => x.id !== p.id));
  }

  const visible = projects.filter((p) =>
    search ? p.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div style={{ direction: "rtl", padding: 20 }}>
      <HeaderBar
        onOpenNew={() => setShowNew(true)}
        onSearch={(q) => setSearch(q)}
        searchValue={search}
        setSearchValue={setSearch}
      />

      <div style={{ display: "flex", gap: 20 }}>
        {/* جزء المشاريع */}
        <div style={{ flex: 3 }}>
          <h3>المشاريع</h3>
          <ProjectsGrid
            projects={visible}
            onOpen={openProject}
            onDelete={handleDelete}
          />
        </div>

        {/* جزء إنشاء مشروع جديد */}
        <div style={{ flex: 1 }}>
          <NewProjectBox />
        </div>
      </div>

      {/* نافذة مشروع جديد */}
      <NewProjectModal
        visible={showNew}
        onClose={() => setShowNew(false)}
        onCreated={(proj) => {
          fetchProjects();
          setActiveProject(proj);
        }}
      />
    </div>
  );
}


/* ---------------------- Root App ---------------------- */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* الصفحة الرئيسية (Dashboard الجديد) */}
        <Route path="/" element={<DashboardPage />} />

        {/* صفحة محرر المشروع الحالي */}
        <Route path="/project/:id" element={<ProjectEditor />} />

        {/* صفحة محرر الواجهة الجديد (UI Builder) */}
        <Route path="/builder" element={<UIBuilder />} />

      </Routes>
    </BrowserRouter>
  );
}
