const tagRE = /{{((?:.|\\n)+?)}}/g;

/**
 * @param {string} text
 */
function parseText(text) {
  if (!tagRE.test(text)) return null;
  const jsonSlice = (start, end) => JSON.stringify(text.slice(start, end));

  const tokens = [];
  tagRE.lastIndex = 0;
  let lastIndex = 0;
  let match;
  while ((match = tagRE.exec(text))) {
    const index = match.index;
    if (index > lastIndex) {
      tokens.push(jsonSlice(lastIndex, index));
    }

    const value = match[1];
    tokens.push(`(${value.trim()})`);
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(jsonSlice(lastIndex));
  }
  return tokens.join('+');
}

export { parseText };
