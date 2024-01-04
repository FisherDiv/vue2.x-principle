/**
 * 一个属性就有一个dep, dep的作用是用来搜集Watcher
 * dep和watcher的关系： 多对多
 * 一个dep可以对应多个watcher, 一个watcher可对应多个dep
 */
let id = 0;
class Dep {
  constructor() {
    this.subs = []; // 存放watcher
    this.id = id++;
  }

  depend() {
    // 收集Watcher,同时Watcher里有dep 是双向记忆的
    Dep.target.addDep(this);
  }
  addSub(watcher) {
    // 添加watcher到数组
    this.subs.push(watcher);
  }

  notify() {
    // 通知更新
    this.subs.forEach((watcher) => {
      watcher.update();
    });
  }
}

// 当前的watcher,这里其实是赋值，不应该用push pop命名
Dep.target = null;
export function pushTarget(watcher) {
  // 添加Watcher
  Dep.target = watcher;
}

export function popTarget() {
  // 删除watcher
  Dep.target = null;
}

export default Dep;
