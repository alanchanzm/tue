import { parseText } from './text-parser';

const forRE = /([A-z_][\w]*)\s+(?:in|of)\s+(.*)/;
const bindRE = /^:|^v-bind:/;
const onRE = /^@|^v-on:/;
const mustUsePropsRE = /^(value|selected|checked|muted)$/;

function generate(ast) {
  const code = genElement(ast);
  return new Function(`with (this) { return ${code} }`); // eslint-disable-line no-new-func
}

function genElement(el, key) {
  const forExp = getAttr(el, 'v-for');
  if (forExp) return genFor(el, forExp);

  const ifExp = getAttr(el, 'v-if');
  if (ifExp) return genIf(el, ifExp);

  if (el.tag === 'template') return genChildren(el);

  return `__h__("${el.tag}", ${genData(el, key)}, ${genChildren(el)})`;
}

function genIf(el, exp) {
  return `(${exp}) ? ${genElement(el)} : ''`;
}

function genFor(el, exp) {
  if (!forRE.test(exp)) {
    throw new Error(`Invalid v-for expression: ${exp}`);
  }

  const match = forRE.exec(exp);
  const item = match[1].trim();
  const arr = match[2].trim();
  const key = el.attrsMap['track-by'] || 'undefined';
  return `(${arr}).map(function (${item}, $index) { return ${genElement(el, key)} })`;
}

function genData(el, key) {
  if (!el.attrs.length) return '{}';

  let data = '';
  // key
  if (key) data += `key:${key},`;
  // class
  if (el.attrsMap[':class'] || el.attrsMap.class) {
    data += `class: _renderClass(${el.attrsMap[':class']}, "${el.attrsMap.class || ''}")`;
  }
  // attrs
  let hasProps = false;
  let props = '';
  let hasAttrs = false;
  let attrs = '';
  for (const attr of el.attrs) {
    const { name, value } = attr;
    if (bindRE.test(name)) {
      const bindName = name.replace(bindRE, '');
      if (bindName === 'style') {
        data += `style: ${value},`;
      } else if (mustUsePropsRE.test(bindName)) {
        hasProps = true;
        props += `"${bindName}": (${value}),`;
      } else if (bindName !== 'class') {
        hasAttrs = true;
        attrs += `"${bindName}": (${value}),`;
      }
    } else if (onRE.text(name)) {
      const onName = name.replace(onRE, '');
      // TODO:
    } else if (name !== 'class') {
      hasAttrs = true;
      attrs += `"${name}": (${JSON.stringify(value)}),`;
    }
  }
  // 去除结尾「,」
  if (hasAttrs) data += `attrs:{${attrs.slice(0, -1)}},`;
  if (hasProps) data += `props:{${props.slice(0, -1)}},`;
  // 去除结尾「,」 data结尾可能没有「,」所以用正则
  return `{${data.replace(/,$/, '')}}`;
}

function genChildren(el) {
  if (!el.children.length) return 'undefined';

  return `__flatten__([${el.children.map(genNode).join(',')}])`;
}

function genNode(node) {
  if (node.tag) return genElement(node);
  return genText(node);
}

function genText(text) {
  if (text === ' ') return '" "';
  const exp = parseText(text);
  if (exp) return `String(${escapeNewlines(exp)})`;
  return escapeNewlines(JSON.stringify(text));
}

/**
 * @param {string} str
 */
function escapeNewlines(str) {
  return str.replace(/\n/g, '\\n');
}

function getAttr(el, attr) {
  const val = el.attrsMap[attr];
  if (val) {
    el.attrsMap[attr] = null;
    for (let i = 0; i < el.attrs.length; i += 1) {
      if (el.attrs[i].name === attr) {
        el.attrs.splice(i, 1);
        break;
      }
    }
  }
  return val;
}

export { generate };
