export type EventType = string | symbol

/**
 * Valid event key type (excludes number for better type safety)
 */
export type EventKey = string | symbol

export type EventThis<T = unknown> = T

/**
 * Event handler function type
 */
export type EventHandler<T = any> = (...args: T[]) => void

/**
 * Handler item with context
 */
export interface EventHandlerItem<T = any> {
  handler: EventHandler<T>
  thisArg?: EventThis
  once?: boolean
}

/**
 * Handler list type
 */
export type EventHandlerList<T = any> = Array<EventHandlerItem<T>>

/**
 * Events map interface
 */
export interface Events {
  [key: EventType]: EventHandlerList
}

/**
 * Event map for type-safe events
 * Usage:
 * interface MyEvents extends EventMap {
 *   'user:login': [userId: string, timestamp: number]
 *   'user:logout': []
 * }
 *
 * Note: Use string or symbol as event keys, avoid using numbers
 */
export interface EventMap {
  [event: EventKey]: any[]
}

/**
 * Error handler type
 */
export type ErrorHandler = (
  error: Error,
  event: EventType,
  handler: EventHandler
) => void
