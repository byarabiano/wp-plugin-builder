// admin/src/ui-builder/components/DraggableElement.jsx
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useEditorStore } from "../hooks/useEditorStore";

/**
 * Renders one element node and supports:
 * - dragging itself
 * - accepting drops (to become parent) if it's a container
 */

export default function DraggableElement({ node, parentId = null, index = 0 }) {
  const setActive = useEditorStore(s => s.setActiveElement);
  const addFromLib = useEditorStore(s => s.addElementFromLibrary);
  const moveNode = useEditorStore(s => s.moveNode);
  const deleteElement = useEditorStore(s => s.deleteElement);

  // draggable (existing element)
  const [, dragRef] = useDrag({
    type: "ELEMENT",
    item: { id: node.id, originParentId: parentId, originIndex: index },
  });

  // drop target: accept NEW_ELEMENT (from sidebar) or ELEMENT (reorder / nest)
  const [, dropRef] = useDrop({
    accept: ["NEW_ELEMENT", "ELEMENT"],
    drop: (item, monitor) => {
      if (item.elementType) {
        // new from library -> add inside this node
        addFromLib(item.elementType, item.defaultProps || {}, node.id);
      } else if (item.id) {
        // moving existing element -> move into this node (as last child)
        if (item.id === node.id) return; // skip self-drop
        moveNode(item.id, node.id, node.children ? node.children.length : 0);
      }
    },
    canDrop: (item, monitor) => {
      // only container nodes accept drops; allow any node to accept if type is 'container'
      return node.type === "container";
    }
  });

  const ref = (el) => {
    dragRef(el);
    dropRef(el);
  };

  function onClickSelect(e) {
    e.stopPropagation();
    setActive(node.id);
  }

  return (
    <div onClick={onClickSelect} style={{ margin: 6, padding: 6, border: "1px solid #eee", borderRadius: 6 }}>
      <div ref={ref} style={{ padding: 6, background: "#fff" }}>
        {/* render node preview */}
        {node.type === "text" && (
          <div style={{ fontSize: node.props.fontSize, color: node.props.color }}>
            {node.props.content}
          </div>
        )}

        {node.type === "button" && (
          <button style={{ padding: node.props.padding, background: node.props.background, color: node.props.color }}>
            {node.props.content}
          </button>
        )}

        {node.type === "image" && <img src={node.props.src} alt="" style={{ maxWidth: "100%" }} />}

        {node.type === "container" && (
          <div style={{ background: node.props.background, padding: node.props.padding, minHeight: node.props.minHeight }}>
            {/* children will render below */}
            <div style={{ color: "#888", fontSize: 12 }}>حاوية</div>
          </div>
        )}
      </div>

      {/* children */}
      <div style={{ paddingLeft: 12 }}>
        {node.children && node.children.map((child, idx) => (
          <DraggableElement key={child.id} node={child} parentId={node.id} index={idx} />
        ))}
      </div>

      {/* actions */}
      <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
        <button onClick={(e)=>{ e.stopPropagation(); deleteElement(node.id); }} style={{ fontSize: 12 }}>حذف</button>
      </div>
    </div>
  );
}
