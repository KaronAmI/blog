# JS 总结之变量

ECMAScript 的变量是松散类型的，所谓松散类型就是可以用来保存**任何类型**的数据。也就是说，每个变量仅仅是一个用于保存值的占位符而已。

变量名包括函数名，必须是有效的标识符，由 a ~ z、A ~ Z、\$ 或 \_ 开头，可以包含前面所有这些字符以及数字 0~9。

但保留字（for、in、if、null、true、false 等）不可以用来做变量名，但可以做属性名：

```js
var a = {
  null: 1 // 极度不推荐
}
a.null // 1
```

## var

全局中定义一个变量：

```js
var a
var a = 1
```

当 a 不设置初始值的时候，默认值为 undefined。

可以改变 a 的值：

```js
a = 'hi'
```

a 并不会被标记为特定的类型，当复制的类型改变，a 的类型也随之改变。

var 定义的变量无法使用 delete 删除

```js
// ...
delete a // false
a // 1
```

如果变量定义在一个函数中，该变量为局部变量，变量会随函数退出后而销毁：

```js
function fn() {
  var a = 1
}
fn()
console.log(a) // Uncaught ReferenceError: a is not defined
```

如果省略了 var 定义一个变量，会创建一个全局变量，该变量可被 delete 删除

```js
function fn() {
  a = 1
}
fn()
console.log(a) // 1
```

不推荐这样定义一个全局变量，严格模式下回导致 ReferenceError 错误。

多个定义可以用逗号隔开一次性定义：

```js
var a = 1,
  b = 2,
  c = 3
```

### 提升

无论 var 出现在一个作用域中哪个位置，这个声明都属于整个作用域，在其中到处都是可以访问的，这被称为**提升**，举个例子：

```js
console.log(a)
var a = 1

// 等价于

var a = undefined
console.log(a) // undefined
a = 1
```

**函数也存在提升现象，并且在变量之前**，举个例子：

```js
console.log(a) // ƒ a() {}
var a = 1
function a() {}
```

这里的 a 为什么不会影响到函数 a ？这是因为变量对象收集变量时的一个特点：**如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性**。具体可以查看[JS 总结之变量对象](https://github.com/KaronAmI/blog/issues/27)

所以等同于：

```js
function a() {}
var a = undefined // 此处的 a 并不会影响到函数 a
console.log(a) // ƒ a() {}
a = 1
```

在 ES6 之前，块作用域只有函数内，其它的大括号不会形成块作用域，提升负主要责任，举个例子：

```js
if (true) {
  var a = 1
}
console.log(a) // 1
```

此处 a 并不会因为 a 是在大括号内变成局部变量，a 还是被提升到外面了：

```js
var a = undefined
if (true) {
  a = 1
}
console.log(a) // 1
```

ES6 之后，要定义一个局部变量，可以使用新语法 let 和 const

## let / const

查看总结：《JS 总结之 let / const》（未完成）

## 参考

- JavaScript 高级程序设计（第 3 版）3.3
