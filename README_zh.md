# Evenex

> 一个轻量级、类型安全、功能全面的**事件总线**库，适用于现代 JavaScript 和 TypeScript 项目。

[![npm version](https://img.shields.io/npm/v/evenex.svg)](https://www.npmjs.com/package/evenex)
[![npm downloads](https://img.shields.io/npm/dm/evenex.svg)](https://www.npmjs.com/package/evenex)
[![bundle size](https://img.shields.io/bundlephobia/minzip/evenex.svg)](https://bundlephobia.com/package/evenex)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README.md) | [简体中文](README_zh.md)

## ✨ 功能特性

- ✅ 类型安全的事件定义
- 🔁 `on` / `once` / `off` / `emit` API
- 🧼 轻松清除和移除监听器
- 🧰 实用方法：`has`, `listenerCount`, `eventNames`, `listeners`
- 🛡️ 使用 `onError` 进行全局错误处理
- 🧠 开发调试模式
- ⚡ 无依赖且轻量级

## 📦 安装

```bash
npm install evenex
# or
yarn add evenex
# or
pnpm add evenex
```

## 🪄 基本用法

```typescript
import evenex from 'evenex'

// Listen to an event
evenex.on('hello', (name: string) => {
  console.log(`Hello, ${name}!`)
})

// Emit event
evenex.emit('hello', 'World')
// -> Hello, World!
```

## 🧠 类型安全的事件

您可以定义自己的事件映射接口以获得更好的类型推断：

```typescript
import { createEvenex } from 'evenex'

interface MyEvents {
  'user:login': [userId: string]
  'user:logout': []
}

const bus = createEvenex<MyEvents>()

bus.on('user:login', (userId) => {
  console.log('User logged in:', userId)
})

bus.emit('user:login', '12345') // ✅ OK
bus.emit('user:login') // ❌ Type error
```

## 🧼 移除监听器

```typescript
const handler = () => console.log('event')

bus.on('foo', handler)
bus.off('foo', handler) // remove specific
bus.off('foo') // remove all listeners of foo
bus.clear() // remove all listeners of all events
```

## 🛠 API

| 方法                 | 描述                               |
| -------------------- | ---------------------------------- |
| on(event, handler)   | 订阅一个事件                       |
| once(event, handler) | 仅订阅一次                         |
| off(event, handler?) | 取消订阅处理器或该事件的全部处理器 |
| emit(event, ...args) | 触发事件                           |
| has(event)           | 检查事件是否有监听器               |
| listenerCount(event) | 获取监听器的数量                   |
| eventNames()         | 获取所有事件名称                   |
| listeners(event)     | 获取所有监听函数                   |
| clear(event?)        | 清除特定或所有事件                 |
| removeAllListeners() | clear() 的别名                     |

## 🪝 全局错误处理

```typescript
import { createEvenex } from 'evenex'

const bus = createEvenex({
  onError(error, event, handler) {
    console.error(`Error in ${String(event)}:`, error)
  }
})

bus.on('boom', () => {
  throw new Error('💥')
})

bus.emit('boom') // error is caught by onError
```

## 📄 License

[MIT](./LICENSE) 许可证 © 2025-至今 [king3](https://github.com/coderking3)

## 🤝 贡献

欢迎贡献、问题和功能请求!

请随时查看 [issues 页面](https://github.com/OpenKnights/better-mock-server/issues)。
