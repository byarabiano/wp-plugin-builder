// admin/src/ui-builder/components/ElementButton.jsx
import React from "react";
import { useDrag } from "react-dnd";

export default function ElementButton({ element }) {
  // drag item type NEW_ELEMENT with payload { type, defaultProps }
  const [, drag] = useDrag({
    type: "NEW_ELEMENT",
    item: { elementType: element.type, defaultProps: element.defaultProps },
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  });

  return (
    <div ref={drag} className="ui-lib-btn" style={{ cursor: "grab" }}>
      ➕ {element.label}
    </div>
  );
}
