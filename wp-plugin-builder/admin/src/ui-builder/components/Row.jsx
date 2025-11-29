// admin/src/ui-builder/components/Row.jsx
import React from "react";

export default function Row({ node, children }) {
  const style = {
    display: "flex",
    gap: node.props.gap || 12,
    flexDirection: node.props.direction === "column" ? "column" : "row",
    alignItems: node.props.align || "stretch",
    justifyContent: node.props.justify || "flex-start",
    background: node.props.background || "transparent",
    padding: node.props.padding ? node.props.padding + "px" : undefined
  };

  return <div style={style}>{children}</div>;
}
