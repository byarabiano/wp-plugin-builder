// admin/src/ui-builder/hooks/useEditorStore.js
import { create } from "zustand";

/**
 * Node schema:
 * {
 *   id: string,
 *   type: string,
 *   props: object,
 *   children: [] // recursive
 * }
 *
 * elements: array of root nodes
 */

function genId(prefix = "el") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/* Helpers to work with tree (immutable) */
function findNodeAndParentById(list, id, parent = null) {
  for (let i = 0; i < list.length; i++) {
    const node = list[i];
    if (node.id === id) return { node, parent, index: i, list };
    if (node.children && node.children.length) {
      const found = findNodeAndParentById(node.children, id, node);
      if (found) return found;
    }
  }
  return null;
}

function removeNodeById(list, id) {
  // returns new list with node removed
  const res = [];
  for (const node of list) {
    if (node.id === id) continue;
    const copy = { ...node };
    if (node.children && node.children.length) {
      copy.children = removeNodeById(node.children, id);
    }
    res.push(copy);
  }
  return res;
}

function insertNodeAt(list, targetParentId, atIndex, newNode) {
  // If targetParentId === null -> insert at root level atIndex
  if (!targetParentId) {
    const copy = [...list];
    copy.splice(atIndex, 0, newNode);
    return copy;
  }

  return list.map(node => {
    if (node.id === targetParentId) {
      const children = node.children ? [...node.children] : [];
      const c = [...children];
      c.splice(atIndex, 0, newNode);
      return { ...node, children: c };
    }
    if (node.children && node.children.length) {
      return { ...node, children: insertNodeAt(node.children, targetParentId, atIndex, newNode) };
    }
    return node;
  });
}

export const useEditorStore = create((set, get) => ({
  elements: [], // root nodes array
  activeElement: null,

  // add element as new root (or into parent if specified)
  addElement: (type, props = {}, parentId = null, atIndex = null) => {
    const id = genId();
    const newNode = { id, type, props: { ...props }, children: [] };

    const current = get().elements;
    let next;
    if (parentId === null) {
      const idx = atIndex == null ? current.length : atIndex;
      next = [...current];
      next.splice(idx, 0, newNode);
    } else {
      const idx = atIndex == null ? (findNodeAndParentById(current, parentId)?.node?.children?.length ?? 0) : atIndex;
      next = insertNodeAt(current, parentId, idx, newNode);
    }

    set({ elements: next, activeElement: id });
    return id;
  },

  // add element coming from library drag (similar to addElement but returns id)
  addElementFromLibrary: (libraryType, defaultProps = {}, parentId = null, atIndex = null) => {
    return get().addElement(libraryType, defaultProps, parentId, atIndex);
  },

  // update props of node
  updateElement: (id, partialProps) => {
    const recurse = (list) => list.map(node => {
      if (node.id === id) {
        return { ...node, props: { ...node.props, ...partialProps } };
      }
      if (node.children && node.children.length) {
        return { ...node, children: recurse(node.children) };
      }
      return node;
    });
    set({ elements: recurse(get().elements) });
  },

  // delete node by id
  deleteElement: (id) => {
    set({ elements: removeNodeById(get().elements, id), activeElement: get().activeElement === id ? null : get().activeElement });
  },

  // set active element id
  setActiveElement: (id) => set({ activeElement: id }),

  // move node: remove from original place and insert into targetParentId at index
  moveNode: (nodeId, targetParentId = null, atIndex = null) => {
    const current = get().elements;
    // find node
    const found = findNodeAndParentById(current, nodeId);
    if (!found) return;
    const nodeCopy = JSON.parse(JSON.stringify(found.node)); // deep clone safe
    // remove it
    const removed = removeNodeById(current, nodeId);
    // determine index
    const parentId = targetParentId ?? null;
    const index = atIndex == null ? (parentId ? (findNodeAndParentById(removed, parentId)?.node?.children?.length ?? 0) : removed.length) : atIndex;
    const inserted = insertNodeAt(removed, parentId, index, nodeCopy);
    set({ elements: inserted, activeElement: nodeId });
  },

  // helper: get node by id
  getNode: (id) => {
    const f = findNodeAndParentById(get().elements, id);
    return f ? f.node : null;
  },

  // replace full tree (for import/load)
  setElements: (arr) => set({ elements: arr }),
}));
