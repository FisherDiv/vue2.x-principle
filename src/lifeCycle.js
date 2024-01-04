import { patch } from "./vnode/patch";
import Watcher from "./observer/watcher";
/**
 * 挂载
 * @param {*} vm
 * @param {*} el
 */
export function mountComponent(vm, el) {
  callHook(vm, "beforeMounted");
  // vm._update(vm._render());
  // 为了实现自动更新，这里不再是直接调用，而是封装到Watcher里调用
  let updateComponent = () => {
    vm._update(vm._render());
  };
  // 这个Watcher是首次挂载时用于渲染的，没有任何功能 true是用来标识渲染的
  new Watcher(vm, updateComponent, () => {}, true);
  callHook(vm, "mounted");
}
/**
 * patch
 * @param {*} Vue
 */
export function lifeCycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    let vm = this;
    // render函数-》vnode -> 真实dom
    vm.$el = patch(vm.$el, vnode);
  };
}

/**
 * 生命周期调用
 * @param {*} vm
 * @param {*} hook
 */
export function callHook(vm, hook) {
  // console.log(vm, hook);
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(this); // this
    }
  }
}
