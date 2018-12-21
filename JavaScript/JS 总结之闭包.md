# JS 总结之闭包

从[《JS 总结之函数、作用域链》](https://github.com/KaronAmI/blog/issues/25)一文中知道作用域链的作用，保证了对所有变量对象的有序访问。

## 👩‍🎨‍ 问题

函数外的是无法访问函数内部的变量，有时候要用到怎么办？我们的主角，闭包就是可以解决这个问题。

## 👷 什么是闭包

引用 MDN 上的解释：

> 闭包是函数和声明该函数的词法环境的组合。

引用 《JavaScript 高级程序设计（第 3 版）》上的解释：

> 闭包是指有权访问另一个函数作用域中的变量的函数。

### 🐳 相同点

这两个解释都在说着同一件事，闭包能访问**声明时函数所在的环境中的变量和函数**。

那具体是因为什么才会让闭包访问到环境中的变量和函数，这得靠两兄弟：**变量对象**和**作用域链**。

**变量对象**

当执行函数的时候，会创建和初始化一个执行环境，执行环境中有一个变量对象，专门用来梳理和记住这些变量和函数，是作用域链形成的前置条件 。但我们无法使用这个变量对象，该对象主要是给 JS 引擎使用的。具体可以查看[《JS 总结之变量对象》]()。

变量对象就相当于一个存放的仓库，获取到里面的东西，还得需要**去获取这些的路径**，这就是作用域链的事情了。

**作用域链**

然而，光有变量对象可完成不了闭包的形成，怎样才能让函数访问到，这得靠作用域链，作用域链的作用就是让函数找到变量对象里面的变量和函数。具体可以查看[《JS 总结之函数、作用域链》](https://github.com/KaronAmI/blog/issues/25)

### 🐬 不同点

虽然都是讲闭包，但 MDN 上面讲的是**声明该函数的词法环境**，而 JS 高程讲的是**访问另一个函数作用域中**，从解释上的不同，闭包便有了**理论中的闭包**（ MDN ）和**实践中的闭包**（ JS 高程）之分。

## 🕵 理论中的闭包

根据 MDN 的解释写个例子：

```js
var a = 1
function fn() {
  console.log(a)
}
fn()
```

函数 fn 和函数 fn 的词法作用域构成了一个闭包。但是这不是普通的函数吗？

在《JavaScript 权威指南》中也得到证实:

> 从技术的角度讲，所有 JavaScript 函数都是闭包

## 👨‍💻‍ 实践中的闭包

汤姆大叔翻译的文章中讲，实践中的闭包需要满足以下两个条件：

1. 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
2. 在代码中引用了自由变量

**什么是上下文**？即函数的执行环境。

**什么是自由变量**？即函数的词法作用域中的变量和函数，而不是函数本身的参数或者局部变量，或者说是所在函数的变量对象中的变量和函数。

这两点和 JS 高程中讲的闭包的解释不谋而合。

现在写个符合的例子：

```js
function fn() {
  var a = 1
  function fn1() {
    console.log(a)
  }
  return fn1
}

var b = fn()
b()
```

当执行 b 的时候，创建它的执行环境 fn 早已经摧毁，但函数 b 还能访问到变量 a。

好吧，我有点乱！

要彻底明白这个是咋回事，要结合**执行环境**、**活动变量**和**作用域链**来看，让我们来看看这个例子的执行过程：

### 🍑 执行过程

1. 执行全局代码，创建全局执行环境 globalContext，将全局执行环境推入**环境栈**

```js
环境栈 = [globalContext]
```

1. 初始化全局执行环境

```js
globalContext = {
  VO: [global],
  Scope: [globalContext.VO],
  this: globalContext.VO
}
```

3. 初始化的同时，创建 fn 函数，**复制 `全局执行环境的作用域链` 到 fn 的 `[[scope]]` 属性**

```js
fn.[[scope]] = [
  globalContext.VO
]
```

4. 执行 fn 函数，创建 fn 的执行环境 fnContext，并推入环境栈

```js
环境栈 = [fnContext, globalContext]
```

5. 初始化 fnContext：

- 复制 fn 的 `[[scope]]` 创建 fn 作用域链
- 创建变量对象，初始化变量对象，加入形参，函数，变量等，由于是函数，变量对象为活动对象
- 将活动对象推入 fnContext 的 Scope 顶端

```js
fnContext = {
  AO: {
    arguments: {},
    scope: undefined,
    fn1: reference to function fn1(){}
  },
  Scope: [AO, globalContext.VO],
  this: undefined
}
```

- 初始化同时，创建 fn1 函数，**复制 `fnContext 的作用域链` 到 fn1 的 `[[scope]]` 属性**

```js
fn1.[[scope]] = [
  fnContext.AO, globalContext.VO
]
```

6. 执行完毕，推出 fnContext

```js
环境栈 = [globalContext]
```

7. 执行函数 b，也就是被返回的 fn1，创建 fn1 的执行环境 fn1Context，并推入环境栈

```js
环境栈 = [
  fn1Context，
  globalContext
]
```

8. 初始化 fn1Context：

- 复制 fn1 的 `[[scope]]` 创建 fn1 作用域链
- 创建变量对象，初始化变量对象，加入形参，函数，变量等，由于是函数，变量对象为活动对象
- 将活动对象推入 fn1Context 的 Scope 顶端

```js
fn1Context = {
  AO: {
    arguments: {}
  },
  Scope: [AO, fnContext.AO, globalContext.VO],
  this: undefined
}
```

9. 执行完毕，推出 fn1Context

```js
环境栈 = [globalContext]
```

### 🍓 柳暗花明

当执行函数 b 的时候，创建它的执行环境 fn 早已摧毁（步骤 6），只留下了它的活动变量 `fnContext.AO` 于内存中（步骤 5）：

```js
fn1Context = {
  Scope: [AO, fnContext.AO, globalContext.VO]
}
```

`fnContext.AO` 存在 fn1 的作用域链中，所以能访问到**fn1 的词法环境**，这便形成了闭包。因此，闭包是变量对象和作用域链共同作用的结果。

## ❄️ 总结自：

- [《闭包》](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures) by MDN
- [《JavaScript 深入之执行上下文》](https://github.com/mqyqingfeng/Blog/issues/8) by 冴羽
- [《JavaScript 深入之闭包》](https://github.com/mqyqingfeng/Blog/issues/9) by 冴羽
- [《深入理解 JavaScript 系列（16）：闭包（Closures）》](http://www.cnblogs.com/TomXu/archive/2012/01/31/2330252.html) by 汤姆大叔
- 《JavaScript 高级程序设计（第 3 版）》4.2 执行环境及作用域、7.2 闭包
- 《JavaScript 权威指南》8.6 闭包
