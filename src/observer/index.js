/**
 *  1.Object.defineProperty()有缺陷，只能对一个属性监测
 *  2.如此需要用walk方法来遍历
 *  3.对象又是复合型的，所以需要在defineReactive里递归
 *  4.新对象赋值后也需要观测
 */

import { arrayMethods } from "./arr";
import Dep from "./dep";
// 观测方法
export function observer(data) {
  if (typeof data !== "object" || data == null) {
    // 判断非对象
    // return data;
    return;
  }
  if (data.__ob__) {
    // 是否被观测过
    return data;
  }
  // 是一个对象了
  return new Observer(data);
}

// 真正的观测对象
// vue2.x 是使用Object.defineProperty实现劫持的，它的缺点是只能对数据的一个属性进行劫持
// 所以需要使用遍历
class Observer {
  // 构造器
  constructor(value) {
    this.dep = new Dep(); // 1).给所有的对象添加一个dep , {} 2).[]不是给里面的属性添加dep,而是数组本身
    Object.defineProperty(value, "__ob__", {
      // 挂载this到属性(观测对象），供arr李调用
      enumerable: false, // 不可枚举
      configurable: false,
      value: this // this 是Observer实例
    });

    if (Array.isArray(value)) {
      // 观测数组
      value.__proto__ = arrayMethods;
      this.observerArray(value);
    } else {
      // 观测对象, 第一次进来肯定是走这里， data返回的是一个对象
      this.walk(value);
    }
  }
  // 遍历属性
  walk(data) {
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]; // data的key
      let value = data[key]; // data的value
      defineReactive(data, key, value); // 属性劫持
    }
  }
  // 劫持数组对象的方法 [{name: '张三', age: 12}]
  observerArray(value) {
    for (let i = 0; i < value.length; i++) {
      // console.log("value[i]", value[i]);
      observer(value[i]);
    }
  }
}

// 真正的劫持方法(对象)
function defineReactive(data, key, value) {
  /**
   * 递归检测，嵌套对像的检测
   * */
  let childDep = observer(value); // 获取到数组对应的dep？，子
  let dep = new Dep(); // 给每个属性都设置dep
  // 单个属性检测
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend(); // 收集依赖
        if (childDep) {
          console.log("childDep", childDep);
          childDep.dep.depend(); // 数组搜集watcher?
        }
      }
      // 获取时，比如 this.msg
      return value; //  data[key] 不能用这个，不然一直会递归调用自己
    },
    set(newValue) {
      // 设置时，比如 this.msg = "world"
      if (newValue === value) {
        // eg: this.msg = "hello"
        return;
      }
      /**
       * 对新对象也需要观测，不然不会响应，主要是对象，如果是非对象会直接返回
       */
      observer(newValue);
      // 设置新职
      value = newValue; // data[key] = newValue // 这里也不能用data[key]
      dep.notify(); // 通知更新
    }
  });
}
