export const HOOKS = ["beforeCreated", "created", "beforeMounted", "mounted", "updated", "beforeDestroy", "destroyed"];

// 策略模式
let starts = {};

/**
 * 合并data
 * @param {*} parentVal
 * @param {*} childVal
 */
starts.data = function (parentVal, childVal) {
  return childVal;
};

starts.computed = function () {}; // 合并computed

// 遍历生命周期，生命周期都是同一种合并方法
HOOKS.forEach((hooks) => {
  starts[hooks] = mergeHook;
});

/**
 * // { created: [fn,fn,fn], mounted: [fn,fn,fn],...}
 * @param {*} parentVal
 * @param {*} childVal
 */
function mergeHook(parentVal, childVal) {
  // console.log("----", parentVal, childVal); // fn,fn
  // 合并多个个钩子 created: [fn,fn,fn]
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return [childVal]; // 在下次执行是变为父
    }
  } else {
    return parentVal;
  }
}

/**
 *  合并options：data， computed, watch ....
 * @param {*} parent Mixin里面那个对象 parent最初是{},即是Vue.options
 * @param {*} child 组件对象
 */
export function mergeOptions(parent, child) {
  // console.log("mergeOptions(parent, child):", parent, child);
  const options = {};
  // 父有子无
  for (let key in parent) {
    mergeField(key);
  }
  // 子有父无
  for (let key in child) {
    mergeField(key);
  }
  /**
   * 子函数, 根据key合并, 如果有合并策略，则调用合并策略方法，没有则用子的
   * @param {*} key
   */
  function mergeField(key) {
    // 是否有合并策略
    if (starts[key]) {
      options[key] = starts[key](parent[key], child[key]);
    } else {
      // 没有合并策略便取子的
      options[key] = child[key];
    }
  }
  // console.log("options", options);
  return options;
}
