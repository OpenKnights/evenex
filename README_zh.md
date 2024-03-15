# Evenex

> 一个使用 TypeScript 实现的事件总线库（ [English](README.md) | 中文 ）

- **Evenex：** 取自“Event”和“Nexus”，意为事件总线作为连接不同事件和派发中心的角色。
- **Microscopic：** 体积微小，压缩后小于1kb
- **Familiar：** 我们采用了合理的 API 设计，与其他任何 EventBus 库类似，让您轻松上手。

## 安装

请确保您在 Node.js 环境下使用 npm 或其他包管理器安装此库。

```shell
npm install --save evenex
```

然后，利用现代的模块捆绑工具，如 Vite 或 Webpack，以模块化的语法引入此库。

```javascript
// 使用 ES Module
import { CreateEvenex } from 'evenex'

// 使用 CommonJS
var { CreateEvenex } = require('evenex')
```

## 使用

```javascript
import { CreateEvenex } from 'evenex'
const evenex = CreateEvenex()

let count = 0
let setCount = (val) => (count = val)

const on1 = (num) => {
  setCount(num)
}
const on2 = (count) => {
  setTimeout(() => {
    console.log(`emit1-count:`, count)
  }, 100)
}

// 监听事件
evenex.on('changeCount', on1)
evenex.on('changeCount', on2)
evenex.on('test', on2)

setTimeout(() => {
  // 触发事件
  evenex.emit('changeCount', count + 1)

  console.log('hasEvent -> changeCount 01', evenex.hasEvent('changeCount'))

  // 取消监听
  evenex.off('changeCount', on1)
  evenex.off('changeCount', on2)

  // 检查事件是否存在
  console.log('hasEvent -> changeCount 02', evenex.hasEvent('changeCount'))

  console.log('eventBus -> 01', evenex.eventBus)

  // 置空所有事件
  evenex.clear()

  console.log('eventBus -> 02', evenex.eventBus)
}, 1000)
```

## 方法

### on

为指定事件注册一个处理函数

**参数**

- `type` **(string)** 要监听的事件类型。
- `handler` **(Function)** 在接收到指定事件时调用的函数。
- `thisArg` **(any)** 用于指定调用函数时的 this 上下文。

### off

取消监听某个事件的处理函数

**参数**

- `type` **(string)** 要取消监听的事件类型。
- `handler` **(Function)** 接收该事件已注册的处理函数。

### emit

触发指定事件注册的所有处理程序

**参数**

- `type` **(string)** 要触发的事件类型。
- `...payload` **(any)** 所需要传递的任何参数

### clear

置空所有事件注册的处理程序

### hasEvent

检查指定的事件是否存在

**参数**

- `type` **(string)** 要检查的事件类型。
