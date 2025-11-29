// admin/src/ui-builder/components/DroppableArea.jsx
import React from "react";
import { useDrop } from "react-dnd";
import { useEditorStore } from "../hooks/useEditorStore";
import DraggableElement from "./DraggableElement";

/**
 * Canvas: droppable root area
 * Accepts:
 * - NEW_ELEMENT  -> add to root
 * - ELEMENT      -> move existing node to root / reorder (simple append)
 */

export default function DroppableArea() {
  const elements = useEditorStore(s => s.elements);
  const addFromLib = useEditorStore(s => s.addElementFromLibrary);
  const moveNode = useEditorStore(s => s.moveNode);

  const [, drop] = useDrop({
    accept: ["NEW_ELEMENT", "ELEMENT"],
    drop: (item, monitor) => {
      // NEW_ELEMENT from sidebar
      if (item.elementType) {
        addFromLib(item.elementType, item.defaultProps || {}, null);
        return;
      }
      // existing element being moved to root
      if (item.id) {
        moveNode(item.id, null);
      }
    },
    collect: (m) => ({ isOver: !!m.isOver() })
  });

  return (
    <div ref={drop} className="ui-canvas" style={{ padding: 16 }}>
      {elements.length === 0 && (
        <div style={{ color: "#888", padding: 20 }}>
          اسحب عناصر من اليسار هنا لبدء البناء.
        </div>
      )}

      {elements.map((el, i) => (
        <DraggableElement key={el.id} node={el} parentId={null} index={i} />
      ))}
    </div>
  );
}
