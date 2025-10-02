# Evenex

> A lightweight, type-safe, fully-featured **Event Bus** library for modern JavaScript and TypeScript projects.

[![npm version](https://img.shields.io/npm/v/evenex.svg)](https://www.npmjs.com/package/evenex)
[![npm downloads](https://img.shields.io/npm/dm/evenex.svg)](https://www.npmjs.com/package/evenex)
[![bundle size](https://img.shields.io/bundlephobia/minzip/evenex.svg)](https://bundlephobia.com/package/evenex)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README.md) | [简体中文](README_zh.md)

## ✨ Features

- ✅ Type-safe event definitions
- 🔁 `on` / `once` / `off` / `emit` API
- 🧼 Clear & remove listeners easily
- 🧰 Utility methods: `has`, `listenerCount`, `eventNames`, `listeners`
- 🛡️ Global error handling with `onError`
- 🧠 Debug mode for development
- ⚡ Zero dependencies & lightweight

## 📦 Installation

```bash
npm install evenex
# or
yarn add evenex
# or
pnpm add evenex
```

## 🪄 Basic Usage

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

## 🧠 Type-safe Events

You can define your own event map interface for better type inference:

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

## 🧼 Removing Listeners

```typescript
const handler = () => console.log('event')

bus.on('foo', handler)
bus.off('foo', handler) // remove specific
bus.off('foo') // remove all listeners of foo
bus.clear() // remove all listeners of all events
```

## 🛠 API

| Method                 | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `on(event, handler)`   | Subscribe to an event                            |
| `once(event, handler)` | Subscribe once only                              |
| `off(event, handler?)` | Unsubscribe handler or all handlers of the event |
| `emit(event, ...args)` | Trigger event                                    |
| `has(event)`           | Check if event has listeners                     |
| `listenerCount(event)` | Get number of listeners                          |
| `eventNames()`         | Get all event names                              |
| `listeners(event)`     | Get all listener functions                       |
| `clear(event?)`        | Clear specific or all events                     |
| `removeAllListeners()` | Alias for `clear()`                              |

## 🪝 Global Error Handling

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

[MIT License](LICENSE) © OpenKnights Contributors
