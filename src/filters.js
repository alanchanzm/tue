/**
 * @file filters
 */

/**
 * @namespace
 */
const Filters = {
  /**
   * 首字母大写
   * @param {*} value
   * @return {string}
   */
  capitalize(value) {
    value = String(value);
    const [head] = value;
    return `${head.toUpperCase()}${value.slice(1)}`;
  },
  /**
   * @param {string} value
   * @return {string}
   */
  uppercase(value) {
    return value.toUpperCase();
  },
};

export { Filters };
