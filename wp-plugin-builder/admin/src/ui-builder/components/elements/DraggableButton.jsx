// admin/src/ui-builder/components/elements/DraggableButton.jsx

import React from "react";
import { useDrag } from "react-dnd";

export const ELEMENT_TYPES = {
    BUTTON: "button",
};

export default function DraggableButton() {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ELEMENT_TYPES.BUTTON,
        item: { type: ELEMENT_TYPES.BUTTON },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            style={{
                padding: "10px 15px",
                background: "#007bff",
                color: "#fff",
                borderRadius: "5px",
                textAlign: "center",
                cursor: "grab",
                opacity: isDragging ? 0.4 : 1,
                marginBottom: "10px",
            }}
        >
            Button
        </div>
    );
}
