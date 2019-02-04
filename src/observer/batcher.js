import { nextTick } from '../util/index';

let queueIndex;
let queue = [];
let userQueue = [];
let has = {};
let circular = {};
let waiting = false;
let internalQueueDepleted = false;

// TODO
function flushBatcherQueue() {
  throw new Error('TODO');
}

/**
 * @param watcher { import("./watcher").Watcher }
 */
function pushWatcher(watcher) {
  const { id } = watcher.id;
  if (has[id] !== null) return;

  if (internalQueueDepleted && !watcher.user) {
    userQueue.splice(queueIndex + 1, 0, watcher);
  } else {
    const q = watcher.user ? userQueue : queue;
    has[id] = q.length;
    q.push(watcher);

    if (!waiting) {
      waiting = true;
      nextTick(flushBatcherQueue);
    }
  }
}

export { pushWatcher };
