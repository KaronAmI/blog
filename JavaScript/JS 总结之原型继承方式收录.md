# JS 总结之原型继承方式收录

以一个父类为前提条件，列举 js 继承的继承方式：

```JavaScript
function Person (age) {
  this.age = age || 18
}
Person.prototype.sleep = function () {
  console.log('sleeping')
}
```

## 🍖 方式 1：原型链继承（不推荐）

```JavaScript
function Programmer() {}

Programmer.prototype = new Person ()
Programmer.prototype.code = function () {
  console.log('coding')
}

let jon = new Programmer()
jon.code() // coding
jon.sleep() // sleeping

jon instanceof Person // true
jon instanceof Programmer // true

Object.getPrototypeOf(jon) // Person {age: 18, code: ƒ}
jon.__proto__ // Person {age: 18, code: ƒ}
```

缺点：

1. 无法向父类构造函数传参
2. 父类的所有属性被共享，只要一个实例修改了属性，其他所有的子类实例都会被影响

## 🌭 方式 2：借用构造函数（经典继承）（不推荐）

复制父类**构造函数内的属性**

```JavaScript
function Programmer(name) {
  Person.call(this)
  this.name = name
}
let jon = new Programmer('jon')
jon.name // jon
jon.age // 18

jon.sleep() // Uncaught TypeError: jon.sleep is not a function
jon instanceof Person // false
jon instanceof Programmer // true
```

优点：

1. 可以为父类传参
2. 避免了共享属性

缺点：

1. 只是子类的实例，不是父类的实例
2. 方法都在构造函数中定义，每次创建实例都会创建一遍方法

## 🍤 方式 3：组合继承（推荐）

组合 **原型链继承** 和 **借用构造函数继承**。

```JavaScript
function Programmer(age, name) {
  Person.call(this, age)
  this.name = name
}

Programmer.prototype = new Person()
Programmer.prototype.constructor = Programmer // 修复构造函数指向

let jon = new Programmer(18, 'jon')
jon.age // 18
jon.name // jon

let flash = new Programmer(22, 'flash')
flash.age // 22
flash.name // flash

jon.age // 18

jon instanceof Person // true
jon instanceof Programmer // true
flash instanceof Person // true
flash instanceof Programmer // true
```

优点：融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式

缺点：调用了两次父类构造函数

## 🌮 方式 4：原型式继承（不推荐）

```JavaScript
function create(o) {
  function F() {}
  F.prototype = o
  return new F()
}

let obj = {
  gift: ['a', 'b']
}

let jon = create(obj)
let xiaoming = create(obj)

jon.gift.push('c')
xiaoming.gift // ['a', 'b', 'c']
```

缺点：共享了属性和方法

## 🍳 方式 5：寄生式继承（不推荐）

创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来做增强对象，最后返回对象

```JavaScript
function createObj (o) {
  var clone = Object.create(o)
  clone.sayName = function () {
    console.log('hi')
  }
  return clone
}
```

缺点：跟借用构造函数模式一样，每次创建对象都会创建一遍方法

## 🍧 方式 6：寄生组合继承（最佳）

子类构造函数复制父类的自身属性和方法，子类原型只接受父类的原型属性和方法：

```JavaScript
function create(prototype) {
  function Super() {}
  Super.prototype = prototype
  return new Super()
}

function Programmer(age, name) {
  Person.call(this, age)
  this.name = name
}

Programmer.prototype = create(Person.prototype)
Programmer.prototype.constructor = Programmer // 修复构造函数指向

let jon = new Programmer(18, 'jon')
jon.name // jon
```

进阶封装：

```JavaScript

function create(prototype) {
  function Super() {}
  Super.prototype = prototype
  return new Super()
}

function prototype(child, parent) {
  let prototype = create(parent.prototype)
  prototype.constructor = child // 修复构造函数指向
  child.prototype = prototype
}

function Person (age) {
  this.age = age || 18
}
Person.prototype.sleep = function () {
  console.log('sleeping')
}

function Programmer(age, name) {
  Person.call(this, age)
  this.name = name
}

prototype(Programmer, Person)

let jon = new Programmer(18, 'jon')
jon.name // jon
```

引用《JavaScript 高级程序设计》中对寄生组合式继承的夸赞就是：

> 这种方式的高效率体现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 instanceof 和 isPrototypeOf。开发人员普遍认为寄生组合式继承是引用类型最理想的继承范式。

## 🍜 方式 7：ES6 extends（最佳）

```JavaScript
// 父类
class Person {
  constructor(age) {
    this.age = age
  }
  sleep () {
    console.log('sleeping')
  }
}

// 子类
class Programmer extends Person {
  constructor(age, name) {
    super(age)
    this.name = name
  }
  code () {
    console.log('coding')
  }
}

let jon = new Programmer(18, 'jon')
jon.name // jon
jon.age // 18

let flash = new Programmer(22, 'flash')
flash.age // 22
flash.name // flash

jon instanceof Person // true
jon instanceof Programmer // true
flash instanceof Person // true
flash instanceof Programmer // true
```

优点：不用手动设置原型。

缺点：新语法，只要部分浏览器支持，需要转为 ES5 代码。

## ❄️ 参考

- 《JavaScript 高级程序设计（第 3 版）》6.3 继承
- [《JavaScript 深入之继承的多种方式和优缺点》](https://github.com/mqyqingfeng/Blog/issues/16) by 冴羽
- [《ECMAScript 6 入门》Class 的继承](http://es6.ruanyifeng.com/#docs/class-extends) by 阮一峰
