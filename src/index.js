function Vue(options) {
  this._init(options) // 调用初始化方法
}

Vue.prototype._init = function (options) { // 把初始化方法挂在到Vue的原型上
  console.log(options)
}

export default Vue