# # JS 总结之数组常用的方法

## push

**用途**：将一个或多个元素添加到**数组的末尾**，并**返回该数组的新长度**。

**语法**：arr.push(element1, …, elementN)

**返回**：新的 length 属性值

**注意**：**改变了原数组**

**示例**：

```js
let a = [1, 2]
let b = a.push(3, 4)
console.log(b) // 4
console.log(a) // [1, 2, 3, 4]
```

a 被修改了

## unshift

**用途**：将一个或者多个元素添加到**数组的开头**，并**返回该数组的新长度**。

**语法**：arr.unshift(element1, …, elementN)

**返回**：新的 length 属性值

**注意**：**改变了原数组**

**示例**：

```js
let a = [1, 2]
let b = a.unshift(3, 4)
console.log(b) // 4
console.log(a) // [3, 4, 1, 2]
```

a 被修改了

## shift

**用途**：从数组中**删除第一个元素**，并**返回该元素的值**。

**语法**：arr.shift()

**返回**：被删除的元素的值，如果数组为空则返回 undefined

**注意**：**改变了原数组**

**示例**：

```js
let a = [1, 2, 3, 4]
let b = a.shift()
console.log(b) // 1
console.log(a) // [2, 3, 4]
```

a 被修改了

## pop

**用途**：从数组中**删除最后一个元素**，并返回该元素的值。

**语法**：arr.pop()

**返回**：被删除的元素的值，如果数组为空则返回 undefined

**注意**：**改变了原数组**

**示例**：

```js
let a = [1, 2, 3, 4]
let b = a.pop()
console.log(b) // 4
console.log(a) // [1, 2, 3]
```

a 被修改了

## reverse

**用途**：将数组中的位置颠倒。

**语法**：arr.reverse()

**返回**：该数组的引用

**注意**：**改变了原数组**

**示例**：

```js
let a = [1, 2, 3, 4]
let b = a.reverse()
console.log(a) // [4, 3, 2, 1]
console.log(b) // [4, 3, 2, 1]
console.log(a === b) // true
```

a 被修改了

## sort

## concat

**用途**：合并两个或多个数组。

**语法**：var new_array = old_array.concat(value1[, value2[, ...[, valueN]]])

**返回**：该数组的引用

**注意**：**返回新数组**

**示例**：

```js
let a = [1, 2, 3, 4]
let b = ['a', 'b']
let c = [[1, 2]]

let new_arr = a.concat(b, c)

console.log(new_arr) // [1, 2, 3, 4, "a", "b", [1, 2]]
console.log(a) // [1, 2, 3, 4]
console.log(b) // ['a', 'b']
console.log(c) // [[1, 2]]
```

## indexOf

**用途**：返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。

**语法**：arr.indexOf(searchElement[, fromIndex = 0])

**参数**：

- searchElement 要查找的元素
- fromIndex 开始查找的位置
  - 为负数时，从数组末尾开始查找，-1 为最后一个元素，-2 为倒数第二个，以此类推
  - 如果参数中提供的索引值是一个负值，仍然会从前向后查询数组

**返回**：首个被找到的元素在数组中的索引位置，若没有找到则返回 -1

**示例**：

```js
let a = [1, 2, 3, 4]

a.indexOf(1) // 0
a.indexOf(7) // -1
a.indexOf(2, 2) // -1
a.indexOf(2, 1) // 1
a.indexOf(2, 0) // 1
a.indexOf(2, -1) // -1
a.indexOf(2, -2) // -1
a.indexOf(2, -3) // 1
```

## lastIndexOf

## slice

## splice

## forEach

## map

## filter

## every

## some

## fill

## find

## findIndex

## reduce

## reduceRight

## of

## includes
