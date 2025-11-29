// Layer to manage projects (localStorage for now)
// Later can be replaced with WordPress REST API without touching UI code

const KEY = "wpb_projects";

// Read all projects
export function listProjects() {
  const raw = localStorage.getItem(KEY);
  const projects = raw ? JSON.parse(raw) : [];
  return { projects };
}

// Save all projects
function saveProjects(projects) {
  localStorage.setItem(KEY, JSON.stringify(projects));
}

// Generate unique ID
function uid() {
  return "p_" + Math.random().toString(36).substr(2, 9);
}

// Create new project
export function newProject(name) {
  const raw = localStorage.getItem(KEY);
  const projects = raw ? JSON.parse(raw) : [];

  const project = {
    id: uid(),
    name,
    date: new Date().toISOString(),
    updated: new Date().toISOString(),
    files: [],      // سيتم استخدامها لاحقًا في محرر المشروع
    settings: {},   // إعدادات المشروع لاحقًا
  };

  projects.push(project);
  saveProjects(projects);

  return { project };
}

// Delete a project
export function deleteProject(id) {
  const raw = localStorage.getItem(KEY);
  const projects = raw ? JSON.parse(raw) : [];

  const filtered = projects.filter(p => p.id !== id);
  saveProjects(filtered);

  return { success: true };
}

// Find project by ID
export function getProject(id) {
  const raw = localStorage.getItem(KEY);
  const projects = raw ? JSON.parse(raw) : [];
  const project = projects.find(p => p.id === id) || null;
  return { project };
}

// Update project (rename, update settings, update files...)
export function updateProject(id, data) {
  const raw = localStorage.getItem(KEY);
  const projects = raw ? JSON.parse(raw) : [];

  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return { error: "not_found" };

  projects[idx] = {
    ...projects[idx],
    ...data,
    updated: new Date().toISOString(),
  };

  saveProjects(projects);

  return { project: projects[idx] };
}
