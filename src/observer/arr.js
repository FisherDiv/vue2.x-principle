/**
 * 1.Obejct.defineProperty也可以观测数组，只是数组长度不定，一般是从重写数组方法来实现的
 * 2.新增元素如果是对象需要观测
 * 3.Observer实例的获取
 */

// 获取数组原来的方法

let oldArrayProtoMethods = Array.prototype

// 继承数组的方法

export let arrayMethods = Object.create(oldArrayProtoMethods)

// 劫持方法列表
let methods = ['push', 'pop', 'unshift', 'shift', 'splice']

methods.forEach(item => {
  arrayMethods[item] = function (...args) {
    let result = oldArrayProtoMethods[item].apply(this, args) // 执行原数组的方法
    // 数组追加数组是对象是也需要响应
    let inserted // 这里返回的是一个数组，可能一个元素，可能对个元素，所以下面是观测数组而不是对象
      switch (item) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.splice(2) // arr.splice(0,2,{age: 55},{age: 66}) -- 0,1,| {age: 55},{age: 66}
          break
      }
    let ob = this.__ob__ // this是每个观测的对象 __ob__是Observer的实例
    ob.observerArray(inserted) // 对添加的对象进行劫持 eg.[1,2]
    return result
  }
})