import { expect, test } from 'vitest'

import { boundary } from '../src/util'

let count = 0
const setCount = (num: number) => {
  count = num
}

test('boundary testing', () => {
  setCount(count + 2)

  const isVerify1 = boundary('changeCount1', setCount, [])
  const isVerify2 = boundary('changeCount2', null, [], false)

  expect(isVerify1).toBe(true)
  expect(isVerify2).toBe(true)
})
