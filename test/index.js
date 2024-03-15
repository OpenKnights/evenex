import { CreateEvenex } from '../dist/index.esm.js'
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
