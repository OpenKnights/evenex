import type { EventHandler } from './types'

// eslint-disable-next-line typescript/no-unsafe-function-type
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'

export const isString = (val: unknown): val is string => typeof val === 'string'

export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'

export const isObject = (val: unknown): val is object =>
  val !== null && typeof val === 'object'

/**
 * Validate event type
 */
export const validateEventType = (type: unknown): void => {
  if (!isString(type) && !isSymbol(type)) {
    throw new TypeError('Event name must be a string or symbol')
  }
}

/**
 * Validate event handler
 */
export const validateEventHandler = (handler: unknown): void => {
  if (!isFunction(handler)) {
    throw new TypeError('Event handler must be a function')
  }
}

/**
 * Safe execute handler with error handling
 */
export const safeExecute = <T = any>(
  handler: EventHandler<T>,
  thisArg: any,
  args: T[],
  onError?: (error: Error) => void
): void => {
  try {
    handler.apply(thisArg, args)
  } catch (error) {
    if (onError) {
      onError(error as Error)
    } else {
      console.error('Error in event handler:', error)
    }
  }
}
