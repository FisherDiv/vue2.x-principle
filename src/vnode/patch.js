/**
 * 新旧元素替换
 * @param {*} oldVnode
 * @param {*} vnode
 * @returns
 */
export function patch(oldVnode, vnode) {
  console.log(oldVnode, vnode);
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
    //标签
    vnode.el = document.createElement(tag);
    if (children.length > 0) {
      children.forEach((child) => {
        vnode.el.appendChild(createEl(child)); // 递归
      });
    }
  } else {
    vnode.el = document.createTextNode(text);
  }
  console.log(vnode.el);
  return vnode.el;
}
