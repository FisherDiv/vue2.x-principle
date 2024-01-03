export function renderMixin(Vue) {
  Vue.prototype._c = function () {
    // 创建标签
    return createElement(...arguments);
  };

  Vue.prototype._v = function () {
    // 处理文本
    return createText(...arguments);
  };

  Vue.prototype._s = function (val) {
    // 处理变量
    return val === null ? "" : typeof val === "object" ? JSON.stringify(val) : val;
  };
  /**
   * render方法
   * @returns
   */
  Vue.prototype._render = function () {
    let vm = this;
    let render = vm.$options.render;
    let vnode = render.call(this);
    // console.log("vnode", vnode); // { tag: div, text: undefined, key: undefined, data: {id: 'app', name:'div'}, children: [...]}
    return vnode;
  };
}

/**
 * Vnode节点
 * @param {*} tag
 * @param {*} data
 * @param {*} key
 * @param {*} children
 * @param {*} text
 * @returns
 */
function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  };
}

/**
 * 创建标签元素
 * @param {*} tag 标签
 * @param {*} data attrs属性
 * @param  {...any} children 子集
 * @returns
 */
function createElement(tag, data = {}, ...children) {
  return vnode(tag, data, data.key, children);
}

/**
 * 创建文本
 * @param {*} text
 * @returns
 */
function createText(text) {
  return vnode(undefined, undefined, undefined, undefined, text);
}
