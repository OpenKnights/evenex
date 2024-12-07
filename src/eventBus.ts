import { EventType, EventHandler, Events } from '../types'

/**
 * Evenex's EventBus abstract class
 *
 * @abstract
 * @class  EventBus
 */
export default abstract class EventBus {
  private events: Events

  constructor(events: Events) {
    this.events = events
  }

  /**
   * Subscribing to Events
   *
   * @param {EventType} type
   * @param {EventHandler} handler
   * @param {T} thisArg
   */
  abstract on<T>(type: EventType, handler: EventHandler, thisArg?: T): void

  /**
   * Unsubscribe from events
   *
   * @param {EventType} type
   * @param {EventHandler} handler
   */
  abstract off(type: EventType, handler: EventHandler): void

  /**
   * Calling the subscribed event
   *
   * @param {EventType} type
   * @param {...T[]} payload
   */
  abstract emit<T>(type: EventType, ...payload: T[]): void

  /**
   * Clear all subscribed events
   *
   * @abstract
   * @memberof EventBus
   */
  abstract clear(): void

  /**
   * Determine whether an event of Type EventType exists
   *
   * @param {EventType} type
   * @return {*}  {boolean}
   */
  abstract has(type: EventType): boolean

  protected getEvents(): Events {
    return this.events
  }

  protected setEvents(payload: any): void {
    this.events = payload
  }
}
