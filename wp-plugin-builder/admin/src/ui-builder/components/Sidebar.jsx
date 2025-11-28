// admin/src/ui-builder/components/Sidebar.jsx

import React from "react";
import DraggableButton from "./elements/DraggableButton";

export default function Sidebar() {
    return (
        <div>
            <h3 style={{ marginBottom: "10px" }}>elements</h3>

            {/* أول عنصر: Button */}
            <DraggableButton />
        </div>
    );
}
