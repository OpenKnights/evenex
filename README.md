# Evenex

> An event bus library implemented in TypeScript.（ English | [中文](README_zh.md)）

## Install

Please make sure you install this library using npm or another package manager in a Node.js environment.

```shell
npm install --save evenex
```

Then, utilize modern module bundling tools such as Vite or Webpack to import this library using modular syntax.

```javascript
// Using ES Module
import { CreateEvenex } from 'evenex'

// Using CommonJS
var { CreateEvenex } = require('evenex')
```

## Usage

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

// Listen for events
evenex.on('changeCount', on1)
evenex.on('changeCount', on2)
evenex.on('test', on2)

setTimeout(() => {
  // Trigger events
  evenex.emit('changeCount', count + 1)

  console.log('hasEvent -> changeCount 01', evenex.hasEvent('changeCount'))

  // Unsubscribe from events
  evenex.off('changeCount', on1)
  evenex.off('changeCount', on2)

  // Check if an event exists
  console.log('hasEvent -> changeCount 02', evenex.hasEvent('changeCount'))

  console.log('eventBus -> 01', evenex.eventBus)

  // Clear all events
  evenex.clear()

  console.log('eventBus -> 02', evenex.eventBus)
}, 1000)
```

## API

### on

Register a handler for a specified event.

**Parameters**

- `type` **(string)** The type of event to listen for.
- `handler` **(Function)** The function to call when the specified event is received.
- `thisArg` **(any)** The context to be used when calling the function.

### off

Unsubscribe from handling a specific event.

**Parameters**

- `type` **(string)** The type of event to unsubscribe from.
- `handler` **(Function)** The handler function registered for the event.

### emit

Trigger all handlers registered for the specified event.

**Parameters**

- `type` **(string)** The type of event to trigger.
- `...payload` **(any)** Any arguments that need to be passed.

### clear

Clear all handlers registered for events.

### hasEvent

Check if the specified event exists

**Parameters**

- `type` **(string)** The type of event to check.
