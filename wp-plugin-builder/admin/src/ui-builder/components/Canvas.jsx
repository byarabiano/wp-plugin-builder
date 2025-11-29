// admin/src/ui-builder/components/Canvas.jsx

import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { ELEMENT_TYPES } from "./elements/DraggableButton";

export default function Canvas() {
    const [elements, setElements] = useState([]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: Object.values(ELEMENT_TYPES),
        drop: (item, monitor) => {
            const offset = monitor.getClientOffset();
            addElement(item.type, offset);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    const addElement = (type, position) => {
        setElements((prev) => [
            ...prev,
            {
                id: Date.now(),
                type,
                x: position.x,
                y: position.y,
            },
        ]);
    };

    return (
        <div
            ref={drop}
            style={{
                width: "100%",
                height: "100%",
                border: "2px dashed #bbb",
                margin: "10px",
                borderRadius: "10px",
                background: isOver ? "#e0f7ff" : "#fff",
                position: "relative",
                overflow: "auto",
            }}
        >
            {elements.map((el) => {
                if (el.type === ELEMENT_TYPES.BUTTON) {
                    return (
                        <button
                            key={el.id}
                            style={{
                                position: "absolute",
                                left: el.x - 250, // تعديل لتتناسب مع sidebar
                                top: el.y - 80,
                                padding: "8px 15px",
                                background: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                            }}
                        >
                            Button
                        </button>
                    );
                }
                return null;
            })}

            {elements.length === 0 && (
                <div
                    style={{
                        color: "#666",
                        textAlign: "center",
                        marginTop: "40px",
                    }}
                >
                    اسحب العناصر إلى هنا
                </div>
            )}
        </div>
    );
}
