# Evenex

> An event bus library implemented in TypeScript.（ English | [中文](README_zh.md)）

- **Evenex：** Derived from "Event" and "Nexus", it signifies the role of the event bus as a nexus connecting different events and dispatch centers.
- **Microscopic：** It boasts a minuscule size, less than 1kb after compression.
- **Familiar：** We've implemented a sensible API design akin to other EventBus libraries, ensuring an easy learning curve for users.

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

  console.log('has -> changeCount 01', evenex.has('changeCount'))

  // Unsubscribe from events
  evenex.off('changeCount', on1)
  evenex.off('changeCount', on2)

  // Check if an event exists
  console.log('has -> changeCount 02', evenex.has('changeCount'))

  console.log('events -> 01', evenex.events)

  // Clear all events
  evenex.clear()

  console.log('events -> 02', evenex.events)
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

### has

Check if the specified event exists

**Parameters**

- `type` **(string)** The type of event to check.
