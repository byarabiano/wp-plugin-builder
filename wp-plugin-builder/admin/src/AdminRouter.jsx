import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./App";
import ProjectEditor from "./pages/ProjectEditor";

export default function AdminRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/project/:id" element={<ProjectEditor />} />
      </Routes>
    </BrowserRouter>
  );
}
