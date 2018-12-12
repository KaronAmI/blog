# 关于 this 应该知道的几个点

this 对每个 Jser 都不陌生，经常看到对象这里 this 那里 this，那什么是 this？答案就是上下文对象，即被调用函数所处的环境，也就是说，this 在函数内部指向了调用它（它指函数函数）的对象，通俗的讲，就是**谁调用了函数**。

## 🐥 常见的几种情况

**🐃 情况 1**

this 指向 window

```JavaScript
var name = 'xiaoming' // 思考，为什么不能用 let 或者 const ？
function foo () {
  console.log(this.name)
}
foo() // xiaoming
```

谁调用了这个函数，答案就是 window。这好理解，因为这里的变量和函数都是直接挂在 window 上的，等同于 window.foo()。`需注意，严格模式下，this 为 undefined`

**🐏 情况 2**

this 指向一个对象

```JavaScript
var name = 'xiaoming'
var foo = {
  name: 'Jon',
  getName () {
    console.log(this.name)
  }
}
foo.getName() // Jon
```

谁调用了这个函数，答案是 foo 对象，所以打印了 Jon 而不是 xiaoming

```JavaScript
var bar = foo.getName
bar() // xiaoming
```

如果赋值到另一个变量，就变成 window 调用，所以打印了 xiaoming

**🐎 情况 3**

this 指向了一个用 new 新生成的对象

```JavaScript
function Person (name) {
  this.name = name
  this.getName = function () {
    console.log(this.name)
  }
}

var jser = new Person('Jon')
jser.getName() // Jon
```

这种方式成为 new 绑定，也叫做**构造调用**。

JavaScript 中，new 的机制实际上和面向类的语言完全不同，构造函数只是一些使用 new 操作符时被调用的函数，它们并不会属于某个类，也不会实例化一个类。

**实际上，内置对象函数在内的所有函数都可以用 new 来调用，所以并不存在所谓的构造函数，只有对于函数进行构造调用**。

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作：

1. 创建（或者说构造）一个全新的对象
2. 这个新对象会被执行原型链接
3. 这个新对象会绑定到函数调用的 this
4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象

这个例子中，使用 new 来调用 Person(..) 时，我们会构造一个新对象（jser）并把它绑定到 Person(..) 调用中的 this 上。
或者可以这么想，谁调用了 getName ？就是 jser 调用了，所以 this 指向了 jser

**🦍 情况 4**

用 call，apply 和 bind 来修改 this 指向

- call / apply

call 和 apply 是以不同对象作为上下文对象来调用某个函数，举个例子：

```JavaScript
var bar = {
  name: 'bar',
  getName () {
    console.log(this.name)
  }
}

var foo = {
  name: 'foo'
}

bar.getName.call(foo) // foo
```

看起来像是**借用函数**，对象 foo 借用了 bar 的函数 getName，所以我们判断一个对象类型，经常这么搞：

```JavaScript
let foo = [1,2,3,4,5]
Object.prototype.toString.call(foo) // "[object Array]"
```

apply 和 call 的用法一样，不同点在于 call 用参数表给调用函数传参，而 apply 使用了数组

- bind

**bind 可以永久性的修改函数中的 this 的指向**，无论谁调用，this 指向都一样，并返回了完成绑定的函数，看例子：

```JavaScript
var bar = {
  name: 'bar',
  getName () {
    console.log(this.name)
  }
}

var foo = {
  name: 'foo'
}

foo.func = bar.getName.bind(bar)
foo.func() // bar
```

这里的 func 不受 foo 影响，this 还是指向了 bar

```JavaScript
var bar = {
  name: 'bar',
  getName () {
    console.log(this.name)
  }
}

func = bar.getName.bind(bar)
func() // bar
```

这里的 func 也不受 window 影响，this 还是指向了 bar

综合上述，bind 强制修改了 this，谁调用了函数 this 都不能被修改

**🐓 忽略 this**

如果你把 null 或者 undefined 作为 this 的绑定对象传入 call、apply 或者 bind，这些值再调用时会被忽略，实际应用的是默认绑定。

**🐿 箭头函数**

ES6 中介绍了一种无法使用这些规则的特殊函数类型：箭头函数，根据外层（函数或者全局）作用域来决定 this，箭头函数常用于回调函数

**🤔 情况 1 中，为什么不能用 let 声明？**

ES6 中，let 命令、const 命令、class 命令声明的全局变量，**不属于顶层对象的属性**，window 无法访问到。var 命令和 function 命令声明的全局变量，**属于顶层对象的属性**，window 能访问到。所以**情况 1** 中改为：

```JavaScript
let name = 'xiaoming'
function foo () {
  console.log(this.name)
}
foo() // undefined
```

## ❄️ 总结自：

- 《你不知道的 JavaScript 上卷》第二部分 第 2 章
- 《Node.js 开发指南》附录 A
- [《ECMAScript 6 入门》let 和 const 命令 - 顶层对象的属性](http://es6.ruanyifeng.com/#docs/let#%E9%A1%B6%E5%B1%82%E5%AF%B9%E8%B1%A1%E7%9A%84%E5%B1%9E%E6%80%A7)
