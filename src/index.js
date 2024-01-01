import { initMixin } from "./init";
import { lifeCycleMixin } from "./lifeCycle";
import { renderMixin } from "./vnode/index";
import { initGlobApi } from "./global-api/index";

// 最终导出去的大对象
function Vue(options) {
  this._init(options); // 调用初始化方法
}

initMixin(Vue); // 初始化数据,分拆到文件
lifeCycleMixin(Vue);
renderMixin(Vue);
initGlobApi(Vue);
// Vue.prototype._init = function (options) { // 把初始化方法挂在到Vue的原型上
//   console.log(options)
// }

export default Vue;
