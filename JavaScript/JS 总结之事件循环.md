# JS 总结之 事件循环

众所周知，JavaScript 为了避免复杂，被设计成了单线程。

## ⛅️ 任务

单线程意味着所有任务都需要按顺序执行，如果某个任务执行非常耗时，线程就会被阻断，后面的任务需要等上一个任务执行完毕才会进行。而大多数非常耗时的任务是网络请求，CPU 是闲着的，所以为了资源的充分运用，便有了异步的概念。

异步便是把这些非常耗时的任务放到一边，其他任务先进行，等处理完其它不需要等待的任务再回头来计算刚刚被放一边的任务。这样就不会阻断线程啦。

就像上面讲述的，后面的任务需要等上一个任务执行完毕才会进行，叫**同步任务**；把这些非常耗时的任务放到一边，其他任务先进行，叫**异步任务**。

那么问题来了，**执行异步任务后会发生什么**？

## ☁️ 任务队列

在 stack 之外存在一个**任务队列**。

当异步任务执行完成后，会将一个回调函数（回调函数是在编写异步任务时指定的，用来处理异步的结果）推入**任务队列**，这些回调函数根据类放入到 **tasks** 和 **microtasks** 中，最先被推入的函数先被推入 stack 执行，是先进先出的数据结构。由于有定时器这类功能， stack 一般要检查时间后，某些任务才会被执行。

## 🌧 事件循环

**一旦 stack 没任务了**，JavaScript 引擎就会去读取任务队列，这个过程会循环不断，被叫做事件循环。

## 🌩 setTimeout、setInterval

上文讲的定时功能，依靠 setTimeout、setInterval 提供的定时功能，区别在于 setTimeout 在指定时间后执行一次，而 setInterval 则重复执行。

setTimeout 在任务队列尾部添加了一个事件，在设定的时间后执行。但实际没有这么理想，当任务队列前面的任务非常耗时，回调函数不一定在设置的时间运行。

所以常见的写法 setTimeout(fn, 0)，是指定某个任务在 stack 最早可得的空闲时间执行，也就是说，尽可能早得执行。

(注意：HTML5 标准规定了 setTimeout 的第二个参数的最小值（最短间隔），不得低于 4 毫秒，如果低于这个值，就会自动增加。)

## ⛈ task 与 microtask

先看一个例子：

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
  })

console.log(5)
```

打印出来为：1，5，3，4，2。**why?** ☃️

### 🌱 初探

从上文知道，每个线程都有自己的事件循环，都是独立运行的。事件循环里面有 task 队列 和 mircotask 队列，队列里面都按顺序存放着不同的待执行任务，这些任务从不同源划分的。

tasks 包含生成 dom 对象、解析 HTML、执行主线程 js 代码、更改当前 URL 还有其他的一些事件如页面加载、输入、网络事件和定时器事件。从浏览器的角度来看，**tasks 代表一些离散的独立的工作**。当执行完一个 task 后，浏览器可以继续其他的工作如页面重渲染和垃圾回收。

**microtasks 则是完成一些更新应用程序状态的较小任务**，如处理 promise 的回调和 DOM 的修改，这些任务在浏览器重渲染前执行。Microtask 应该以异步的方式尽快执行，其开销比执行一个新的 macrotask 要小。Microtasks 使得我们可以在 UI 重渲染之前执行某些任务，从而避免了不必要的 UI 渲染，这些渲染可能导致显示的应用程序状态不一致。

事件循环持续不断运行，按顺序执行 task 队列，如例子中的 setTimeout, 在 tasks 之间，浏览器可以更新渲染。**只要 stack 为空，mircotask 队列就会处理**，或者**在每个 task 的末尾处理**。在处理 mircotask 队列期间，**新添加的 microtask 添加到队列的末尾并且也会被执行**，如上文的 Promise then callback。

大概顺序就是：

第一轮：检查 task 队列 -> 检查 microtask 队列 -> 检查是否需要渲染更新
下 1 至 n 轮：...

### ☘ 源

一般来说，task 和 microtask 都有哪些：

task：

- DOM 操作任务：以非阻塞方式插入文档
- 用户交互任务：鼠标键盘事件、用户输入事件
- 网络任务
- IndexDB 数据库操作等 I/O
- setTimeout / setInterval
- history.back
- setImmediate（涉及 node，不在这里讨论，但归纳在这）

microtask：

- Promise.then
- MutationObserver
- Object.observe
- process.nextTick（涉及 node，不在这里讨论，但归纳在这）

> Jake Archibald 大大 说：setImmediate is task-queuing, whereas nextTick is before other pending work such as I/O, so it's closer to microtasks.

### 🍃 小试牛刀

尝试分析一下上面的例子：

- Promise then 的回调被分到了 microtask 队列中
- 当打印完 5 后，当前 script 已经执行完毕，开始按顺序执行 microtask 队列中的回调，打印了 3
- 接着遇到了下一个 Promise then 的回调，也会被执行，打印 4，至此，microtask 队列已空，开始下一轮 task
- 执行下一个 task，打印 2

所以打印了 1，5，3，4，2

### 🍀 运行时机

Tasks 按照顺序执行，浏览器可能在它们的间隔渲染视图。

Microtasks 也是按顺序执行的，执行的顺序，在下面两种情况下执行：

**1. 在 task 执行完之后执行。**

来看一个例子：

```js
var outer = document.querySelector('.outer')
var inner = document.querySelector('.inner')

function onClick() {
  console.log('click')

  setTimeout(function() {
    console.log('timeout')
  }, 0)

  Promise.resolve().then(function() {
    console.log('promise')
  })
}

inner.addEventListener('click', onClick)
outer.addEventListener('click', onClick)
```

在线查看：[Edit on CodeSandBox](https://codesandbox.io/s/8l70wz1ow0)

**截图**：

![image](./Image/microtasks.png)

当点击 inner 后，console 打印：click，promise，click，promise，timeout，timeout。

**执行过程**：（用文字描述看不清楚，画了个图来一步一步根据）

触发 inner 点击之后：

![loop1](Image/loop1.png)

触发 outer 点击之后：

![loop2](Image/loop2.png)

**2. 当 stack 为空的时候，便执行完 microtask 队列里面的任务。**

可以在规范 [html 规范: Cleaning up after a callback step](https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-a-callback) 中找到:

> If the JavaScript execution context stack is now empty, perform a microtask checkpoint.

我们把上面的例子改一下：

```js
var outer = document.querySelector('.outer')
var inner = document.querySelector('.inner')

function onClick() {
  console.log('click')

  setTimeout(function() {
    console.log('timeout')
  }, 0)

  Promise.resolve().then(function() {
    console.log('promise')
  })
}

inner.addEventListener('click', onClick)
outer.addEventListener('click', onClick)

inner.click()
```

加上 **inner.click()** 这句，情况变得不一样，在线查看：[Edit on CodeSandBox](https://codesandbox.io/s/737l93455q)

**截图**：

![image](./Image/microtasks2.png)

当点击 inner 后，console 打印：click，click，promise，promise，timeout，timeout。

**执行过程**：（还是画图）

触发 inner 点击之后：

![loop3](Image/loop3.png)

触发 outer 点击之后：

![loop4](Image/loop4.png)

这个例子与上一个不同，当执行完第 6 步，并没有检查 microtask 队列，因为 stack 并没为空，script 还在 stack 中。这也说明，上面的规则确保了 microtasks 不打断当前代码执行。

联系[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) 文中的解释：

> ... The above rule ensures microtasks don't interrupt JavaScript that's mid-execution. This means we don't process the microtask queue between listener callbacks, they're processed after both listeners.

## ⛅️ 总结

1. 事件循环持续不断运行；
2. 事件循环包含 task 队列和 microtask 队列；
3. task 队列和 microtask 队列都是按照队列内顺讯执行的，即先进先出；
4. tasks 之间（执行完 microtasks 之后），浏览器可以更新渲染；
5. microtasks 不会打断当前代码执行；
6. 在 task 执行完之后执行，或者当 stack 为空时，检查 microtask 队列并执行其中的任务；
7. 新添加的 microtask 添加到队列的末尾并且也会被执行；
8. 事件循环同一时间内只执行一个任务；
9. 任务一直执行到完成，不能被其他任务抢断。

## 🚀 参考

- [HTML Living Standard: event-loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops) by WHATWG
- [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) by Jake Archibald
- [深入探究 eventloop 与浏览器渲染的时序问题](https://github.com/jin5354/404forest/issues/61) by An Yan
- [JavaScript 运行机制详解：再谈 Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html) by 阮一峰
- [这一次，彻底弄懂 JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89) by ssssyoki
- [关于 task 和 microtask 的问答](https://www.zhihu.com/question/55364497/answer/144215284) by 顾轶灵
- [HTML 系列：macrotask 和 microtask](https://zhuanlan.zhihu.com/p/24460769) by 杨健
