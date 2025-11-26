import React, { useState } from "react";

// تحويل Object مسطح لشجرة مجلدات (Folder Tree)
function buildTree(files) {
    const root = {};

    Object.keys(files).forEach((path) => {
        const parts = path.split("/");
        let current = root;

        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = {
                    __isFile: index === parts.length - 1,
                    __path: path,
                    children: {},
                };
            }
            current = current[part].children;
        });
    });

    return root;
}

function TreeNode({ name, node, activeFile, onSelect }) {
    const [open, setOpen] = useState(true);

    const isFile = node.__isFile;
    const fullPath = node.__path;

    const isActive = activeFile === fullPath;

    // ملف
    if (isFile) {
        return (
            <div
                className={"wpb-file " + (isActive ? "active" : "")}
                onClick={() => onSelect(fullPath)}
            >
                📄 {name}
            </div>
        );
    }

    // مجلد
    return (
        <div className="wpb-folder-wrapper">
            <div className="wpb-folder" onClick={() => setOpen(!open)}>
                {open ? "📂" : "📁"} {name}
            </div>

            {open && (
                <div className="wpb-folder-children">
                    {Object.keys(node.children).map((childName) => (
                        <TreeNode
                            key={childName}
                            name={childName}
                            node={node.children[childName]}
                            activeFile={activeFile}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FileTree({ files, activeFile, onSelectFile }) {
    const tree = buildTree(files);

    return (
        <div className="wpb-filetree">
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
