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

// 遍历生命周期
HOOKS.forEach((hooks) => {
  starts[hooks] = mergeHook;
});

/**
 * // { created: [fn,fn,fn], mounted: [fn,fn,fn],...}
 * @param {*} parentVal
 * @param {*} childVal
 */
function mergeHook(parentVal, childVal) {
  // 合并两个钩子
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    } else {
      return [childVal];
    }
  } else {
    return parentVal;
  }
}

/**
 *  合并options：data， computed, watch ....
 * @param {*} parent
 * @param {*} child
 */
export function mergeOptions(parent, child) {
  // console.log("==", parent, child);
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
   * 子函数, 根据key合并
   * @param {*} key
   */
  function mergeField(key) {
    if (starts[key]) {
      options[key] = starts[key](parent[key], child[key]);
    } else {
      options[key] = child[key];
    }
  }
  return options;
}
