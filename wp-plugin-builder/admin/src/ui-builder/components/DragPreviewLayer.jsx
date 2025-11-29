// admin/src/ui-builder/components/DragPreviewLayer.jsx
import React from "react";
import { useDragLayer } from "react-dnd";

export default function DragPreviewLayer() {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialClientOffset(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging()
  }));

  if (!isDragging || !currentOffset) return null;

  const style = {
    position: "fixed",
    pointerEvents: "none",
    left: currentOffset.x,
    top: currentOffset.y,
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    padding: 8,
    borderRadius: 6,
    fontSize: 13
  };

  return (
    <div style={style}>
      {itemType === "NEW_ELEMENT" ? `إضافة: ${item.elementType}` : `نقل: ${item.id}`}
    </div>
  );
}
