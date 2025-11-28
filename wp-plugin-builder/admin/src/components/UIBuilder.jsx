// admin/src/pages/UIBuilder.jsx

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Sidebar from "../ui-builder/components/Sidebar";
import Canvas from "../ui-builder/components/Canvas";

export default function UIBuilder() {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="ui-builder-container" style={styles.container}>

                {/* Sidebar */}
                <div style={styles.sidebar}>
                    <Sidebar />
                </div>

                {/* Canvas */}
                <div style={styles.canvas}>
                    <Canvas />
                </div>

            </div>
        </DndProvider>
    );
}

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        background: "#f5f5f7",
    },
    sidebar: {
        width: "280px",
        background: "#ffffff",
        borderRight: "1px solid #ddd",
        padding: "15px",
        overflowY: "auto",
    },
    canvas: {
        flex: 1,
        background: "#fafafa",
        position: "relative",
        overflow: "auto",
    },
};
