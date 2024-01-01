import { patch } from "./vnode/patch";
/**
 * 挂载
 * @param {*} vm
 * @param {*} el
 */
export function mountComponent(vm, el) {
  callHook(vm, "beforeMounted");
  vm._update(vm._render());
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
