export type EventType = string
export type EventThis<T = unknown> = T

/**
 * handler types
 */
export type EventHandler = (...payload: any[]) => void
export type EventHandlerList = Array<{
  handler: EventHandler
  thisArg?: EventThis
}>

/**
 * events Interface
 */
export interface Events {
  [key: EventType]: EventHandlerList
}
/**
 * check Types
 */
export type CheckHandleType = boolean
