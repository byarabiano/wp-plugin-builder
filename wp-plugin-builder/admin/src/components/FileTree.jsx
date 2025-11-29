import React, { useState } from "react";

/* ============================================================
   Helper: Build folder tree from flat object
============================================================ */
function buildTree(files = {}) {
    const root = {};

    Object.keys(files).forEach((fullPath) => {
        const parts = fullPath.split("/");
        let level = root;

        parts.forEach((part, index) => {
            if (!level[part]) {
                level[part] = {
                    __isFile: index === parts.length - 1,
                    __path: fullPath,
                    children: {},
                };
            }
            level = level[part].children;
        });
    });

    return root;
}

function TreeNode({ name, node, activeFile, onSelect }) {
    const [open, setOpen] = useState(true);

    const isFile = node.__isFile;
    const fullPath = node.__path;
    const isActive = activeFile === fullPath;

    /* ================================
       File Node
    ================================= */
    if (isFile) {
        return (
            <div
                className={`wpb-file ${isActive ? "active" : ""}`}
                onClick={() => onSelect(fullPath)}
                style={{
                    padding: "4px 10px",
                    cursor: "pointer",
                    background: isActive ? "#e4f1ff" : "transparent",
                }}
            >
                📄 {name}
            </div>
        );
    }

    /* ================================
       Folder Node
    ================================= */
    const childNames = Object.keys(node.children);

    return (
        <div className="wpb-folder-wrapper" style={{ marginBottom: 4 }}>
            <div
                className="wpb-folder"
                onClick={() => setOpen(!open)}
                style={{
                    cursor: "pointer",
                    padding: "4px 10px",
                    userSelect: "none",
                }}
            >
                {open ? "📂" : "📁"} {name}
            </div>

            {open && (
                <div
                    className="wpb-folder-children"
                    style={{ paddingLeft: 15, borderLeft: "1px dashed #ddd" }}
                >
                    {childNames.map((child) => (
                        <TreeNode
                            key={child}
                            name={child}
                            node={node.children[child]}
                            activeFile={activeFile}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ============================================================
   Root Component
============================================================ */
export default function FileTree({ files, activeFile, onSelectFile }) {
    const tree = buildTree(files);

    return (
        <div className="wpb-filetree" style={{ padding: 10 }}>
            {Object.keys(tree).map((name) => (
                <TreeNode
                    key={name}
                    name={name}
                    node={tree[name]}
                    activeFile={activeFile}
                    onSelect={onSelectFile}
                />
            ))}
        </div>
    );
}
