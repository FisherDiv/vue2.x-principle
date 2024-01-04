import { popTarget, pushTarget } from "./dep";

let id = 0; // 每一个watcher的标示

/**
 * Vue 更新组件策略时以组件为单位的，给每个组件都增加watcher,
 * 属性变化后会调用这个watcher
 */
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn; // 表达式或者函数，方便watch属性的不同方式
    this.cb = cb; // 回调函数
    this.options = options; // 自定义配置项
    this.id = id++; // 每一个组件只有一个Watcher,

    this.deps = []; // 记录有多少 denpent
    this.depsId = new Set();

    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn; // getter是执行更新的方法
    }
    // 初始化渲染
    this.get();
  }

  get() {
    // 执行更新的函数
    pushTarget(this); // Dep.target
    this.getter();
    popTarget();
  }
  update() {
    // 更新逻辑
    this.get();
  }

  addDep(dep) {
    // 添加依赖
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.deps.push(dep);
      this.depsId.add(id);

      // 同时将Watch放入dep中
      dep.addSub(this);
    }
  }
}

export default Watcher;
