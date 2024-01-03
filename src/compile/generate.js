const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配 {{}}
/**
 * 生成render函数字符串
 * @param {*} el
 * @returns
 */
export function generate(el) {
  // console.log("generate(el)->el:", el);
  let children = genChildren(el);
  // console.log(children);
  // 拼接方法字符串， （标签，属性，子集）
  let code = `_c('${el.tag}', ${el.attrs.length ? `${genProps(el.attrs)}` : "undefined"}${
    children ? `,${children}` : ""
  })`; // _c() 解析元素
  // console.log("generate(el)->code:", code);
  // _c('div', {id:"app",name:"div"},_v("hello "+_s(msg)),_c('h1', undefined,_v("child"),_c('span', undefined,_c('i', undefined,_v("12")))),_c('h2', undefined,_v("h2chidl")))
  return code;
}

/**
 * 遍历子
 * @param {*} el
 * @returns
 */
function genChildren(el) {
  const children = el.children;
  if (children) {
    return children.map((child) => gen(child)).join(",");
  }
}

/**
 * 生成单个节点的字符串
 * @param {*} node
 */
function gen(node) {
  if (node.type === 1) {
    // 标签
    return generate(node); //递归
  } else {
    // 那就是3，纯文本和{{}}文本
    let text = node.text;

    // 1）纯文本
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`; // _v() 解析文本
    }

    // 2）处理特殊文本 文本 + {{}}
    let tokens = [];

    let lastIndex = (defaultTagRE.lastIndex = 0); // 如果正则是全局模式，需要每次使用前变为0
    let match;
    // hello {{msg}} tail {{msg2}}
    // 可能有多个插值表达式
    while ((match = defaultTagRE.exec(text))) {
      // console.log("match", match);
      let index = match.index;
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }
      // 添加插值表达式 {{}}
      tokens.push(`_s(${match[1].trim()})`); // _s() 解析变量
      lastIndex = index + match[0].length;
    }

    // 判断还有没有文本 hello {{msg}} tail --> 有没有尾巴
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }
    // console.log("gen(node)->tokens:", tokens);
    return `_v(${tokens.join("+")})`;
  }
}

/**
 * 处理属性
 * @param {*} atts
 */
function genProps(attrs) {
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    // 特别处理style; color: red; font-size: 20px;
    if (attr.name === "style") {
      let obj = {};
      attr.value.split(";").forEach((item) => {
        let [key, value] = item.split(":");
        obj[key] = value;
      });
    }
    // 拼接
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  // console.log("genProps(attrs)->str:", str);
  return `{${str.slice(0, -1)}}`;
}
