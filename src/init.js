import { initState } from "./initState"

// 这个还不是真正初始化的地方，相当于业务分层了
export function initMixin(Vue) {
  Vue.prototype._init = function (options) { // 把初始化方法挂在到Vue的原型上
    let vm = this // this 是Vue的实例
    vm.$options = options
    initState(vm)
  }
}