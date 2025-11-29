// admin/src/ui-builder/components/Column.jsx
import React from "react";

export default function Column({ node, children }) {
  const style = {
    flex: node.props.flex || 1,
    padding: node.props.padding ? node.props.padding + "px" : undefined,
    minHeight: node.props.minHeight ? node.props.minHeight + "px" : undefined
  };

  return <div style={style}>{children}</div>;
}
