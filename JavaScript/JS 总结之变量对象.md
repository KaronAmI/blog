# JS 总结之变量对象

就如上一篇[《JS 总结之闭包》](https://github.com/KaronAmI/blog/issues/26)中谈到的，闭包的形成是变量对象和作用域链共同作用的结果。

什么是变量对象？变量对象是执行环境的一个属性，储存在与执行环境相关的变量和函数声明。

## 🥇 不同执行环境中的变量对象

根据执行环境的不同，可分为全局执行环境的变量对象和函数执行环境的变量对象。

### 🤺 全局执行环境

首先我们需要理解以下几个概念：

#### 🥛 Global 对象

Global 对象可以说是 ECMAScript 中最特别的一个对象了，因为不管你从什么角度上看，这个对象都是不存在的。ECMAScript 中的 Global 对象在某种意义上是作为一个终极的“兜底儿对象”来定义的。换句话说，不属于其他对象的属性和方法，最终都是它的属性和方法。

事实上，**没有全局变量或全局函数，所有在全局作用域中定义的属性和函数，都是 Global 对象的属性**。

#### 🍺 window 对象

在浏览器中，window 对象有着双重角色，既是**通过 JavaScript 访问浏览器窗口的一个接口**，又是 **ECMAScript 规定的 Global 对象**。

ECMAScript 虽然没有指出如何直接访问 Global 对象，但是 **Web 浏览器都是将这个 Global 对象作为 window 对象的一部分加以实现的**。因此，在全局作用域中声明的所有变量和函数，就都成为了 window 对象的属性。

#### 🍷 全局执行环境

在 Web 浏览器中，**全局执行环境被认为是 window 对象**，因此，所有全局变量和函数都是作为 window 对象的属性和方法创建的。全局执行环境直到应用程序退出（如关闭网页或浏览器）时才会摧毁。

#### ☕️ 全局执行环境中的变量对象

综上所述，可以理解为，**全局作用域 == window 对象 == Global 对象**。而变量对象是为了找到属性和方法，所以，全局执行环境中的变量对象（Variable Object，缩写为 **VO**）只能是 Global 对象了，因为能在上面找到属性和方法。

### ⛹ 函数执行环境

在函数执行环境中，全局执行环境的变量对象 VO 不能直接访问，此时由激活对象（Activation Object,缩写为 **AO**）扮演 VO 的角色。

激活对象 AO 是在进入函数执行环境时刻被创建的，它通过函数的 arguments 属性初始化。arguments 属性的值是 Arguments 对象。

对于 VO 和 AO 的关系可以理解为，VO 在不同的 Execution Context 中会有不同的表现：当在全局执行环境中，可以直接使用 VO；但是，在函数执行环境中，AO 就会被创建。

当函数执行完后，函数执行环境被摧毁，变量对象也会随之摧毁。

## 🥈 处理代码

全局执行环境和函数执行环境对代码处理都是一样的，分成两个基本的阶段来处理：

1. 建立阶段
2. 执行阶段

### 🍼 建立阶段

当建立阶段(代码执行之前)时，VO 里已经包含了下列属性(前面已经说了)：

1. **函数的所有形参**（函数执行上下文中）
   - 变量对象以名字为属性名，值为属性值创建属性；
   - 如果没有对应的参数的话，属性值为 undefined。
2. **所有函数声明**
   - 由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建；
   - 如果变量对象已经存在相同名称的属性，则完全替换这个属性。
3. **所有变量声明**
   - 由名称和对应值（undefined）组成一个变量对象的属性被创建；
   - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性。

（注意：**未声明的变量不会放入变量对象中**）

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
  c: <reference to FunctionDeclaration ‘c’>,
  d: undefined,
}
```

### ☕️ 执行阶段

根据代码的执行顺序，修改变量对象的值，上面的例子变为：

```js
AO(test) = {
  arguments: {
    0: 1,
    length: 1
  },
  a: 1,
  b: 10,
  c: <reference to FunctionDeclaration ‘c’>,
  d: <reference to FunctionExpression ‘_e’>,
}
```

至此，变量对象就生成完毕。

## 🚀 参考

- [深入理解 JavaScript 系列（12）：变量对象（Variable Object）](http://www.cnblogs.com/TomXu/archive/2012/01/16/2309728.html) by 汤姆大叔
- [JavaScript 的执行上下文](http://www.cnblogs.com/wilber2013/p/4909430.html) by 田小计划
- 《JavaScript 高级程序设计（第 3 版）》4.2 、5.7.1 、8.1
