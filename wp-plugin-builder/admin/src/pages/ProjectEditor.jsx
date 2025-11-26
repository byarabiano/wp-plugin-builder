import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Tabs from "../components/Tabs";
import FileTree from "../components/FileTree";
import CodeEditor from "../components/editor/CodeEditor";
import SettingsTab from "../components/SettingsTab";
import ExportTab from "../components/ExportTab";

import {
    loadProject,
    saveProject
} from "../api";
import { createDefaultStructure } from "../api/projects";

export default function ProjectEditor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [activeTab, setActiveTab] = useState("editor");
    const [activeFile, setActiveFile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load project on mount
    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await loadProject(id);

                if (!res || !res.success || !res.project) {
                    alert("المشروع غير موجود");
                    navigate("/");
                    return;
                }

                let data = res.project.data || {};

                // Normalize structure
                if (!data.files || typeof data.files !== "object") {
                    data.files = createDefaultStructure(res.project.name);
                }

                if (!data.info) data.info = {};

                setProject({
                    id: res.project.id,
                    name: res.project.name,
                    created: res.project.created,
                    modified: res.project.modified,
                    info: data.info,
                    files: data.files,
                });

                const fileList = Object.keys(data.files);
                if (fileList.length) setActiveFile(fileList[0]);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id]);

    // Save file content
    const updateFileContent = useCallback(
        (path, content) => {
            setProject((prev) => ({
                ...prev,
                files: {
                    ...prev.files,
                    [path]: { ...prev.files[path], content },
                },
            }));
        },
        []
    );

    // Save project to backend
    const handleSave = async () => {
        if (!project) return;

        const payload = {
            info: project.info,
            files: project.files,
        };

        const res = await saveProject(project.id, payload);

        if (res && res.success) {
            alert("تم حفظ المشروع بنجاح");
        } else {
            alert("خطأ أثناء الحفظ");
        }
    };

    if (loading || !project) {
        return (
            <div style={{ padding: 30, fontSize: 18 }}>
                ⏳ جاري تحميل المشروع...
            </div>
        );
    }

    return (
        <div className="wpb-editor-container" style={{ direction: "rtl" }}>
            {/* ======= Header Bar ======= */}
            <div className="wpb-editor-header" style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 20px",
                background: "#fff",
                borderBottom: "1px solid #eee",
                alignItems: "center"
            }}>
                
                <div className="wpb-editor-title" style={{ fontSize: 20, fontWeight: 700 }}>
                    {project.name}
                    <span style={{ color: "#888", fontSize: 14 }}>
                        {"  "} (ID: {project.id})
                    </span>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <button className="wpb-btn wpb-save" onClick={handleSave}>
                        💾 حفظ المشروع
                    </button>

                    <button
                        className="wpb-btn wpb-back"
                        onClick={() => navigate("/")}
                    >
                        ⬅ عودة للوحة التحكم
                    </button>
                </div>
            </div>

            {/* ======= Tabs ======= */}
            <Tabs
                active={activeTab}
                onChange={setActiveTab}
                tabs={[
                    { id: "editor", label: "المحرر" },
                    { id: "settings", label: "الإعدادات" },
                    { id: "export", label: "التصدير" },
                ]}
            />

            <div className="wpb-editor-body" style={{ display: "flex", height: "calc(100vh - 140px)" }}>
                
                {/* ====== Sidebar: File Tree ====== */}
                {activeTab === "editor" && (
                    <div style={{
                        width: 260,
                        borderRight: "1px solid #eee",
                        overflowY: "auto",
                        background: "#fafafa",
                    }}>
                        <FileTree
                            files={project.files}
                            activeFile={activeFile}
                            onSelectFile={setActiveFile}
                        />
                    </div>
                )}

                {/* ====== Main Content ====== */}
                <div style={{ flex: 1, padding: 10 }}>
                    {activeTab === "editor" && activeFile && (
                        <CodeEditor
                            path={activeFile}
                            file={project.files[activeFile]}
                            onChange={updateFileContent}
                        />
                    )}

                    {activeTab === "settings" && (
                        <SettingsTab project={project} setProject={setProject} />
                    )}

                    {activeTab === "export" && (
                        <ExportTab project={project} />
                    )}
                </div>
            </div>
        </div>
    );
}
