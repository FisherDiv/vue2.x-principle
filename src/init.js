import { initState } from "./initState"
import { compileToFunction } from "./compile/index"
import { generate } from "./compile/generate"

// 这个还不是真正初始化的地方，相当于业务分层了
export function initMixin(Vue) {
  Vue.prototype._init = function (options) { // 把初始化方法挂在到Vue的原型上
    let vm = this // this 是Vue的实例
    vm.$options = options
    // 初始化状态
    initState(vm)
    // 渲染模版 el
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  // 定义$mount方法
  Vue.prototype.$mount = function (el) {
    let vm = this
    el = document.querySelector(el)
    let options = vm.$options
    if (!options.render) { // 没有render函数
      if (!options.template && el) { // 没有template属性，但配置了el
        el = el.outerHTML // 拿到HTML内容 
        // <div id="app">DEMO Test</div>
        // 拿到render函数
        let render = compileToFunction(el)
        // 将render函数转成vnode
        options.render = render
      }
    }
  }
}