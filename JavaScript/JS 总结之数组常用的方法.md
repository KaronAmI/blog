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

- searchElement
  - 要查找的元素
- fromIndex **可选**
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

**用途**：返回指定元素在数组中的最后一个的引索，如果不存在则返回-1，从 fromIndex 处开始。

**语法**：arr.lastIndexOf(searchElement[, fromIndex = arr.length - 1])

**参数**：

- searchElement
  - 要查找的元素
- fromIndex **可选**
  - 从此位置开始**从后到前**查找
  - 默认为数值长度减 1
  - 如果**大于或等于**数组的长度，整个数组会被查找
  - 如果为**负值**，数组从末尾向前偏移开始查找，-1 为最后一个
  - 如果参数中提供的索引值是一个负值，仍然会从前向后查询数组
  - 如果**为负值但大于数组长度**，则返回 -1

**注意**：

使用 `===` 比较数组中的元素

**示例**：

```js
//       0  1  2  3  4  5
let a = [2, 3, 4, 2, 1, 5]
//      -6 -5 -4 -3 -2 -1

a.lastIndexOf(2, 6) // 3
a.lastIndexOf(2, 3) // 3
a.lastIndexOf(2, 3) // 3
a.lastIndexOf(2, 2) // 0
a.lastIndexOf(2, -3) // -3 处还能找到 2，返回引索 3
a.lastIndexOf(2, -4) // -4 处已经找不到 2了，返回前面的2的引索 0
```

## slice

**用途**：由 begin 和 end（不包括 end）决定的原数组的**浅拷贝**，**返回一个新的数组对象**。

**语法**：arr.slice(begin, end)

**参数**：

- begin **可选**
  - 默认为 0，即从 0 开始，提取原数组中的元素
  - -1 为最后一个位置
- end **可选**
  - 如果 end 为负数，表示在原数组中的倒数第几个元素结束抽取。如：slice(-2, -1)表示抽取原数组中的倒数第二个到最后一个元素（**不包括最后一个元素**，也就是倒数第二个元素）
  - 如果 end 被省略或者大于数组长度，则会一直提前到原数组末尾

**示例**：

```js
//       0  1  2  3  4  5
let a = [2, 3, 4, 2, 1, 5]
//      -6 -5 -4 -3 -2 -1

a.slice(0, 3) // 提取 0 1 2 位置的元素，得：[2，3，4]
a.slice(-5, -2) // 提取 1 2 3 位置的元素，得：[3, 4, 2]
a.slice(-4) // 提取 2 3 4 5 位置的元素，得：[4, 2, 1, 5]
```

## splice

**用途**：通过删除现有元素或者添加新元素来修改原数组，如果删除便返回删除的数组，如果添加便返回空数组

**语法**：array.splice(start[, deleteCount[, item1[, item2[, ...]]]])

**参数**：

- start

  - 指定修改的开始位置（从 0 计数）
  - 如果超出了数组的长度，则从数组末尾开始添加内容
  - 如果为负数，则从数组末位开始的第几位（从-1 计数）
  - 如果负数的绝对值大于数组的长度，则表示开始位置为第 0 位

- deleteCount **可选**：整数，表示要移除的数组元素的个数

  - 如果为 0 或负数，则不移除元素
  - 如果大于 start 之后的元素的总数，则 start 后面的元素都要被删除，包括 start 位
  - 如果被省略，则相当于 (arr.length - start)

- item1, item2, ... **可选**
  - 要添加进数组的元素，从 start 位置开始，如果不指定，splice 将只删除数组的元素

**示例**：

```js
//    0  1  2  3  4  5  6
let a = [2, 3, 4, 2, 1, 5]
a.splice(0, 0, 'a') // []
console.log(a) // ['a', 2, 3, 4, 2, 1, 5]
```

```js
//    0  1  2  3  4  5  6
let a = [2, 3, 4, 2, 1, 5]
a.splice(0, 1, 'a') // [2]
console.log(a) // ['a', 3, 4, 2, 1, 5]
```

```js
//    0  1  2  3  4  5  6
let a = [2, 3, 4, 2, 1, 5]
a.splice(1, 2, 'a') // [3, 4]
console.log(a) // [2, 'a', 2, 1, 5]
```

```js
//    0  1  2  3  4  5  6
let a = [2, 3, 4, 2, 1, 5]
a.splice(-1, 0, 'a') // []
console.log(a) // [2, 3, 4, 2, 1, 'a', 5]
```

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
