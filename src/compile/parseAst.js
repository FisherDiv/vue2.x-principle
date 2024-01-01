const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名称
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //<span:xx>
// startTagOpen = /^<((?:[a-zA-Z_][\-\.0-9_a-zA-Z]*\:)?[a-zA-Z_][\-\.0-9_a-zA-Z]*)/
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
//<div id="app"></div>
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
// const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{}}

// 创建ast语法树
function createASTElement(tag, attrs) {
  return {
    tag,
    attrs,
    children: [], // 子节点
    type: 1, // 节点类型,1是标签，3是文本
    parent: null // 父节点
  };
}

let root; // 根元素
let createParent; // 当前元素的父元素
let stack = []; // [div, h]

/**
 * 转化为ast元素，标记parent,压栈
 * 这会是一个平行结构
 * @param {*} tag
 * @param {*} attrs
 */
function start(tag, attrs) {
  let element = createASTElement(tag, attrs);
  if (!root) {
    // 根节点
    root = element;
  }
  createParent = element; // 当前父元素
  stack.push(element);
}

/**
 * 处理文本
 * @param {*} text
 */
function charts(text) {
  // text = text.replace(/\s/g, ""); // 去除空格 /a/g
  text = text.trim();
  if (text) {
    createParent.children.push({
      type: 3,
      text
    });
  }
}

/**
 * 处理结束的标签
 * 遇到一个标签结束，则吧它往父元素上挂
 */
function end() {
  let element = stack.pop(); // 弹出最后一个
  createParent = stack[stack.length - 1]; // 栈中最后一个元素
  if (createParent) {
    element.parent = createParent.tag;
    createParent.children.push(element);
  }
}

/**
 * 解析html成为ast树
 * @param {*} html
 */
export function parseHTML(html) {
  // console.log("原始html", html);
  while (html) {
    // console.log("html", html);
    // html为空结束
    // 判断标签 <>
    let textEnd = html.indexOf("<"); // 第0个元素
    // console.log(textEnd);
    if (textEnd === 0) {
      // 标签开始
      const startTagMatch = parseStartMatch();
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      // 结束标签
      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }
    // 处理文本
    let text;
    if (textEnd > 0) {
      // textEnd是下一个标签开始的地方
      text = html.substring(0, textEnd); // 获取文本内容
    }

    if (text) {
      advance(text.length);
      charts(text);
    }
  }

  /**
   * 子函数 匹配开始标签，把标签转化为对象
   * <div id="app" name="div">DEMO Test</div>
   * {tagName: 'div', attrs: [{name: 'id', value: 'app' }, {name: 'name': value: 'div'}]}
   */
  function parseStartMatch() {
    const start = html.match(startTagOpen);
    // ['<div', 'div', index: 0, input: '<div id="app">DEMO Test</div>', groups: undefined]
    // console.log("start", startTagOpen, start);
    if (start) {
      // 如果匹配到了
      let match = {
        tagName: start[1], // 标签名装进来
        attrs: [] // 预留属性
      };
      advance(start[0].length); // 截取html
      let attr, end;
      // 没有结束标记，并且有属性
      // console.log((end = html.match(startTagClose)), (attr = html.match(attribute)));
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // console.log(end, attr);
        // null [' id="app"', 'id', '=', 'app', undefined, undefined, index: 0, input: ' id="app" name="div">DEMO Test</div>', groups: undefined]
        // null [' name="div"', 'name', '=', 'div', undefined, undefined, index: 0, input: ' name="div">DEMO Test</div>', groups: undefined]
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] });
        advance(attr[0].length);
      }
      if (end) {
        //  ['>', '', index: 0, input: '>DEMO Test</div>', groups: undefined]
        // 匹配结束
        advance(end[0].length);
        // console.log(match);
        return match; // {tagName: 'div', attrs: [{name: 'id', value: 'app' }, {name: 'name': value: 'div'}]}
      }
    }
  }
  /**
   * 子函数： 截取n后面的字符串并赋值
   * @param {*} n
   */
  function advance(n) {
    html = html.substring(n);
  }

  /**

  <div id="app" name="div">hello {{msg}} <h>child</h></div>
  {
    attrs: [{…}, {…}],
    children: [
      {type: 3, text: 'hello {{msg}} '},
      {tag: 'h', attrs: [], children: [{text: 'child', type: 3}], type: 1, parent: 'div'}
    ],
    parent: null,
    tag:"div",
    type:1
  }
*/
  return root;
}
