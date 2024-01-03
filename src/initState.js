import { observer } from "./observer/index";
// 出事化对象数据
export function initState(vm) {
  let opts = vm.$options;
  // 有没有配置data属性
  if (opts.data) {
    initData(vm);
  }
  // 有没有配置props属性
  if (opts.props) {
    initPorps(vm);
  }
  // 有没有配置watch属性
  if (opts.watch) {
    initWatch(vm);
  }
  // .... 其他属性 省略
}

// 初始化data
function initData(vm) {
  let data = vm.$options.data;
  // 1.data有两种形式 1)函数  2）对象
  // 2.最终返回一个对象
  // 3.如果不cal的话,这里的this是指向window的
  data = vm._data = typeof data === "function" ? data.call(vm) : data;
  // 劫持后的对象
  // vm._data = data
  // 将data上所有属性代理到 vm实例上 vm._data.msg => vm.msg
  for (let key in data) {
    proxy(vm, "_data", key);
  }

  // 这里才是真正对数据进行劫持
  observer(data); // 观测对象
}
// 初始化props
function initPorps() {}
// 初始化watch
function initWatch() {}
// 把vm._data代理到vm
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    }
  });
}
