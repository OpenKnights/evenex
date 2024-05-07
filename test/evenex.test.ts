import { createEvenex } from '../src/index'
import type { Evenex } from '../src/evenex'

let evenex: Evenex
beforeAll(() => {
  evenex = createEvenex()
})
let count = 0
const setCount = (num: number) => {
  count = num
}

test(`Has the evenex event been successfully listened to using the 'on' method?`, () => {
  evenex.on('changeCount1', setCount)

  const isOnMethod = evenex.has('changeCount1')

  expect(isOnMethod).toBe(true)
})

test(`Has the evenex event unsubscription using the 'off' method been successful?`, () => {
  evenex.off('changeCount1', setCount)

  const isOffMethod = evenex.has('changeCount1')

  expect(isOffMethod).toBe(false)
})

test('Has the evenex event emission been successful?', () => {
  evenex.on('changeCount', setCount)
  evenex.emit('changeCount', 3)

  const isEmitMethod = count === 3

  expect(isEmitMethod).toBe(true)

  evenex.off('changeCount', setCount)
})
