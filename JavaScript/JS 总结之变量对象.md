# JS 总结之变量对象

就如上一篇[《JS 总结之闭包》](https://github.com/KaronAmI/blog/issues/26)中谈到的，闭包的形成是变量对象和作用域链共同作用的结果。

什么是变量对象？变量对象是执行环境的一个属性，储存在与执行环境相关的变量和函数声明。

## 🥇 不同执行环境中的变量对象

根据执行环境的不同，可分为全局执行环境的变量对象和函数执行环境的变量对象。

### 🤺 全局执行环境

全局执行环境的变量对象被叫做全局对象，该对象在打开浏览器的时候就存在了，生命周期终止于程序退出那一刻。

该对象可以在任何地方访问创建阶段的自身属性，如 Math，String，Date 等。

全局对象是不能通过名称直接访问的，所以当需要访问全局对象的属性时，我们可以**通过 this 来间接访问全局对象**。

除了使用 this，还可以**通过 window 来间接访问全局对象**，window 被当做全局对象的一个属性，指向了全局对象本身。

用伪代码来表示大概就是：

```js
VO(globalContext) = global = {
  ..
  window: global
}
```

### ⛹ 函数执行环境

在函数执行环境中，此时由活动对象（ AO ）代替变量对象。活动对象在进入函数执行环境的时创建，通过函数的 arguments 属性初始化。arguments 属性的值是 Arguments 对象。

```js
VO(functionContext) === AO
```

## 🥈 处理代码

全局执行环境和函数执行环境对代码处理都是一样的，分成两个基本的阶段来处理：

1. 进入执行上下文
2. 执行代码

### 🍼 进入执行上下文

当进入执行上下文(代码执行之前)时，VO 里已经包含了下列属性(前面已经说了)：

1. 函数的所有形参(如果我们是在函数执行上下文中)
   - 变量对象以名字为属性名，值为属性值创建属性；
   - 如果没有对应的参数的话，属性值为 undefined。
2. 所有函数声明
   - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建；
   - 如果变量对象已经存在相同名称的属性，则完全替换这个属性。
3. 所有变量声明
   - 由名称和对应值（undefined）组成一个变量对象的属性被创建；
   - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性。

（注意：**未声明的变量不会放入变量对象中**）

让我们看一个例子：

```js
function test(a) {
  var b = 10
  function c() {}
  var d = function _e() {}
}

test(10) // call
```

当进入带有参数 10 的 test 函数上下文时，AO 表现为如下：

```js
AO(test) = {
  arguments: {
    0: 1,
    length: 1
  },
  a: 1,
  b: undefined,
  c: <reference to FunctionDeclaration 'c'>,
  d: undefined,
}
```

### ☕️ 代码执行

根据代码的执行顺序，修改变量对象的值，上面的例子变为：

```js
AO(test) = {
  arguments: {
    0: 1,
    length: 1
  },
  a: 1,
  b: 10,
  c: <reference to FunctionDeclaration 'c'>,
  d: <reference to FunctionExpression '_e'>,
}
```

至此，变量对象就生成完毕。

## 🚀 总结自：

- [深入理解 JavaScript 系列（12）：变量对象（Variable Object）](http://www.cnblogs.com/TomXu/archive/2012/01/16/2309728.html) by 汤姆大叔
