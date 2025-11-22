import type {
  ErrorHandler,
  EventHandler,
  EventHandlerItem,
  EventKey,
  EventMap,
  Events,
  EventType
} from './types'

import { safeExecute, validateEventHandler, validateEventType } from './util'

export interface EvenexOptions {
  /** Enable debug mode */
  debug?: boolean
  /** Max listeners per event (0 for unlimited) */
  maxListeners?: number
  /** Global error handler */
  onError?: ErrorHandler
}

/**
 * Evenex event bus class
 */
export class Evenex<TEventMap extends EventMap = EventMap> {
  private events: Events = {}
  private readonly options: Required<EvenexOptions>

  constructor(options: EvenexOptions = {}) {
    this.options = {
      debug: false,
      maxListeners: 0,
      onError: (error, event) => {
        console.error(`Error in event "${String(event)}":`, error)
      },
      ...options
    }
  }

  /**
   * Subscribe to an event
   */
  on<K extends keyof TEventMap & EventKey>(
    type: K,
    handler: EventHandler<TEventMap[K]>,
    thisArg?: any
  ): this {
    validateEventType(type)
    validateEventHandler(handler)

    const handlerList = this.getOrCreateHandlerList(type)

    // Check max listeners
    if (
      this.options.maxListeners > 0 &&
      handlerList.length >= this.options.maxListeners
    ) {
      console.warn(
        `Max listeners (${this.options.maxListeners}) exceeded for event "${String(type)}"`
      )
    }

    handlerList.push({
      handler: handler as EventHandler,
      thisArg,
      once: false
    })

    this.log('on', type, handler)
    return this
  }

  /**
   * Subscribe to an event once
   */
  once<K extends keyof TEventMap & EventKey>(
    type: K,
    handler: EventHandler<TEventMap[K]>,
    thisArg?: any
  ): this {
    validateEventType(type)
    validateEventHandler(handler)

    const handlerList = this.getOrCreateHandlerList(type)

    handlerList.push({
      handler: handler as EventHandler,
      thisArg,
      once: true
    })

    this.log('once', type, handler)
    return this
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof TEventMap & EventKey>(
    type: K,
    handler?: EventHandler<TEventMap[K]>
  ): this {
    validateEventType(type)

    const handlerList = this.events[type as EventType]
    if (!handlerList) return this

    // If no handler provided, remove all handlers for this event
    if (!handler) {
      delete this.events[type as EventType]
      this.log('off', type, 'all handlers')
      return this
    }

    // Remove specific handler (optimized: filter instead of splice in loop)
    const filteredList = handlerList.filter((item) => item.handler !== handler)

    if (filteredList.length === 0) {
      delete this.events[type as EventType]
    } else {
      this.events[type as EventType] = filteredList
    }

    this.log('off', type, handler)
    return this
  }

  /**
   * Emit an event
   */
  emit<K extends keyof TEventMap & EventKey>(
    type: K,
    ...args: TEventMap[K]
  ): boolean {
    validateEventType(type)

    const handlerList = this.events[type as EventType]
    if (!handlerList || handlerList.length === 0) {
      this.log('emit', type, 'no listeners')
      return false
    }

    this.log('emit', type, args)

    // Create a copy to safely handle once listeners
    const handlers = [...handlerList]
    const onceHandlers: EventHandlerItem[] = []

    for (const item of handlers) {
      safeExecute(item.handler, item.thisArg, args as any[], (error) =>
        this.options.onError(error, type as EventType, item.handler)
      )

      if (item.once) {
        onceHandlers.push(item)
      }
    }

    // Remove once handlers
    if (onceHandlers.length > 0) {
      this.events[type as EventType] = handlerList.filter(
        (item) => !onceHandlers.includes(item)
      )

      if (this.events[type as EventType].length === 0) {
        delete this.events[type as EventType]
      }
    }

    return true
  }

  /**
   * Clear all events or specific event
   */
  clear(type?: EventType): this {
    if (type !== undefined) {
      validateEventType(type)
      delete this.events[type]
      this.log('clear', type)
    } else {
      this.events = {}
      this.log('clear', 'all events')
    }
    return this
  }

  /**
   * Check if an event has listeners
   */
  has(type: EventType): boolean {
    validateEventType(type)
    return type in this.events && this.events[type].length > 0
  }

  /**
   * Get listener count for an event
   */
  listenerCount(type: EventType): number {
    validateEventType(type)
    return this.events[type]?.length ?? 0
  }

  /**
   * Get all event names
   */
  eventNames(): EventType[] {
    return Object.keys(this.events)
  }

  /**
   * Get all listeners for an event
   */
  listeners(type: EventType): EventHandler[] {
    validateEventType(type)
    return this.events[type]?.map((item) => item.handler) ?? []
  }

  /**
   * Remove all listeners for all events
   */
  removeAllListeners(): this {
    return this.clear()
  }

  /**
   * Get or create handler list for event type
   */
  private getOrCreateHandlerList(type: EventKey): EventHandlerItem[] {
    const eventType = type as EventType
    if (!this.events[eventType]) {
      this.events[eventType] = []
    }
    return this.events[eventType]
  }

  /**
   * Debug logging
   */
  private log(action: string, type: EventKey, data?: any): void {
    if (this.options.debug) {
      // eslint-disable-next-line no-console
      console.log(`[Evenex] ${action}:`, String(type), data)
    }
  }
}

/**
 * Create a new Evenex instance
 */
export const createEvenex = <TEventMap extends EventMap = EventMap>(
  options?: EvenexOptions
) => new Evenex<TEventMap>(options)

/**
 * Default Evenex instance
 */
const evenex = createEvenex()

export default evenex
