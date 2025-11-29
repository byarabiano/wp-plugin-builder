// admin/src/ui-builder/utils/tree-utils.js
/**
 * Advanced tree utilities for nested UI builder nodes.
 *
 * Node shape:
 * {
 *   id: string,
 *   type: string,
 *   props: object,
 *   children: [node]
 * }
 */

export function walkTree(nodes, visitor, path = []) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const currentPath = path.concat(i);
    visitor(node, { index: i, parent: nodes, path: currentPath });
    if (node.children && node.children.length) {
      walkTree(node.children, visitor, currentPath.concat('children'));
    }
  }
}

export function findById(nodes, id) {
  let found = null;
  walkTree(nodes, (node, ctx) => {
    if (node.id === id) found = { node, ctx };
  });
  return found;
}

// mapTree returns a new tree, applying mapper to each node
export function mapTree(nodes, mapper) {
  return nodes.map(n => {
    const mapped = mapper(n);
    return {
      ...mapped,
      children: mapped.children && mapped.children.length ? mapTree(mapped.children, mapper) : []
    };
  });
}

// flatten to array (preorder)
export function flatten(nodes) {
  const out = [];
  walkTree(nodes, (node) => out.push(node));
  return out;
}

// normalize input (ensure each node has children array, props object)
export function normalizeNodes(nodes) {
  if (!Array.isArray(nodes)) return [];
  return nodes.map(n => ({
    id: n.id,
    type: n.type,
    props: n.props || {},
    children: normalizeNodes(n.children || [])
  }));
}

// get parent info (node, parent array, index)
export function findParent(nodes, id) {
  let res = null;
  function helper(list, parent = null) {
    for (let i = 0; i < list.length; i++) {
      const node = list[i];
      if (node.id === id) {
        res = { node, parent, index: i, list };
        return true;
      }
      if (node.children && node.children.length) {
        if (helper(node.children, node)) return true;
      }
    }
    return false;
  }
  helper(nodes, null);
  return res;
}
