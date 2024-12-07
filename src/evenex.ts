import type { Events, EventType, EventHandler } from '../types'
import EventBus from './eventBus'
import { boundary } from './util'

/**
 * Evenex event bus class
 *
 * @class Evenex
 * @extends {EventBus}
 */
export class Evenex extends EventBus {
  private defaultEvents: Events

  constructor(events: Events = {}) {
    super(events)
    this.defaultEvents = events
  }

  on<T>(type: EventType, handler: EventHandler, thisArg?: T) {
    const events = this.getEvents()
    let handlerList = events[type]
    const isVerify = boundary(type, handler, handlerList)

    if (!isVerify) {
      handlerList = []
      events[type] = handlerList
    }

    handlerList.push({
      handler,
      thisArg
    })
  }

  off(type: EventType, handler: EventHandler) {
    const events = this.getEvents()
    const handlerList = events[type]
    const isVerify = boundary(type, handler, handlerList)
    if (!isVerify) return

    for (let i = 0; i < handlerList.length; i++) {
      const currHandle = handlerList[i].handler
      if (currHandle === handler) {
        handlerList.splice(i, 1)
        break
      }
    }

    if (handlerList.length === 0) delete events[type]
  }

  emit<T>(type: EventType, ...payload: T[]) {
    const events = this.getEvents()
    const handlerList = events[type]
    const isVerify = boundary(type, null, handlerList, false)
    if (!isVerify) return

    handlerList.forEach(({ handler, thisArg }) => {
      handler.apply(thisArg, payload)
    })
  }

  clear() {
    this.setEvents(this.defaultEvents)
  }

  has(type: EventType) {
    const events = this.getEvents()
    return Object.keys(events).includes(type)
  }
}

const createEvenex = (events: Events = {}) => new Evenex(events)
const evenex = createEvenex()

export { createEvenex }
export default evenex
