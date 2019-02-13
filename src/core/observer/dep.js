let uid = 0;
class Dep {
  constructor() {
    this.id = uid;
    uid += 1;
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
