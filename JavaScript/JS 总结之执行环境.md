# JS 总结之执行环境

## 🍓 运行环境

JavaScript 中，有三种代码运行环境：

1. Global 环境
2. Function 环境
3. Eval 环境

为了表示不同的运行环境，JavaScript 中有一个**执行环境**的概念。

## 🍑 执行环境

执行环境都有三个重要的属性：

- 变量对象
- 作用域链
- this

这三个属性跟代码运行的行为有很重要的关系，在之前的文章中都有详细分析。具体可以查看[《JS 总结之函数、作用域链》](https://github.com/KaronAmI/blog/issues/25)、[《JS 总结之变量对象》](https://github.com/KaronAmI/blog/issues/27)和[《JS 总结之关于 this 应该知道的几个点》](https://github.com/KaronAmI/blog/issues/21)。

当一段 JavaScript 代码执行的时候，JavaScript 解释器会创建执行环境，其实这里会有两个阶段：

1. **创建阶段**（当函数被调用，但是开始执行函数内部代码之前）

- 创建 Scope chain
- 创建 VO / AO（variables, functions and arguments）
- 设置 this 的值

2. **激活/代码执行阶段**

- 设置变量的值、函数的引用，然后解释/执行代码

整个执行过程可以参考[《JS 总结之闭包》](https://github.com/KaronAmI/blog/issues/26)中举的例子。

## 🍒 执行环境栈

当 JavaScript 代码执行的时候，会进入不同的执行环境，这些执行环境会构成一个**执行环境栈**。在开始解析代码的时候，会将全局执行环境 globalContext 压入执行环境栈中：

```js
执行环境栈 = [globalContext]
```

现在写个例子：

```js
var a = 1

function d() {}

function b() {
  function c() {
    d()
  }
  c()
}
b()
```

那么对应的执行环境栈为：

```js
执行环境栈 = [
  dContext
  cContext,
  bContext,
  globalContext
]
```

当每个执行环境执行完后，执行环境栈会将它往外丢，最后只剩下 globalContext。globalContext 直到应用程序退出（如关闭网页或浏览器）时才会摧毁。。

## 🚀 参考

- [JavaScript 的执行上下文](http://www.cnblogs.com/wilber2013/p/4909430.html) by 田小计划
- [JavaScript 深入之执行上下文栈](https://github.com/mqyqingfeng/Blog/issues/4) by 冴羽
