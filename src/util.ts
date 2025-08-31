import type {
  CheckHandleType,
  EventHandler,
  EventHandlerList,
  EventType
} from './types'

export const isFunction = (val: unknown): boolean => typeof val === 'function'

export const isString = (val: unknown): boolean => typeof val === 'string'

export const isObject = (val: unknown): boolean =>
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
