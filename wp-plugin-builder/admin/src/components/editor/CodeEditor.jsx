// admin/src/components/editor/CodeEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import "../../styles/editor.css";

/*
  Custom CodeEditor with:
   - Monaco integration (via monaco-editor package)
   - Theme toggle (dark/light)
   - Fullscreen toggle
   - File path display
*/

// minimal languages (monaco should include them via package install)
import "monaco-editor/esm/vs/basic-languages/php/php.contribution";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/css/css.contribution";
import "monaco-editor/esm/vs/basic-languages/json/json.contribution";
import "monaco-editor/esm/vs/editor/editor.api";

// Inline fallback worker to avoid external worker files in WP admin.
// Note: this is a minimal worker — advanced language features may need proper workers.
self.MonacoEnvironment = {
  getWorker(_, label) {
    const code = `self.onmessage = function() { /* noop worker */ }`;
    const blob = new Blob([code], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    return new Worker(url);
  },
};

export default function CodeEditor({ path, file = {}, onChange }) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const [theme, setTheme] = useState("dark"); // "dark" | "light"
  const [isFullscreen, setIsFullscreen] = useState(false);

  // create/dispose editor when container mounts or file path changes
  useEffect(() => {
    if (!containerRef.current) return;

    // dispose previous
    if (editorRef.current) {
      editorRef.current.dispose();
      editorRef.current = null;
    }

    const language = detectLanguage(path);
    const model = monaco.editor.createModel(file?.content || "", language);

    editorRef.current = monaco.editor.create(containerRef.current, {
      model,
      theme: theme === "dark" ? "vs-dark" : "vs",
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: false },
      wordWrap: "on",
      tabSize: 2,
      scrollBeyondLastLine: false,
      // editorWordWrap: "bounded",
    });

    // notify parent on content change
    const sub = model.onDidChangeContent(() => {
      if (onChange) onChange(path, model.getValue());
    });

    return () => {
      try { sub.dispose(); } catch(e){/*ignore*/ }
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
      if (model) model.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  // update theme
  useEffect(() => {
    monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs");
    // set BODY class to control CSS variables as well
    if (theme === "light") document.body.classList.add("wpb-theme--light");
    else document.body.classList.remove("wpb-theme--light");
  }, [theme]);

  // update external changes to file content
  useEffect(() => {
    if (!editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;
    const incoming = file?.content || "";
    if (incoming !== model.getValue()) {
      const selection = editorRef.current.getSelection();
      model.pushEditOperations([], [{ range: model.getFullModelRange(), text: incoming }], () => null);
      if (selection) editorRef.current.setSelection(selection);
    }
  }, [file?.content]);

  // fullscreen handling
  useEffect(() => {
    const el = containerRef.current?.parentElement?.parentElement; // wrapper
    if (!el) return;

    if (isFullscreen) {
      el.classList.add("wpb-fullscreen");
      // prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      el.classList.remove("wpb-fullscreen");
      document.body.style.overflow = "";
    }

    setTimeout(() => {
      if (editorRef.current) editorRef.current.layout();
    }, 60);

    const onKey = (e) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isFullscreen]);

  function toggleTheme() {
    setTheme(t => (t === "dark" ? "light" : "dark"));
  }

  function toggleFullscreen() {
    setIsFullscreen(f => !f);
  }

  return (
    <div className="wpb-codeeditor-wrapper" style={{ display: "flex", flexDirection: "column" }}>
      <div className="wpb-codeeditor-toolbar">
        <div className="left">
          <div className="wpb-current-path">{path || "بدون ملف"}</div>
        </div>

        <div style={{display:"flex", gap:8, alignItems:"center"}}>
          <select className="wpb-theme-select" value={theme} onChange={e=>setTheme(e.target.value)}>
            <option value="dark">Dark (افتراضي)</option>
            <option value="light">Light</option>
          </select>

          <button className="wpb-toolbar-btn" onClick={toggleFullscreen} title="Fullscreen (Esc to exit)">
            ⛶
          </button>
        </div>
      </div>

      <div className="wpb-editor-canvas" ref={containerRef} />

      {/* inline minimal CSS for quick tweaks (keeps file cohesive) */}
      <style>{`
        /* ensure Monaco container fills available area */
        .wpb-editor-canvas > div { height: 100% !important; }
      `}</style>
    </div>
  );
}

function detectLanguage(filename){
  if(!filename) return "php";
  const ext = filename.split(".").pop().toLowerCase();
  switch(ext){
    case "php": return "php";
    case "js": return "javascript";
    case "jsx": return "javascript";
    case "ts": return "typescript";
    case "css": return "css";
    case "json": return "json";
    default: return "plaintext";
  }
}
