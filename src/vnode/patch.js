/**
 * 新旧元素替换
 * @param {*} oldVnode
 * @param {*} vnode
 * @returns
 */
export function patch(oldVnode, vnode) {
  // console.log(oldVnode, vnode);
  // 创建dom
  let el = createEl(vnode);
  // 找到父元素
  let parentEL = oldVnode.parentNode;
  // 插入新元素
  parentEL.insertBefore(el, oldVnode.nextsibling);
  // 移除旧元素
  parentEL.removeChild(oldVnode);
  return el;
}

/**
 * 创建真实dom
 * @param {*} vnode
 */
function createEl(vnode) {
  let { tag, children, key, data, text } = vnode;
  if (typeof tag === "string") {
    //标签 div, h1....
    vnode.el = document.createElement(tag); // 多了一个el属性
    if (children.length > 0) {
      children.forEach((child) => {
        vnode.el.appendChild(createEl(child)); // 递归
      });
    }
  } else {
    // undefined 文本
    vnode.el = document.createTextNode(text);
  }
  // { tag: div, text: undefined, key: undefined, data: {id: 'app', name:'div'}, children: [...], el: div}
  // console.log("createEl(vnode)->vnode", vnode);
  return vnode.el;
}
