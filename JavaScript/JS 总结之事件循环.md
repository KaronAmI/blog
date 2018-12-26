# JS 总结之事件循环

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

打印出来为：1，5，3，4，2。

有没有想过为什么是这样？为什么，3 比 2 先打印？要说明白这件事，要深入到事件循环里面，看看是怎么个执行机制。

从上文知道，每个线程都有自己的事件循环，都是独立运行的。事件循环里面有 tasks 队列 和 mircotasks 队列，队列里面都按顺序存放着不同的待执行任务，这些任务从不同源划分的（这个下面会讲）。

事件循环持续不断运行，按顺序执行 tasks 队列，**在 tasks 之间，浏览器可以更新渲染**。
mircotasks 队列在**当前正在执行的 script 之后直接执行**，例如响应操作，或者某些不用新建一个 task 的异步操作。

**只要 stack 为空，mircotasks 队列就会处理**，或者**在每个 task 的末尾处理**。在处理 mircotasks 队列期间，**新添加的 microtask 添加到队列的末尾并且也会被执行**。microtasks 包括 mutation observer 回调和上面例子中的 promise then 的回调也是。

所以上面的例子：

- Promise then 的回调被分到了 promises 队列中
- 当打印完 5 后，当前 script 已经执行完毕，开始按顺序执行 promises 队列中的回调， 打印了 3
- 接着遇到了下一个 Promise then 的回调，也会被执行，打印 4，至此，promises 队列已空，开始下一轮 task
- 执行下一个 task，打印 2

所以打印了 1，5，3，4，2

### 🍀 问题

为什么需要 microtask？

根据 HTML Standard，在每个 task 运行完以后，UI 都会重渲染，那么在 microtask 中就完成数据更新，当前 task 结束就可以得到最新的 UI 了。反之如果新建一个 task 来做数据更新，那么渲染就会进行两次。

### 🌱 源

知道了 task 和 microtask 的规则后，我们来仔细划分下，tasks 和 microtask 都有哪些：

task：

- DOM 操作任务：以非阻塞方式插入文档
- 用户交互任务：鼠标键盘事件、用户输入事件
- 网络任务
- IndexDB 数据库操作等 I/O
- setTimeout / setInterval
- history.back
- setImmediate

microtask：

- Promise.then
- MutationObserver
- Object.observe
- process.nextTick

### 🍃 运行时机

tasks 按照顺序执行，浏览器可能在它们的间隔渲染视图。

Microtasks 也是按顺序失踪的，并且在下面两种情况下执行：

1. 在 task 执行完之后执行
2. 当 stack 为空的时候，便执行完 microtask 队列里面的任务

用图表示：

enmmmm。。。还是不是很理解怎么办？ 🌚

再来看一个例子：

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

运行结果：

[![Edit 8l70wz1ow0](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/8l70wz1ow0?expanddevtools=1&view=preview)

截图：

![image](./Image/microtasks.png)

当点击 inner 后，console 打印：click，promise，click，promise，timeout，timeout。

执行过程：

1. 点击 inner

| Tasks      | dispatch click |
| ---------- | -------------- |
| Microtasks |                |
| JS stack   | onClick        |
| Log        | click          |

2. 调用函数 onClick

| Tasks      | dispatch click |
| ---------- | -------------- |
| Microtasks |                |
| JS stack   | onClick        |
| Log        |                |

3. 调用函数 onClick

| Tasks      | dispatch click |
| ---------- | -------------- |
| Microtasks |                |
| JS stack   | onClick        |
| Log        | click          |

4. 遇到 setTimeout，分配进 tasks 队列

| Tasks      | dispatch click，setTimeout callback |
| ---------- | ----------------------------------- |
| Microtasks |                                     |
| JS stack   | onClick                             |
| Log        | click                               |

5. 遇 Promise then callback，放入 microtasks 队列

| Tasks      | dispatch click，setTimeout callback |
| ---------- | ----------------------------------- |
| Microtasks | Promise then                        |
| JS stack   | onClick                             |
| Log        | click                               |

6. onClick 执行完毕，将其推出 stack

| Tasks      | dispatch click，setTimeout callback |
| ---------- | ----------------------------------- |
| Microtasks | Promise then                        |
| JS stack   |                                     |
| Log        | click                               |

7. 检查 microtasks，执行待执行任务

| Tasks      | dispatch click，setTimeout callback |
| ---------- | ----------------------------------- |
| Microtasks |                                     |
| JS stack   | Promise then                        |
| Log        | click，promise                      |

8. 执行完毕，将其推出 stack

| Tasks      | dispatch click，setTimeout callback |
| ---------- | ----------------------------------- |
| Microtasks |                                     |
| JS stack   |                                     |
| Log        | click，promise                      |

9. inner 点击触发 outer 点击事件，将 outer onClick 推入 stack

| Tasks      | dispatch click，setTimeout callback |
| ---------- | ----------------------------------- |
| Microtasks |                                     |
| JS stack   | onClick                             |
| Log        | click，promise                      |

10. 执行 onClick，打印 click

| Tasks      | dispatch click，setTimeout callback |
| ---------- | ----------------------------------- |
| Microtasks |                                     |
| JS stack   | onClick                             |
| Log        | click，promise，click               |

11. 遇到 setTimeout，分配进 tasks 队列

| Tasks      | dispatch click，setTimeout callback，setTimeout callback |
| ---------- | -------------------------------------------------------- |
| Microtasks |                                                          |
| JS stack   | onClick                                                  |
| Log        | click，promise，click                                    |

12. 遇 Promise then callback，放入 microtasks 队列

| Tasks      | dispatch click，setTimeout callback，setTimeout callback |
| ---------- | -------------------------------------------------------- |
| Microtasks | Promise then                                             |
| JS stack   | onClick                                                  |
| Log        | click，promise，click                                    |

12. onClick 执行完毕，将其推出 stack

| Tasks      | dispatch click，setTimeout callback，setTimeout callback |
| ---------- | -------------------------------------------------------- |
| Microtasks | Promise then                                             |
| JS stack   |                                                          |
| Log        | click，promise，click                                    |

13. 检查 microtasks，执行待执行任务

| Tasks      | dispatch click，setTimeout callback，setTimeout callback |
| ---------- | -------------------------------------------------------- |
| Microtasks |                                                          |
| JS stack   | Promise then                                             |
| Log        | click，promise，click，promise                           |

14. 执行完毕，将其推出 stack

| Tasks      | dispatch click，setTimeout callback，setTimeout callback |
| ---------- | -------------------------------------------------------- |
| Microtasks |                                                          |
| JS stack   |                                                          |
| Log        | click，promise，click，promise                           |

15. 至此，dispatch click 执行完毕，推出dispatch click，完成第一个 task

| Tasks      | setTimeout callback，setTimeout callback |
| ---------- | ---------------------------------------- |
| Microtasks |                                          |
| JS stack   |                                          |
| Log        | click，promise，click，promise           |

16. 执行下一个 task，推入 stack，打印 timeout

| Tasks      | setTimeout callback，setTimeout callback |
| ---------- | ---------------------------------------- |
| Microtasks |                                          |
| JS stack   | setTimeout callback                      |
| Log        | click，promise，click，promise，timeout  |

17. 执行完推出，setTimeout callback

| Tasks      | setTimeout callback                     |
| ---------- | --------------------------------------- |
| Microtasks |                                         |
| JS stack   |                                         |
| Log        | click，promise，click，promise，timeout |

18. 检查无待执行的 microtasks，继续下轮 task，推入 stack，打印 timeout

| Tasks      | setTimeout callback                              |
| ---------- | ------------------------------------------------ |
| Microtasks |                                                  |
| JS stack   | setTimeout callback                              |
| Log        | click，promise，click，promise，timeout，timeout |


19. 执行完推出，setTimeout callback

| Tasks      |                                                  |
| ---------- | ------------------------------------------------ |
| Microtasks |                                                  |
| JS stack   |                                                  |
| Log        | click，promise，click，promise，timeout，timeout |

20. 完成，结果为：click，promise，click，promise，timeout，timeout

## 🚀 参考

- [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) by Jake
- [从 event loop 规范探究 javaScript 异步及浏览器更新渲染时机](https://github.com/aooy/blog/issues/5) by 杨敬卓
- [深入探究 eventloop 与浏览器渲染的时序问题](https://github.com/jin5354/404forest/issues/61) by An Yan
- [JavaScript 运行机制详解：再谈 Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html) by 阮一峰
- [这一次，彻底弄懂 JavaScript 执行机制](https://juejin.im/post/59e85eebf265da430d571f89) by ssssyoki
- [关于 task 和 microtask 的问答](https://www.zhihu.com/question/55364497/answer/144215284) by 顾轶灵
