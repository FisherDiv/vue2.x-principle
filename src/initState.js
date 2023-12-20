// 出事化对象数据
export function initState(vm) {
  let opts = vm.$options
  // 有没有配置data属性
  if (opts.data) {
    initData(vm)
  }
  // 有没有配置props属性
  if (opts.props) {
    initPorps(vm)
  }
  // 有没有配置watch属性
  if (opts.watch) {
    initWatch(vm)
  }
  // .... 其他属性 省略
}

// 初始化data
function initData() {

}
// 初始化props
function initPorps() {

}
// 初始化watch
function initWatch() {

}