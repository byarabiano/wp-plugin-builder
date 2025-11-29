import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import "../../styles/editor.css";

import 'monaco-editor/esm/vs/basic-languages/php/php.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js';
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution.js';
import 'monaco-editor/esm/vs/language/json/monaco.contribution.js';

/* ============================================================
   Monaco Worker (Safe inline worker for WordPress admin)
============================================================ */
self.MonacoEnvironment = {
    getWorker() {
        const code = `self.onmessage = () => {};`;
        const blob = new Blob([code], { type: "application/javascript" });
        return new Worker(URL.createObjectURL(blob));
    },
};

export default function CodeEditor({ path, file = {}, onChange }) {
    const containerRef = useRef(null);
    const editorRef = useRef(null);
    const modelRef = useRef(null);
    const [theme, setTheme] = useState("dark");
    const [isFullscreen, setIsFullscreen] = useState(false);

    /* ============================================================
       Handle editor creation on mount + file switching
    ============================================================= */
    useEffect(() => {
        if (!containerRef.current) return;

        // If existing model exists, dispose
        if (modelRef.current) {
            modelRef.current.dispose();
            modelRef.current = null;
        }

        // Create new model
        const lang = detectLanguage(path);
        modelRef.current = monaco.editor.createModel(file?.content || "", lang);

        // Create editor only once
        if (!editorRef.current) {
            editorRef.current = monaco.editor.create(containerRef.current, {
                theme: theme === "dark" ? "vs-dark" : "vs",
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                scrollBeyondLastLine: false,
            });
        }

        editorRef.current.setModel(modelRef.current);

        const sub = modelRef.current.onDidChangeContent(() => {
            if (onChange) onChange(path, modelRef.current.getValue());
        });

        return () => {
            sub.dispose();
        };
    }, [path]);

    /* ============================================================
       Apply theme
    ============================================================= */
    useEffect(() => {
        monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs");
    }, [theme]);

    /* ============================================================
       Sync external content updates
    ============================================================= */
    useEffect(() => {
        if (!editorRef.current || !modelRef.current) return;
        const incoming = file?.content || "";
        if (incoming !== modelRef.current.getValue()) {
            const range = modelRef.current.getFullModelRange();
            modelRef.current.pushEditOperations([], [{ range, text: incoming }], () => null);
        }
    }, [file?.content]);

    /* ============================================================
       Fullscreen handling
    ============================================================= */
    useEffect(() => {
        const wrapper = containerRef.current?.parentElement?.parentElement;
        if (!wrapper) return;

        if (isFullscreen) {
            wrapper.classList.add("wpb-fullscreen");
            document.body.style.overflow = "hidden";
        } else {
            wrapper.classList.remove("wpb-fullscreen");
            document.body.style.overflow = "";
        }

        setTimeout(() => editorRef.current?.layout(), 60);
    }, [isFullscreen]);

    return (
        <div className="wpb-codeeditor-wrapper" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div className="wpb-codeeditor-toolbar">
                <div>{path}</div>

                <div style={{ display: "flex", gap: 8 }}>
                    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>

                    <button onClick={() => setIsFullscreen((v) => !v)}>
                        ⛶
                    </button>
                </div>
            </div>

            <div ref={containerRef} style={{ flex: 1, minHeight: 0 }} />

            <style>{`
                .wpb-editor-canvas > div { height: 100% !important; }
            `}</style>
        </div>
    );
}

function detectLanguage(file) {
    if (!file) return "plaintext";
    const ext = file.split(".").pop().toLowerCase();
    switch (ext) {
        case "php": return "php";
        case "js": return "javascript";
        case "jsx": return "javascript";
        case "ts": return "typescript";
        case "json": return "json";
        case "css": return "css";
        default: return "plaintext";
    }
}
