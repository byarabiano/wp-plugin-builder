// admin/src/ui-builder/utils/drag-preview-utils.js
/**
 * Helpers for drop indicator calculation
 *
 * These are pure utilities used by the DragPreviewLayer.
 */

export function getDropIndicatorPosition(targetRect, monitorClientOffset) {
  if (!targetRect || !monitorClientOffset) return null;
  const x = monitorClientOffset.x - targetRect.left;
  const y = monitorClientOffset.y - targetRect.top;
  return { x, y };
}

/** simple helper to decide insert before/after based on y position */
export function decideIndexByY(childrenRects, offsetY) {
  if (!childrenRects || childrenRects.length === 0) return 0;
  for (let i = 0; i < childrenRects.length; i++) {
    const r = childrenRects[i];
    if (offsetY < r.top + r.height / 2) return i;
  }
  return childrenRects.length;
}
