# JS 总结之对象

我们都知道，对象一般是类的实例，如 Java，Python 等这类面向对象语言，而 JavaScript 中没有类，因此 JavaScript 中的对象不是类的实例，而是基于原型的对象。

JavaScript 中的对象 **Object** 是 7 种内置类型（**number, string, null, undefined, boolean, object, symbol**）之一，是由 key 和 value 组成，value 可以是任意数据类型。

## 🔨 创建

JavaScript 可以用 **声明形式** 和 **构造形式** 的方式创建对象

### 🚋 声明形式

```JavaScript
let obj = {
  name: 'Jon',
  age: 18,
  say: () => {
    console.log('hello')
  }
}
```

这种方式创建的对象需要注意点是，按照命名规范命名的 key 加不加引号都可以，不符合命名规范的 key 要加引号，如：

```JavaScript
let obj = {
  'first_name': 'Jon',
}
```

### 🚂 构造形式

```JavaScript
let obj = new Object()
obj.name = 'Jon'
obj.age = 18
obj.say = () => {
  console.log('hello')
}
```

给构造器生成的对象添加属性需要一个一个添加

## ⛏ 访问

访问一个对象的属性值可以通过 **. 操作符** 和 **[] 操作符** 进行访问，举个粟子：

**. 操作符**：要求属性名满足标识符的命名规范

**[] 操作符**：可以接受任意 UTF-8/Unicode 字符串作为属性名

```JavaScript
let obj = {
  'first_name': 'Jon',
  age: 18,
  say: () => {
    console.log('hello')
  }
}

obj.age // 通过 .运算符 访问，18
obj['age'] // 通过 []操作符  访问，18
obj['first_name'] // 通过 []操作符 访问，Jon
```

## 🔧 get/set

### 🛥 使用 get

```JavaScript
let person = {
  _age: 18,
  get age () {
    return this._age
  }
}

person.age // Jon's age: 18
```

### ⛵️ 使用 set

```JavaScript
let play = {
  game: [],
  set current (name) {
    this.game.push(name)
  }
}

play.current = 'dota2'
play.game // ['dota2']
```

涉及 getter 和 setter 的 Object.create()、object.defineProperty()、object.defineProperties() 后待补充

## 🛰 对象的扩展（ES6 / ES7）

### 🚗 属性简写

```JavaScript
let name = 'Jon'
let person = {name}
// 等同于
let person = {name: name}
```

### 🚕 对象函数简写

```JavaScript
let person = {
  say () {
    console.log('hello')
  }
}
// 等同于
let person = {
  say: function () {
    console.log('hello')
  }
}
```

### 🚙 属性表达式

属性，方法名，getter 和 setter 都支持

```JavaScript
let firstName = 'first name'
let age = 'age'
let current = 'current'
let person = {
  [firstName] : 'Jon',
  get [age] () {
    return 18
  },
  set [current] (name) {
    this[firstName] = name
  }
}
person['first name'] // 'Jon'
person.age // 18
person.current = 'karon'
person['first name'] // 'karon'
```

注意：属性表达式和简写不能同时使用，比如：

```JavaScript
let firstName = 'first name'
// 报错
let person = {
  [firstName]
}
```

### 🚌 属性的遍历

ES6 一共有 5 种方法可以遍历对象的属性。

1. **for...in** 循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

2. **Object.keys(obj)** 返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

3. **Object.getOwnPropertyNames(obj)** 返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

4. **Object.getOwnPropertySymbols(obj)** 返回一个数组，包含对象自身的所有 Symbol 属性的键名。

5. **Reflect.ownKeys(obj)** 返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

首先遍历所有数值键，按照数值升序排列。
其次遍历所有字符串键，按照加入时间升序排列。
最后遍历所有 Symbol 键，按照加入时间升序排列。

### 🏎 对象解构、扩展运算符

```JavaScript
let person = {
  name: 'Jon',
  age: 18,
  say () {
    console.log('hello')
  }
}

let {name, age, say} = person
```

要求等号右边必须是一个对象，否则会报错，如：

```JavaScript
let {a} = undefined // 报错
let {a} = null // 报错
```

并没有拷贝到原型对象上的属性

```JavaScript
let name = {name: 'Jon'}
let person = {age: 18}
person.__proto__ = name
let {...a} = person
a.name // undefined
```

如果属性对象，只是拷贝引用

```JavaScript
let person = { habit: {name: 'play game' }}
let {...a} = person
person.habit.name = 'study'
a.habit.name // study
```

展开

```JavaScript
let obj = {
  name: 'Jon',
  age: 18
}

let person = {...obj}
person // { name: 'Jon', age: 18 }
```

利用展开可以用来合并对象

```JavaScript
let gift = { skill: 'faster' }
let person = {
  name: 'barry'
}
let flash = {...person, ...gift}
flash // {name: 'barry', skill: 'faster'}
```

### 🚜 新增的常用方法

**【es6】Object.is(..)**

比较两个值是否相同，与 === 严格比较的区别在 +0 与-0，NaN 与 NaN

```JavaScript
+0 === -0 // true
NaN === NaN // false
Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

**【es6】Object.assign(..)**

对象合并，将后面的对象的属性复制给第一个参数，也就是目标对象，需注意：可复制的属性为自身属性和可枚举的属性，继承而来的属性无法被复制，如果是相同属性，后面的会覆盖前面的，举个栗子：

```JavaScript
let person = { name: 'barry', skill: 'run' }
let superSkill = {skill: 'flash'}
Object.assign({}, person, superSkill) // {name: 'barry', skill: 'flash'}
```

也可以用来处理数组，如下，b 把 a 引索为 0 和 1 的覆盖了

```JavaScript
let a = [1, 2, 3]
let b = [4, 5]
Object.assign([], a, b) // [4, 5, 3]
```

**【es6】Object.keys(..)**

遍历自身属性，不含继承属性和 Symbol 属性

```JavaScript
let person = { name: 'barry', skill: 'run', [Symbol('skill')]: 'run flash'}
Object.keys(person) // ['name', 'skill']
```

**【es6】Object.getOwnPropertySymbols(..)**

```JavaScript
let person = {
  [Symbol('skill')]: 'run flash'
}

Object.getOwnPropertySymbols(person) // [Symbol(skill)]
```

**【es7】Object.values(..)**

遍历自身属性，不含继承属性和 Symbol 属性

```JavaScript
let person = { name: 'barry', skill: 'run', [Symbol('skill')]: 'run flash'}
Object.values(person) // ['barry', 'run']
```

**【es7】Object.entries(..)**

遍历自身属性，不含继承属性和 Symbol 属性

```JavaScript
let person = { name: 'barry', skill: 'run', [Symbol('skill')]: 'run flash'}
Object.entries(person) // [['name', 'barry'], ['skill', 'run']]
```

将对象转为 Map 对象：

```JavaScript
let person = { name: 'barry', skill: 'run', [Symbol('skill')]: 'run flash'}
let personArr = Object.entries(person) // [['name', 'barry'], ['skill', 'run']]
let personMap = new Map(personArr) // Map { name: 'barry', skill: 'run' }
```

**【es7】Object.fromEntries(..)**

为 Object.entries()的逆操作，用于将一个键值对数组转为对象。

```JavaScript
let person = [['name', 'barry'], ['skill', 'run']]
Object.fromEntries(person) // { name: 'barry', skill: 'run' }
```

**【es7】Object.getOwnPropertyDescriptors(..)**
获取对象所有自身的属性描述符

```JavaScript
let barry = { name: 'barry', skill: 'run' }
Object.getOwnPropertyDescriptors(barry)
/* {
  name: {
    value: "barry",
    configurable: true,
    enumerable: true,
    writable: true
  },
  skill: {
    value: "run",
    configurable: true,
    enumerable: true,
    writable: true
  }
} */
```

对应的有：【ES5】的 Object.getOwnPropertyDescriptor(..)

## 🚀 总结自：

- [《ECMAScript 6 入门》对象扩展](http://es6.ruanyifeng.com/?search=get&x=0&y=0#docs/object) by 阮一峰
- [《getter》](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/get) by MDN
- [《setter》](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/set) by MDN
- 《你不知道的 JavaScript 下卷》第六章 新增 API - Object
- 《Node.js 开发指南》附录 A
