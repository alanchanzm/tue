/**
 * 首字母大写
 * @param {string|any} value
 * @returns {string}
 */
function capitalize(value) {
  value = String(value);
  const [head] = value;
  return `${head.toUpperCase()}${value.slice(1)}`;
}

export { capitalize };
