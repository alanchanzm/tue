/**
 * @param {HTMLElement} el
 */
function getOutHTML(el) {
  if (el.outerHTML) return el.outerHTML;

  const container = document.createElement('div');
  container.appendChild(el.cloneNode(true));
  return container.innerHTML;
}

export { getOutHTML };
