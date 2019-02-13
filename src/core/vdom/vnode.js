function VNode(sel, data, children, text, elm) {
  const { key = undefined } = data || {};
  return { sel, data, children, text, elm, key };
}

export { VNode };
