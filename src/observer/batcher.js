import { nextTick, warn } from '../util/index';
import config from '../config';

let queueIndex;
let queue = [];
let userQueue = [];
let has = {};
let circular = {};
let waiting = false;
let internalQueueDepleted = false;

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

function flushBatcherQueue() {
  runBatcherQueue(queue);
  internalQueueDepleted = true;
  runBatcherQueue(userQueue);
  resetBatcherState();
}

/**
 * 执行队列中的 watcher
 * @param {Watcher[]} queue
 */
function runBatcherQueue(queue) {
  for (queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
    const watcher = queue[queueIndex];
    const { id } = watcher;
    has[id] = null;
    watcher.run();

    if (process.env.NODE_ENV !== 'production' && has[id] !== null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > config._maxUpdateCount) {
        warn(
          `You may have an infinite update loop for watcher with expression "${
            watcher.expression
          }"`,
          watcher.vm
        );
        break;
      }
    }
  }
}

function resetBatcherState() {
  queue = [];
  userQueue = [];
  has = {};
  circular = {};
  waiting = false;
  internalQueueDepleted = false;
}

export { pushWatcher };
