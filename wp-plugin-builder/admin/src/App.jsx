import React from "react";
import { ThemeProvider } from "@/context/ThemeContext"; 
import Dashboard from "./Dashboard"; // لم نغيّر أي وظائف
import ProjectsGrid from "@/components/ProjectsGrid";
import NewProjectModal from "@/components/NewProjectModal";
import { listProjects } from "@/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
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
    search
      ? p.name.toLowerCase().includes(search.toLowerCase())
      : true
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
        <div style={{ flex: 1 }}>
          <h3>المشاريع</h3>
          <ProjectsGrid projects={visible} onOpen={openProject} onDelete={handleDelete} />
        </div>
      </div>

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
