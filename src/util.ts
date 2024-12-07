import type {
  EventType,
  EventHandler,
  EventHandlerList,
  CheckHandleType
} from '../types'

export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const boundary = (
  type: EventType,
  handler: EventHandler | null,
  handlerList: EventHandlerList,
  checkHandle: CheckHandleType = true
) => {
  if (!isString(type)) {
    throw new TypeError('the event name must be string type')
  }

  if (checkHandle) {
    if (!isFunction(handler)) {
      throw new TypeError('the event callback must be function type')
    }
  }

  return Array.isArray(handlerList)
}
