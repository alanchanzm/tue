const singleAttrIdentifier = /([^\s"'<>/=]+)/;
const singleAttrAssign = /=/;
const singleAttrAssigns = [singleAttrAssign];
const singleAttrValues = [/"([^"]*)"+/.source, /'([^']*)'+/.source, /([^\s"'=<>`]+)/.source];
// 字母或下划线开头 包含任意数量的 \w 和 - 和 .
const ncname = '[A-z_][\\w\\-\\.]*';
// 形如 xmlns:tag 或 tag
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 标签开头： <tag
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 标签结尾： > 或 />
const startTagClose = /^\s*(\/?)>/;
// </tag>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>>/i;

const comment = /^<!--/;
const conditionalComment = /^<!\[/;

// fix for firefox
let IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, (_, g) => {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

function parse(html) {}

// Empty Elements
const empty = makeMap(
  'area,base,basefont,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr',
);

// Inline Elements
const inline = makeMap(
  'a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,noscript,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,svg,textarea,tt,u,var',
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
const closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source');

// Attributes that have their values filled in disabled='disabled'
const fillAttrs = makeMap(
  'checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected',
);

// Special Elements (can contain anything)
const special = makeMap('script,style');

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
const nonPhrasing = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,title,tr,track',
);

/**
 * @param {string} html
 * @param {*} handler
 */
function HTMLParser(html, handler) {
  const stack = []; // 用于配对标签
  let lastTag;
  let last;
  let prevTag;

  while (html) {
    last = html;

    // 解析非纯文本标签内容
    if (!lastTag || !special(lastTag)) {
      const textEnd = html.indexOf('<');

      // 第一个字符为 < (可能是标签的起始字符)
      if (textEnd === 0) {
        // comment
        if (comment.test(html)) {
          const commentEnd = html.indexOf('-->');

          if (~commentEnd) {
            if (handler.comment) {
              handler.comment(html.substring(4, commentEnd));
            }
            html = html.substring(commentEnd + 3);
            prevTag = '';
            continue;
          }
        }

        // 条件注释 for IE
        if (conditionalComment.test(html)) {
          const conditionalCommentEnd = html.indexOf(']>');

          if (~conditionalCommentEnd) {
            if (handler.comment) {
              handler.comment(html.substring(2, conditionalCommentEnd + 1), true);
            }
            html = html.substring(conditionalCommentEnd + 2);
            prevTag = '';
            continue;
          }
        }

        // Doctype
        const doctypeMatch = doctype.exec(html);
        if (doctypeMatch) {
          if (handler.doctype) {
            handler.doctype(doctypeMatch[0]);
          }
          html = html.substring(doctypeMatch[0].length);
          prevTag = '';
          continue;
        }

        // EndTag
        const endTagMatch = endTag.exec(html);
        if (endTagMatch) {
          html = html.substring(endTagMatch[0].length);
          endTagMatch[0].replace(endTag, parseEndTag);
          prevTag = `/${endTagMatch[1].toLowerCase()}`;
          continue;
        }

        // StartTag
        const startTagMatch = parseStartTag(html);
        if (startTagMatch) {
          html = startTagMatch.rest;
          handleStartTag(startTagMatch);
          prevTag = startTagMatch.tagName.toLowerCase();
          continue;
        }
      }
    }
  }

  /**
   * @param {*} tag
   * @param {string} tagName
   */
  function parseEndTag(tag, tagName) {
    let pos = 0;

    // find start tag from stack
    if (tagName) {
      const needle = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos -= 1) {
        if (stack[pos].tag.toLowerCase() === needle) break;
      }
    }

    if (~pos) {
      for (let i = stack.length - 1; i >= pos; i -= 1) {
        if (handler.end) {
          handler.end(stack[i].tag, stack[i].attrs, i > pos || !tag);
        }
      }
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (tagName.toLowerCase() === 'br') {
      if (handler.start) {
        handler.start(tagName, [], true, '');
      }
    } else if (tagName.toLowerCase() === 'p') {
      if (handler.start) {
        handler.start(tagName, [], false, '', true);
      }
      if (handler.end) {
        handler.end(tagName, []);
      }
    }
  }

  /**
   * @param {string} input
   */
  function parseStartTag(input) {
    const attribute = attrForHandler();
    const start = startTagOpen.exec(input);
    if (!start) return undefined;

    const match = {
      tagName: start[1],
      attrs: [],
    };
    input = input.slice(start[0].length);
    let end;
    let attr;
    // eslint-disable-next-line no-cond-assign
    while (!(end = startTagClose.exec(input)) && (attr = attribute.exec(input))) {
      input = input.slice(start[0].length);
      match.attrs.push(attr);
    }
    if (end) {
      [, match.unarySlash] = end;
      match.rest = input.slice(end[0].length);
      return match;
    }
    return undefined;
  }

  function handleStartTag(match) {
    let { unarySlash } = match;
    const { tagName } = match;

    if (handler.html5 && lastTag === 'p' && nonPhrasing(tagName)) {
      parseEndTag('', lastTag);
    }

    if (!handler.html5) {
      while (lastTag && inline(lastTag)) {
        parseEndTag('', lastTag);
      }
    }

    if (closeSelf(tagName) && lastTag === tagName) {
      parseEndTag('', tagName);
    }

    const unary = empty(tagName) || (tagName === 'html' && lastTag === 'head') || !!unarySlash;

    const attrs = match.attrs.map(args => {
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        [3, 4, 5].forEach(index => {
          if (args[index] === '') delete args[index];
        });
      }
      return {
        name: args[1],
        value: args[3] || args[4] || (args[5] && fillAttrs(args[5]) ? args[1] : ''),
      };
    });

    if (!unary) {
      stack.push({ tag: tagName, attrs });
      lastTag = tagName;
      unarySlash = '';
    }

    if (handler.start) {
      handler.start(tagName, attrs, unary, unarySlash);
    }
  }
}

/**
 * 把字符串转换成 map
 * @param {string} str
 */
function makeMap(str) {
  const values = str.split(',');
  const map = {};
  values.forEach(value => {
    map[value] = 1;
  });
  return key => map[key.toLowerCase()] === 1;
}

function attrForHandler() {
  const pattern = `${
    singleAttrIdentifier.source
  }(?:\\s*(${joinSingleAttrAssigns()})\\s*(?:${singleAttrValues.join('|')}))?`;
  return new RegExp(`^\\s*${pattern}`);
}

function joinSingleAttrAssigns() {
  return singleAttrAssigns.map(assign => `(?:${assign.source})`).join('|');
}

export { parse, HTMLParser };
