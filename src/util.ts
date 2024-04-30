import type { THandles, THandler } from '../types'

export const boundary = (
  type: string,
  handler: THandler | null,
  handles: THandles,
  checkHandle: boolean = true
) => {
  if (typeof type !== 'string') {
    throw new TypeError('the event name must be string type')
  }

  if (checkHandle) {
    if (typeof handler !== 'function')
      throw new TypeError('the event callback must be function type')
  }

  return Array.isArray(handles)
}
