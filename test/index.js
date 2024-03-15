// The module exports an instance of the Evenex class by default, and we also export the Evenex class separately.
import evenex from '../dist/index.esm.js'

// Alternatively, you can use it like this
// import { Evenex } from 'evenex';
// const evenex = new Evenex();

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
