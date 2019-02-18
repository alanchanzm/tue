let uid = 0;
class Dep {
  static target: any;
  id: number;
  subs: any[];

  constructor() {
    this.id = uid;
    this.subs = [];
  }

  /**
   * @param { import("./watcher").Watcher } sub
   */
  addSub(sub) {
    this.subs.push(sub);
  }

  removeSub(sub) {
    this.subs.$remove(sub);
  }

  depend() {
    Dep.target.addDep(this);
  }

  notify() {
    const subs = this.subs.slice();
    subs.forEach(sub => sub.update());
  }
}

Dep.target = null;

export { Dep };
