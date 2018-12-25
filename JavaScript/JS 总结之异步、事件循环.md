# JS 总结之异步、事件循环

众所周知，JavaScript 为了避免复杂，被设计成了单线程。

## ⛅️ 任务

单线程意味着所有任务都需要按顺序执行，如果某个任务执行非常耗时，线程就会被阻断，后面的任务需要等上一个任务执行完毕才会进行。而大多数非常耗时的任务是网络请求，CPU 是闲着的，所以为了资源的充分运用，便有了异步的概念。

异步便是把这些非常耗时的任务放到一边，其他任务先进行，等处理完其它不需要等待的任务再回头来计算刚刚被放一边的任务。这样就不会阻断线程啦。

就像上面讲述的，后面的任务需要等上一个任务执行完毕才会进行，叫**同步任务**；把这些非常耗时的任务放到一边，其他任务先进行，叫**异步任务**。

那么问题来了，**执行异步任务后会发生什么**？

## ☁️ 任务队列

在 stack 之外存在一个**任务队列**。

当异步任务执行完成后，会将一个回调函数（回调函数是在编写异步任务时指定的，用来处理异步的结果）推入**任务队列**，这些回调函数根据类放入到 **task** 和 **microtask** 中，最先被推入的函数先被推入 stack 执行，是先进先出的数据结构。由于有定时器这类功能， stack 一般要检查时间后，某些任务才会被执行。

## 🌧 事件循环

一旦 stack 没任务了，JavaScript 引擎就会去读取任务队列，这个过程会循环不断，被叫做事件循环。

用图表示：

## 🌩 setTimeout、setInterval

上文讲的定时功能，依靠 setTimeout、setInterval 提供的定时功能，区别在于 setTimeout 在指定时间后执行一次，而 setInterval 则重复执行。

setTimeout 在任务队列尾部添加了一个事件，在设定的时间后执行。但实际没有这么理想，当任务队列前面的任务非常耗时，回调函数不一定在设置的时间运行。

所以常见的写法 setTimeout(fn, 0)，是指定某个任务在 stack 最早可得的空闲时间执行，也就是说，尽可能早得执行。

(注意：HTML5 标准规定了 setTimeout 的第二个参数的最小值（最短间隔），不得低于 4 毫秒，如果低于这个值，就会自动增加。)

## ⛈ task 与 microtask

事件循环中，存在一个 task 队列，一个 microtask 队列。

### 🌱 源

task：

- DOM 操作任务：以非阻塞方式插入文档
- 用户交互任务：鼠标键盘事件、用户输入事件
- 网络任务
- IndexDB 数据库操作等 I/O
- setTimeout / setInterval
- history.back
- setImmediate

microtask

- Promise.then
- MutationObserver
- Object.observe
- process.nextTick

用图表示：

### 🍃 运行时机

tasks 按照顺序执行，浏览器可能在它们的间隔渲染视图。

Microtasks 也是按顺序失踪的，并且在下面两种情况下执行：

1. 在 task 执行完之后执行
2. 当 stack 为空的时候，便执行完 microtask 队列里面的任务

### 🌿 举个例子

```js
console.log(1)

setTimeout(() => {
  console.log(2)
}, 0)

Promise.resolve()
  .then(() => {
    console.log(3)
  })
  .then(() => {
    console.log(4)
    setTimeout(() => {
      console.log(5)
    }, 0)
  })
```

### ☘ 问题 1

如果执行 microtask 时又遇到了 microtask 怎么个排序？

如果 microtask 在执行过程中遇到了 microtask，会将其放入 microtask 队列后面，一起执行。

改下上面的例子：

```js
console.log(1)

setTimeout(() => {
  console.log(2)
}, 0)

Promise.solve()
  .then(solve => {
    console.log(3)
    solve()
  })
  .then(() => {
    console.log(4)
    Promise.solve()
      .then(solve => {
        console.log(5)
        solve()
      })
      .then(() => {
        console.log(6)
      })
  })
```

### 🍀 问题 2

为什么需要 microtask？

根据 HTML Standard，在每个 task 运行完以后，UI 都会重渲染，那么在 microtask 中就完成数据更新，当前 task 结束就可以得到最新的 UI 了。反之如果新建一个 task 来做数据更新，那么渲染就会进行两次。

## 🚀 参考

- [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) by Jake
- [从 event loop 规范探究 javaScript 异步及浏览器更新渲染时机](https://github.com/aooy/blog/issues/5) by 杨敬卓
- [深入探究 eventloop 与浏览器渲染的时序问题](https://github.com/jin5354/404forest/issues/61) by An Yan
- [JavaScript 运行机制详解：再谈 Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html) by 阮一峰
- [这一次，彻底弄懂 JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89) by ssssyoki
- [关于 task 和 microtask 的问答](https://www.zhihu.com/question/55364497/answer/144215284) by 顾轶灵
